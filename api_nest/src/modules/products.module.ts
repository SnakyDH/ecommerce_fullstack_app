import { ProductController } from '@adapter/in/controllers/product.controller';
import { GetProductsHandler } from '@adapter/in/handlers/get-products.handler';
import { HttpExceptionHandler } from '@adapter/in/handlers/http-exception.handler';
import { ProductMapper } from '@adapter/in/mappers/product.mapper';
import { ProductEntity } from '@adapter/out/postgres/entities/product.entity';
import { ProductRepository } from '@adapter/out/postgres/repository/product.repository';
import { GetProductsUseCase } from '@domain/products/use_case/get-products.use-case';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  providers: [
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: GetProductsUseCase,
      useFactory: (productRepository: ProductRepository) =>
        new GetProductsUseCase(productRepository),
      inject: ['IProductRepository'],
    },
    {
      provide: GetProductsHandler,
      useFactory: (getProductsUseCase: GetProductsUseCase) =>
        new GetProductsHandler(getProductsUseCase),
      inject: [GetProductsUseCase],
    },
    ProductMapper,
    HttpExceptionHandler,
  ],
  exports: ['IProductRepository', GetProductsHandler, ProductMapper],
})
export class ProductsModule { }
