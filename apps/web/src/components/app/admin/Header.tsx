"use client";

import { Search, Moon, Sun, Bell, Hexagon } from "lucide-react";
import LocaleLink from "../../ui/LocaleLink";
import { useTheme } from "@/src/core/providers/theme-provider/ThemeContext";

const AdminDashboardHeader = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <LocaleLink
          href="/"
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="relative">
            <Hexagon className="w-8 h-8 text-nest-red fill-nest-red/10 transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-nest-red font-bold">
              N
            </div>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            NestJS <span className="text-nest-red">Academy</span>
          </span>
        </LocaleLink>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {["Articles", "Catégories", "tags", "Médiathèque"].map((item) => (
            <LocaleLink
              key={item}
              href={item === "Accueil" ? "/" : "#"}
              className={`text-sm font-medium transition-colors ${item === "Blog" ? "text-nest-red" : "text-slate-600 hover:text-nest-red dark:text-slate-300 dark:hover:text-nest-light"}`}
            >
              {item}
            </LocaleLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminDashboardHeader;
