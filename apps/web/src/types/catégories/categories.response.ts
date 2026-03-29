import { IApiResponse, IPaginatedApiResponse } from "@/src/core/types";

export interface CategoriesResponseEntity {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  description: string | null;
}

export type CategoriesApiResponse = IApiResponse<CategoriesResponseEntity>;

export type PaginatedCategoriesApiResponse =
  IPaginatedApiResponse<CategoriesResponseEntity>;

export interface CategoriesWithArticleCountResponseEntity extends CategoriesResponseEntity {
  articles: number;
}

export type CategoriesWithArticleCountApiResponse =
  IApiResponse<CategoriesWithArticleCountResponseEntity>;

export type PaginatedCategoriesWithArticleCountApiResponse =
  IPaginatedApiResponse<CategoriesWithArticleCountResponseEntity>;
