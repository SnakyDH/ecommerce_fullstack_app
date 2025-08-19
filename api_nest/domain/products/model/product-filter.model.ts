import { Product } from './product.model';

export enum OrderType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface ProductOrderBy {
  field: keyof Product;
  order: OrderType;
}

export interface ProductFilter {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  orderBy?: ProductOrderBy;
}
