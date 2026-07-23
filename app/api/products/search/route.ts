import { NextResponse } from "next/server";
import { getSearchIndex } from "@/lib/wordpress/repository";
import type { LocaleCode } from "@/types/locale";

const locales: LocaleCode[] = ["ru-RU", "en-US", "en-GB", "fr-FR", "de-DE"];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedLocale = url.searchParams.get("locale");
  const locale = locales.includes(requestedLocale as LocaleCode)
    ? (requestedLocale as LocaleCode)
    : "ru-RU";
  const items = await getSearchIndex();

  return NextResponse.json(
    items.map((item) => ({
      id: item.id,
      name: item.names[locale] ?? item.names["ru-RU"],
      category: item.category,
      slug: item.slug,
      href: `/product/${item.slug}`,
      type: "product"
    }))
  );
}
