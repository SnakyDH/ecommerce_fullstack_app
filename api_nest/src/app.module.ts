import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './modules/products.module';
import { typeOrmConfig } from './config/data-source.options';
import { PresignedModule } from '@modules/presigned.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ProductsModule,
    PresignedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }




