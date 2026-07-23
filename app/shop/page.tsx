import { Suspense } from "react";
import { connection } from "next/server";
import { ShopClient } from "@/components/shop/shop-client";
import {
  getProductCategories,
  getProducts
} from "@/lib/wordpress/repository";

export default async function ShopPage() {
  await connection();
  const [products, categories] = await Promise.all([
    getProducts({ perPage: 100 }),
    getProductCategories()
  ]);

  return (
    <Suspense>
      <ShopClient products={products} categories={categories} />
    </Suspense>
  );
}
