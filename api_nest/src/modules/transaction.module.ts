import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTransactionEntity } from '../adapter/out/postgres/entities/OrderTransaction.entity';
import { TransactionRepository } from '../adapter/out/postgres/repositories/transaction.repository';
import { TransactionController } from '../adapter/in/controllers/transaction.controller';
import { InitTransactionHandler } from '../adapter/in/handlers/init-transaction.handler';
import { InitTransactionUseCase } from '../../domain/transaction/use_case/init-transaction.use-case';
import { HttpExceptionHandler } from '../adapter/in/handlers/http-exception.handler';
import { ProductsModule } from './products.module';
import { PresignedModule } from './presigned.module';
import { DeliveryModule } from './delivery.module';
import { ITransactionRepository } from '@domain/transaction/repository/transaction-repository.interface';
import { IPresignedRepository } from '@domain/presigned/repository/presigned-repository.interface';
import { IProductRepository } from '@domain/products/repository/product-repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderTransactionEntity]),
    ProductsModule,
    PresignedModule,
    DeliveryModule,
  ],
  controllers: [TransactionController],
  providers: [
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository,
    },
    {
      provide: InitTransactionUseCase,
      useFactory: (
        transactionRepo: ITransactionRepository,
        productRepo: IProductRepository,
      ) => {
        return new InitTransactionUseCase(
          transactionRepo,
          productRepo,
        );
      },
      inject: [
        'ITransactionRepository',
        'IProductRepository',
      ],
    },
    {
      provide: InitTransactionHandler,
      useFactory: (initTransactionUseCase: InitTransactionUseCase) =>
        new InitTransactionHandler(initTransactionUseCase),
      inject: [InitTransactionUseCase],
    },
    HttpExceptionHandler,
  ],
  exports: ['ITransactionRepository'],
})
export class TransactionModule { }