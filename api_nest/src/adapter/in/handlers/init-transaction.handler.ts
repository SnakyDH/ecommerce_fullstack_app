import { PresignedType } from '@domain/presigned/model/presigned.type';
import { InitTransactionUseCase } from '../../../../domain/transaction/use_case/init-transaction.use-case';
import { InitTransactionRequestDto } from '../dtos/init-transaction-request.dto';
import { InitTransactionResponseDto } from '../dtos/init-transaction-response.dto';

export class InitTransactionHandler {
  constructor(private readonly initTransactionUseCase: InitTransactionUseCase) { }

  async execute(request: InitTransactionRequestDto): Promise<InitTransactionResponseDto> {
    const result = await this.initTransactionUseCase.execute({
      productId: request.productId,
      quantity: request.quantity,
      presignedDocuments: request.presignedDocuments.map(presigned => ({
        url: presigned.url,
        type: presigned.type as PresignedType,
        token: presigned.token,
      })),
    });

    return {
      transactionId: result.transaction.id,
      status: result.transaction.status,
      productId: result.transaction.product.id,
      quantity: result.transaction.quantity,
      total: result.transaction.total,
      presignedDocuments: result.presignedDocuments.map(presigned => ({
        url: presigned.url,
        type: presigned.type,
        token: presigned.token,
      })),
      createdAt: result.transaction.createdAt,
    };
  }
}
