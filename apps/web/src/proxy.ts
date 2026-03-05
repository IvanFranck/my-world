import createMiddleware from "next-intl/middleware";
import { defaultLocale } from "./locales/types";

export default createMiddleware({
  locales: ["en", "fr"],
  defaultLocale,
  localeDetection: false,
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
