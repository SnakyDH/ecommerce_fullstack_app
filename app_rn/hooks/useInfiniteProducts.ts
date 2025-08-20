import { useState, useCallback, useMemo, useEffect } from 'react';
import { useGetProductsQuery } from '@/store/api/productsApi';
import { ProductsRequest, Product } from '@/types/product';

interface UseInfiniteProductsOptions {
  initialParams?: Omit<ProductsRequest, 'page'>;
  pageSize?: number;
}

/**
 * Custom hook for infinite scroll pagination of products
 */
export const useInfiniteProducts = (options: UseInfiniteProductsOptions = {}) => {
  const { initialParams = {}, pageSize = 10 } = options;

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [totalPagination, setTotalPagination] = useState<any>(null);

  const queryParams = useMemo(() => ({
    ...initialParams,
    page: currentPage,
    limit: pageSize,
  }), [initialParams, currentPage, pageSize]);

  const {
    data: response,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetProductsQuery(queryParams);

  useEffect(() => {
    if (response?.data) {
      if (currentPage === 1) {
        setAllProducts(response.data);
        console.log(`Loaded page 1 with ${response.data.length} products`);
      } else {
        setAllProducts(prev => {
          const newProducts = response.data.filter(
            newProduct => !prev.some(existingProduct => existingProduct.id === newProduct.id)
          );
          console.log(`Loaded page ${currentPage}: ${newProducts.length} new products added (total: ${prev.length + newProducts.length})`);
          return [...prev, ...newProducts];
        });
      }
      setTotalPagination(response.pagination);
      setIsLoadingMore(false);
    } else if (error) {
      console.error('Products API Error:', error);
    }
  }, [response, currentPage, error]);

  const hasNextPage = totalPagination ? currentPage < totalPagination.totalPages : false;

  const loadMore = useCallback(async () => {
    if (hasNextPage && !isLoadingMore && !isFetching) {
      console.log(`Loading next page: ${currentPage + 1}`);
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage, isLoadingMore, isFetching, currentPage]);

  const refresh = useCallback(async () => {
    setCurrentPage(1);
    setAllProducts([]);
    setTotalPagination(null);
    await refetch();
  }, [refetch]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setAllProducts([]);
    setTotalPagination(null);
  }, []);

  useEffect(() => {
    resetPagination();
  }, [JSON.stringify(initialParams), resetPagination]);

  return {
    products: allProducts,
    pagination: totalPagination,
    isLoading: isLoading && currentPage === 1,
    isLoadingMore: isLoadingMore || (isFetching && currentPage > 1),
    isFetching,
    error,
    hasError: !!error,
    loadMore,
    refresh,
    resetPagination,
    hasNextPage,
    currentPage,
    isEmpty: !isLoading && allProducts.length === 0,
    totalItems: totalPagination?.total || 0,
  };
};
