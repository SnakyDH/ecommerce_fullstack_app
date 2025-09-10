import { PaginationModel } from 'domain/common/util/pagination.model';
import { Product } from '../model/product.model';
import { ProductFilter } from '../model/product-filter.model';

export interface IProductRepository {
  findAll(page: number, limit: number, filter?: ProductFilter): Promise<PaginationModel<Product>>;
  findById(id: number): Promise<Product | null>;
}
