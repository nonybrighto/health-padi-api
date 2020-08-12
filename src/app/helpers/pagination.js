class Pagination {
  constructor(totalCount, page, limit) {
    this.page = page;
    this.limit = limit;
    this.totalCount = totalCount;
  }

  setTotalCount(count) {
    this.totalCount = count;
  }

  getOffset() {
    const offset = (this.page - 1) * this.limit;
    return offset;
  }

  getTotalPages() {
    const totalPages = Math.ceil(this.totalCount / this.limit);
    return totalPages;
  }

  hasNextPage() {
    return this.page < this.getTotalPages();
  }

  hasPreviousPage() {
    return this.page > 1;
  }

  generatePaginationObject() {
    const paginationObject = {
      totalPages: this.getTotalPages(),
      perPage: this.limit,
      itemCount: this.totalCount,
      currentPage: this.page,
      ...(this.hasPreviousPage() && { previousPage: this.page - 1 }),
      ...(this.hasNextPage() && { nextPage: this.page + 1 })
    };

    return paginationObject;
  }
}

export default Pagination;
