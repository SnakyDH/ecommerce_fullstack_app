import { ExceptionCustom } from '../../common/exceptions/exception-custom';
import { ExceptionConstants } from '../../common/exceptions/exception.constants';
import { ITransactionRepository } from '../repository/transaction-repository.interface';
import { IProductRepository } from '../../products/repository/product-repository.interface';
import { OrderTransaction } from '../model/transaction.model';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { Presigned } from '../../presigned/model/presigned.model';
import { PresignedType } from '../../presigned/model/presigned.type';
import { Product } from '../../products/model/product.model';

export interface InitTransactionRequest {
  productId: number;
  quantity: number;
  presignedDocuments: Presigned[];
}

export interface InitTransactionResult {
  transaction: OrderTransaction;
  presignedDocuments: Presigned[];
}

export class InitTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly productRepository: IProductRepository,
  ) { }

  async execute(request: InitTransactionRequest): Promise<InitTransactionResult> {
    const product: Product | null = await this.productRepository.findById(request.productId);
    if (!product) {
      throw new ExceptionCustom(ExceptionConstants.PRODUCT_NOT_FOUND);
    }

    const total = parseFloat((product.price * request.quantity).toFixed(2));
    const vat = parseFloat((total * 0.19).toFixed(2));

    const transactionData: Omit<OrderTransaction, 'id' | 'createdAt' | 'delivery' | 'paymentGatewayTransactionId'> = {
      vat,
      quantity: request.quantity,
      product,
      total,
      status: TransactionStatus.PENDING,
      acceptanceEndUserPolicy: request.presignedDocuments.find(p => p.type === PresignedType.END_USER_POLICY),
      acceptancePersonalDataAuthorization: request.presignedDocuments.find(p => p.type === PresignedType.PERSONAL_DATA_AUTH),
    };

    const transaction = await this.transactionRepository.create(transactionData);

    return {
      transaction,
      presignedDocuments: request.presignedDocuments,
    };
  }

}