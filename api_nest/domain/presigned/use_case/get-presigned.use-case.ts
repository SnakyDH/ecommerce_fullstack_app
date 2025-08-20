import { ExceptionCustom } from '@domain/common/exceptions/exception-custom';
import { Presigned } from '../model/presigned.model';
import { IPresignedRepository } from '../repository/presigned-repository.interface';
import { ExceptionConstants } from '@domain/common/exceptions/exception.constants';

export class GetPresignedUseCase {
  constructor(private readonly presignedRepository: IPresignedRepository) { }

  async execute(): Promise<Presigned[]> {
    try {
      const presignedList = await this.presignedRepository.getPresigneds();

      if (!presignedList) {
        throw new ExceptionCustom(ExceptionConstants.GET_PRESIGNED_ERROR);
      }

      if (presignedList.length === 0) {
        throw new ExceptionCustom(ExceptionConstants.PRE_SIGNED_NOT_FOUND);
      }

      return presignedList;
    } catch (error) {
      if (error instanceof ExceptionCustom) {
        throw error;
      }
      throw new ExceptionCustom(ExceptionConstants.GET_PRESIGNED_ERROR);
    }
  }
}
