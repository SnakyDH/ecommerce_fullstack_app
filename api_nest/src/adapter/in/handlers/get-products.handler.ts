import { GetProductsUseCase } from '@domain/products/use_case/get-products.use-case';
import { GetProductsRequestDto } from '../dtos/get-products-request.dto';
import { GetProductsResponseDto } from '../dtos/get-products-response.dto';
import { ProductMapper } from '../mappers/product.mapper';
import { ProductFilterMapper } from '../mappers/product-filter.mapper';

export class GetProductsHandler {
  constructor(private readonly getProductsUseCase: GetProductsUseCase) { }

  async execute(
    getProductsDto: GetProductsRequestDto,
  ): Promise<GetProductsResponseDto> {
    const { page, limit } = getProductsDto;
    const filter = ProductFilterMapper.fromDto(getProductsDto);
    const productsModel = await this.getProductsUseCase.execute(page, limit, filter);
    return ProductMapper.toPaginatedProductsDto(productsModel);
  }
}
