import { ExceptionCustom } from "@domain/common/exceptions/exception-custom";
import { ITransactionRepository } from "../repository/transaction-repository.interface";
import { ExceptionConstants } from "@domain/common/exceptions/exception.constants";
import { OrderTransaction } from "../model/transaction.model";


export class GetTransactionByIdUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) { }

  async execute(id: number): Promise<OrderTransaction> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new ExceptionCustom(ExceptionConstants.TRANSACTION_NOT_FOUND);
    }
    return transaction;
  }
}