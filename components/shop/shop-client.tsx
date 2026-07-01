"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/lib/data/products";
import { categoryDescriptions } from "@/lib/data/categories";
import { formatPrice, sortProductsByMerchOrder } from "@/lib/utils";
import { ProductCardImage } from "@/components/ui/product-card-image";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/product";
import { useLocale } from "@/hooks/use-locale";

type ShopClientProps = {
  initialCategory?: string;
  initialSubcategory?: string;
  initialSort?: string;
};

const itemsPerPage = 6;

export function ShopClient({
  initialCategory,
  initialSubcategory,
  initialSort
}: ShopClientProps) {
  const { locale, currency, copy } = useLocale();
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

  const categoryLabels: Record<string, string> = {
    shapewear: copy.categoryShapewear,
    underwear: copy.categoryUnderwear,
    bras: copy.categoryBras,
    all: copy.categoryAll
  };

  const subcategoryLabels: Record<string, string> = {
    all: copy.subcategoryAll,
    bodysuits: copy.subcategoryBodysuits,
    tops: copy.subcategoryTops,
    bottoms: copy.subcategoryBottoms
  };

  const filteredProducts = useMemo(() => {
    const base = products.filter((product) => {
      const matchesCategory = category === "all" ? true : product.category === category;
      const matchesSubcategory =
        subcategory === "all" ? true : product.subcategory === subcategory;
      return matchesCategory && matchesSubcategory;
    });

    if (sort === "price-low") {
      return [...base].sort((a, b) => a.price - b.price);
    }
    if (sort === "price-high") {
      return [...base].sort((a, b) => b.price - a.price);
    }
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
    return sortProductsByMerchOrder(base);
  }, [category, sort, subcategory]);

  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [category, subcategory, sort]);

  useEffect(() => {
    if (category !== "shapewear" && subcategory !== "all") {
      setSubcategory("all");
    }
  }, [category, subcategory]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const activeCategoryDescription =
    categoryDescriptions[category as Category] ?? categoryDescriptions.shapewear;
  const showShapewearSubcategories = category === "shapewear" || category === "all";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 md:px-8">
      <div className="border border-borderSoft bg-white px-4 py-6 sm:px-6 sm:py-10 md:px-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#A89B8C] sm:text-[11px]">{copy.shopTitle}</p>
        <h1 className="mt-3 font-display text-3xl tracking-[0.04em] text-[#2C2825] sm:mt-4 sm:text-5xl">
          {categoryLabels[category] ?? categoryLabels.shapewear}
        </h1>
        <p className="mt-3 max-w-2xl text-xs leading-6 text-[#8A7F73] sm:mt-4 sm:text-sm sm:leading-7">{activeCategoryDescription}</p>
        <div className="mt-5 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
          {[
            { label: copy.categoryShapewear, value: "shapewear" },
            { label: copy.categoryUnderwear, value: "underwear" },
            { label: copy.categoryBras, value: "bras" },
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
        {showShapewearSubcategories ? (
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
            {[
              { label: copy.subcategoryBodysuits, value: "bodysuits" },
              { label: copy.subcategoryTops, value: "tops" },
              { label: copy.subcategoryBottoms, value: "bottoms" }
            ].map((entry) => (
              <button
                key={entry.value}
                onClick={() => {
                  setCategory("shapewear");
                  setSubcategory(entry.value);
                }}
                className={`border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] sm:px-4 sm:py-2 sm:text-[11px] ${
                  subcategory === entry.value
                    ? "border-[#5C4E43] bg-[#5C4E43] text-white"
                    : "border-borderSoft bg-white text-[#6a625c]"
                }`}
              >
                {entry.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-4 border-b border-borderSoft pb-4 sm:mt-8 sm:gap-5 sm:pb-5 md:flex-row md:items-center md:justify-between">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#A89B8C] sm:text-[11px]">
          {copy.breadcrumbHome} / {copy.breadcrumbShop} / {categoryLabels[category] ?? category}
          {subcategory !== "all" ? ` / ${subcategoryLabels[subcategory] ?? subcategory}` : ""}
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
            <option value="price-low">{copy.sortPriceLow}</option>
            <option value="price-high">{copy.sortPriceHigh}</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.18em] text-[#A89B8C] sm:mt-4 sm:text-[11px]">
        <span>{filteredProducts.length} {copy.itemsCount}</span>
        {subcategory !== "all" ? <span>{subcategoryLabels[subcategory]}</span> : <span>{categoryLabels[category]}</span>}
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
          {visibleProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.slug}`} className="group border border-borderSoft bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-lg p-3 sm:p-4">
              <ProductCardImage
                src={product.image}
                hoverSrc={product.hoverImage}
                alt={product.name}
                className="min-h-[180px] sm:min-h-[280px] md:min-h-[360px]"
              />
              <div className="mt-3 sm:mt-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#A89B8C] sm:text-[11px]">
                    {product.subcategory
                      ? `${categoryLabels[product.category]} / ${subcategoryLabels[product.subcategory]}`
                      : categoryLabels[product.category]}
                  </p>
                  <p className="text-xs text-[#6B5E52] sm:text-sm">{formatPrice(product.price, currency, locale)}</p>
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
