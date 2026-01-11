export const ArticleStatusRequest = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  SCHEDULED: "SCHEDULED",
  ARCHIVED: "ARCHIVED",
} as const;

export type ArticleStatusRequest =
  (typeof ArticleStatusRequest)[keyof typeof ArticleStatusRequest];

export interface CreateArticleRequest {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  coverImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: ArticleStatusRequest;
  categoryIds: string[];
  tagIds: string[];
  scheduledAt?: Date;
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {}

export interface ArticleFiltersRequest {
  status?: ArticleStatusRequest;
  categoryId?: string;
  tagId?: string;
  search?: string;
  authorId?: string;
  page?: number;
  limit?: number;
  sortBy?: "publishedAt" | "createdAt" | "views";
  sortOrder?: "asc" | "desc";
}
