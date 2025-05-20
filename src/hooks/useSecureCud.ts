import CryptoJS from 'crypto-js';
import { useState } from 'react';
import { api } from '../app/libs/axios'; // ajuste para o seu axios configurado

const SECRET_KEY = process.env.EXPO_PUBLIC_API_SECRET || 'sua-chave-secreta';
const ENCRYPTION_KEY = SECRET_KEY.slice(0, 32);

function encryptPayload(data: any): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
}

function generateSignature(
  method: string,
  url: string,
  encryptedBody: string,
  timestamp: number
) {
  const dataToSign = `${method}:${url}:${encryptedBody}:${timestamp}`;
  return CryptoJS.HmacSHA256(dataToSign, SECRET_KEY).toString();
}

export function useSecureCRUD<T>(baseUrl: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | T[] | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Adicionando suporte a filtros
  const [filters, setFilters] = useState<Record<string, any>>({});

  const secureRequest = async <D = any>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    endpoint: string = '',
    payload?: D,
    queryParams?: Record<string, any>
  ) => {
    setLoading(true);
    setError(null);
    const timestamp = Date.now();
    let url = `${baseUrl}${endpoint ? `/${endpoint}` : ''}`;

    // Incorporando filtros aos parâmetros da query
    const params = { ...queryParams, ...filters };

    if (params) {
      const queryString = new URLSearchParams(params as any).toString();
      url += `?${queryString}`;
    }

    const encrypted = payload ? encryptPayload(payload) : '';
    const signature = generateSignature(
      method.toUpperCase(),
      url,
      encrypted,
      timestamp
    );

    try {
      const response = await api({
        method,
        url,
        data: payload ? { data: encrypted } : undefined,
        headers: {
          'x-signature': signature,
          'x-timestamp': timestamp.toString(),
          'x-encrypted': '1'
        }
      });
      return response.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPage = async (pageNumber: number, limit: number = 10) => {
    try {
      const result = await secureRequest('get', '', undefined, {
        page: pageNumber,
        limit,
        ...filters
      });

      if (Array.isArray(result)) {
        setData((prev) =>
          pageNumber === 1 ? result : [...(prev as T[]), ...result]
        );
        setHasMore(result.length === limit);
        setPage(pageNumber);
      }
    } catch (err) {
      console.error('Erro na paginação segura com filtros', err);
    }
  };

  const fetchNextPage = (limit: number = 10) => {
    if (hasMore && !loading) {
      fetchPage(page + 1, limit);
    }
  };

  const refreshPagination = (limit: number = 10) => {
    setRefreshing(true);
    fetchPage(1, limit).finally(() => setRefreshing(false));
  };

  const getAll = () => secureRequest('get');
  const getById = (id: number | string) => secureRequest('get', String(id));
  const create = <D>(item: D) => secureRequest('post', '', item);
  const update = <D>(id: number | string, item: D) =>
    secureRequest('put', String(id), item);
  const remove = (id: number | string) => secureRequest('delete', String(id));

  // Função para aplicar filtros
  const applyFilters = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    fetchPage(1, 10); // Aplica os filtros e recarrega a primeira página
  };

  return {
    data,
    loading,
    error,
    page,
    hasMore,
    refreshing,
    filters, // Retorna os filtros atuais
    getAll,
    getById,
    create,
    update,
    remove,
    request: secureRequest,
    fetchPage,
    fetchNextPage,
    refreshPagination,
    applyFilters // Função para aplicar filtros
  };
}

//npm install --save-dev @types/crypto-js
