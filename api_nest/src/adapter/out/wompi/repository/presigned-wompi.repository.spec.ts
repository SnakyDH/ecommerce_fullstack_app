import { PresignedWompiService } from './presigned-wompi.repository';
import { Presigned } from 'domain/presigned/model/presigned.model';
import { PresignedType } from 'domain/presigned/model/presigned.type';
import { GetPresignedResponseDto } from '../dtos/get-presigned-response.dto';
import { envOptions } from 'src/config/env.options';

// Mock de fetch
global.fetch = jest.fn();

describe('PresignedWompiService', () => {
  let service: PresignedWompiService;

  beforeEach(() => {
    service = new PresignedWompiService();
    jest.clearAllMocks();
  });

  describe('getPresignedList', () => {
    it('should return presigned when API call is successful', async () => {
      // Arrange
      const mockResponse: GetPresignedResponseDto = {
        data: {
          presigned_acceptance: {
            acceptance_token: 'acceptance_token_1',
            permalink: 'https://example.com/acceptance',
            type: 'END_USER_POLICY',
          },
          presigned_personal_data_auth: {
            acceptance_token: 'acceptance_token_2',
            permalink: 'https://example.com/personal-data',
            type: 'PERSONAL_DATA_AUTH',
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      // Act
      const result = await service.getPresigneds();

      // Assert
      expect(result).toHaveLength(2);
      expect(result?.[0]).toBeInstanceOf(Presigned);
      expect(result?.[0]?.url).toBe('https://example.com/acceptance');
      expect(result?.[0]?.type).toBe(PresignedType.END_USER_POLICY);
      expect(result?.[0]?.token).toBe('acceptance_token_1');
      expect(result?.[1]?.url).toBe('https://example.com/personal-data');
      expect(result?.[1]?.type).toBe(PresignedType.PERSONAL_DATA_AUTH);
      expect(result?.[1]?.token).toBe('acceptance_token_2');

      expect(global.fetch).toHaveBeenCalledWith(
        `${envOptions.wompi.baseUrl}/merchants/${envOptions.wompi.publicKey}`,
      );
    });

    it('should return null when API call fails', async () => {
      // Arrange
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      // Act
      const result = await service.getPresigneds();

      // Assert
      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalledWith(
        `${envOptions.wompi.baseUrl}/merchants/${envOptions.wompi.publicKey}`,
      );
    });

    it('should return null when API returns error status', async () => {
      // Arrange
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      });

      // Act
      const result = await service.getPresigneds();

      // Assert
      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalledWith(
        `${envOptions.wompi.baseUrl}/merchants/${envOptions.wompi.publicKey}`,
      );
    });
  });
});
