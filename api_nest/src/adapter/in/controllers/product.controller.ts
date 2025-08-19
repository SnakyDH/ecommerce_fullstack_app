import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { GetProductsRequestDto } from '../dtos/get-products-request.dto';
import { GetProductsResponseDto } from '../dtos/get-products-response.dto';
import { HttpExceptionHandler } from '../handlers/http-exception.handler';
import { GetProductsHandler } from '../handlers/get-products.handler';
import { ExceptionCustom } from '@domain/common/exceptions/exception-custom';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly getProductsHandler: GetProductsHandler,
    private readonly httpExceptionHandler: HttpExceptionHandler,
  ) { }

  @Get()
  @ApiOperation({
    summary: 'Get products with filtering and pagination',
    description: 'Retrieve a paginated list of products with optional filtering by name, price range, stock, and sorting options',
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: GetProductsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid query parameters',
  })
  @ApiResponse({
    status: 404,
    description: 'No products found',
  })
  @ApiQuery({ type: GetProductsRequestDto, name: 'getProductsDto' })
  async getProducts(
    @Query()
    getProductsDto: GetProductsRequestDto,
  ): Promise<GetProductsResponseDto> {
    try {
      return await this.getProductsHandler.execute(getProductsDto);
    } catch (error) {
      if (error instanceof ExceptionCustom) {
        return this.httpExceptionHandler.handle(error);
      }
      throw new InternalServerErrorException(error);
    }
  }
}
