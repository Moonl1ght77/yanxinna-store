import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { convertImage, matchImages, parseCsv, parseRow, slugify } from "../../scripts/import-products.mjs";

const row = {
  product_number: "YX-006",
  name_zh: "高腰塑身裤",
  category: "Shapewear",
  subcategory: "Bottoms",
  sizes: "S,M,L,XL",
  colors: "黑色 #1A1A1A|肤色 #d9b8a0",
  fabric: "85% 尼龙, 15% 氨纶",
  care: "",
  compression_level: "",
  benefits: "高腰收腹|无痕裤口",
  featured: "是",
  best_seller: "",
  sort_order: "6",
  image_dir: "E:\\Studio-Assets\\YANXINNA\\YX-006",
};

describe("批量上品：CSV 解析", () => {
  it("带 BOM、引号包住的逗号和 CRLF 都按一格解析（Excel 另存的 CSV 就是这样）", () => {
    const text = '\uFEFF产品编号,尺码,面料\r\nYX-006,"S,M,L","85% 尼龙, 15% 氨纶"\r\n';
    expect(parseCsv(text)).toEqual([
      ["产品编号", "尺码", "面料"],
      ["YX-006", "S,M,L", "85% 尼龙, 15% 氨纶"],
    ]);
  });

  it("颜色列拆成色名+色值，留空的洗护和压缩等级按说明书的默认值补", () => {
    const product = parseRow(row);
    expect(product.colors).toEqual([
      { name_zh: "黑色", hex: "#1a1a1a" },
      { name_zh: "肤色", hex: "#d9b8a0" },
    ]);
    expect(product.category).toBe("shapewear");
    expect(product.care_zh).toBe("冷水手洗 平铺晾干");
    expect(product.compression_level).toBe("Medium");
    expect(product.featured).toBe(true);
    expect(product.best_seller).toBe(false);
    expect(product.sort_order).toBe(6);
  });

  it("颜色格式不对要当场报错，不能带着坏数据去翻译", () => {
    expect(() => parseRow({ ...row, colors: "黑色 1a1a1a" })).toThrow("中文色名 #RRGGBB");
  });
});

describe("批量上品：按文件名配图", () => {
  const files = ["细节-裤口.png", "肤色模特正面.png", "肤色白底.png", "黑色模特正面.png", "黑色白底.png"];
  const colors = [
    { name_zh: "黑色", hex: "#1a1a1a" },
    { name_zh: "肤色", hex: "#d9b8a0" },
  ];

  it("白底是主图、模特是悬停图，剩下的进图集", () => {
    const matched = matchImages(files, colors);
    expect(matched.colors[0]).toMatchObject({ image: "黑色白底.png", hover_image: "黑色模特正面.png" });
    expect(matched.colors[1]).toMatchObject({ image: "肤色白底.png", hover_image: "肤色模特正面.png" });
    expect(matched.extras).toEqual(["细节-裤口.png"]);
  });

  it("某个颜色缺悬停图直接报错，否则发布后列表悬停是空的", () => {
    expect(() => matchImages(["黑色白底.png"], [colors[0]])).toThrow("模特");
  });
});

describe("批量上品：压图与网址", () => {
  it("输出 1200×1600 的 JPG，和站上既有产品图同一比例", async () => {
    const dir = mkdtempSync(join(tmpdir(), "yx-img-"));
    const dest = join(dir, "out.jpg");
    await convertImage(resolve("public/products/shapewear-1/黑色白底.png"), dest);
    const meta = await sharp(dest).metadata();
    expect([meta.format, meta.width, meta.height]).toEqual(["jpeg", 1200, 1600]);
  });

  it("英文名转网址只留小写字母、数字和短横线", () => {
    expect(slugify("High-Waist Shaping Shorts (Firm)")).toBe("high-waist-shaping-shorts-firm");
  });
});
