import { PaginationQuery } from "@/src/core/types/pagination-query";

export interface QueryPostsFilters extends PaginationQuery {
  search?: string;
}
