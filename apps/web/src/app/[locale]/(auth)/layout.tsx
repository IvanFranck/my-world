"use client";

import { useTheme } from "@/src/core/providers/theme-provider/ThemeContext";
import { useSelectedLayoutSegment } from "next/navigation";
import { Hexagon, ArrowLeft, Sun, Moon } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

type AuthSegment = "login" | "register" | null;

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { darkMode, toggleDarkMode } = useTheme();
  const segments = useSelectedLayoutSegment() as AuthSegment;

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-linear-to-br from-nest-red to-purple-900 opacity-90"></div>
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

          {segments === "login" && (
            <>
              <div className="mb-12">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Devenez un expert backend.
                </h2>
                <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                  Rejoignez une communauté de plus de 5000 développeurs
                  passionnés et accédez à des tutoriels exclusifs.
                </p>
              </div>
            </>
          )}
          {segments === "register" && (
            <>
              <div className="mb-12">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Commencez votre apprentissage.
                </h2>
                <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                  Créez votre compte gratuit et accédez immédiatement à nos
                  parcours d'apprentissage pour NestJS et TypeScript.
                </p>
              </div>
            </>
          )}

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

        {children}
      </div>
    </div>
  );
}
