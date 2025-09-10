import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITransactionRepository } from '@domain/transaction/repository/transaction-repository.interface';
import { OrderTransaction } from '@domain/transaction/model/transaction.model';
import { OrderTransactionEntity } from '../entities/OrderTransaction.entity';
import { ExceptionCustom } from '@domain/common/exceptions/exception-custom';
import { ExceptionConstants } from '@domain/common/exceptions/exception.constants';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(OrderTransactionEntity)
    private readonly transactionRepository: Repository<OrderTransactionEntity>,
  ) { }

  async create(transaction: Omit<OrderTransaction, 'id' | 'createdAt'>): Promise<OrderTransaction> {
    const transactionData = {
      paymentGatewayTransactionId: transaction.paymentGatewayTransactionId,
      quantity: transaction.quantity,
      total: transaction.total,
      status: transaction.status,
      productId: transaction.product.id,
      deliveryId: transaction.delivery?.id,
      acceptanceEndUserPolicyUrl: transaction.acceptanceEndUserPolicy?.url,
      acceptancePersonalDataAuthorizationUrl: transaction.acceptancePersonalDataAuthorization?.url,
      acceptanceEndUserPolicyToken: transaction.acceptanceEndUserPolicy!.token,
      acceptancePersonalDataAuthorizationToken: transaction.acceptancePersonalDataAuthorization!.token,
    };

    const transactionEntity = this.transactionRepository.create(transactionData);
    const savedTransaction = await this.transactionRepository.save(transactionEntity);

    const completeTransaction = await this.transactionRepository.findOne({
      where: { id: savedTransaction.id },
      relations: ['product', 'delivery'],
    });

    if (!completeTransaction) {
      throw new ExceptionCustom(ExceptionConstants.TRANSACTION_NOT_FOUND);
    }

    return completeTransaction as OrderTransaction;
  }

  async findById(id: number): Promise<OrderTransaction | null> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['product', 'delivery'],
    });
    return transaction as OrderTransaction || null;
  }

  async findByPaymentGatewayId(paymentGatewayTransactionId: string): Promise<OrderTransaction | null> {
    const transaction = await this.transactionRepository.findOne({
      where: { paymentGatewayTransactionId },
      relations: ['product', 'delivery'],
    });
    return transaction as OrderTransaction || null;
  }

  async update(id: number, transaction: Partial<OrderTransaction>): Promise<OrderTransaction> {
    const updateData: any = {};

    if (transaction.paymentGatewayTransactionId !== undefined) {
      updateData.paymentGatewayTransactionId = transaction.paymentGatewayTransactionId;
    }
    if (transaction.quantity !== undefined) {
      updateData.quantity = transaction.quantity;
    }
    if (transaction.total !== undefined) {
      updateData.total = transaction.total;
    }
    if (transaction.status !== undefined) {
      updateData.status = transaction.status;
    }
    if (transaction.product !== undefined) {
      updateData.productId = transaction.product.id;
    }
    if (transaction.delivery !== undefined) {
      updateData.deliveryId = transaction.delivery?.id;
    }
    if (transaction.acceptanceEndUserPolicy !== undefined) {
      updateData.acceptanceEndUserPolicyUrl = transaction.acceptanceEndUserPolicy?.url;
    }
    if (transaction.acceptancePersonalDataAuthorization !== undefined) {
      updateData.acceptancePersonalDataAuthorizationUrl = transaction.acceptancePersonalDataAuthorization?.url;
    }

    await this.transactionRepository.update(id, updateData);
    const updatedTransaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['product', 'delivery'],
    });

    if (!updatedTransaction) {
      throw new ExceptionCustom(
        ExceptionConstants.TRANSACTION_NOT_FOUND,
      );
    }

    return updatedTransaction as OrderTransaction;
  }

  async findAll(): Promise<OrderTransaction[]> {
    const transactions = await this.transactionRepository.find({
      relations: ['product', 'delivery'],
    });
    return transactions as OrderTransaction[];
  }
}
