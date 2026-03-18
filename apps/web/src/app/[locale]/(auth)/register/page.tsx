import React from "react";
import { Hexagon, Mail, Lock, User, ArrowLeft, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import LocaleLink from "@/src/components/ui/LocaleLink";

interface RegisterProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Register: React.FC<RegisterProps> = ({ darkMode, toggleDarkMode }) => {
  const locale = useLocale();

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Créer un compte</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          C'est gratuit et ça prend moins d'une minute.
        </p>
      </div>

      <form className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Nom complet
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nest-red focus:border-transparent transition-all"
                placeholder="Jean Dupont"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nest-red focus:border-transparent transition-all"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nest-red focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 mt-1 text-nest-red focus:ring-nest-red border-slate-300 rounded"
          />
          <label
            htmlFor="terms"
            className="ml-2 block text-sm text-slate-600 dark:text-slate-400"
          >
            J'accepte les{" "}
            <a href="#" className="text-nest-red hover:underline">
              conditions d'utilisation
            </a>{" "}
            et la{" "}
            <a href="#" className="text-nest-red hover:underline">
              politique de confidentialité
            </a>
            .
          </label>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-nest-red hover:bg-nest-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nest-red transition-all transform hover:scale-[1.01]"
        >
          Créer mon compte
        </button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Déjà un compte ?{" "}
          <LocaleLink
            href={`/login`}
            className="font-medium text-nest-red hover:text-nest-light transition-colors"
          >
            Se connecter
          </LocaleLink>
        </p>
      </form>
    </div>
  );
};

export default Register;
