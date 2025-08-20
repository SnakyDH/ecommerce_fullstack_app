import { IPresignedRepository } from '../repository/presigned-repository.interface';
import { Presigned } from '../model/presigned.model';
import { PresignedType } from '../model/presigned.type';
import { GetPresignedUseCase } from './get-presigned.use-case';
import { ExceptionCustom } from '@domain/common/exceptions/exception-custom';
import { ExceptionConstants } from '@domain/common/exceptions/exception.constants';

describe('GetPresignedUseCase', () => {
  let useCase: GetPresignedUseCase;
  let mockPresignedRepository: jest.Mocked<IPresignedRepository>;

  beforeEach(() => {
    mockPresignedRepository = {
      getPresigneds: jest.fn(),
    } as unknown as jest.Mocked<IPresignedRepository>;

    useCase = new GetPresignedUseCase(mockPresignedRepository);
  });

  describe('execute', () => {
    it('should return presigned list when repository returns data', async () => {
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

      mockPresignedRepository.getPresigneds.mockResolvedValue(
        expectedPresigneds,
      );

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual(expectedPresigneds);
      expect(mockPresignedRepository.getPresigneds).toHaveBeenCalledTimes(1);
    });

    it('should throw PRE_SIGNED_NOT_FOUND when repository returns empty array', async () => {
      // Arrange
      mockPresignedRepository.getPresigneds.mockResolvedValue([]);

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow(
        new ExceptionCustom(ExceptionConstants.PRE_SIGNED_NOT_FOUND),
      );
      expect(mockPresignedRepository.getPresigneds).toHaveBeenCalledTimes(1);
    });

    it('should throw GET_PRESIGNED_ERROR when repository returns null', async () => {
      // Arrange
      mockPresignedRepository.getPresigneds.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow(
        new ExceptionCustom(ExceptionConstants.GET_PRESIGNED_ERROR),
      );
      expect(mockPresignedRepository.getPresigneds).toHaveBeenCalledTimes(1);
    });

    it('should throw GET_PRESIGNED_ERROR when repository throws error', async () => {
      // Arrange
      const error = new Error('Repository error');
      mockPresignedRepository.getPresigneds.mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow(
        new ExceptionCustom(ExceptionConstants.GET_PRESIGNED_ERROR),
      );
      expect(mockPresignedRepository.getPresigneds).toHaveBeenCalledTimes(1);
    });
  });
});
