import { z } from "zod";
import { passwordRegex } from "@my-website/constants";
import { TranslateFunction } from "@/src/core/types/translation";

export const loginSchema = (t: TranslateFunction) =>
  z.object({
    email: z.email({ message: t("email.invalid") }),
    password: z.string().min(8, { message: t("password.min") }),
  });

export type LoginFormData = z.infer<ReturnType<typeof loginSchema>>;
