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
    const productsPaginated = await this.productRepository.findAll(page, limit, filter);
    if (productsPaginated.data.length <= 0) {
      throw new ExceptionCustom(ExceptionConstants.PRODUCT_NOT_FOUND);
    }

    productsPaginated.data.forEach((product) => {
      product.price = this.formatPrice(product.price);
    });


    return productsPaginated;
  }

  private formatPrice(price: number): number {
    return price / 100;
  }
}
