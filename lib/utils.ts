export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const categoryOrder = ["shapewear", "underwear", "bras"] as const;
const shapewearSubcategoryOrder = ["bodysuits", "tops", "bottoms"] as const;

// 商品价格以 USD 为基准，展示时按静态汇率换算
// ponytail: 静态汇率，价格调整或汇率大幅波动时手动更新
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

/**
 * 只保留真的挂着产品的分类，并按固定陈列顺序排。
 * 两个原因：
 * 1. WordPress 的 /categories 是 hide_empty => false（后台要能看到完整分类树好归档），
 *    直接渲染会出现点进去空空如也的死按钮。
 * 2. 接口按 term name 排序，name 改中文后顺序会跟着变；这里按 slug 定序，与名字无关。
 * 不在 WordPress 侧改 hide_empty：商家只勾子类时父类 count 为 0，父类会整个消失，子类行跟着塌。
 */
export function visibleCategories<T extends { slug: string; parent: number }>(
  categories: T[],
  products: Array<{ category: string; subcategory?: string }>
) {
  const usedTop = new Set(products.map((product) => product.category));
  const usedSub = new Set(
    products
      .map((product) => product.subcategory)
      .filter((slug): slug is string => Boolean(slug))
  );

  return {
    top: categories
      .filter((entry) => entry.parent === 0 && usedTop.has(entry.slug))
      .sort((left, right) => getCategoryPriority(left.slug) - getCategoryPriority(right.slug)),
    sub: categories
      .filter((entry) => entry.parent !== 0 && usedSub.has(entry.slug))
      .sort(
        (left, right) =>
          getShapewearSubcategoryPriority(left.slug) -
          getShapewearSubcategoryPriority(right.slug)
      )
  };
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
