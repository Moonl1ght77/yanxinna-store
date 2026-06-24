export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const categoryOrder = ["shapewear", "underwear", "bras"] as const;
const shapewearSubcategoryOrder = ["bodysuits", "tops", "bottoms"] as const;

export function formatPrice(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function titleCase(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getCategoryPriority(category: string) {
  const index = categoryOrder.indexOf(category as (typeof categoryOrder)[number]);
  return index === -1 ? categoryOrder.length : index;
}

export function getShapewearSubcategoryPriority(subcategory?: string) {
  if (!subcategory) return shapewearSubcategoryOrder.length;
  const index = shapewearSubcategoryOrder.indexOf(
    subcategory as (typeof shapewearSubcategoryOrder)[number]
  );
  return index === -1 ? shapewearSubcategoryOrder.length : index;
}

export function sortProductsByMerchOrder<T extends { category: string; subcategory?: string }>(
  items: T[]
) {
  return [...items].sort((left, right) => {
    const categoryDelta =
      getCategoryPriority(left.category) - getCategoryPriority(right.category);
    if (categoryDelta !== 0) return categoryDelta;

    if (left.category === "shapewear" && right.category === "shapewear") {
      const subcategoryDelta =
        getShapewearSubcategoryPriority(left.subcategory) -
        getShapewearSubcategoryPriority(right.subcategory);
      if (subcategoryDelta !== 0) return subcategoryDelta;
    }

    return 0;
  });
}
