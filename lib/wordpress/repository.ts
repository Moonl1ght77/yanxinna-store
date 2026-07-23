import { z } from "zod";
import {
  productCategoriesTag,
  productDetailTag,
  productListTag
} from "@/lib/wordpress/cache-tags";
import { WordPressApiError, wordPressGet } from "@/lib/wordpress/client";
import { mapWordPressProduct } from "@/lib/wordpress/mapper";
import {
  wordpressCategorySchema,
  wordpressProductSchema
} from "@/lib/wordpress/schemas";
import type {
  ProductCategory,
  ProductQuery,
  ProductRecord,
  ProductSearchItem
} from "@/types/product";

export async function getProducts(query: ProductQuery = {}): Promise<ProductRecord[]> {
  const data = await wordPressGet<unknown>("products", {
    tags: [productListTag],
    searchParams: {
      category: query.category,
      subcategory: query.subcategory,
      featured: query.featured,
      best_seller: query.bestSeller,
      search: query.search,
      page: query.page,
      per_page: query.perPage
    }
  });

  return z.array(wordpressProductSchema).parse(data).map(mapWordPressProduct);
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  try {
    const data = await wordPressGet<unknown>(`products/${encodeURIComponent(slug)}`, {
      tags: [productListTag, productDetailTag(slug)]
    });
    return mapWordPressProduct(data);
  } catch (error) {
    if (error instanceof WordPressApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  const data = await wordPressGet<unknown>("categories", {
    tags: [productCategoriesTag]
  });
  return z.array(wordpressCategorySchema).parse(data);
}

export async function getSearchIndex(): Promise<ProductSearchItem[]> {
  const products = await getProducts({ perPage: 100 });
  return products.map((product) => ({
    id: product.id,
    slug: product.slug,
    category: product.category,
    names: Object.fromEntries(
      Object.entries(product.translations).map(([locale, translation]) => [
        locale,
        translation.name
      ])
    ) as ProductSearchItem["names"]
  }));
}
