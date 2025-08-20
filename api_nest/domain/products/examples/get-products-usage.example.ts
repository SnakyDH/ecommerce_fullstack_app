import { GetProductsUseCase } from '../use_case/get-products.use-case';
import { ProductFilter, OrderType } from '../model/product-filter.model';
import { IProductRepository } from '../repository/product-repository.interface';

// Example usage of GetProductsUseCase with filtering and ordering

export class ProductUsageExamples {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly productRepository: IProductRepository
  ) { }

  // Example 1: Get products with basic pagination
  async getBasicProducts() {
    const page = 1;
    const limit = 10;

    return await this.getProductsUseCase.execute(page, limit);
  }

  // Example 2: Get products filtered by name
  async getProductsByName(searchName: string) {
    const page = 1;
    const limit = 10;
    const filter: ProductFilter = {
      name: searchName
    };

    return await this.getProductsUseCase.execute(page, limit, filter);
  }

  // Example 3: Get products with price range filter
  async getProductsByPriceRange(minPrice: number, maxPrice: number) {
    const page = 1;
    const limit = 10;
    const filter: ProductFilter = {
      minPrice,
      maxPrice
    };

    return await this.getProductsUseCase.execute(page, limit, filter);
  }

  // Example 4: Get products ordered by price (ascending)
  async getProductsOrderedByPriceAsc() {
    const page = 1;
    const limit = 10;
    const filter: ProductFilter = {
      orderBy: {
        field: 'price',
        order: OrderType.ASC
      }
    };

    return await this.getProductsUseCase.execute(page, limit, filter);
  }

  // Example 5: Get products ordered by name (descending)
  async getProductsOrderedByNameDesc() {
    const page = 1;
    const limit = 10;
    const filter: ProductFilter = {
      orderBy: {
        field: 'name',
        order: OrderType.DESC
      }
    };

    return await this.getProductsUseCase.execute(page, limit, filter);
  }

  // Example 6: Complex filter with multiple criteria
  async getComplexFilteredProducts() {
    const page = 1;
    const limit = 10;
    const filter: ProductFilter = {
      name: 'laptop',
      minPrice: 100,
      maxPrice: 2000,
      minStock: 5,
      orderBy: {
        field: 'price',
        order: OrderType.DESC
      }
    };

    return await this.getProductsUseCase.execute(page, limit, filter);
  }

  // Example 7: Get products ordered by stock (ascending)
  async getProductsOrderedByStock() {
    const page = 1;
    const limit = 10;
    const filter: ProductFilter = {
      orderBy: {
        field: 'stock',
        order: OrderType.ASC
      }
    };

    return await this.getProductsUseCase.execute(page, limit, filter);
  }
}
