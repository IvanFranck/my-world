import { Entity } from "@/src/core/types/entity";

export const PostStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  SCHEDULED: "SCHEDULED",
  ARCHIVED: "ARCHIVED",
} as const;

export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];

export interface PostEntity extends Entity {
  title: string;
  content: string;
  slug: string;
  status: PostStatus;
  authorId: string;
  excerpt: string | null;
  coverImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  views: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}
