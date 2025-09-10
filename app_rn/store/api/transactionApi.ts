import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getApiBaseUrl } from '@/config/api';
import { Presigned, PresignedType } from '@/types/presigned';

interface InitTransactionRequest {
  productId: number;
  quantity: number;
  presignedDocuments: Presigned[];
}

export interface InitTransactionResponse {
  transactionId: number;
  status: string;
  productId: number;
  quantity: number;
  total: number;
  presignedDocuments: Presigned[];
  createdAt: string;
}

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
  }),
  tagTypes: ['Transaction'],
  endpoints: (builder) => ({
    initTransaction: builder.mutation<InitTransactionResponse, InitTransactionRequest>({
      query: (data) => ({
        url: 'transactions/init-transaction',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transaction'],
    }),
  }),
});

export const { useInitTransactionMutation } = transactionApi;
