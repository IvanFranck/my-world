import { Entity } from "@/src/core/types/entity";

export interface Category extends Entity {
  title: string;
  slug: string;
  description: string | null;
}

export interface CategoryWithArticleCount extends Category {
  articles: number;
}
