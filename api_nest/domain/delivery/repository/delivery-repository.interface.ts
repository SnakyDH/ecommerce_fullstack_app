import { Delivery } from '../model/delivery';

export interface IDeliveryRepository {
  create(delivery: Omit<Delivery, 'id'>): Promise<Delivery>;
  findById(id: number): Promise<Delivery | null>;
  update(id: number, delivery: Partial<Delivery>): Promise<Delivery>;
}
