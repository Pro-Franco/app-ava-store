// hooks/useCRUD.ts
import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';

type Options = {
  token?: string; // Token JWT ou Bearer Token (opcional)
  cacheKey?: string; // Chave para armazenar dados no cache (opcional)
  autoRefresh?: boolean; // Recarregar dados automaticamente após create/update/delete
};

const cacheStore: Record<string, any> = {}; // Simples objeto para cache em memória

export function useCRUD<T>(baseUrl: string, options: Options = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | T[] | null>(null);

  const getAuthHeaders = () => {
    if (!options.token) return {};
    return { Authorization: `Bearer ${options.token}` };
  };

  const handleRequest = async <D = any>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    endpoint: string = '',
    payload?: D,
    config?: AxiosRequestConfig
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        method,
        url: `${baseUrl}/${endpoint}`,
        data: payload,
        headers: {
          ...getAuthHeaders(),
          ...(config?.headers || {})
        },
        ...config
      });

      // Atualiza cache e estado se for GET
      if (method === 'get') {
        setData(response.data);
        if (options.cacheKey) {
          cacheStore[options.cacheKey] = response.data;
        }
      }

      return response.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAll = async () => {
    // Usa cache se existir
    if (options.cacheKey && cacheStore[options.cacheKey]) {
      setData(cacheStore[options.cacheKey]);
      return cacheStore[options.cacheKey];
    }

    return handleRequest('get');
  };

  const getById = (id: number | string) => handleRequest('get', String(id));
  const create = async <D>(item: D) => {
    const result = await handleRequest('post', '', item);
    if (options.autoRefresh) await getAll();
    return result;
  };
  const update = async <D>(id: number | string, item: D) => {
    const result = await handleRequest('put', String(id), item);
    if (options.autoRefresh) await getAll();
    return result;
  };
  const remove = async (id: number | string) => {
    const result = await handleRequest('delete', String(id));
    if (options.autoRefresh) await getAll();
    return result;
  };

  // Auto-refresh inicial se cache não existir
  useEffect(() => {
    if (!options.cacheKey || !cacheStore[options.cacheKey]) {
      getAll();
    } else {
      setData(cacheStore[options.cacheKey]);
    }
  }, [baseUrl]);

  return {
    data,
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    remove
  };
}
