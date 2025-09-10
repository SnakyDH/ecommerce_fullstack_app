import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './modules/products.module';
import { typeOrmConfig } from './config/data-source.options';
import { PresignedModule } from '@modules/presigned.module';
import { DeliveryModule } from './modules/delivery.module';
import { TransactionModule } from './modules/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ProductsModule,
    PresignedModule,
    DeliveryModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }




