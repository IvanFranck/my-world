import { TranslateFunction } from "@/src/core/types";
import z from "zod";

export const createCategorySchema = (t: TranslateFunction) => {
  return z.object({
    title: z.string().min(4, t("title.min")),
    description: z.string().min(10, t("description.min")).optional(),
    color: z.string().regex(z.regexes.hex).optional(),
  });
};

export type CreateCategoryFormData = z.infer<
  ReturnType<typeof createCategorySchema>
>;

export const updateCategoryScheme = (t: TranslateFunction) => {
  return createCategorySchema(t).optional();
};

export type UpdateCategoryFormData = z.infer<
  ReturnType<typeof updateCategoryScheme>
>;
