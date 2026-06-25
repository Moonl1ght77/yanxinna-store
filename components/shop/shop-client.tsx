"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/lib/data/products";
import { categoryDescriptions } from "@/lib/data/categories";
import { formatPrice, sortProductsByMerchOrder } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/product";
import { useLocale } from "@/hooks/use-locale";

type ShopClientProps = {
  initialCategory?: string;
  initialSubcategory?: string;
  initialSort?: string;
};

const itemsPerPage = 6;

const categoryLabels: Record<string, string> = {
  shapewear: "Коррекция",
  underwear: "Трусы",
  bras: "Бюстгальтеры",
  all: "Все категории"
};

const subcategoryLabels: Record<string, string> = {
  all: "Все корректирующее белье",
  bodysuits: "Боди",
  tops: "Топы",
  bottoms: "Шорты и низ"
};

export function ShopClient({
  initialCategory,
  initialSubcategory,
  initialSort
}: ShopClientProps) {
  const { locale, currency, copy } = useLocale();
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const [category, setCategory] = useState(initialCategory ?? "shapewear");
  const [subcategory, setSubcategory] = useState(initialSubcategory ?? "all");
  const [sort, setSort] = useState(initialSort ?? "featured");

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
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="border border-borderSoft bg-white px-6 py-10 md:px-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8a8077]">Магазин</p>
        <h1 className="mt-4 font-display text-5xl tracking-[0.04em] text-[#231f1b]">
          {categoryLabels[category] ?? categoryLabels.shapewear}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6b635d]">{activeCategoryDescription}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {[
            { label: "Коррекция", value: "shapewear" },
            { label: "Трусы", value: "underwear" },
            { label: "Бюстгальтеры", value: "bras" },
            { label: "Все", value: "all" }
          ].map((entry) => (
            <button
              key={entry.value}
              onClick={() => setCategory(entry.value)}
              className={`border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] ${
                category === entry.value
                  ? "border-[#231f1b] bg-[#231f1b] text-white"
                  : "border-borderSoft bg-white text-[#6a625c]"
              }`}
            >
              {entry.label}
            </button>
          ))}
        </div>
        {showShapewearSubcategories ? (
          <div className="mt-6 flex flex-wrap gap-3 border-t border-borderSoft pt-6">
            <button
              onClick={() => setSubcategory("all")}
              className={`border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] ${
                subcategory === "all"
                  ? "border-[#231f1b] bg-[#231f1b] text-white"
                  : "border-borderSoft bg-white text-[#6a625c]"
              }`}
            >
              Все корректирующее белье
            </button>
            {[
              { label: "Боди", value: "bodysuits" },
              { label: "Топы", value: "tops" },
              { label: "Шорты и низ", value: "bottoms" }
            ].map((entry) => (
              <button
                key={entry.value}
                onClick={() => {
                  setCategory("shapewear");
                  setSubcategory(entry.value);
                }}
                className={`border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] ${
                  subcategory === entry.value
                    ? "border-[#231f1b] bg-[#231f1b] text-white"
                    : "border-borderSoft bg-white text-[#6a625c]"
                }`}
              >
                {entry.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col gap-5 border-b border-borderSoft pb-5 md:flex-row md:items-center md:justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">
          Главная / Магазин / {categoryLabels[category] ?? category}
          {subcategory !== "all" ? ` / ${subcategoryLabels[subcategory] ?? subcategory}` : ""}
        </p>
        <div className="flex flex-col gap-3 md:flex-row">
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="border border-borderSoft bg-white px-4 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#231f1b] outline-none"
          >
            <option value="featured">Рекомендуемые</option>
            <option value="best">Бестселлеры</option>
            <option value="new">Новинки</option>
            <option value="price-low">Цена: по возрастанию</option>
            <option value="price-high">Цена: по убыванию</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">
        <span>{filteredProducts.length} товаров</span>
        {subcategory !== "all" ? <span>{subcategoryLabels[subcategory]}</span> : <span>{categoryLabels[category]}</span>}
      </div>

      {visibleProducts.length === 0 ? (
        <div className="mt-8 border border-borderSoft bg-white p-10 text-center">
          <p className="font-display text-3xl tracking-[0.04em] text-[#231f1b]">Товары не найдены</p>
          <p className="mt-3 text-sm leading-7 text-[#6b635d]">
            Вернитесь к основной категории или сбросьте фильтр корректирующего белья.
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              variant="ghost"
              onClick={() => {
                setCategory("shapewear");
                setSubcategory("all");
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {visibleProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.slug}`} className="border border-borderSoft bg-white p-4 transition duration-300 hover:-translate-y-1">
              <PlaceholderImage src={product.image} alt={product.name} className="min-h-[360px] rounded-none image-zoom" />
              <div className="mt-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8077]">
                    {product.subcategory
                      ? `${categoryLabels[product.category]} / ${subcategoryLabels[product.subcategory]}`
                      : categoryLabels[product.category]}
                  </p>
                  <p className="text-sm text-[#524a43]">{formatPrice(product.price, currency, locale)}</p>
                </div>
                <p className="mt-2 text-lg text-[#231f1b]">{product.name}</p>
                <p className="mt-2 text-sm leading-6 text-[#6b635d]">{product.shortDescription}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {visibleCount < filteredProducts.length ? (
        <div className="mt-10 flex justify-center">
          <Button variant="ghost" onClick={() => setVisibleCount((count) => count + itemsPerPage)}>
            {copy.loadMore}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
