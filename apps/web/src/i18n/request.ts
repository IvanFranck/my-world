import { defaultLocale, Messages, SupportedLocales } from "../locales/types";
import enAuth from "../locales/en/auth.json";
import enPosts from "../locales/en/posts.json";
import frAuth from "../locales/fr/auth.json";
import frPosts from "../locales/fr/posts.json";
import { getRequestConfig } from "next-intl/server";

const localeMessage: Record<SupportedLocales, Messages> = {
  en: { auth: enAuth, posts: enPosts },
  fr: { auth: frAuth, posts: frPosts },
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  const lang: SupportedLocales = (locale ?? defaultLocale) as SupportedLocales;

  return {
    locale: lang,
    messages: localeMessage[lang],
  };
});
