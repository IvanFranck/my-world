import { generateSlug } from "@/src/core/lib/utils";
import {
  CreatePostFormData,
  createPostSchema,
} from "@/src/services/posts/schemas";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const useCreatePost = () => {
  const t = useTranslations("posts.form");

  const form = useForm({
    resolver: standardSchemaResolver(createPostSchema(t)),
  });

  const { watch, setValue } = form;

  const watchedTitle = watch("title");

  const onSubmit = (data: CreatePostFormData) => {
    console.log("🚀 ~ onSubmit create post ~ data:", data);
  };

  useEffect(() => {
    setValue("slug", generateSlug(watchedTitle), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [watchedTitle, setValue]);

  return {
    form,
    onSubmit,
  };
};
