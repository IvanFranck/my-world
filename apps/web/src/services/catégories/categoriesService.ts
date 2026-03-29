import {
  CategoriesApiResponse,
  Category,
  CategoryWithArticleCount,
  PaginatedCategoriesApiResponse,
  PaginatedCategoriesWithArticleCountApiResponse,
} from "@/src/types";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@my-website/types";
import { ICategoriesService } from "./categoriesService.contract";
import { HttpClient } from "@/src/core/http/httpClient";
import { API_BASE_URL } from "@/src/core/lib/constants";
import { categoryRoutes } from "./categoryRoutes";
import { CategoriesMapper } from "./mappers";
import { IPaginatedQuery, IPaginatedSearchQuery } from "@/src/core/types/query";
import { buildUrlQuery } from "@/src/core/lib/utils";

export class CategoriesService
  extends HttpClient
  implements ICategoriesService
{
  constructor(baseUrl?: string) {
    super(baseUrl || API_BASE_URL);
  }
  async create(data: CreateCategoryRequest): Promise<Category> {
    const response = await this.post<CategoriesApiResponse>(
      categoryRoutes.root,
      data,
    );

    return CategoriesMapper.mapCategoryFromCategoriesApiResponse(response);
  }

  async update(data: UpdateCategoryRequest, id: string): Promise<Category> {
    const response = await this.patch<CategoriesApiResponse>(
      `${categoryRoutes.id.replace(":id", id)}`,
      data,
    );

    return CategoriesMapper.mapCategoryFromCategoriesApiResponse(response);
  }

  async archive(id: string): Promise<void> {
    await this.delete(`${categoryRoutes.id.replace(":id", id)}`);
  }

  async list(query: IPaginatedQuery): Promise<CategoryWithArticleCount[]> {
    const urlQuery = buildUrlQuery(query);
    const response =
      await this.get<PaginatedCategoriesWithArticleCountApiResponse>(
        `${categoryRoutes.root}?${urlQuery}`,
      );

    return CategoriesMapper.mapCategoryWithArticleCountFromPaginatedCategoriesWithArticleCountApiResponse(
      response,
    );
  }

  async search(query: IPaginatedSearchQuery): Promise<Category[]> {
    const urlQuery = buildUrlQuery(query);
    const response = await this.get<PaginatedCategoriesApiResponse>(
      `${categoryRoutes.root}?${urlQuery}`,
    );

    return CategoriesMapper.mapCategoryFromPaginatedCategoriesApiResponse(
      response,
    );
  }
}
