"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { sortProductsByMerchOrder, visibleCategories } from "@/lib/utils";
import { categoryLabel } from "@/lib/category-labels";
import { ProductCardImage } from "@/components/ui/product-card-image";
import { Button } from "@/components/ui/button";
import type { ProductCategory, ProductRecord } from "@/types/product";
import { useLocale } from "@/hooks/use-locale";
import { localizeProduct } from "@/lib/wordpress/localize";

type ShopClientProps = {
  products: ProductRecord[];
  categories: ProductCategory[];
  initialCategory?: string;
  initialSubcategory?: string;
  initialSort?: string;
};

const itemsPerPage = 6;

export function ShopClient({
  products,
  categories,
  initialCategory,
  initialSubcategory,
  initialSort
}: ShopClientProps) {
  const { locale, copy } = useLocale();
  const searchParams = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const [category, setCategory] = useState(initialCategory ?? "shapewear");
  const [subcategory, setSubcategory] = useState(initialSubcategory ?? "all");
  const [sort, setSort] = useState(initialSort ?? "featured");

  // 同步 URL 参数到状态
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlSubcategory = searchParams.get("subcategory");
    const urlSort = searchParams.get("sort");

    if (urlCategory) setCategory(urlCategory);
    if (urlSubcategory) setSubcategory(urlSubcategory);
    else setSubcategory("all");
    if (urlSort) setSort(urlSort);
    else setSort("featured");
  }, [searchParams]);

  const localizedProducts = useMemo(
    () => products.map((product) => localizeProduct(product, locale)),
    [locale, products]
  );

  const knownLabels: Record<string, string> = Object.fromEntries(
    ["shapewear", "underwear", "bras", "bodysuits", "tops", "bottoms"].map(
      (slug) => [slug, categoryLabel(slug, copy)]
    )
  );

  const { topLevelCategories, allSubcategories } = useMemo(() => {
    const visible = visibleCategories(categories, products);
    if (visible.top.length > 0) {
      return { topLevelCategories: visible.top, allSubcategories: visible.sub };
    }

    // categories 接口不可用时退回从产品自身推导
    return {
      topLevelCategories: Array.from(
        new Set(products.map((product) => product.category))
      ).map((slug, index) => ({ id: index + 1, slug, name: slug, parent: 0 })),
      allSubcategories: visible.sub
    };
  }, [categories, products]);

  const categoryLabels = useMemo<Record<string, string>>(
    () => ({
      all: copy.categoryAll,
      ...Object.fromEntries(
        topLevelCategories.map((entry) => [
          entry.slug,
          knownLabels[entry.slug] ?? entry.name
        ])
      )
    }),
    [
      copy.categoryAll,
      copy.categoryBras,
      copy.categoryShapewear,
      copy.categoryUnderwear,
      topLevelCategories
    ]
  );

  const activeCategoryId = topLevelCategories.find(
    (entry) => entry.slug === category
  )?.id;
  const subcategoryOptions = allSubcategories.filter(
    (entry) => category === "all" || entry.parent === activeCategoryId
  );
  const subcategoryLabels: Record<string, string> = {
    all: copy.subcategoryAll,
    ...Object.fromEntries(
      subcategoryOptions.map((entry) => [
        entry.slug,
        knownLabels[entry.slug] ?? entry.name
      ])
    )
  };

  /**
   * 分类还没有产品时（导航里的内裤/文胸就是这种），它不在筛选按钮里，
   * 也就不在 categoryLabels 里。此时必须回退到 categoryLabel() 拿它自己的名字——
   * 早先是回退到 shapewear，导致点「内裤」落到一个标题写着「塑身衣」的空页，
   * 标题和面包屑都是错的。
   */
  const labelFor = (slug: string) =>
    categoryLabels[slug] ?? subcategoryLabels[slug] ?? categoryLabel(slug, copy);

  const filteredProducts = useMemo(() => {
    const base = localizedProducts.filter((product) => {
      const matchesCategory = category === "all" ? true : product.category === category;
      const matchesSubcategory =
        subcategory === "all" ? true : product.subcategory === subcategory;
      return matchesCategory && matchesSubcategory;
    });

    if (sort === "best") {
      return sortProductsByMerchOrder(base).sort(
        (a, b) => Number(b.bestSeller) - Number(a.bestSeller)
      );
    }
    if (sort === "new") {
      return sortProductsByMerchOrder(base).sort(
        (a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge))
      );
    }
    return sortProductsByMerchOrder(base).sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
  }, [category, localizedProducts, sort, subcategory]);

  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [category, subcategory, sort]);

  useEffect(() => {
    if (
      subcategory !== "all" &&
      !subcategoryOptions.some((entry) => entry.slug === subcategory)
    ) {
      setSubcategory("all");
    }
  }, [subcategory, subcategoryOptions]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const activeCategoryDescription =
    {
      shapewear: copy.shapewearDescription,
      underwear: copy.underwearDescription,
      bras: copy.brasDescription
    }[category] ?? "";
  const showSubcategories = subcategoryOptions.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 md:px-8">
      <div className="border border-borderSoft bg-white px-4 py-6 sm:px-6 sm:py-10 md:px-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#A89B8C] sm:text-[11px]">{copy.shopTitle}</p>
        <h1 className="mt-3 font-display text-3xl/[1.15] tracking-[0.04em] text-[#2C2825] sm:mt-4 sm:text-5xl/[1.15]">
          {labelFor(category)}
        </h1>
        <p className="mt-3 max-w-2xl text-xs leading-6 text-[#8A7F73] sm:mt-4 sm:text-sm sm:leading-7">{activeCategoryDescription}</p>
        <div className="mt-5 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
          {[
            ...topLevelCategories.map((entry) => ({
              label: categoryLabels[entry.slug] ?? entry.name,
              value: entry.slug
            })),
            { label: copy.categoryAll, value: "all" }
          ].map((entry) => (
            <button
              key={entry.value}
              onClick={() => setCategory(entry.value)}
              className={`border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] sm:px-4 sm:py-2 sm:text-[11px] ${
                category === entry.value
                  ? "border-[#5C4E43] bg-[#5C4E43] text-white"
                  : "border-borderSoft bg-white text-[#6a625c]"
              }`}
            >
              {entry.label}
            </button>
          ))}
        </div>
        {showSubcategories ? (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-borderSoft pt-4 sm:mt-6 sm:gap-3 sm:pt-6">
            <button
              onClick={() => setSubcategory("all")}
              className={`border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] sm:px-4 sm:py-2 sm:text-[11px] ${
                subcategory === "all"
                  ? "border-[#5C4E43] bg-[#5C4E43] text-white"
                  : "border-borderSoft bg-white text-[#6a625c]"
              }`}
            >
              {copy.subcategoryAll}
            </button>
            {subcategoryOptions.map((entry) => (
              <button
                key={entry.slug}
                onClick={() => {
                  const parent = topLevelCategories.find(
                    (categoryEntry) => categoryEntry.id === entry.parent
                  );
                  if (parent) setCategory(parent.slug);
                  setSubcategory(entry.slug);
                }}
                className={`border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] sm:px-4 sm:py-2 sm:text-[11px] ${
                  subcategory === entry.slug
                    ? "border-[#5C4E43] bg-[#5C4E43] text-white"
                    : "border-borderSoft bg-white text-[#6a625c]"
                }`}
              >
                {subcategoryLabels[entry.slug] ?? entry.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-4 border-b border-borderSoft pb-4 sm:mt-8 sm:gap-5 sm:pb-5 md:flex-row md:items-center md:justify-between">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#A89B8C] sm:text-[11px]">
          {copy.breadcrumbHome} / {copy.breadcrumbShop} / {labelFor(category)}
          {subcategory !== "all" ? ` / ${labelFor(subcategory)}` : ""}
        </p>
        <div className="flex flex-col gap-3 md:flex-row">
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="w-full border border-borderSoft bg-white px-3 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#2C2825] outline-none sm:px-4 sm:py-3 sm:text-[11px] md:w-auto"
          >
            <option value="featured">{copy.sortFeatured}</option>
            <option value="best">{copy.sortBest}</option>
            <option value="new">{copy.sortNew}</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.18em] text-[#A89B8C] sm:mt-4 sm:text-[11px]">
        <span>{filteredProducts.length} {copy.itemsCount}</span>
        {subcategory !== "all" ? <span>{labelFor(subcategory)}</span> : <span>{labelFor(category)}</span>}
      </div>

      {visibleProducts.length === 0 ? (
        <div className="mt-6 border border-borderSoft bg-white p-6 text-center sm:mt-8 sm:p-10">
          <p className="font-display text-2xl tracking-[0.04em] text-[#2C2825] sm:text-3xl">{copy.noProducts}</p>
          <p className="mt-2 text-xs leading-6 text-[#8A7F73] sm:mt-3 sm:text-sm sm:leading-7">
            {copy.noProductsHint}
          </p>
          <div className="mt-4 flex justify-center sm:mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setCategory("shapewear");
                setSubcategory("all");
              }}
            >
              {copy.resetFilters}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-6 md:grid-cols-3">
          {visibleProducts.map((product, productIndex) => (
            <Link key={product.id} href={`/product/${product.slug}`} className="group border border-borderSoft bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-lg p-3 sm:p-4">
              <ProductCardImage
                src={product.image}
                hoverSrc={product.hoverImage}
                alt={product.name}
                className="aspect-[3/4]"
                priority={productIndex === 0}
              />
              <div className="mt-3 sm:mt-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#A89B8C] sm:text-[11px]">
                    {product.subcategory
                      ? `${labelFor(product.category)} / ${labelFor(product.subcategory)}`
                      : labelFor(product.category)}
                  </p>
                </div>
                <p className="mt-1.5 text-sm font-medium text-[#2C2825] sm:mt-2 sm:text-lg">{product.name}</p>
                <p className="mt-1 text-[11px] leading-5 text-[#8A7F73] sm:mt-2 sm:text-sm sm:leading-6">{product.shortDescription}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {visibleCount < filteredProducts.length ? (
        <div className="mt-8 flex justify-center sm:mt-10">
          <Button variant="ghost" onClick={() => setVisibleCount((count) => count + itemsPerPage)}>
            {copy.loadMore}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
