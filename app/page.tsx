"use client";

import { HomePage } from "@/components/home/home-page";
import { useLocale } from "@/hooks/use-locale";

export default function Page() {
  const { locale, currency, copy } = useLocale();
  return <HomePage locale={locale} currency={currency} copy={copy} />;
}
