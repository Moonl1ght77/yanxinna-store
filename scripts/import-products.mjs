#!/usr/bin/env node
// 批量上品：中文 CSV → claude 翻五语 → 压图 → 上传服务器 → WP-CLI 导入 → 校验。
// 用法和 CSV 格式见 wordpress/migration/填写说明.md
//   node scripts/import-products.mjs <csv>              全流程，导入即发布
//   node scripts/import-products.mjs <csv> --draft      导入为草稿
//   node scripts/import-products.mjs <csv> --stage-only 只生成本地待上传目录，不碰服务器
//   node scripts/import-products.mjs --push <待上传目录> [--draft]  只上传并导入已生成的目录
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { z } from "zod";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const IMPORTER = path.resolve(HERE, "../wordpress/migration/import-products.php");
const SYSTEM_PROMPT = path.resolve(HERE, "import-products.prompt.txt");
const LOCALES = ["ru-RU", "en-US", "en-GB", "fr-FR", "de-DE"];
const SSH = {
  host: "admin@47.243.151.206",
  key: path.join(os.homedir(), ".ssh", "yanxinna_cms"),
  wp: "/www/wwwroot/wordpress",
  bin: "/usr/local/bin/wp",
};
const SITE = "https://yanxinna.com";
const CMS_API = "https://cms.yanxinna.com/wp-json/yanxinna/v1";
const LLM_MODEL = "opus";
// 与站上既有产品图一致：3:4 画布、浅灰底；宽 1200 够详情页直出
const IMAGE = { width: 1200, height: 1600, bg: "#f5f5f5", quality: 85 };
const COLUMNS = {
  产品编号: "product_number",
  中文名: "name_zh",
  大类: "category",
  子类: "subcategory",
  尺码: "sizes",
  颜色: "colors",
  面料: "fabric",
  洗护: "care",
  压缩等级: "compression_level",
  卖点: "benefits",
  首页推荐: "featured",
  热销: "best_seller",
  排序: "sort_order",
  图片文件夹: "image_dir",
};
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

// ---------- CSV ----------
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  text = text.replace(/^﻿/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

export function parseRow(record) {
  const pn = (record.product_number ?? "").trim() || "?";
  const need = (key, label) => {
    const value = (record[key] ?? "").trim();
    if (!value) throw new Error(`${pn}：「${label}」必填`);
    return value;
  };
  const yes = (value) => ["是", "y", "yes", "true", "1"].includes((value ?? "").trim().toLowerCase());
  const split = (value, sep) => (value ?? "").split(sep).map((s) => s.trim()).filter(Boolean);

  const colors = split(need("colors", "颜色"), "|").map((entry) => {
    const m = entry.match(/^(.+?)\s+(#[0-9a-fA-F]{6})$/);
    if (!m) throw new Error(`${pn}：颜色「${entry}」格式应为「中文色名 #RRGGBB」`);
    return { name_zh: m[1], hex: m[2].toLowerCase() };
  });
  const compression = (record.compression_level ?? "").trim() || "Medium";
  if (!["Light", "Medium", "Firm"].includes(compression)) {
    throw new Error(`${pn}：压缩等级「${compression}」只能是 Light / Medium / Firm`);
  }
  return {
    product_number: need("product_number", "产品编号"),
    name_zh: need("name_zh", "中文名"),
    category: need("category", "大类").toLowerCase(),
    subcategory: need("subcategory", "子类").toLowerCase(),
    sizes: split(need("sizes", "尺码"), ","),
    colors,
    fabric_zh: need("fabric", "面料"),
    care_zh: (record.care ?? "").trim() || "冷水手洗 平铺晾干",
    compression_level: compression,
    benefits_zh: split(record.benefits, "|"),
    featured: yes(record.featured),
    best_seller: yes(record.best_seller),
    sort_order: Number.parseInt(record.sort_order ?? "", 10) || 0,
    image_dir: need("image_dir", "图片文件夹"),
  };
}

export function readProducts(csvPath) {
  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
  if (rows.length < 2) throw new Error("CSV 里没有产品行");
  const headers = rows[0].map((h) => h.trim());
  const missing = Object.keys(COLUMNS).filter((h) => !headers.includes(h));
  if (missing.length) throw new Error(`CSV 表头缺少：${missing.join("、")}`);
  const keys = headers.map((h) => COLUMNS[h]);
  const products = rows.slice(1).map((cells) => {
    const record = {};
    keys.forEach((key, i) => {
      if (key) record[key] = cells[i] ?? "";
    });
    return parseRow(record);
  });
  const seen = new Set();
  for (const p of products) {
    if (seen.has(p.product_number)) throw new Error(`产品编号重复：${p.product_number}`);
    seen.add(p.product_number);
  }
  return products;
}

// ---------- 图片 ----------
export function matchImages(files, colors) {
  const used = new Set();
  const pick = (color, keyword) => {
    const file = files.find((n) => !used.has(n) && n.startsWith(color.name_zh) && n.includes(keyword));
    if (!file) throw new Error(`缺图：找不到「${color.name_zh}…${keyword}…」`);
    used.add(file);
    return file;
  };
  const matched = colors.map((c) => ({ ...c, image: pick(c, "白底"), hover_image: pick(c, "模特") }));
  const extras = files.filter((n) => !used.has(n));
  return { colors: matched, extras };
}

export function listImages(dir) {
  if (!fs.existsSync(dir)) throw new Error(`图片文件夹不存在：${dir}`);
  return fs
    .readdirSync(dir)
    .filter((n) => IMAGE_EXT.has(path.extname(n).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "zh"));
}

export async function convertImage(src, dest) {
  await sharp(src)
    .flatten({ background: IMAGE.bg })
    .resize(IMAGE.width, IMAGE.height, { fit: "contain", background: IMAGE.bg })
    .jpeg({ quality: IMAGE.quality, mozjpeg: true })
    .toFile(dest);
}

export function slugify(text) {
  return text
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

// ---------- claude 翻译 ----------
const Localized = z.object({
  name: z.string().min(1),
  short_description: z.string().min(1),
  description: z.string().min(1),
  badge: z.string(),
  fabric: z.string().min(1),
  care: z.string().min(1),
  benefits: z.array(z.string().min(1)).min(1),
  seo_title: z.string().min(1),
  seo_description: z.string().min(1).max(320),
});
const Copy = z.object({
  translations: z.object(Object.fromEntries(LOCALES.map((l) => [l, Localized]))),
  colors: z.array(z.object(Object.fromEntries(LOCALES.map((l) => [l, z.string().min(1)])))),
});

function jsonSchema() {
  const str = { type: "string" };
  const localized = {
    type: "object",
    additionalProperties: false,
    required: ["name", "short_description", "description", "badge", "fabric", "care", "benefits", "seo_title", "seo_description"],
    properties: {
      name: str,
      short_description: str,
      description: str,
      badge: str,
      fabric: str,
      care: str,
      benefits: { type: "array", items: str },
      seo_title: str,
      seo_description: str,
    },
  };
  const perLocale = (schema) => ({
    type: "object",
    additionalProperties: false,
    required: LOCALES,
    properties: Object.fromEntries(LOCALES.map((l) => [l, schema])),
  });
  return {
    type: "object",
    additionalProperties: false,
    required: ["translations", "colors"],
    properties: { translations: perLocale(localized), colors: { type: "array", items: perLocale(str) } },
  };
}

function claudeBinary() {
  if (process.platform !== "win32") return "claude";
  const found = spawnSync("where", ["claude"], { encoding: "utf8" });
  for (const line of (found.stdout || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean)) {
    if (line.toLowerCase().endsWith(".exe")) return line;
    const npmBinary = path.join(path.dirname(line), "node_modules", "@anthropic-ai", "claude-code", "bin", "claude.exe");
    if (fs.existsSync(npmBinary)) return npmBinary;
  }
  throw new Error("找不到 claude 命令行，先装 Claude Code 再跑");
}

function askClaude(userPrompt, stage) {
  const settings = path.join(stage, "claude-settings.json");
  if (!fs.existsSync(settings)) fs.writeFileSync(settings, JSON.stringify({ disableAllHooks: true }));
  const env = { ...process.env };
  delete env.CLAUDECODE; // 允许在 Claude Code 的终端里嵌套跑
  const args = [
    "-p",
    "--output-format", "json",
    "--model", LLM_MODEL,
    "--tools", "",
    "--no-session-persistence",
    "--settings", settings,
    "--system-prompt", fs.readFileSync(SYSTEM_PROMPT, "utf8"),
    "--json-schema", JSON.stringify(jsonSchema()),
  ];
  const run = spawnSync(claudeBinary(), args, { input: userPrompt, encoding: "utf8", cwd: stage, env, maxBuffer: 50e6 });
  if (run.error) throw run.error;
  let result;
  try {
    result = JSON.parse(run.stdout);
  } catch {
    throw new Error(`claude 没返回 JSON（退出码 ${run.status}）：${(run.stderr || run.stdout).slice(0, 500)}`);
  }
  if (result.is_error) {
    const hint = /not logged in/i.test(result.result)
      ? "\n→ claude 命令行没登录：在终端跑一次 `claude login`（或设置 ANTHROPIC_API_KEY），再重试"
      : "";
    throw new Error(`claude 出错：${result.result}${hint}`);
  }
  const payload = result.structured_output ?? result.result;
  if (typeof payload === "string") {
    return JSON.parse(payload.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, ""));
  }
  return payload;
}

async function translate(product, stage) {
  const userPrompt = `产品信息（JSON）：\n${JSON.stringify(
    {
      product_number: product.product_number,
      name_zh: product.name_zh,
      category: product.category,
      subcategory: product.subcategory,
      sizes: product.sizes,
      colors_zh: product.colors.map((c) => c.name_zh),
      fabric_zh: product.fabric_zh,
      care_zh: product.care_zh,
      compression_level: product.compression_level,
      benefits_zh: product.benefits_zh,
    },
    null,
    2
  )}`;
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const raw = askClaude(userPrompt, stage);
      const copy = Copy.parse(raw);
      if (copy.colors.length !== product.colors.length) {
        throw new Error(`颜色数量不符：输入 ${product.colors.length}，返回 ${copy.colors.length}`);
      }
      return copy;
    } catch (error) {
      lastError = error;
      console.warn(`  ${product.product_number} 第 ${attempt} 次翻译失败：${error.message}`);
    }
  }
  throw lastError;
}

// ---------- 组装 ----------
async function buildProduct(product, stage) {
  const files = listImages(product.image_dir);
  const { colors, extras } = matchImages(files, product.colors);
  console.log(`▶ ${product.product_number} ${product.name_zh}：${colors.length} 色、${extras.length} 张细节图，翻译中…`);
  const copy = await translate(product, stage);
  const slug = slugify(copy.translations["en-US"].name) || product.product_number.toLowerCase();
  const pn = product.product_number;
  const mediaDir = path.join(stage, "media", pn);
  fs.mkdirSync(mediaDir, { recursive: true });
  const convert = async (file, name) => {
    await convertImage(path.join(product.image_dir, file), path.join(mediaDir, name));
    return `${pn}/${name}`;
  };
  const colorRows = [];
  const gallery = [];
  for (const [i, color] of colors.entries()) {
    const base = `${pn.toLowerCase()}-${slugify(copy.colors[i]["en-US"]) || `c${i + 1}`}`;
    const image = await convert(color.image, `${base}-main.jpg`);
    const hover = await convert(color.hover_image, `${base}-hover.jpg`);
    colorRows.push({ hex: color.hex, image, hover_image: hover, names: copy.colors[i] });
    gallery.push(image, hover);
  }
  for (const [i, file] of extras.entries()) {
    gallery.push(await convert(file, `${pn.toLowerCase()}-detail-${String(i + 1).padStart(2, "0")}.jpg`));
  }
  return {
    product_number: pn,
    slug,
    category: product.category,
    subcategory: product.subcategory,
    main_image: colorRows[0].image,
    hover_image: colorRows[0].hover_image,
    gallery,
    sizes: product.sizes,
    colors: colorRows,
    parameters: [],
    attachments: [],
    compression_level: product.compression_level,
    featured: product.featured,
    best_seller: product.best_seller,
    sort_order: product.sort_order,
    complete_the_look: [],
    translations: copy.translations,
  };
}

function newStage() {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
  const stage = path.join(os.tmpdir(), `yx-import-${stamp}`);
  fs.mkdirSync(path.join(stage, "media"), { recursive: true });
  return stage;
}

// ---------- 上传 + 导入 ----------
function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 50e6 });
  if (r.error) throw r.error;
  const out = `${r.stdout || ""}${r.stderr || ""}`
    .split(/\r?\n/)
    .filter((l) => !l.includes("imagick"))
    .join("\n");
  if (r.status !== 0) throw new Error(`${cmd} 失败（退出码 ${r.status}）\n${out}`);
  return out;
}

async function pushStage(stage, { draft }) {
  const payload = JSON.parse(fs.readFileSync(path.join(stage, "products.json"), "utf8"));
  const status = draft ? "draft" : "publish";
  fs.writeFileSync(
    path.join(stage, "run.php"),
    `<?php\n$args = array( '--media-dir=' . __DIR__ . '/media', '--status=${status}' );\nrequire __DIR__ . '/import-products.php';\n`
  );
  const remote = `/tmp/${path.basename(stage)}`;
  console.log(`⬆ 上传到服务器 ${remote} …`);
  run("scp", ["-i", SSH.key, "-o", "BatchMode=yes", "-q", "-r", stage, `${SSH.host}:${remote}`]);
  console.log(`⚙ 服务器上导入（${status}）…`);
  const out = run("ssh", [
    "-i", SSH.key, "-o", "BatchMode=yes", SSH.host,
    `cd ${SSH.wp} && sudo -n -u www ${SSH.bin} eval-file ${remote}/run.php; rc=$?; rm -rf ${remote}; exit $rc`,
  ]);
  console.log(out.trim());
  const summary = out.match(/Created: (\d+), updated: (\d+), failed: (\d+)/);
  if (!summary) throw new Error("没拿到导入结果汇总，看上面的输出");
  if (Number(summary[3]) > 0) throw new Error(`有 ${summary[3]} 个产品导入失败，看上面的 Warning`);

  console.log(draft ? "\n草稿已进后台，发布前到后台检查：" : "\n校验线上 API：");
  for (const item of payload.products) {
    if (draft) {
      const id = out.match(new RegExp(`${item.product_number} as draft \\(post (\\d+)\\)`))?.[1];
      console.log(`  ${item.product_number} → https://cms.yanxinna.com/wp-admin/post.php?post=${id ?? "?"}&action=edit`);
      continue;
    }
    const res = await fetch(`${CMS_API}/products/${item.slug}`);
    const ok = res.ok && (await res.json()).product_number === item.product_number;
    console.log(`  ${ok ? "✓" : "✗"} ${item.product_number} → ${SITE}/product/${item.slug}`);
    if (!ok) process.exitCode = 1;
  }
  if (!draft) console.log("前台约 1 分钟内更新（缓存刷新）。");
}

// ---------- 入口 ----------
function usage() {
  const lines = fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 7);
  console.error(lines.map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
  process.exit(2);
}

export async function main(argv) {
  const opts = { draft: argv.includes("--draft"), stageOnly: argv.includes("--stage-only"), push: null, csv: null };
  const pushIndex = argv.indexOf("--push");
  if (pushIndex >= 0) opts.push = argv[pushIndex + 1];
  opts.csv = argv.find((a, i) => !a.startsWith("--") && argv[i - 1] !== "--push");
  if (opts.push) return pushStage(path.resolve(opts.push), opts);
  if (!opts.csv) usage();

  const products = readProducts(path.resolve(opts.csv));
  const stage = newStage();
  console.log(`${products.length} 个产品，工作目录 ${stage}`);
  const items = [];
  for (const product of products) items.push(await buildProduct(product, stage));
  fs.writeFileSync(path.join(stage, "products.json"), JSON.stringify({ products: items }, null, 2));
  fs.copyFileSync(IMPORTER, path.join(stage, "import-products.php"));
  console.log(`✓ products.json 和 ${items.reduce((n, p) => n + p.gallery.length, 0)} 张图已生成`);
  if (opts.stageOnly) {
    console.log(`只生成不上传。之后可用：node scripts/import-products.mjs --push "${stage}"`);
    return;
  }
  await pushStage(stage, opts);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(`\n✗ ${error.message}`);
    process.exit(1);
  });
}
