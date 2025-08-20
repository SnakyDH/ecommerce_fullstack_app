export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number;
}

export interface Pagination {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export interface ProductsResponse {
  data: Product[];
  pagination: Pagination;
}

export interface ProductsRequest {
  page?: number;
  limit?: number;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  orderBy?: 'name' | 'price' | 'stock';
  orderType?: 'ASC' | 'DESC';
}
