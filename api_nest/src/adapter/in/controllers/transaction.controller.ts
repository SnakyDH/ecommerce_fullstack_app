import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InitTransactionRequestDto } from '../dtos/init-transaction-request.dto';
import { InitTransactionResponseDto } from '../dtos/init-transaction-response.dto';
import { InitTransactionHandler } from '../handlers/init-transaction.handler';
import { HttpExceptionHandler } from '../handlers/http-exception.handler';
import { ExceptionCustom } from '../../../../domain/common/exceptions/exception-custom';
import { FinishTransactionRequestDto } from '../dtos/finish-transaction-request.dto';
import { FinishTransactionResponseDto } from '../dtos/finish-transaction-response.dto';
import { FinishTransactionHandler } from '../handlers/finish-transaction.handler';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly initTransactionHandler: InitTransactionHandler,
    private readonly finishTransactionHandler: FinishTransactionHandler,
    private readonly httpExceptionHandler: HttpExceptionHandler,
  ) { }

  @Post('init-transaction')
  @ApiOperation({
    summary: 'Initialize a new transaction',
    description: 'Creates a new transaction with presigned documents for user acceptance',
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction initialized successfully with presigned documents',
    type: InitTransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Product or delivery not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async initTransaction(
    @Body() request: InitTransactionRequestDto,
  ): Promise<InitTransactionResponseDto> {
    try {
      return await this.initTransactionHandler.execute(request);
    } catch (error) {
      if (error instanceof ExceptionCustom) {
        return this.httpExceptionHandler.handle(error);
      }
      throw new InternalServerErrorException(error);
    }
  }


  @Post('finish-transaction')
  @ApiOperation({
    summary: 'Finish a transaction',
    description: 'Finishes a transaction and updates the transaction status',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction finished successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async finishTransaction(
    @Body() request: FinishTransactionRequestDto,
  ): Promise<FinishTransactionResponseDto> {
    try {
      return await this.finishTransactionHandler.execute(request);
    } catch (error) {
      if (error instanceof ExceptionCustom) {
        return this.httpExceptionHandler.handle(error);
      }
      throw new InternalServerErrorException(error);
    }
  }
}
