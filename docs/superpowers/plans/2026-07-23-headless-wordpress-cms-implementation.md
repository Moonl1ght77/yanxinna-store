# YANXINNA Headless WordPress CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 YANXINNA Next.js 前端安全改造成由 WordPress 管理五语言产品的纯展示/询盘站，并移除全部价格、购物车和支付能力。

**Architecture:** WordPress 自定义插件提供白名单化的公开只读 REST API；Next.js 通过服务器端数据层读取、校验并映射产品数据。前端迁移到 Cloudflare Workers + OpenNext，保留现有 UI 组件并使用 staging-first 部署。

**Tech Stack:** Next.js 15.5.21、React 19、TypeScript、Zod 4、Vitest 4、Cloudflare Workers、OpenNext 1.20.2、WordPress、PHP、ACF PRO。

## Global Constraints

- 当前工作分支固定为 `codex/测试分支`，不得切换或更新正式域名。
- 当前 Cloudflare Pages 生产站保持不动，staging 验收前不得覆盖。
- 不重构现有视觉系统、Tailwind 颜色、动画或页面网格。
- 全站不显示价格，不保留购买、购物车、订单或支付路径。
- 产品管理俄语、美式英语、英式英语、法语、德语五种语言。
- 产品 URL 保持 `/product/[slug]`，slug 全语言共用。
- 浏览器不得包含 WordPress 管理员密码、Application Password 或刷新密钥。
- 生产代码不得以 `lib/data/products.ts` 作为 API 故障回退。
- 每个任务只修改列出的文件；发现无关问题只记录，不顺手重构。

---

## File Structure

### Frontend data boundary

- `types/product.ts`：前端稳定产品类型，不包含价格或购物字段。
- `types/wordpress.ts`：WordPress REST 原始响应类型。
- `lib/wordpress/config.ts`：服务器端环境变量校验。
- `lib/wordpress/schemas.ts`：Zod REST 契约。
- `lib/wordpress/mapper.ts`：WordPress 响应到前端产品类型的纯函数转换。
- `lib/wordpress/client.ts`：带缓存标签和超时的只读 HTTP 客户端。
- `lib/wordpress/repository.ts`：页面使用的查询接口。
- `lib/wordpress/localize.ts`：五语言产品选择。

### Routes and states

- `app/api/products/search/route.ts`：同源搜索索引。
- `app/api/revalidate/route.ts`：验证密钥并刷新产品缓存。
- `app/shop/loading.tsx`、`app/shop/error.tsx`：列表状态。
- `app/product/[slug]/loading.tsx`、`error.tsx`、`not-found.tsx`：详情状态。

### WordPress deliverable

- `wordpress/yanxinna-headless-products/yanxinna-headless-products.php`：插件入口。
- `wordpress/yanxinna-headless-products/includes/class-content.php`：CPT、taxonomy、角色。
- `wordpress/yanxinna-headless-products/includes/class-fields.php`：ACF 字段组。
- `wordpress/yanxinna-headless-products/includes/class-rest.php`：公开只读 REST。
- `wordpress/yanxinna-headless-products/includes/class-webhook.php`：缓存刷新通知。
- `wordpress/yanxinna-headless-products/includes/class-security.php`：CORS、方法和输出保护。
- `wordpress/migration/products.json`：四个现有产品的迁移数据。
- `wordpress/migration/import-products.php`：通过 `wp eval-file` 执行的导入器。

### Tests and docs

- `tests/fixtures/wordpress-products.ts`：独立测试 fixture。
- `tests/lib/wordpress/mapper.test.ts`：映射与校验测试。
- `tests/lib/wordpress/repository.test.ts`：HTTP、缓存和错误测试。
- `tests/api/revalidate.test.ts`：刷新密钥测试。
- `docs/wordpress/*.md`：安装、字段、接口、部署和验收文档。

---

### Task 1: Establish the tested OpenNext baseline

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `next.config.ts`
- Modify: `.gitignore`
- Create: `.env.example`
- Create: `.dev.vars.example`
- Create: `open-next.config.ts`
- Create: `wrangler.jsonc`
- Create: `vitest.config.ts`

**Interfaces:**
- Consumes: existing Next.js App Router application.
- Produces: `npm run test`, `npm run typecheck`, `npm run preview`, `npm run deploy` scripts and an OpenNext-compatible build.

- [ ] **Step 1: Record the clean baseline**

Run:

```powershell
git status --short --branch
npm exec tsc -- --noEmit --incremental false
```

Expected: branch is `codex/测试分支`; typecheck exits 0.

- [ ] **Step 2: Install exact compatible dependencies**

Run:

```powershell
npm install next@15.5.21 zod@4.4.3 @opennextjs/cloudflare@1.20.2
npm install --save-dev wrangler@4.113.0 vitest@4.1.10 jsdom@29.1.1
```

Expected: npm exits 0 and `npm ls next @opennextjs/cloudflare wrangler vitest zod` shows the pinned versions.

- [ ] **Step 3: Add package scripts**

Set `package.json` scripts to:

```json
{
  "dev": "next dev",
  "build": "next build",
  "typecheck": "tsc --noEmit --incremental false",
  "test": "vitest run",
  "test:watch": "vitest",
  "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
  "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
}
```

- [ ] **Step 4: Replace static export with Worker configuration**

`next.config.ts` must remove `output: "export"` and build the WordPress media allow-list from `WORDPRESS_API_URL`:

```ts
import type { NextConfig } from "next";

const wordpressApiUrl = process.env.WORDPRESS_API_URL;
const remotePatterns = wordpressApiUrl
  ? [{ protocol: "https" as const, hostname: new URL(wordpressApiUrl).hostname }]
  : [];

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    unoptimized: true,
    remotePatterns
  }
};

export default nextConfig;
```

- [ ] **Step 5: Add exact Worker configuration**

`open-next.config.ts`:

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig();
```

`wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "yanxinna-store-cms-staging",
  "main": ".open-next/worker.js",
  "compatibility_date": "2026-07-23",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "binding": "ASSETS",
    "directory": ".open-next/assets"
  }
}
```

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname)
    }
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"]
  }
});
```

- [ ] **Step 6: Add environment templates and ignore generated output**

`.env.example` and `.dev.vars.example` must contain names only with safe sample values:

```dotenv
WORDPRESS_API_URL=https://cms.example.com/wp-json/yanxinna/v1
WORDPRESS_REVALIDATE_SECRET=replace-with-a-random-server-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Add `.open-next/`, `.wrangler/` and `.dev.vars` to `.gitignore`.

- [ ] **Step 7: Verify the framework-only change**

Run:

```powershell
npm run typecheck
npm run build
```

Expected: both commands exit 0 before any CMS data code is added.

- [ ] **Step 8: Commit**

```powershell
git add package.json package-lock.json next.config.ts .gitignore .env.example .dev.vars.example open-next.config.ts wrangler.jsonc vitest.config.ts
git commit -m "chore: 配置 OpenNext 与测试基线"
```

---

### Task 2: Define and test the WordPress product contract

**Files:**
- Modify: `types/product.ts`
- Create: `types/wordpress.ts`
- Create: `lib/wordpress/schemas.ts`
- Create: `lib/wordpress/mapper.ts`
- Create: `lib/wordpress/localize.ts`
- Create: `tests/fixtures/wordpress-products.ts`
- Create: `tests/lib/wordpress/mapper.test.ts`

**Interfaces:**
- Produces: `mapWordPressProduct(input): ProductRecord`, `localizeProduct(record, locale): Product`.
- Product locale keys: `"ru-RU" | "en-US" | "en-GB" | "fr-FR" | "de-DE"`.

- [ ] **Step 1: Write failing mapping tests**

Tests must assert:

```ts
expect(mapWordPressProduct(validWordPressProduct).productNumber).toBe("YX-001");
expect(mapWordPressProduct(validWordPressProduct).translations["ru-RU"].name).toBe("Боди");
expect(() => mapWordPressProduct(productWithoutMainImage)).toThrow();
expect(localizeProduct(record, "de-DE").name).toBe("Nahtloser Body");
```

Run:

```powershell
npm test -- tests/lib/wordpress/mapper.test.ts
```

Expected: FAIL because mapper modules do not exist.

- [ ] **Step 2: Define stable frontend types**

`types/product.ts` must reuse `LocaleCode` from `types/locale.ts` and define:

```ts
import type { LocaleCode } from "@/types/locale";

export type ProductTranslation = {
  name: string;
  shortDescription: string;
  description: string;
  badge?: string;
  fabric: string;
  care: string;
  benefits: string[];
  seoTitle: string;
  seoDescription: string;
};

export type ProductRecord = {
  id: string;
  slug: string;
  productNumber: string;
  category: string;
  subcategory?: string;
  image: string;
  hoverImage?: string;
  gallery: string[];
  colors: ProductColor[];
  sizes: string[];
  parameters: ProductParameter[];
  attachments: ProductAttachment[];
  compressionLevel?: "Light" | "Medium" | "Firm";
  featured: boolean;
  bestSeller: boolean;
  sortOrder: number;
  completeTheLook: string[];
  translations: Record<LocaleCode, ProductTranslation>;
};

export type Product = Omit<ProductRecord, "translations"> & ProductTranslation;
```

No price, compare-at price, inventory or commerce fields are allowed.

- [ ] **Step 3: Add Zod schemas and mapper**

`schemas.ts` must require all five translation groups, product number, slug, category, main image, at least one color and at least one size. `mapper.ts` must:

```ts
export function mapWordPressProduct(input: unknown): ProductRecord {
  const parsed = wordpressProductSchema.parse(input);
  return {
    id: String(parsed.id),
    slug: parsed.slug,
    productNumber: parsed.product_number,
    category: parsed.category.slug,
    subcategory: parsed.subcategory?.slug,
    image: parsed.main_image.url,
    hoverImage: parsed.hover_image?.url,
    gallery: parsed.gallery.map((image) => image.url),
    colors: parsed.colors.map(mapColor),
    sizes: parsed.sizes.map((item) => item.value),
    parameters: parsed.parameters.map(mapParameter),
    attachments: parsed.attachments.map(mapAttachment),
    compressionLevel: parsed.compression_level || undefined,
    featured: parsed.featured,
    bestSeller: parsed.best_seller,
    sortOrder: parsed.sort_order,
    completeTheLook: parsed.complete_the_look.map(String),
    translations: mapTranslations(parsed.translations)
  };
}
```

- [ ] **Step 4: Implement locale fallback**

`localizeProduct()` must select the requested locale and fall back only to `ru-RU` for a defensive runtime guard:

```ts
export function localizeProduct(record: ProductRecord, locale: LocaleCode): Product {
  const translation = record.translations[locale] ?? record.translations["ru-RU"];
  const { translations, ...shared } = record;
  return { ...shared, ...translation };
}
```

- [ ] **Step 5: Run tests**

```powershell
npm test -- tests/lib/wordpress/mapper.test.ts
npm run typecheck
```

Expected: PASS and exit 0.

- [ ] **Step 6: Commit**

```powershell
git add types/product.ts types/wordpress.ts lib/wordpress/schemas.ts lib/wordpress/mapper.ts lib/wordpress/localize.ts tests
git commit -m "feat: 定义 WordPress 产品数据契约"
```

---

### Task 3: Build the server-only WordPress repository and revalidation

**Files:**
- Create: `lib/wordpress/config.ts`
- Create: `lib/wordpress/client.ts`
- Create: `lib/wordpress/repository.ts`
- Create: `lib/wordpress/cache-tags.ts`
- Create: `app/api/products/search/route.ts`
- Create: `app/api/revalidate/route.ts`
- Create: `tests/lib/wordpress/repository.test.ts`
- Create: `tests/api/revalidate.test.ts`

**Interfaces:**
- Produces: `getProducts(query?)`, `getProductBySlug(slug)`, `getProductCategories()`, `getSearchIndex()`.
- Revalidation request: `POST /api/revalidate`, header `x-yanxinna-secret`, body `{ "slug": "..." }`.

- [ ] **Step 1: Write failing repository tests**

Tests must mock `global.fetch` and assert:

```ts
expect(await getProducts()).toHaveLength(1);
expect(fetch).toHaveBeenCalledWith(
  expect.stringContaining("/products"),
  expect.objectContaining({ next: expect.objectContaining({ tags: ["products"] }) })
);
await expect(getProductBySlug("missing")).resolves.toBeNull();
await expect(getProducts()).rejects.toThrow("WordPress API request failed");
```

Run and expect FAIL:

```powershell
npm test -- tests/lib/wordpress/repository.test.ts
```

- [ ] **Step 2: Implement validated server configuration**

`config.ts`:

```ts
import "server-only";
import { z } from "zod";

const schema = z.object({
  WORDPRESS_API_URL: z.string().url(),
  WORDPRESS_REVALIDATE_SECRET: z.string().min(32),
  NEXT_PUBLIC_SITE_URL: z.string().url()
});

export function getWordPressConfig() {
  return schema.parse(process.env);
}
```

- [ ] **Step 3: Implement read-only client**

`client.ts` must:

- prepend `WORDPRESS_API_URL`;
- accept only GET;
- use an 8-second `AbortSignal.timeout(8000)`;
- set Next cache tags;
- throw a sanitized `WordPressApiError` without response body.

Core call:

```ts
return fetch(url, {
  method: "GET",
  headers: { Accept: "application/json" },
  signal: AbortSignal.timeout(8000),
  next: { revalidate: 300, tags }
});
```

- [ ] **Step 4: Implement repository functions**

`repository.ts` signatures:

```ts
export async function getProducts(query: ProductQuery = {}): Promise<ProductRecord[]>;
export async function getProductBySlug(slug: string): Promise<ProductRecord | null>;
export async function getProductCategories(): Promise<ProductCategory[]>;
export async function getSearchIndex(): Promise<ProductSearchItem[]>;
```

The detail function maps HTTP 404 to `null`; all other failures propagate as sanitized API errors.

- [ ] **Step 5: Add same-origin search route**

`GET /api/products/search` returns only `id`, localized `name`, `category`, `slug` and `href`. It must not return the WordPress base URL or raw ACF data.

- [ ] **Step 6: Write and implement revalidation authentication**

Tests must assert 401 for missing/wrong secret and 200 for correct secret. Implementation compares equal-length UTF-8 byte arrays using `timingSafeEqual`, then calls:

```ts
revalidateTag("products");
revalidateTag("categories");
if (body.slug) revalidateTag(`product:${body.slug}`);
```

- [ ] **Step 7: Run tests**

```powershell
npm test -- tests/lib/wordpress/repository.test.ts tests/api/revalidate.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 8: Commit**

```powershell
git add lib/wordpress app/api/products app/api/revalidate tests
git commit -m "feat: 添加 WordPress 服务端数据层"
```

---

### Task 4: Connect CMS data to existing pages and states

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/home/home-page.tsx`
- Modify: `app/shop/page.tsx`
- Modify: `components/shop/shop-client.tsx`
- Modify: `app/product/[slug]/page.tsx`
- Modify: `components/product/product-detail-client.tsx`
- Modify: `components/ui/search-modal.tsx`
- Create: `app/shop/loading.tsx`
- Create: `app/shop/error.tsx`
- Create: `app/product/[slug]/loading.tsx`
- Create: `app/product/[slug]/error.tsx`
- Create: `app/product/[slug]/not-found.tsx`

**Interfaces:**
- Consumes: repository functions from Task 3.
- Produces: CMS-backed home, shop, search and product detail with no direct mock import.

- [ ] **Step 1: Add product Props before removing imports**

Update signatures:

```ts
export function HomePage({ locale, currency, copy, products }: HomePageProps);
export function ShopClient({ products, categories }: ShopClientProps);
export function ProductDetailClient({ product, completeTheLook }: ProductDetailClientProps);
```

Then remove `@/lib/data/products` imports from each component.

- [ ] **Step 2: Convert page entry points to server data loaders**

`app/page.tsx` and `app/shop/page.tsx` export `dynamic = "force-dynamic"`, fetch records server-side, then pass localized products to existing client components. `app/product/[slug]/page.tsx`:

```ts
const record = await getProductBySlug(slug);
if (!record) notFound();
const product = localizeProduct(record, locale);
return <ProductDetailClient product={product} completeTheLook={related} />;
```

`generateMetadata()` must use locale SEO values, canonical URL and main image.

- [ ] **Step 3: Preserve existing filtering and sorting**

`ShopClient` must filter the provided array by taxonomy slugs and keep the existing sort/button/Load More markup. Price sorting options are removed; featured, best seller and new ordering remain.

- [ ] **Step 4: Convert SearchModal to lazy same-origin data**

When the modal first opens, call `/api/products/search`, display internal loading/error text, cache the successful index in component state, and continue combining product results with `staticPages`.

- [ ] **Step 5: Add route states**

Each loading component must mirror the existing card/gallery aspect ratios. Error components must be client components with `reset()` and a link back to `/shop`. Product `not-found.tsx` must use existing Button styles.

- [ ] **Step 6: Verify no mock imports remain**

Run:

```powershell
rg -n --fixed-strings 'lib/data/products' app components lib
```

Expected: no matches.

- [ ] **Step 7: Run tests and build**

```powershell
npm test
npm run typecheck
npm run build
```

Expected: all exit 0.

- [ ] **Step 8: Commit**

```powershell
git add app components
git commit -m "feat: 将产品页面接入 WordPress 数据"
```

---

### Task 5: Remove commerce and replace it with product inquiry

**Files:**
- Modify: `app/layout.tsx`
- Modify: `components/layout/site-header.tsx`
- Modify: `components/home/home-page.tsx`
- Modify: `components/shop/shop-client.tsx`
- Modify: `components/product/product-detail-client.tsx`
- Modify: `components/ui/sample-request-modal.tsx`
- Modify: `lib/utils.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Delete: `app/cart/page.tsx`
- Delete: `app/checkout/page.tsx`
- Delete: `app/checkout/success/page.tsx`
- Delete: `app/api/stripe/checkout/route.ts`
- Delete: `components/cart/*`
- Delete: `providers/cart-provider.tsx`
- Delete: `providers/paypal-provider.tsx`
- Delete: `hooks/use-cart.ts`
- Delete: `types/cart.ts`
- Delete: `lib/data/products.ts`

**Interfaces:**
- Produces: `SampleRequestModal` optional `productContext` prop containing product name, number, color and size.

- [ ] **Step 1: Add inquiry context**

Define:

```ts
type ProductInquiryContext = {
  productName: string;
  productNumber: string;
  color?: string;
  size?: string;
};
```

`SampleRequestModal` includes these values in its generated mailto body without changing the modal’s visual hierarchy.

- [ ] **Step 2: Replace purchase controls**

Product detail keeps color/size selection but removes:

- price and compare-at price;
- quantity state and +/- buttons;
- `useCart`;
- “Add to cart”.

The existing full-width primary button opens the inquiry modal and passes the selected product context.

- [ ] **Step 3: Remove commerce UI and providers**

Remove the Header cart icon/link and CartProvider/PayPalProvider wrappers. Remove all price rendering from home and shop cards. Remove price sort options.

- [ ] **Step 4: Delete commerce routes and modules**

Use `apply_patch` delete hunks for the listed files. Remove `@paypal/react-paypal-js`:

```powershell
npm uninstall @paypal/react-paypal-js
```

- [ ] **Step 5: Remove dead price helpers and product mock**

Remove `formatPrice`, `usdDisplayRates` and commerce-only type fields. Delete `lib/data/products.ts`; keep only test fixture data under `tests/`.

- [ ] **Step 6: Prove no commercial elements remain**

Run:

```powershell
rg -n -i 'paypal|stripe|checkout|addToCart|cart-provider|use-cart|compareAtPrice|formatPrice|usdDisplayRates|NEXT_PUBLIC_PAYPAL' app components hooks lib providers types package.json
```

Expected: no production-code matches.

- [ ] **Step 7: Test and commit**

```powershell
npm test
npm run typecheck
npm run build
git add -A
git commit -m "feat: 移除支付并改为产品询盘"
```

---

### Task 6: Build the WordPress content model plugin

**Files:**
- Create: `wordpress/yanxinna-headless-products/yanxinna-headless-products.php`
- Create: `wordpress/yanxinna-headless-products/includes/class-content.php`
- Create: `wordpress/yanxinna-headless-products/includes/class-fields.php`

**Interfaces:**
- Produces: `yx_product` CPT, `yx_product_category` taxonomy, `yx_product_manager` role, versioned ACF field group.

- [ ] **Step 1: Create guarded plugin bootstrap**

Plugin header requires WordPress 6.0 and PHP 7.4, loads classes, and shows an admin notice when `acf_add_local_field_group` is unavailable. It must not bundle ACF PRO.

- [ ] **Step 2: Register product content**

`YX_Content::register()` must register:

```php
register_post_type( 'yx_product', [
    'public'       => true,
    'show_ui'      => true,
    'show_in_rest' => true,
    'rest_base'    => 'yx-products-admin',
    'supports'     => [ 'title', 'thumbnail' ],
    'menu_icon'    => 'dashicons-products',
] );
```

Register hierarchical `yx_product_category` with REST enabled for the editor.

- [ ] **Step 3: Register minimum product manager capabilities**

Create role `yx_product_manager` with product/media capabilities but without plugin, theme, user or site-option administration.

- [ ] **Step 4: Register the full ACF group**

`YX_Fields::register()` must define:

- product number;
- hover image and gallery;
- sizes repeater;
- colors repeater with five name subfields and two images;
- parameters repeater with five label/value pairs;
- attachments repeater;
- compression, featured, best seller, sort order and relationship;
- five translation groups with name, short description, description, badge, fabric, care, benefits, SEO title and SEO description.

Location rule: `post_type == yx_product`. Field names must exactly match the frontend schema.

- [ ] **Step 5: Validate source**

Because PHP CLI is not installed on this Windows machine, run a structural check:

```powershell
rg -n 'register_post_type|register_taxonomy|acf_add_local_field_group|yx_product_manager' wordpress/yanxinna-headless-products
```

Expected: all four constructs exist. The mandatory `php -l` check is deferred to Task 9 using the staging WordPress/PHP environment and may not be reported as passed locally.

- [ ] **Step 6: Commit**

```powershell
git add wordpress/yanxinna-headless-products
git commit -m "feat: 添加 WordPress 产品内容模型插件"
```

---

### Task 7: Add WordPress REST, security, webhook, and migration

**Files:**
- Create: `wordpress/yanxinna-headless-products/includes/class-rest.php`
- Create: `wordpress/yanxinna-headless-products/includes/class-security.php`
- Create: `wordpress/yanxinna-headless-products/includes/class-webhook.php`
- Create: `wordpress/migration/products.json`
- Create: `wordpress/migration/import-products.php`

**Interfaces:**
- Produces: `/wp-json/yanxinna/v1/products`, `/products/{slug}`, `/categories`.
- Webhook target: `${YANXINNA_FRONTEND_URL}/api/revalidate`.

- [ ] **Step 1: Register GET-only REST routes**

Each route uses `WP_REST_Server::READABLE` and `permission_callback => '__return_true'`. Query args use `sanitize_text_field` and bounded integer validation.

- [ ] **Step 2: Return only published, complete products**

REST mapper must:

- query `post_status => publish`;
- exclude records missing required fields;
- escape plain text with `sanitize_text_field`;
- sanitize rich descriptions with `wp_kses_post`;
- return attachment URLs, not filesystem paths;
- omit author, user, raw post meta and ACF field keys.

- [ ] **Step 3: Add CORS and method protection**

Allow origins from `YANXINNA_ALLOWED_ORIGINS`, split by comma. Do not send `Access-Control-Allow-Credentials`. Reject non-GET/OPTIONS requests under the public namespace with HTTP 405.

- [ ] **Step 4: Add signed cache refresh**

On `save_post_yx_product`, status transition and deletion, send a non-blocking POST:

```php
wp_remote_post( trailingslashit( YANXINNA_FRONTEND_URL ) . 'api/revalidate', [
    'timeout'  => 5,
    'blocking' => false,
    'headers'  => [
        'Content-Type'       => 'application/json',
        'x-yanxinna-secret'  => YANXINNA_REVALIDATE_SECRET,
    ],
    'body' => wp_json_encode( [ 'slug' => $post->post_name ] ),
] );
```

Constants are configured in `wp-config.php`, never in the plugin repository.

- [ ] **Step 5: Create migration payload**

Convert the four records from the deleted mock into `wordpress/migration/products.json`. Exclude price fields. Copy English source text into `en-US` and `en-GB`; leave untranslated Russian/French/German values empty and import those records as `draft` until all five translations are supplied. The public API therefore never exposes incomplete translations.

- [ ] **Step 6: Create safe importer**

`import-products.php` must:

- require execution under WP CLI;
- accept `--media-base-url`;
- match existing records by `product_number`;
- create/update as draft;
- sideload media through WordPress media functions;
- set taxonomy and ACF values;
- print created, updated and failed counts;
- never publish automatically.

- [ ] **Step 7: Commit**

```powershell
git add wordpress
git commit -m "feat: 添加 WordPress REST 接口与迁移工具"
```

---

### Task 8: Write operator documentation

**Files:**
- Create: `docs/wordpress/README.md`
- Create: `docs/wordpress/fields.md`
- Create: `docs/wordpress/api.md`
- Create: `docs/wordpress/local-development.md`
- Create: `docs/wordpress/deployment.md`
- Create: `docs/wordpress/test-checklist.md`

**Interfaces:**
- Produces: the seven user-requested handoff areas: WordPress steps, plugins, fields, endpoints, local run, production deploy, tests.

- [ ] **Step 1: Document WordPress installation**

Include recommended PHP 8.3+, MySQL 8.0+/MariaDB 10.11+, HTTPS, ACF PRO installation, custom plugin ZIP installation, permalinks and product-manager creation.

- [ ] **Step 2: Document field and API contracts**

List every field key, type, required rule and locale behavior. Include successful list/detail/category JSON examples and 400/404/500 examples.

- [ ] **Step 3: Document local development**

Exact frontend commands:

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
npm test
npm run typecheck
```

Explain that a real WordPress URL is required for runtime pages; tests use contract fixtures only.

- [ ] **Step 4: Document staging and production**

Include Worker secrets, staging Worker creation, WordPress constants, WAF/rate-limit checks, smoke tests, domain cutover and Pages rollback.

- [ ] **Step 5: Document the test checklist**

Cover CRUD/status, five languages, media/attachments, filtering, search, dynamic routes, state pages, security, desktop/mobile visual regression and absence of commerce.

- [ ] **Step 6: Validate docs and commit**

```powershell
rg -n 'WORDPRESS_API_URL|ACF PRO|yanxinna/v1/products|回滚|404|API error' docs/wordpress
git add docs/wordpress
git commit -m "docs: 添加 WordPress CMS 交付文档"
```

Expected: each required topic has at least one match.

---

### Task 9: Full verification and staging gate

**Files:**
- Modify only if verification exposes a task-scoped defect.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: a verified local deliverable and an explicit list of external staging prerequisites.

- [ ] **Step 1: Run all local checks**

```powershell
npm test
npm run typecheck
npm run build
npx opennextjs-cloudflare build
git diff --check
```

Expected: all available commands exit 0. If OpenNext documents Windows incompatibility for the generated build, repeat only that command in WSL and record the exact result.

- [ ] **Step 2: Scan for forbidden production content**

```powershell
rg -n -i 'paypal|stripe|checkout|add.?to.?cart|shopping.?cart|compareAtPrice|NEXT_PUBLIC_PAYPAL' app components hooks lib providers types package.json
rg -n --fixed-strings 'lib/data/products' app components lib
```

Expected: no matches.

- [ ] **Step 3: Verify git scope**

```powershell
git status --short
git diff --stat da2863f..HEAD
```

Expected: no uncommitted files and only CMS/payment-removal/docs/test changes.

- [ ] **Step 4: Run staging-only checks when access exists**

Required commands in the WordPress/PHP environment:

```bash
find wp-content/plugins/yanxinna-headless-products -name '*.php' -print0 | xargs -0 -n1 php -l
wp plugin status advanced-custom-fields-pro
wp plugin status yanxinna-headless-products
curl -fsS https://cms-staging.example.com/wp-json/yanxinna/v1/categories
```

Expected: no PHP syntax errors, both plugins active, categories endpoint returns JSON.

- [ ] **Step 5: Complete browser and visual checks**

Compare desktop and mobile screenshots for home, shop, empty, product, search, 404 and API error in Russian and the longest locale. Only approved commerce-removal/inquiry/state differences are allowed.

- [ ] **Step 6: Final commit only if verification changed files**

```powershell
git add -A
git commit -m "fix: 修复 CMS 验收发现的问题"
```

If no files changed, do not create an empty commit.

---

## Execution Order and Checkpoints

1. Tasks 1–3 establish framework compatibility and tested data boundaries.
2. Tasks 4–5 change user-visible product behavior and remove commerce.
3. Tasks 6–7 create the independently installable WordPress deliverable.
4. Task 8 completes operator handoff.
5. Task 9 is the local/staging release gate.

After Tasks 3, 5, 7 and 9, stop and review test/build output before continuing. No production deployment is authorized by this plan.
