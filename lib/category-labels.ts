import { titleCase } from "@/lib/utils";
import type { CopyKeys } from "@/types/locale";

/**
 * 分类 slug 到多语言标签的映射。
 * 商店筛选和产品详情面包屑共用一份，避免同一个分类在两个页面显示成不同语言。
 * WordPress 的分类 term name 只有一个值，没有多语言位，所以标签走前端 copy。
 */
export function categoryLabel(slug: string | undefined, copy: CopyKeys): string {
  if (!slug) return "";

  const labels: Record<string, string> = {
    shapewear: copy.categoryShapewear,
    underwear: copy.categoryUnderwear,
    bras: copy.categoryBras,
    bodysuits: copy.subcategoryBodysuits,
    tops: copy.subcategoryTops,
    bottoms: copy.subcategoryBottoms
  };

  return labels[slug] ?? titleCase(slug);
}
