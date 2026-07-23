import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
  productCategoriesTag,
  productDetailTag,
  productListTag
} from "@/lib/wordpress/cache-tags";
import { getWordPressConfig } from "@/lib/wordpress/config";

function secretsMatch(actual: string, expected: string) {
  const actualBytes = Buffer.from(actual);
  const expectedBytes = Buffer.from(expected);
  return (
    actualBytes.length === expectedBytes.length &&
    timingSafeEqual(actualBytes, expectedBytes)
  );
}

export async function POST(request: Request) {
  const actualSecret = request.headers.get("x-yanxinna-secret") ?? "";
  const { WORDPRESS_REVALIDATE_SECRET } = getWordPressConfig();

  if (!secretsMatch(actualSecret, WORDPRESS_REVALIDATE_SECRET)) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { slug?: unknown };
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";

  revalidateTag(productListTag);
  revalidateTag(productCategoriesTag);
  if (slug) {
    revalidateTag(productDetailTag(slug));
  }

  return NextResponse.json({ revalidated: true });
}
