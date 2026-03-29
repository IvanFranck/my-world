import { IApiResponse } from "@/src/core/types";
import {
  Category,
  CategoryWithArticleCount,
  CategoriesWithArticleCountResponseEntity,
  CategoriesResponseEntity,
} from "@/src/types";

export class CategoriesMapper {
  static mapCategoryFromCategoriesApiResponse(
    response: IApiResponse<CategoriesResponseEntity>,
  ): Category {
    const data = response.data;
    return {
      id: data.id,
      title: data.name,
      slug: data.slug,
      description: data.description,
    };
  }

  static mapCategoryWithArticleCountFromApiResponse(
    response: IApiResponse<CategoriesWithArticleCountResponseEntity>,
  ): CategoryWithArticleCount {
    const data = response.data;
    return {
      id: data.id,
      title: data.name,
      slug: data.slug,
      description: data.description,
      articles: data.articleCount,
    };
  }

  static mapCategoryFromApiResponse(
    response: IApiResponse<CategoriesResponseEntity[]>,
  ): Category[] {
    const data = response.data;
    return data.map((category) => ({
      id: category.id,
      title: category.name,
      slug: category.slug,
      description: category.description,
    }));
  }

  static mapCategoryWithArticleCountFromApiResponseList(
    response: IApiResponse<CategoriesWithArticleCountResponseEntity[]>,
  ): CategoryWithArticleCount[] {
    const data = response.data;
    return data.map((category) => ({
      id: category.id,
      title: category.name,
      slug: category.slug,
      description: category.description,
      articles: category.articleCount,
    }));
  }
}
