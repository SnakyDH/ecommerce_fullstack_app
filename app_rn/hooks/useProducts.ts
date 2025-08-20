import { useGetProductsQuery } from '@/store/api/productsApi';
import { ProductsRequest } from '@/types/product';

export const useProducts = (params?: ProductsRequest) => {
  const defaultParams: ProductsRequest = {
    page: 1,
    limit: 20,
    ...params,
  };

  const {
    data: response,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetProductsQuery(defaultParams);

  return {
    products: response?.data || [],
    pagination: response?.pagination,
    error,
    isLoading,
    isFetching,
    refetch,
    isEmpty: !isLoading && (!response?.data || response.data.length === 0),
    hasError: !!error,
  };
};
