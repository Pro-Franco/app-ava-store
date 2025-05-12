// hooks/useCRUD.ts
import { AxiosRequestConfig } from 'axios';
import { useState } from 'react';
import { api } from '../app/libs/axios'; // ajuste conforme seu caminho

export function useCRUD<T>(baseUrl: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | T[] | null>(null);

  const handleRequest = async <D = any>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    endpoint: string = '',
    payload?: D,
    config?: AxiosRequestConfig
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api({
        method,
        url: `${baseUrl}${endpoint ? `/${endpoint}` : ''}`,
        data: payload,
        ...config
      });

      setData(response.data);
      return response.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAll = () => handleRequest('get');
  const getById = (id: number | string) => handleRequest('get', String(id));
  const create = <D>(item: D) => handleRequest('post', '', item);
  const update = <D>(id: number | string, item: D) =>
    handleRequest('put', String(id), item);
  const remove = (id: number | string) => handleRequest('delete', String(id));

  return {
    data, // Estado com os dados retornados da requisição (pode ser Cliente ou Cliente[]).
    loading, // Booleano que indica se há uma requisição em andamento.
    error, // Objeto de erro caso a requisição falhe.
    getAll, // Função para buscar todos os Clientes (GET).
    getById, // Função para buscar um Cliente pelo ID (GET).
    create, // Função para criar um novo Cliente (POST).
    update, // Função para atualizar um Cliente pelo ID (PUT).
    remove // Função para deletar um Cliente pelo ID (DELETE).
  };
}
