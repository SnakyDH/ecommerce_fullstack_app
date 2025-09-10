import { GetTransactionByIdUseCase } from "@domain/transaction/use_case/get-transaction-by-id.use-case";
import { TransactionMapper } from "../mappers/transaction.mapper";
import { GetTransactionByIdResponseDto } from "../dtos/get-transaction-by-id.response.dto";

export class GetTransactionByIdHandler {
  constructor(private readonly getTransactionByIdUseCase: GetTransactionByIdUseCase) { }

  async execute(id: number): Promise<GetTransactionByIdResponseDto> {
    const transaction = await this.getTransactionByIdUseCase.execute(id);
    return TransactionMapper.toTransactionDto(transaction);
  }
}