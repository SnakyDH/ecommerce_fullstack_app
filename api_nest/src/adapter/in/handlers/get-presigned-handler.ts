import { Presigned } from 'domain/presigned/model/presigned.model';
import { GetPresignedUseCase } from 'domain/presigned/use_case/get-presigned.use-case';

export class GetPresignedHandler {
  constructor(private readonly getPresignedUseCase: GetPresignedUseCase) { }

  async execute(): Promise<Presigned[]> {
    return this.getPresignedUseCase.execute();
  }
}
