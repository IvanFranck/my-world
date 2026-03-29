import {
  CategoriesApiResponse,
  CategoriesWithArticleCountApiResponse,
  PaginatedCategoriesApiResponse,
  PaginatedCategoriesWithArticleCountApiResponse,
  Category,
  CategoryWithArticleCount,
} from "@/src/types";

export class CategoriesMapper {
  static mapCategoryFromCategoriesApiResponse(
    response: CategoriesApiResponse,
  ): Category {
    const data = response.data;
    return {
      id: data.id,
      title: data.name,
      slug: data.slug,
      description: data.description,
    };
  }

  static mapCategoryWithArticleCountFromCategoriesWithArticleCountApiResponse(
    response: CategoriesWithArticleCountApiResponse,
  ): CategoryWithArticleCount {
    const data = response.data;
    return {
      id: data.id,
      title: data.name,
      slug: data.slug,
      description: data.description,
      articles: data.articles,
    };
  }

  static mapCategoryFromPaginatedCategoriesApiResponse(
    response: PaginatedCategoriesApiResponse,
  ): Category[] {
    const data = response.data.data;
    return data.map((category) => ({
      id: category.id,
      title: category.name,
      slug: category.slug,
      description: category.description,
    }));
  }

  static mapCategoryWithArticleCountFromPaginatedCategoriesWithArticleCountApiResponse(
    response: PaginatedCategoriesWithArticleCountApiResponse,
  ): CategoryWithArticleCount[] {
    const data = response.data.data;
    return data.map((category) => ({
      id: category.id,
      title: category.name,
      slug: category.slug,
      description: category.description,
      articles: category.articles,
    }));
  }
}
