import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './modules/products.module';
import { typeOrmConfig } from './config/data-source.options';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }




