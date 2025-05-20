// hooks/useCRUD.ts
import { AxiosRequestConfig } from 'axios';
import { useState } from 'react';
import { api } from '../app/libs/axios'; // ajuste conforme o caminho real

interface PaginationState<T> {
  items: T[];
  page: number;
  totalPages: number;
  hasMore: boolean;
  loading: boolean;
  refreshing: boolean;
}

export function useCRUD<T>(baseUrl: string) {
  // CRUD state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | T[] | null>(null);

  // Paginação
  const [pagination, setPagination] = useState<PaginationState<T>>({
    items: [],
    page: 1,
    totalPages: 1,
    hasMore: true,
    loading: false,
    refreshing: false
  });

  // Requisição genérica
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

  // Funções de CRUD
  const getAll = () => handleRequest('get');
  const getById = (id: number | string) => handleRequest('get', String(id));
  const create = <D>(item: D) => handleRequest('post', '', item);
  const update = <D>(id: number | string, item: D) =>
    handleRequest('put', String(id), item);
  const remove = (id: number | string) => handleRequest('delete', String(id));

  // 🔁 Paginação
  const fetchPage = async (page = 1, limit = 10, reset = false) => {
    if (pagination.loading || (!reset && !pagination.hasMore)) return;

    setPagination((prev) => ({
      ...prev,
      loading: !reset,
      refreshing: reset
    }));

    try {
      const response = await api.get(baseUrl, {
        params: { page, limit }
      });

      const items: T[] = response.data.data;
      const totalPages = response.data.totalPages || 1;

      setPagination((prev) => ({
        ...prev,
        items: reset ? items : [...prev.items, ...items],
        page: page + 1,
        totalPages,
        hasMore: page < totalPages,
        loading: false,
        refreshing: false
      }));
    } catch (err) {
      console.error('Erro ao paginar:', err);
      setPagination((prev) => ({
        ...prev,
        loading: false,
        refreshing: false
      }));
    }
  };

  const refreshPagination = (limit = 10) => {
    fetchPage(1, limit, true);
  };

  const fetchNextPage = (limit = 10) => {
    fetchPage(pagination.page, limit, false);
  };

  return {
    // CRUD
    data,
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    remove,

    // Paginação
    pagination: {
      ...pagination,
      refreshPagination,
      fetchNextPage
    }
  };
}

/*

{
  "data": [
    { "id": 1, "name": "Item 1" },
    { "id": 2, "name": "Item 2" }
  ],
  "page": 1,
  "perPage": 10,
  "totalItems": 50
}

Exemplo do uso em um flatlist formatdo com o hook useCRUD
<FlatList
  data={items}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View style={{ height: 60, justifyContent: 'center', paddingHorizontal: 16 }}>
      <Text>{item.name}</Text>
    </View>
  )}
  onEndReached={hasMore ? () => fetchNextPage(10) : undefined}
  onEndReachedThreshold={0.5}
  ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
  ListEmptyComponent={
    !loading ? (
      <Text style={{ textAlign: 'center', marginTop: 20 }}>
        Nenhum item encontrado.
      </Text>
    ) : null
  }
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={() => refreshPagination(10)} />
  }
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  getItemLayout={(data, index) => ({
    length: 60,
    offset: 60 * index,
    index
  })}
/>

*/
