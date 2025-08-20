import { PaginationModel } from './pagination.model';

describe('PaginationModel', () => {
  describe('constructor', () => {
    it('should create a pagination model with the provided values', () => {
      // Arrange
      const data = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      const total = 10;
      const page = 2;
      const totalPages = 5;

      // Act
      const paginationModel = new PaginationModel(
        data,
        total,
        page,
        totalPages,
      );

      // Assert
      expect(paginationModel.data).toBe(data);
      expect(paginationModel.total).toBe(total);
      expect(paginationModel.page).toBe(page);
      expect(paginationModel.totalPages).toBe(totalPages);
    });
  });

  describe('create', () => {
    it('should create a pagination model with calculated totalPages', () => {
      // Arrange
      const data = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      const total = 25;
      const page = 2;
      const limit = 10;
      const expectedTotalPages = 3; // Math.ceil(25/10)

      // Act
      const paginationModel = PaginationModel.create(data, total, page, limit);

      // Assert
      expect(paginationModel).toBeInstanceOf(PaginationModel);
      expect(paginationModel.data).toBe(data);
      expect(paginationModel.total).toBe(total);
      expect(paginationModel.page).toBe(page);
      expect(paginationModel.totalPages).toBe(expectedTotalPages);
    });

    it('should handle perfect division for totalPages calculation', () => {
      // Arrange
      const data = [{ id: 1, name: 'Item 1' }];
      const total = 20;
      const page = 2;
      const limit = 5;
      const expectedTotalPages = 4; // Math.ceil(20/5)

      // Act
      const paginationModel = PaginationModel.create(data, total, page, limit);

      // Assert
      expect(paginationModel.totalPages).toBe(expectedTotalPages);
    });

    it('should round up totalPages when division is not perfect', () => {
      // Arrange
      const data = [{ id: 1, name: 'Item 1' }];
      const total = 21;
      const page = 1;
      const limit = 5;
      const expectedTotalPages = 5; // Math.ceil(21/5)

      // Act
      const paginationModel = PaginationModel.create(data, total, page, limit);

      // Assert
      expect(paginationModel.totalPages).toBe(expectedTotalPages);
    });

    it('should handle edge case when total is 0', () => {
      // Arrange
      const data: any[] = [];
      const total = 0;
      const page = 1;
      const limit = 10;
      const expectedTotalPages = 0; // Math.ceil(0/10)

      // Act
      const paginationModel = PaginationModel.create(data, total, page, limit);

      // Assert
      expect(paginationModel.totalPages).toBe(expectedTotalPages);
    });

    it('should handle edge case when limit is 0', () => {
      // Arrange
      const data: any[] = [];
      const total = 10;
      const page = 1;
      const limit = 0;

      // Act
      const paginationModel = PaginationModel.create(data, total, page, limit);

      // Assert
      // Math.ceil(10/0) es Infinity en JavaScript
      expect(paginationModel.totalPages).toBe(Infinity);
    });

    it('should preserve generics type', () => {
      // Arrange
      interface TestType {
        id: number;
        name: string;
      }

      const data: TestType[] = [
        { id: 1, name: 'Test 1' },
        { id: 2, name: 'Test 2' },
      ];

      // Act
      const paginationModel = PaginationModel.create<TestType>(data, 10, 1, 5);

      // Assert
      expect(paginationModel.data).toBe(data);
      // Verificar que el tipo se preserva - Jest solo puede verificar la estructura, no los tipos en tiempo de ejecución
      expect(paginationModel.data[0].id).toBe(1);
      expect(paginationModel.data[0].name).toBe('Test 1');
    });
  });
});
