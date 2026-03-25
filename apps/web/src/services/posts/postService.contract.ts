import { PostEntity, QueryPostsFilters } from "@/src/types/posts";
import { CreatePostFormData, UpdatePostFormData } from "./schemas";

export abstract class PostService {
  abstract create(payload: CreatePostFormData): Promise<PostEntity>;
  abstract update(payload: UpdatePostFormData): Promise<PostEntity>;
  abstract getPost(slug: string): Promise<PostEntity>;
  abstract lisPosts(query: QueryPostsFilters): Promise<PostEntity[]>;
}
