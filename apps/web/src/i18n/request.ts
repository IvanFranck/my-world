import { defaultLocale, Messages, SupportedLocales } from "../locales/types";
import enAuth from "../locales/en/auth.json";
import frAuth from "../locales/fr/auth.json";
import { getRequestConfig } from "next-intl/server";

const localeMessage: Record<SupportedLocales, Messages> = {
  en: { auth: enAuth },
  fr: { auth: frAuth },
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  const lang: SupportedLocales = (locale ?? defaultLocale) as SupportedLocales;

  return {
    locale: lang,
    messages: localeMessage[lang],
  };
});
