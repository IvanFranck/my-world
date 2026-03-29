export interface IPaginatedQuery {
  page: number;
  limit: number;
}

export interface IPaginatedSearchQuery extends IPaginatedQuery {
  search?: string;
}
