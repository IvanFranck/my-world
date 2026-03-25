import {
  CreatePostFormData,
  createPostSchema,
} from "@/src/services/posts/schemas";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

export const useCreatePost = () => {
  const t = useTranslations("posts.form");

  const form = useForm({
    resolver: standardSchemaResolver(createPostSchema(t)),
  });

  const onSubmit = (data: CreatePostFormData) => {
    console.log("🚀 ~ onSubmit create post ~ data:", data);
  };

  return {
    form,
    onSubmit,
  };
};
