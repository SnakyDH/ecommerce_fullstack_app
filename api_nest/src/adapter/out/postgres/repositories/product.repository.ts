import { InjectRepository } from '@nestjs/typeorm';
import { PaginationModel } from '@domain/common/util/pagination.model';
import { Product } from '@domain/products/model/product.model';
import { IProductRepository } from '@domain/products/repository/product-repository.interface';
import { ProductEntity } from '@adapter/out/postgres/entities/product.entity';
import { Between, FindOperator, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ProductFilter } from '@domain/products/model/product-filter.model';
import { ProductEntityToDomainMapper } from '../mappers/product-db-to-domain.mapper';

export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) { }
  async updateStock(id: number, quantity: number): Promise<void> {
    await this.productRepository.update(id, { stock: quantity });
  }
  async findById(id: number): Promise<Product | null> {
    const product = await this.productRepository.findOne({ where: { id } });
    return product ? ProductEntityToDomainMapper.toDomain(product) : null;
  }

  async findAll(
    page: number,
    limit: number,
    filter?: ProductFilter,
  ): Promise<PaginationModel<Product>> {
    const whereClause: { name?: FindOperator<string>, price?: FindOperator<number>, stock?: FindOperator<number> } = {};

    if (filter?.name) {
      whereClause.name = ILike(`%${filter.name}%`);
    }

    if (filter?.minPrice !== undefined && filter?.maxPrice !== undefined) {
      whereClause.price = Between(filter.minPrice, filter.maxPrice);
    } else if (filter?.minPrice !== undefined) {
      whereClause.price = MoreThanOrEqual(filter.minPrice);
    } else if (filter?.maxPrice !== undefined) {
      whereClause.price = LessThanOrEqual(filter.maxPrice);
    }

    if (filter?.minStock !== undefined && filter?.maxStock !== undefined) {
      whereClause.stock = Between(filter.minStock, filter.maxStock);
    } else if (filter?.minStock !== undefined) {
      whereClause.stock = MoreThanOrEqual(filter.minStock);
    } else if (filter?.maxStock !== undefined) {
      whereClause.stock = LessThanOrEqual(filter.maxStock);
    }

    const [products, total] = await this.productRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: whereClause,
      order: filter?.orderBy?.field ? {
        [filter.orderBy.field]: filter.orderBy.order,
      } : undefined,
    });
    return PaginationModel.create(products, total, page, limit);
  }
}
