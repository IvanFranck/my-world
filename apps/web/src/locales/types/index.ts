import enAuth from "../en/auth.json";

export type Messages = {
  auth: typeof enAuth;
};

export type SupportedLocales = "en" | "fr";

export const defaultLocale: SupportedLocales = "fr";
