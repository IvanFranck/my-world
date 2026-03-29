export interface CategoriesResponseEntity {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  description: string | null;
}

export interface CategoriesWithArticleCountResponseEntity extends CategoriesResponseEntity {
  articleCount: number;
}
