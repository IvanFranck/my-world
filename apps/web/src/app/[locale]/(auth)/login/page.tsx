"use client";

import React from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import LocaleLink from "@/src/components/ui/LocaleLink";
import { useLogin } from "@/src/hooks/layout/auth/useLogin";
import { Form } from "@/src/components/ui/form";
import { FormInput } from "@/src/components/form/ui/FormInput";
import { FormPassword } from "@/src/components/form/ui/FormPassword";
import { Button } from "@/src/components/ui/button";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const { form, onSubmit, isLoading } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Connexion</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Bienvenue ! Connectez-vous à votre compte.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <FormInput
              control={form.control}
              name="email"
              label="Email"
              labelClassName="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              placeholder="Entrez votre email"
              BeforeIcon={Mail}
            />

            <FormPassword
              control={form.control}
              name="password"
              label="Mot de passe"
              labelClassName="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              placeholder="Entrez votre mot de passe"
              BeforeIcon={Lock}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-nest-red hover:bg-nest-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nest-red transition-all transform hover:scale-[1.01]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Se connecter"
            )}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">
                Ou continuer avec
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                <path
                  d="M12.0003 20.45c4.6667 0 8.45-3.7833 8.45-8.45 0-4.6667-3.7833-8.45-8.45-8.45-4.6667 0-8.45 3.7833-8.45 8.45 0 4.6667 3.7833 8.45 8.45 8.45Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="ml-2">Google</span>
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2">GitHub</span>
            </button>
          </div>

          {/* <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Pas encore de compte ?{" "}
            <LocaleLink
              href="/register"
              className="font-medium text-nest-red hover:text-nest-light transition-colors"
            >
              S'inscrire gratuitement
            </LocaleLink>
          </p> */}
        </form>
      </Form>
    </div>
  );
};

export default Login;
