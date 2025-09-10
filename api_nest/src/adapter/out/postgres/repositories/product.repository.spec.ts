import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from './product.repository';
import { ProductEntity } from '../entities/product.entity';
import { ProductFilter, OrderType } from '@domain/products/model/product-filter.model';

describe('ProductRepository', () => {
  let productRepository: ProductRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<ProductEntity>>;

  beforeEach(async () => {
    const mockRepository = {
      findAndCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    productRepository = module.get<ProductRepository>(ProductRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(ProductEntity));
  });

  describe('findAll', () => {
    const mockProducts: ProductEntity[] = [
      {
        id: 1,
        name: 'Premium Coffee Beans',
        image: 'coffee1.jpg',
        price: 2499,
        stock: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Espresso Machine',
        image: 'machine1.jpg',
        price: 45999,
        stock: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return paginated products without filters', async () => {
      // Arrange
      mockTypeOrmRepository.findAndCount.mockResolvedValue([mockProducts, 2]);

      // Act
      const result = await productRepository.findAll(1, 10);

      // Assert
      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {},
        order: undefined,
      });
      expect(result.data).toEqual(mockProducts);
      expect(result.total).toBe(2);
    });

    it('should apply name filter with case-insensitive partial match', async () => {
      // Arrange
      const filter: ProductFilter = { name: 'coffee' };
      mockTypeOrmRepository.findAndCount.mockResolvedValue([[mockProducts[0]], 1]);

      // Act
      await productRepository.findAll(1, 10, filter);

      // Assert
      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          name: expect.objectContaining({
            _type: 'ilike',
            _value: '%coffee%',
          }),
        },
        order: undefined,
      });
    });

    it('should apply price range filter (both min and max)', async () => {
      // Arrange
      const filter: ProductFilter = { minPrice: 1000, maxPrice: 5000 };
      mockTypeOrmRepository.findAndCount.mockResolvedValue([[mockProducts[0]], 1]);

      // Act
      await productRepository.findAll(1, 10, filter);

      // Assert
      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          price: expect.objectContaining({
            _type: 'between',
            _value: [1000, 5000],
          }),
        },
        order: undefined,
      });
    });

    it('should apply minimum price filter only', async () => {
      // Arrange
      const filter: ProductFilter = { minPrice: 2000 };
      mockTypeOrmRepository.findAndCount.mockResolvedValue([mockProducts, 2]);

      // Act
      await productRepository.findAll(1, 10, filter);

      // Assert
      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          price: expect.objectContaining({
            _type: 'moreThanOrEqual',
            _value: 2000,
          }),
        },
        order: undefined,
      });
    });

    it('should apply maximum price filter only', async () => {
      // Arrange
      const filter: ProductFilter = { maxPrice: 30000 };
      mockTypeOrmRepository.findAndCount.mockResolvedValue([[mockProducts[0]], 1]);

      // Act
      await productRepository.findAll(1, 10, filter);

      // Assert
      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          price: expect.objectContaining({
            _type: 'lessThanOrEqual',
            _value: 30000,
          }),
        },
        order: undefined,
      });
    });

    it('should apply stock range filter (both min and max)', async () => {
      // Arrange
      const filter: ProductFilter = { minStock: 10, maxStock: 100 };
      mockTypeOrmRepository.findAndCount.mockResolvedValue([[mockProducts[1]], 1]);

      // Act
      await productRepository.findAll(1, 10, filter);

      // Assert
      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          stock: expect.objectContaining({
            _type: 'between',
            _value: [10, 100],
          }),
        },
        order: undefined,
      });
    });

    it('should apply minimum stock filter only', async () => {
      // Arrange
      const filter: ProductFilter = { minStock: 50 };
      mockTypeOrmRepository.findAndCount.mockResolvedValue([[mockProducts[0]], 1]);

      // Act
      await productRepository.findAll(1, 10, filter);

      // Assert
      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          stock: expect.objectContaining({
            _type: 'moreThanOrEqual',
            _value: 50,
          }),
        },
        order: undefined,
      });
    });

    it('should apply maximum stock filter only', async () => {
      // Arrange
      const filter: ProductFilter = { maxStock: 50 };
      mockTypeOrmRepository.findAndCount.mockResolvedValue([[mockProducts[1]], 1]);

      // Act
      await productRepository.findAll(1, 10, filter);

      // Assert
      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          stock: expect.objectContaining({
            _type: 'lessThanOrEqual',
            _value: 50,
          }),
        },
        order: undefined,
      });
    });

    it('should apply ordering by price ascending', async () => {
      // Arrange
      const filter: ProductFilter = {
        orderBy: {
          field: 'price',
          order: OrderType.ASC,
        },
      };
      mockTypeOrmRepository.findAndCount.mockResolvedValue([mockProducts, 2]);

      // Act
      await productRepository.findAll(1, 10, filter);

      // Assert
      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {},
        order: {
          price: 'ASC',
        },
      });
    });

    it('should apply ordering by stock descending', async () => {
      // Arrange
      const filter: ProductFilter = {
        orderBy: {
          field: 'stock',
          order: OrderType.DESC,
        },
      };
      mockTypeOrmRepository.findAndCount.mockResolvedValue([mockProducts, 2]);

      // Act
      await productRepository.findAll(1, 10, filter);

      // Assert
      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {},
        order: {
          stock: 'DESC',
        },
      });
    });

    it('should apply multiple filters simultaneously', async () => {
      // Arrange
      const filter: ProductFilter = {
        name: 'coffee',
        minPrice: 1000,
        maxPrice: 5000,
        minStock: 10,
        orderBy: {
          field: 'name',
          order: OrderType.ASC,
        },
      };
      mockTypeOrmRepository.findAndCount.mockResolvedValue([[mockProducts[0]], 1]);

      // Act
      await productRepository.findAll(1, 10, filter);

      // Assert
      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          name: expect.objectContaining({
            _type: 'ilike',
            _value: '%coffee%',
          }),
          price: expect.objectContaining({
            _type: 'between',
            _value: [1000, 5000],
          }),
          stock: expect.objectContaining({
            _type: 'moreThanOrEqual',
            _value: 10,
          }),
        },
        order: {
          name: 'ASC',
        },
      });
    });

    it('should handle pagination correctly', async () => {
      // Arrange
      const page = 3;
      const limit = 5;
      mockTypeOrmRepository.findAndCount.mockResolvedValue([[], 0]);

      // Act
      await productRepository.findAll(page, limit);

      // Assert
      expect(mockTypeOrmRepository.findAndCount).toHaveBeenCalledWith({
        skip: 10, // (page - 1) * limit = (3 - 1) * 5 = 10
        take: 5,
        where: {},
        order: undefined,
      });
    });
  });
});
