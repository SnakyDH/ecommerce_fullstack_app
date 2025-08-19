import { Test, TestingModule } from '@nestjs/testing';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductController } from './product.controller';
import { GetProductsHandler } from '../handlers/get-products.handler';
import { HttpExceptionHandler } from '../handlers/http-exception.handler';
import { GetProductsRequestDto } from '../dtos/get-products-request.dto';
import {
  GetProductsResponseDto,
  GetProductResponseDto,
} from '../dtos/get-products-response.dto';
import { ExceptionCustom } from '@domain/common/exceptions/exception-custom';
import { ExceptionConstants } from '@domain/common/exceptions/exception.constants';

describe('ProductController', () => {
  let controller: ProductController;
  let mockGetProductsHandler: { execute: jest.Mock };

  beforeEach(async () => {
    mockGetProductsHandler = {
      execute: jest.fn(),
    };

    const mockHttpExceptionHandler = {
      handle: jest.fn().mockImplementation((error: ExceptionCustom) => {
        if (error.message === ExceptionConstants.PRODUCT_NOT_FOUND.toString()) {
          throw new NotFoundException(error.message);
        }
        throw new InternalServerErrorException(error.message);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: GetProductsHandler,
          useValue: mockGetProductsHandler,
        },
        {
          provide: HttpExceptionHandler,
          useValue: mockHttpExceptionHandler,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('returns products paginated correctly', async () => {
      // Arrange
      const getProductsDto: GetProductsRequestDto = {
        page: 1,
        limit: 10,
      };

      const mockProduct: GetProductResponseDto = {
        id: 1,
        name: 'Producto de prueba',
        image: 'imagen.jpg',
        price: 100,
        stock: 10,
      };

      const expectedResponse: GetProductsResponseDto = {
        data: [mockProduct],
        pagination: {
          page: 1,
          totalPages: 1,
          total: 1,
          limit: 10,
        },
      };

      mockGetProductsHandler.execute.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.getProducts(getProductsDto);

      // Assert
      expect(mockGetProductsHandler.execute).toHaveBeenCalledWith(
        getProductsDto,
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should throw NotFoundException when a CustomException with PRODUCT_NOT_FOUND is thrown', async () => {
      // Arrange
      const getProductsDto: GetProductsRequestDto = {
        page: 1,
        limit: 10,
      };

      const customError = new ExceptionCustom(
        ExceptionConstants.PRODUCT_NOT_FOUND,
      );

      mockGetProductsHandler.execute.mockRejectedValue(customError);

      // Act & Assert
      await expect(controller.getProducts(getProductsDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockGetProductsHandler.execute).toHaveBeenCalledWith(
        getProductsDto,
      );
    });

    it('should throw InternalServerErrorException when an unexpected error occurs', async () => {
      // Arrange
      const getProductsDto: GetProductsRequestDto = {
        page: 1,
        limit: 10,
      };

      const error = new Error('Unexpected error');
      mockGetProductsHandler.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getProducts(getProductsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockGetProductsHandler.execute).toHaveBeenCalledWith(
        getProductsDto,
      );
    });
  });
});
