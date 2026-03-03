import { authService } from "@/src/services/auth/authService";
import { LoginFormData, loginSchema } from "@/src/services/auth/schemas";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useLogin = () => {
  const t = useTranslations("auth");

  const mutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await authService.login(data);
    },
    onSuccess: () => {
      toast.success(t("login.success"));
    },
    onError: () => {
      toast.error(t("login.error"));
    },
  });

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema(t)),
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return {
    form,
    onSubmit,
    isLoading: mutation.isPending,
  };
};
