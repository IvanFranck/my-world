import React from "react";
import { Hexagon, Mail, Lock, User, ArrowLeft, Sun, Moon } from "lucide-react";

interface RegisterProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Register: React.FC<RegisterProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 to-nest-red opacity-90"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="relative z-10 w-full h-full flex flex-col justify-between p-12">
          <div>
            <a href="/" className="flex items-center gap-2 mb-8">
              <div className="relative">
                <Hexagon className="w-8 h-8 text-white fill-white/10" />
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-white font-bold">
                  N
                </div>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                NestJS Academy
              </span>
            </a>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Commencez votre apprentissage.
            </h2>
            <p className="text-lg text-slate-300 max-w-md leading-relaxed">
              Créez votre compte gratuit et accédez immédiatement à nos parcours
              d'apprentissage pour NestJS et TypeScript.
            </p>
          </div>

          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} NestJS Academy.
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative">
        <div className="absolute top-8 right-8 flex gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="absolute top-8 left-8 lg:hidden">
          <a
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-nest-red transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Retour</span>
          </a>
        </div>

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
              <a
                href="/login"
                className="font-medium text-nest-red hover:text-nest-light transition-colors"
              >
                Se connecter
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
