import { PresignedController } from './presigned.controller';
import { GetPresignedHandler } from '@adapter/in/handlers/get-presigned-handler';
import { HttpExceptionHandler } from '@adapter/in/handlers/http-exception.handler';
import { ExceptionCustom } from '@domain/common/exceptions/exception-custom';
import { ExceptionConstants } from '@domain/common/exceptions/exception.constants';
import { Presigned } from 'domain/presigned/model/presigned.model';
import { PresignedType } from 'domain/presigned/model/presigned.type';

describe('PresignedsController', () => {
  let controller: PresignedController;
  let mockGetPresignedHandler: jest.Mocked<GetPresignedHandler>;
  let mockHttpExceptionHandler: jest.Mocked<HttpExceptionHandler>;

  beforeEach(() => {
    mockGetPresignedHandler = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetPresignedHandler>;

    mockHttpExceptionHandler = {
      handle: jest.fn(),
    } as unknown as jest.Mocked<HttpExceptionHandler>;

    controller = new PresignedController(
      mockGetPresignedHandler,
      mockHttpExceptionHandler,
    );
  });

  describe('getPresigned', () => {
    it('should return presigned when handler returns data', async () => {
      // Arrange
      const expectedPresigneds: Presigned[] = [
        new Presigned(
          'https://example.com/acceptance',
          PresignedType.END_USER_POLICY,
          'acceptance_token_1',
        ),
        new Presigned(
          'https://example.com/personal-data',
          PresignedType.PERSONAL_DATA_AUTH,
          'acceptance_token_2',
        ),
      ];

      mockGetPresignedHandler.execute.mockResolvedValue(expectedPresigneds);

      // Act
      const result = await controller.getPresigned();

      // Assert
      expect(result).toEqual(expectedPresigneds);
      expect(mockGetPresignedHandler.execute).toHaveBeenCalledTimes(1);
    });

    it('should handle CustomException with HttpExceptionHandler', async () => {
      // Arrange
      const customException = new ExceptionCustom(
        ExceptionConstants.PRE_SIGNED_NOT_FOUND,
      );
      const notFoundException = new Error(
        ExceptionConstants.PRE_SIGNED_NOT_FOUND,
      );

      mockGetPresignedHandler.execute.mockRejectedValue(customException);
      mockHttpExceptionHandler.handle.mockImplementation(() => {
        throw notFoundException;
      });

      // Act & Assert
      await expect(controller.getPresigned()).rejects.toThrow(
        ExceptionConstants.PRE_SIGNED_NOT_FOUND,
      );
      expect(mockGetPresignedHandler.execute).toHaveBeenCalledTimes(1);
      expect(mockHttpExceptionHandler.handle).toHaveBeenCalledWith(
        customException,
      );
    });

    it('should throw error for non-CustomException errors', async () => {
      // Arrange
      const error = new Error('Generic error');
      mockGetPresignedHandler.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getPresigned()).rejects.toThrow('Generic error');
      expect(mockGetPresignedHandler.execute).toHaveBeenCalledTimes(1);
      expect(mockHttpExceptionHandler.handle).not.toHaveBeenCalled();
    });
  });
});
