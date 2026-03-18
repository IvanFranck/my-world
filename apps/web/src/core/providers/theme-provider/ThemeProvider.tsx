"use client";

import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";
import { ThemeManager } from "@/src/core/theme/themeManager";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = ThemeManager.getTheme();
    if (stored) {
      setDarkMode(stored === "dark");
    } else {
      const systemTheme = ThemeManager.getSystemPreference();
      setDarkMode(systemTheme === "dark");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    ThemeManager.setTheme(darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
