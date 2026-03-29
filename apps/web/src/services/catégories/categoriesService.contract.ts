import { IPaginatedQuery, IPaginatedSearchQuery } from "@/src/core/types/query";
import { Category, CategoryWithArticleCount } from "@/src/types";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@my-website/types";

export abstract class ICategoriesService {
  abstract list(query: IPaginatedQuery): Promise<CategoryWithArticleCount[]>;
  abstract search(query: IPaginatedSearchQuery): Promise<Category[]>;
  abstract create(data: CreateCategoryRequest): Promise<Category>;
  abstract update(data: UpdateCategoryRequest, id: string): Promise<Category>;
  abstract archive(id: string): Promise<void>;
}
