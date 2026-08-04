import { describe, expect, it } from "vitest";
import { visibleCategories } from "@/lib/utils";

// 服务器上的完整分类树（hide_empty => false，空分类也会返回），
// name 是中文，顺序按 WordPress 的 name 排序返回，故意打乱以确认排序不依赖接口顺序。
const serverCategories = [
  { id: 4, slug: "underwear", name: "内裤", parent: 0 },
  { id: 6, slug: "tops", name: "塑身上衣", parent: 2 },
  { id: 7, slug: "bottoms", name: "塑身下装", parent: 2 },
  { id: 2, slug: "shapewear", name: "塑身衣", parent: 0 },
  { id: 5, slug: "bras", name: "文胸", parent: 0 },
  { id: 3, slug: "bodysuits", name: "连体塑身衣", parent: 2 }
];

describe("visibleCategories", () => {
  it("剔除没有产品的分类，避免商店页出现点进去空空如也的死按钮", () => {
    const result = visibleCategories(serverCategories, [
      { category: "shapewear", subcategory: "bodysuits" },
      { category: "shapewear", subcategory: "tops" }
    ]);

    expect(result.top.map((entry) => entry.slug)).toEqual(["shapewear"]);
    expect(result.sub.map((entry) => entry.slug)).toEqual(["bodysuits", "tops"]);
  });

  it("按固定陈列顺序排，不受接口返回顺序和 term 名称影响", () => {
    const result = visibleCategories(serverCategories, [
      { category: "bras" },
      { category: "underwear" },
      { category: "shapewear", subcategory: "bottoms" },
      { category: "shapewear", subcategory: "bodysuits" }
    ]);

    expect(result.top.map((entry) => entry.slug)).toEqual([
      "shapewear",
      "underwear",
      "bras"
    ]);
    expect(result.sub.map((entry) => entry.slug)).toEqual(["bodysuits", "bottoms"]);
  });

  it("产品没有子类时不返回任何子类按钮", () => {
    const result = visibleCategories(serverCategories, [{ category: "shapewear" }]);

    expect(result.top.map((entry) => entry.slug)).toEqual(["shapewear"]);
    expect(result.sub).toEqual([]);
  });
});
