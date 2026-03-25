import { TranslateFunction } from "@/src/core/types/translation";
import { PostStatus } from "@/src/types/posts";
import z from "zod";

export const createPostSchema = (t: TranslateFunction) => {
  return z.object({
    title: z.string().min(8, { message: t("title.min") }),
    content: z.string().min(1, { message: t("content.min") }),
    categoryIds: z.array(z.string()).min(1, { message: t("categories.min") }),
    tagIds: z.array(z.string()).min(1, { message: t("tags.min") }),
    status: z.enum(PostStatus, { message: t("status") }),
    excerpt: z.string().optional(),
    slug: z.string().optional(),
    coverImage: z.url({ message: t("coverImage") }).optional(),
    metaDescription: z.string().optional(),
    scheduledAt: z.date({ message: t("scheduledAt") }).optional(),
  });
};

export type CreatePostFormData = z.infer<ReturnType<typeof createPostSchema>>;

export const updatePostSchema = (t: TranslateFunction) => {
  return z.object({
    id: z.uuid({ message: t("id.invalid") }),
    ...createPostSchema(t).partial(),
  });
};

export type UpdatePostFormData = z.infer<ReturnType<typeof updatePostSchema>>;
