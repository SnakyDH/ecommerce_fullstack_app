import { Product } from "@domain/products/model/product.model";
import { ProductEntity } from "../entities/product.entity";

export class ProductEntityToDomainMapper {
  static toDomain(entity: ProductEntity): Product {
    return new Product(
      entity.id,
      entity.name,
      entity.image,
      entity.price,
      entity.stock,
    )
  }
}