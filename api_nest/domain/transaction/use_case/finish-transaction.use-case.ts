import { IProductRepository } from "@domain/products/repository/product-repository.interface";
import { ITransactionRepository } from "../repository/transaction-repository.interface";
import { IDeliveryRepository } from "@domain/delivery/repository/delivery-repository.interface";
import { IPaymentGatewayRepository } from "../repository/payment-gateway-repository.interface";
import { ExceptionCustom } from "@domain/common/exceptions/exception-custom";
import { ExceptionConstants } from "@domain/common/exceptions/exception.constants";
import { OrderTransaction } from "../model/transaction.model";
import { TransactionStatus } from "../enums/transaction-status.enum";
import { PaymentCard } from "../model/credit-card.model";
import { Delivery } from "@domain/delivery/model/delivery";

export interface FinishTransactionRequest {
  transactionId: number;
  paymentCard: PaymentCard;
  delivery: Omit<Delivery, 'id'>;
}

export interface FinishTransactionResult {
  transaction: OrderTransaction;
}

export class FinishTransactionUseCase {

  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly productsRepository: IProductRepository,
    private readonly deliveryRepository: IDeliveryRepository,
    private readonly paymentGatewayRepository: IPaymentGatewayRepository,
  ) { }

  async execute(request: FinishTransactionRequest): Promise<FinishTransactionResult> {
    const transaction = await this.transactionRepository.findById(request.transactionId);
    if (!transaction) {
      throw new ExceptionCustom(ExceptionConstants.TRANSACTION_NOT_FOUND);
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new ExceptionCustom(ExceptionConstants.TRANSACTION_ALREADY_FINISHED);
    }

    if (transaction.product.stock < transaction.quantity) {
      throw new ExceptionCustom(ExceptionConstants.PRODUCT_OUT_OF_STOCK);
    }
    if (!transaction.delivery) {
      await this.deliveryRepository.create(request.delivery);
    }
    else {
      await this.deliveryRepository.update(transaction.delivery.id, transaction.delivery);
    }

    const paymentResult = await this.paymentGatewayRepository.pay(transaction, request.paymentCard);

    if (paymentResult.status == TransactionStatus.APPROVED) {
      await this.productsRepository.updateStock(transaction.product.id, transaction.quantity);
    }
    // * Update the transaction status
    transaction.status = paymentResult.status;
    transaction.paymentGatewayTransactionId = paymentResult.id;

    await this.transactionRepository.update(transaction.id, transaction);
    if (paymentResult.status == TransactionStatus.REJECTED) {
      throw new ExceptionCustom(ExceptionConstants.TRANSACTION_REJECTED);
    }


    return {
      transaction,
    };
  }


}