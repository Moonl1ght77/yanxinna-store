import { Suspense } from "react";
import { connection } from "next/server";
import { ShopClient } from "@/components/shop/shop-client";
import {
  getProductCategories,
  getProducts
} from "@/lib/wordpress/repository";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShopPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  await connection();
  const [params, products, categories] = await Promise.all([
    searchParams,
    getProducts({ perPage: 100 }),
    getProductCategories()
  ]);

  return (
    <Suspense>
      {/*
        必须把 URL 参数传下去。ShopClient 早就有这三个 props，但一直没人传，
        于是服务端永远按默认的 shapewear 渲染：所有 /shop?category=xxx 的
        服务端 h1 都是「塑身衣」，首屏闪一下错分类，搜索引擎也只看得到这一个标题。
      */}
      <ShopClient
        products={products}
        categories={categories}
        initialCategory={first(params.category)}
        initialSubcategory={first(params.subcategory)}
        initialSort={first(params.sort)}
      />
    </Suspense>
  );
}
