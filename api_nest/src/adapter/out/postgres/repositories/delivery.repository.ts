import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDeliveryRepository } from '@domain/delivery/repository/delivery-repository.interface';
import { Delivery } from '@domain/delivery/model/delivery';
import { DeliveryEntity } from '../entities/Delivery.entity';
import { ExceptionCustom } from '@domain/common/exceptions/exception-custom';
import { ExceptionConstants } from '@domain/common/exceptions/exception.constants';

@Injectable()
export class DeliveryRepository implements IDeliveryRepository {
  constructor(
    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepository: Repository<DeliveryEntity>,
  ) { }

  async create(delivery: Omit<Delivery, 'id'>): Promise<Delivery> {
    const deliveryEntity = this.deliveryRepository.create(delivery);
    const savedDelivery = await this.deliveryRepository.save(deliveryEntity);
    return savedDelivery;
  }

  async findById(id: number): Promise<Delivery | null> {
    const delivery = await this.deliveryRepository.findOne({ where: { id } });
    return delivery || null;
  }

  async update(id: number, delivery: Partial<Delivery>): Promise<Delivery> {
    await this.deliveryRepository.update(id, delivery);
    const updatedDelivery = await this.deliveryRepository.findOne({ where: { id } });

    if (!updatedDelivery) {
      throw new ExceptionCustom(
        ExceptionConstants.DELIVERY_NOT_FOUND,
      );
    }

    return updatedDelivery;
  }

}
