export class PaginationModel<T> {
  constructor(
    public readonly data: T[],
    public readonly total: number,
    public readonly page: number,
    public readonly totalPages: number,
  ) { }

  static create<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginationModel<T> {
    const totalPages = Math.ceil(total / limit);
    return new PaginationModel<T>(data, total, page, totalPages);
  }
}
