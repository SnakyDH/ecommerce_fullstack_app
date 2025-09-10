import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { InitTransactionHandler } from '../handlers/init-transaction.handler';
import { HttpExceptionHandler } from '../handlers/http-exception.handler';
import { InitTransactionRequestDto } from '../dtos/init-transaction-request.dto';
import { TransactionStatus } from '../../../../domain/transaction/enums/transaction-status.enum';
import { PresignedType } from '../../../../domain/presigned/model/presigned.type';

describe('TransactionController', () => {
  let controller: TransactionController;
  let initTransactionHandler: jest.Mocked<InitTransactionHandler>;
  let httpExceptionHandler: jest.Mocked<HttpExceptionHandler>;

  beforeEach(async () => {
    const mockInitTransactionHandler = {
      execute: jest.fn(),
    };

    const mockHttpExceptionHandler = {
      handle: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: InitTransactionHandler,
          useValue: mockInitTransactionHandler,
        },
        {
          provide: HttpExceptionHandler,
          useValue: mockHttpExceptionHandler,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    initTransactionHandler = module.get(InitTransactionHandler);
    httpExceptionHandler = module.get(HttpExceptionHandler);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('initTransaction', () => {
    it('should successfully initialize a transaction', async () => {
      // Arrange
      const request: InitTransactionRequestDto = {
        productId: 1,
        quantity: 2,
        presignedDocuments: [],
      };

      const expectedResponse = {
        transactionId: 1,
        status: TransactionStatus.PENDING,
        productId: 1,
        quantity: 2,
        total: 25.99,
        presignedDocuments: [
          {
            url: 'https://example.com/terms',
            type: PresignedType.END_USER_POLICY,
            token: 'token123',
          },
          {
            url: 'https://example.com/privacy',
            type: PresignedType.PERSONAL_DATA_AUTH,
            token: 'token456',
          },
        ],
        createdAt: new Date(),
      };

      initTransactionHandler.execute.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.initTransaction(request);

      // Assert
      expect(initTransactionHandler.execute).toHaveBeenCalledWith(request);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle validation errors', async () => {
      // Arrange
      const request: InitTransactionRequestDto = {
        productId: 999, // Non-existent product
        quantity: 1,
        presignedDocuments: [],
      };

      const error = new Error('Product not found');
      initTransactionHandler.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.initTransaction(request)).rejects.toThrow(error);
    });
  });
});
