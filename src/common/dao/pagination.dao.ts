export class PaginationDao {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  previousPage: number | null;
  nextPage: number | null;

  constructor(page: number, limit: number, totalItems: number) {
    this.page = page;
    this.limit = limit;
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(totalItems / limit);
    this.previousPage = page > 1 ? page - 1 : null;
    this.nextPage = page < this.totalPages ? page + 1 : null;
  }
}
