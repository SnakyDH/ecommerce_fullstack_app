import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryEntity } from '../adapter/out/postgres/entities/Delivery.entity';
import { DeliveryRepository } from '../adapter/out/postgres/repositories/delivery.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryEntity])],
  providers: [
    {
      provide: 'IDeliveryRepository',
      useClass: DeliveryRepository,
    },
  ],
  exports: ['IDeliveryRepository'],
})
export class DeliveryModule { }
