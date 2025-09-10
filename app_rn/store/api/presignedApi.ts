import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Presigned } from '@/types/presigned';
import { getApiBaseUrl } from '@/config/api';

export const presignedApi = createApi({
  reducerPath: 'presignedApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
  }),
  tagTypes: ['Presigned'],
  endpoints: (builder) => ({
    getPresigned: builder.query<Presigned[], void>({
      query: () => ({
        url: 'presigned',
      }),
      providesTags: ['Presigned'],
    }),
  }),
});

export const { useGetPresignedQuery } = presignedApi;
