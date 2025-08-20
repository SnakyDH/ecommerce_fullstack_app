import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product, ProductsResponse, ProductsRequest } from '@/types/product';
import { getApiBaseUrl } from '@/config/api';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductsRequest | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.name) searchParams.append('name', params.name);
        if (params?.minPrice) searchParams.append('minPrice', params.minPrice.toString());
        if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
        if (params?.minStock) searchParams.append('minStock', params.minStock.toString());
        if (params?.maxStock) searchParams.append('maxStock', params.maxStock.toString());
        if (params?.orderBy) searchParams.append('orderBy', params.orderBy);
        if (params?.orderType) searchParams.append('orderType', params.orderType);

        return {
          url: 'products',
          params: Object.fromEntries(searchParams),
        };
      },
      providesTags: ['Product'],
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;
