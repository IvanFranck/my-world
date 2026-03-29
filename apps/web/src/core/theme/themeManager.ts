import { THEME_MANAGER_KEY } from "@/src/core/constants/app.constant";

export type Theme = "dark" | "light";

export class ThemeManager {
  static getTheme(): Theme | null {
    const theme = localStorage.getItem(THEME_MANAGER_KEY);
    if (theme === "dark" || theme === "light") {
      return theme;
    }
    return null;
  }

  static setTheme(theme: Theme): void {
    localStorage.setItem(THEME_MANAGER_KEY, theme);
  }

  static removeTheme(): void {
    localStorage.removeItem(THEME_MANAGER_KEY);
  }

  static getSystemPreference(): Theme {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
}
