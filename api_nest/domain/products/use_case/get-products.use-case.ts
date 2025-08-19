import { Product } from '../model/product.model';
import { IProductRepository } from '../repository/product-repository.interface';
import { PaginationModel } from '../../common/util/pagination.model';
import { ProductFilter } from '../model/product-filter.model';
import { ExceptionCustom } from 'domain/common/exceptions/exception-custom';
import { ExceptionConstants } from 'domain/common/exceptions/exception.constants';

export class GetProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) { }

  async execute(
    page: number,
    limit: number,
    filter?: ProductFilter,
  ): Promise<PaginationModel<Product>> {
    const products = await this.productRepository.findAll(page, limit, filter);
    if (products.data.length <= 0) {
      throw new ExceptionCustom(ExceptionConstants.PRODUCT_NOT_FOUND);
    }
    return products;
  }
}
