import Link, { LinkProps } from "next/link";
import { useLocale } from "next-intl";

export default function LocaleLink({
  href,
  children,
  ...props
}: LinkProps<HTMLAnchorElement> & {
  children?: React.ReactNode | undefined;
} & React.HTMLAttributes<HTMLAnchorElement>) {
  const locale = useLocale();
  return (
    <Link href={`/${locale}${href}`} {...props}>
      {children}
    </Link>
  );
}
