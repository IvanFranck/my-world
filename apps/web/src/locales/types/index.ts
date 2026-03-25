import enAuth from "../en/auth.json";
import enPosts from "../en/posts.json";

export type Messages = {
  auth: typeof enAuth;
  posts: typeof enPosts;
};

export type SupportedLocales = "en" | "fr";

export const defaultLocale: SupportedLocales = "fr";
