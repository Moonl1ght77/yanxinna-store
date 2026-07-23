# YANXINNA Headless WordPress CMS Design

> 状态：会话中的四个设计章节已由 Joe 批准；本文等待书面规格复核。
>
> 日期：2026-07-23

## 1. 背景

YANXINNA 当前是 Next.js 15 App Router 项目，产品数据集中硬编码在
`lib/data/products.ts`。首页推荐、产品列表、站内搜索和产品详情直接读取这份
mock 数据。项目使用 `output: "export"` 静态导出并部署在 Cloudflare Pages，
动态产品路径由 `generateStaticParams()` 在构建期生成。

本次改造将站点转为纯产品展示与询盘站，并使用 WordPress 管理产品。改造必须
优先复用现有组件，保留现有视觉、布局、动画、图库、颜色切换、规格选择、筛选和
响应式行为。价格、购物车、订单、结账和支付能力全部移除。

## 2. 已确认决策

- WordPress 只管理产品内容，不使用 WooCommerce。
- 全站不显示价格，不保留购买、购物车、订单或支付路径。
- 产品内容管理俄语、美式英语、英式英语、法语、德语五种语言。
- 前端从 Cloudflare Pages 静态导出迁移至 Cloudflare Workers + OpenNext。
- 产品详情 URL 保持 `/product/[slug]`，slug 在五种语言间共用。
- 当前线上 Pages 在 staging 验收前保持不动，不直接覆盖。
- WordPress 短暂故障时优先使用最后一次成功缓存，不回退本地产品 mock。

## 3. 目标

1. 商家可在 WordPress 后台新增、编辑、删除、发布和下架产品。
2. 所有产品 mock 数据迁移至 WordPress REST API。
3. 首页、列表、搜索和详情页复用现有组件并使用 CMS 数据。
4. 支持动态产品 slug、分类筛选、五语言内容和产品级 SEO。
5. 提供 loading、empty、404 和 API error 状态。
6. API 地址与刷新密钥全部通过环境变量配置。
7. 前端不包含 WordPress 管理员密码或其他写权限凭据。
8. 提供 WordPress 插件、配置、字段、接口、运行、部署和测试文档。

## 4. 非目标

- 不实现价格、库存、购物车、订单、优惠、税费、运费或支付。
- 不安装 WooCommerce。
- 不重构现有视觉系统、Tailwind 颜色、动画或页面网格。
- 不把首页、品牌页、制造能力页等非产品内容迁移到 WordPress。
- 不新增语言前缀 URL 或 hreflang 路由体系。
- 不在未验收前切换正式域名或替换现有 Pages 生产部署。

## 5. 总体架构

### 5.1 WordPress

独立 WordPress 站点作为 Headless CMS。随项目交付自定义插件
`YANXINNA Headless Products`，插件负责：

- 注册 `yx_product` 自定义文章类型。
- 注册层级产品分类 taxonomy。
- 通过 ACF PRO 注册版本化字段组。
- 提供 `yanxinna/v1` 命名空间下的公开只读 REST API。
- 只输出已发布产品和允许公开的字段。
- 在产品发布、更新、下架或删除后通知前端刷新缓存。
- 注册最小权限的产品管理角色和接口安全规则。

WordPress 原生后台负责登录、媒体上传、草稿、审核、发布和回收站。商家不通过
Next.js 前端写入 WordPress。

### 5.2 Next.js

Next.js 移除静态导出配置，使用 OpenNext 部署到 Cloudflare Workers。新增独立的
WordPress 数据边界：

- 配置模块：读取并校验服务端环境变量。
- API 客户端：负责超时、状态码和 JSON 请求。
- 契约校验：拒绝结构不完整或类型错误的 WordPress 响应。
- 映射器：将 WordPress 数据转换为前端稳定的产品类型。
- 仓储函数：向页面提供产品列表、产品详情、分类和搜索索引。

UI 组件不感知 WordPress 原始结构。页面或同源 Route Handler 获取数据后，通过
Props 将标准化结果传给现有客户端组件。

### 5.3 五语言

每个 WordPress 产品只创建一次。图片、编号、slug、分类、颜色图片、规格等共享；
文本字段保存五套语言值。

现有语言切换界面保持不变。语言选择同时写入现有本地状态和 `yanxinna-region`
Cookie。可见产品内容使用当前 locale 选择对应翻译；服务器生成产品 metadata 时
读取同一 Cookie，首次访问默认俄语。

由于 URL 不增加语言前缀，搜索引擎无 Cookie 访问时获得俄语 metadata。本次保存
五套 SEO 字段并按访问 locale 输出，但不建设五套可独立索引的 hreflang URL。

## 6. WordPress 产品模型

### 6.1 WordPress 原生字段

| 字段 | 用途 |
|---|---|
| `ID` | WordPress 内部主键 |
| `post_title` | 后台识别名称，使用俄语产品名称 |
| `post_name` | 全语言共用 slug |
| `post_status` | publish、draft、pending、trash |
| Featured Image | 前端产品主图 |
| Product Category taxonomy | 层级分类和子分类 |

taxonomy 一级默认包括 `shapewear`、`underwear`、`bras`；二级分类可包括
`bodysuits`、`tops`、`bottoms`。前端使用 taxonomy slug 过滤，不依赖 WordPress
数字 ID。

### 6.2 共享 ACF 字段

| 字段名 | ACF 类型 | 规则 |
|---|---|---|
| `product_number` | Text | 必填、唯一 |
| `hover_image` | Image | 产品卡片悬停图 |
| `gallery` | Gallery | 产品详情图库 |
| `sizes` | Repeater | 每行一个规格值 |
| `colors` | Repeater | 色值、产品图、模特图及五语言颜色名称 |
| `parameters` | Repeater | 每行保存五语言名称和值 |
| `attachments` | Repeater + File | 多份 PDF 或资料附件 |
| `compression_level` | Select | Light、Medium、Firm |
| `featured` | True/False | 首页推荐 |
| `best_seller` | True/False | 畅销排序 |
| `sort_order` | Number | 手工展示顺序 |
| `complete_the_look` | Relationship | 关联产品 |

### 6.3 每语言字段组

每个 locale（`ru-RU`、`en-US`、`en-GB`、`fr-FR`、`de-DE`）包含：

- `name`
- `short_description`
- `description`
- `badge`
- `fabric`
- `care`
- `benefits`
- `seo_title`
- `seo_description`

颜色和参数属于共享 repeater，但各行包含五种语言的显示名称或值，避免重复上传
图片或重复建立产品。

### 6.4 必填规则

只有满足下列条件的已发布产品才可进入公开 API：

- `product_number` 非空。
- slug 非空。
- 至少关联一个产品分类。
- 主图存在。
- 五种语言的名称、简介、完整描述、SEO Title 和 SEO Description 完整。
- 至少有一种颜色和一个规格。

不符合条件的记录在服务端日志中记录 WordPress ID 和缺失字段，但不返回给前端。

## 7. REST API

自定义插件提供以下公开 GET 接口：

| Endpoint | 用途 |
|---|---|
| `GET /wp-json/yanxinna/v1/products` | 产品列表 |
| `GET /wp-json/yanxinna/v1/products/{slug}` | 单个产品详情 |
| `GET /wp-json/yanxinna/v1/categories` | 分类树 |

产品列表支持以下查询参数：

- `category=<taxonomy-slug>`
- `subcategory=<taxonomy-slug>`
- `featured=true`
- `best_seller=true`
- `search=<text>`
- `page=<positive-integer>`
- `per_page=<1..100>`

列表响应只包含卡片、筛选、排序和搜索需要的摘要字段。详情响应额外包含完整描述、
图库、参数、附件和关联产品。接口不返回草稿、待审、回收站、作者、用户或后台
字段。

WordPress 的新增、修改和删除继续由后台 cookie + nonce 完成。自定义公开命名空间
不提供 POST、PUT、PATCH 或 DELETE。

## 8. 前端数据流

### 8.1 数据接口

前端数据层对页面暴露：

- `getProducts(query)`
- `getProductBySlug(slug)`
- `getProductCategories()`
- `getSearchIndex()`

页面不直接调用 `fetch()`，组件不直接读取环境变量。

### 8.2 页面接入

- `app/page.tsx` 获取推荐产品并传给 `HomePage`。
- `app/shop/page.tsx` 获取产品与分类并传给 `ShopClient`。
- `app/product/[slug]/page.tsx` 按 slug 获取详情并生成 metadata。
- `SearchModal` 打开时通过同源搜索接口获取搜索索引。

以下组件保留 DOM 主体、Tailwind 样式和动画，仅改变数据入口：

- `HomePage`
- `ShopClient`
- `SearchModal`
- `ProductDetailClient`
- `ProductCardImage`

### 8.3 询盘替代购买

产品详情保留图库、颜色、规格、参数、资料和关联产品。原价格、数量和“加入购物车”
区域移除；原主按钮位置改为“获取报价/产品询盘”，复用现有询盘弹窗，并自动带入：

- 产品名称
- 产品编号
- 当前颜色
- 当前规格

提交仍沿用项目现有询盘方式，不在本次新增订单或支付后端。

### 8.4 商业功能删除

删除或移除：

- 价格与划线价字段和所有价格渲染。
- Header 购物车入口。
- 数量选择与加入购物车逻辑。
- `/cart` 和 `/checkout` 路由。
- `components/cart`。
- Cart Provider、Hook 和类型。
- PayPal Provider、按钮和依赖。
- Stripe 501 占位 Route Handler。
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` 相关配置和文档。
- 已无调用者的汇率与价格格式化逻辑。

生产代码删除 `lib/data/products.ts`；迁移后的产品 mock 不作为 API 故障回退。测试
可以在测试目录保留独立的契约 fixture。

## 9. 状态与错误处理

### 9.1 Loading

- shop 路由使用与现有两列/三列产品卡片比例一致的骨架屏。
- product 路由使用与现有图库和信息栏比例一致的骨架屏。
- SearchModal 在加载搜索索引时使用弹窗内部 loading 状态。

### 9.2 Empty

- WordPress 暂无已发布产品时显示产品列表 empty 状态。
- 分类或搜索无结果时沿用现有 empty 容器和重置筛选按钮。
- Empty 不视为 API 错误。

### 9.3 404

以下情况调用产品级 `notFound()`：

- slug 不存在。
- 产品未发布、下架或已删除。
- 产品因缺少公开必填字段被 API 排除。

自定义 `not-found.tsx` 使用现有页面外壳和按钮风格。

### 9.4 API Error

- 网络超时、非预期状态码、JSON 损坏或契约校验失败进入 API error。
- 页面错误状态提供“重试”和“返回产品列表”。
- 浏览器只显示用户可理解的信息，不显示 WordPress URL、堆栈或响应正文。
- 服务端日志记录请求类型、状态码和关联 slug，不记录密钥。

### 9.5 缓存降级

Cloudflare/OpenNext 使用 ISR 缓存成功响应。WordPress 内容变化后发送带密钥的刷新
请求，按产品和列表 cache tag 更新。刷新失败时设置较短的兜底过期时间；在过期前
继续返回最后一次成功内容。首次请求且没有任何成功缓存时才显示 API error。

## 10. SEO

产品详情通过 `generateMetadata()` 使用当前 locale 的：

- SEO Title
- SEO Description
- 产品主图
- canonical URL

若 SEO 字段通过 WordPress 校验但运行时仍为空，映射器使用当前语言产品名称和简介
作为最后防线。canonical 保持 `/product/[slug]`。

## 11. 环境变量

Cloudflare Workers：

| 变量 | 可见性 | 用途 |
|---|---|---|
| `WORDPRESS_API_URL` | Server only | WordPress REST 根地址 |
| `WORDPRESS_REVALIDATE_SECRET` | Secret | 验证内容刷新请求 |
| `NEXT_PUBLIC_SITE_URL` | Public | canonical 和公开站点地址 |

任何 WordPress 管理员密码、普通用户密码或 Application Password 都不进入前端
项目。公开读取不需要写权限凭据。

## 12. CORS 与 API 安全

- 浏览器不直接请求 WordPress；页面数据由 Workers 服务端读取。
- SearchModal 使用站点同源接口，不暴露 WordPress API 地址。
- WordPress 自定义公开接口只注册 GET 和 OPTIONS。
- WordPress CORS 仅声明正式域名和 staging 域名，不允许跨域凭据。
- CORS 不是访问控制；已发布产品本身是公开内容，真正的保护来自字段白名单、方法
  白名单、权限检查和不公开草稿。
- WordPress 后台强制 HTTPS，并使用最小权限产品管理角色。
- Cloudflare 对 WordPress REST 与前端刷新入口配置 WAF 和速率限制。
- 刷新接口使用恒定时间比较验证共享密钥。
- 日志、错误页和客户端 bundle 不包含凭据或后台地址。

## 13. 插件交付

### 必需

1. ACF PRO：由站点方持有合法授权。
2. YANXINNA Headless Products：随本仓库交付的自定义插件。

自定义插件以可安装目录和 ZIP 包形式交付，包含：

- CPT 和 taxonomy 注册。
- ACF 字段组注册。
- REST 路由和响应转换。
- 发布状态过滤。
- 产品必填校验。
- 缓存刷新 webhook。
- CORS 和安全过滤器。
- 产品管理员角色。

不要求安装 WooCommerce、JWT、CPT UI 或额外 REST 字段插件。

## 14. 部署

### 14.1 Staging

1. 保留现有 Cloudflare Pages 生产部署。
2. 创建独立 WordPress staging。
3. 安装 ACF PRO 与自定义插件。
4. 创建独立 `yanxinna-store-cms-staging` Worker。
5. 在 Worker 设置服务端环境变量。
6. 迁移现有四个产品和媒体。
7. 完成自动、人工和视觉回归验收。

### 14.2 Production

只有 Joe 明确验收后才执行：

1. 备份正式 WordPress 数据库和媒体。
2. 安装并启用正式 CMS 插件。
3. 设置正式 Worker secrets、WAF 和域名。
4. 进行 smoke test。
5. 将正式域名切换至 Worker。
6. 保留旧 Pages 最后一次成功部署作为回滚版本。

回滚只切回旧 Pages 部署，不删除 WordPress 内容或 staging Worker。

## 15. 测试

### 15.1 自动测试

- WordPress 响应到前端产品类型的映射测试。
- 缺失必填字段、错误字段类型和空翻译测试。
- 分类、子分类、featured、best seller 和搜索查询测试。
- locale 选择和 SEO fallback 测试。
- 发布、下架和不存在 slug 的契约测试。
- 缓存刷新密钥验证测试。
- TypeScript 类型检查。
- Next.js/OpenNext 生产构建。
- 关键页面浏览器测试。

### 15.2 WordPress 后台测试

- 新增、编辑、复制、删除产品。
- draft、pending、publish、trash 状态切换。
- 分类和子分类维护。
- 五语言字段完整性校验。
- 主图、悬停图、图库、颜色图、规格、参数和 PDF 上传。
- 关联产品选择。
- 非管理员产品角色权限。

### 15.3 前端测试

- 首页推荐、shop 列表、筛选、排序、Load More 和搜索。
- 产品详情图库、滑动、颜色、规格、附件和关联产品。
- 询盘自动带入产品信息。
- loading、empty、404、API error 和重试。
- 五语言切换。
- 全站搜索确认不存在价格、购物车、订单、checkout、PayPal 或 Stripe 文案与入口。

### 15.4 视觉回归

在改造前后对以下视图截图比较：

- 首页产品区域。
- shop 默认、分类筛选和 empty。
- 产品详情桌面与手机。
- 搜索弹窗。
- 俄语和最长文案语言下的关键页面。

允许的视觉变化仅包括删除商业元素、用询盘 CTA 填补原购买 CTA 位置，以及新增
loading、empty、404、API error 和附件入口。其他间距、颜色、字体、网格、图片
比例和动画变化视为回归。

## 16. 文档交付

- WordPress 安装与配置步骤。
- 必需插件和自定义插件安装说明。
- 产品字段字典。
- REST API Endpoint 与示例。
- 本地 WordPress/Next.js 运行方式。
- Cloudflare Workers staging 与生产部署方式。
- 环境变量与密钥轮换说明。
- 数据迁移步骤。
- 测试清单和回滚步骤。

## 17. 外部前置条件

完成真实联调和 staging 部署前，站点方需要提供：

- 可访问的 WordPress staging 地址。
- ACF PRO 合法授权或已安装实例。
- WordPress staging 管理权限。
- Cloudflare staging Worker 配置权限。

这些权限只用于服务器和后台配置，不写入仓库或浏览器。未提供时仍可完成前端数据
层、自定义插件、契约 fixture、测试和全部文档，但不能声明真实 WordPress 联调或
staging 部署已完成。

## 18. 验收标准

- 商家可在 WordPress 后台完成产品 CRUD、发布和下架。
- 五语言产品内容和 SEO 可管理并在前端按 locale 输出。
- 所有现有产品 mock 已迁移，生产代码不再导入本地产品数据。
- 首页、列表、搜索和动态详情均使用 WordPress API。
- 分类筛选、图库、颜色、规格、附件和关联产品正常。
- loading、empty、404、API error 和缓存降级均可复现。
- 全站无价格、购物车、订单、结账或支付元素。
- 不存在客户端 WordPress 写权限凭据。
- 自动测试、生产构建、关键浏览器测试和视觉回归通过。
- staging 验收前现有 Pages 生产站点未被覆盖。
