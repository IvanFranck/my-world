export interface IPaginatedApiResponse<T> {
  data: {
    data: T[];
    meta: {
      limit: number;
      page: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface IApiResponse<T> {
  data: T;
}
