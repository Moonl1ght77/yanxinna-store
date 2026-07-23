# API Endpoint 说明

API Base URL：

```text
https://cms.example.com/wp-json/yanxinna/v1
```

公开接口只接受 `GET` 和浏览器预检 `OPTIONS`。前端不调用 WordPress 管理写入接口，也不需要管理员密码、Application Password 或 JWT。

## 产品列表

```http
GET /products
```

可选查询参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `category` | slug | 一级分类筛选 |
| `subcategory` | slug | 二级分类筛选 |
| `featured` | `true/false/1/0` | 首页推荐筛选 |
| `best_seller` | `true/false/1/0` | 热销筛选 |
| `search` | string | 搜索产品编号和五语产品名称 |
| `page` | integer >= 1 | 默认 1 |
| `per_page` | 1–100 | 默认 20 |

响应头包含 `X-WP-Total` 与 `X-WP-TotalPages`。成功响应为产品对象数组：

```json
[
  {
    "id": 101,
    "slug": "seamless-sculpt-bodysuit",
    "product_number": "YX-001",
    "category": { "id": 3, "slug": "shapewear", "name": "Shapewear" },
    "subcategory": null,
    "main_image": { "id": 201, "url": "https://cms.example.com/a.jpg", "alt": "Bodysuit" },
    "hover_image": null,
    "gallery": [],
    "sizes": [{ "value": "S" }, { "value": "M" }],
    "colors": [
      {
        "names": {
          "ru-RU": "Черный",
          "en-US": "Black",
          "en-GB": "Black",
          "fr-FR": "Noir",
          "de-DE": "Schwarz"
        },
        "hex": "#000000",
        "image": { "id": 201, "url": "https://cms.example.com/a.jpg", "alt": "Black" },
        "hover_image": { "id": 202, "url": "https://cms.example.com/b.jpg", "alt": "Black" }
      }
    ],
    "parameters": [],
    "attachments": [],
    "compression_level": "Firm",
    "featured": true,
    "best_seller": false,
    "sort_order": 10,
    "complete_the_look": [],
    "translations": {
      "ru-RU": {
        "name": "Название",
        "short_description": "Краткое описание",
        "description": "<p>Описание</p>",
        "badge": "",
        "fabric": "Ткань",
        "care": "Уход",
        "benefits": ["Преимущество"],
        "seo_title": "SEO",
        "seo_description": "SEO описание"
      },
      "en-US": {
        "name": "Name",
        "short_description": "Short description",
        "description": "<p>Description</p>",
        "badge": "",
        "fabric": "Fabric",
        "care": "Care",
        "benefits": ["Benefit"],
        "seo_title": "SEO",
        "seo_description": "SEO description"
      },
      "en-GB": {
        "name": "Name",
        "short_description": "Short description",
        "description": "<p>Description</p>",
        "badge": "",
        "fabric": "Fabric",
        "care": "Care",
        "benefits": ["Benefit"],
        "seo_title": "SEO",
        "seo_description": "SEO description"
      },
      "fr-FR": {
        "name": "Nom",
        "short_description": "Description courte",
        "description": "<p>Description</p>",
        "badge": "",
        "fabric": "Tissu",
        "care": "Entretien",
        "benefits": ["Avantage"],
        "seo_title": "SEO",
        "seo_description": "Description SEO"
      },
      "de-DE": {
        "name": "Name",
        "short_description": "Kurzbeschreibung",
        "description": "<p>Beschreibung</p>",
        "badge": "",
        "fabric": "Material",
        "care": "Pflege",
        "benefits": ["Vorteil"],
        "seo_title": "SEO",
        "seo_description": "SEO-Beschreibung"
      }
    }
  }
]
```

## 产品详情

```http
GET /products/{slug}
```

成功返回一个完整产品对象。slug 不存在、产品未发布或内容不完整时：

```json
{
  "code": "yanxinna_product_not_found",
  "message": "Product not found.",
  "data": { "status": 404 }
}
```

前端把该响应映射为产品 404 页面。

## 分类列表

```http
GET /categories
```

成功响应：

```json
[
  { "id": 3, "slug": "shapewear", "name": "Shapewear", "parent": 0 },
  { "id": 4, "slug": "bodysuits", "name": "Bodysuits", "parent": 3 }
]
```

## 参数错误与服务错误

无效分页参数由 WordPress 返回 400：

```json
{
  "code": "rest_invalid_param",
  "message": "Invalid parameter(s): per_page",
  "data": { "status": 400 }
}
```

ACF PRO 不可用时返回 503：

```json
{
  "code": "yanxinna_acf_unavailable",
  "message": "Product content is temporarily unavailable.",
  "data": { "status": 503 }
}
```

分类读取故障返回 500。前端对 WordPress 非成功响应、网络超时和数据结构错误统一显示 API error 状态，不回退到旧 mock 数据。

## 前端同源接口

- `GET /api/products/search?q=...`：搜索弹窗使用的同源、无凭据查询。
- `POST /api/revalidate`：仅供 WordPress Webhook 调用；请求头必须带 `x-yanxinna-secret`，JSON 可带 `{"slug":"..."}`。密钥错误返回 401。

`WORDPRESS_REVALIDATE_SECRET` 不得使用 `NEXT_PUBLIC_` 前缀，不得写入 Git，不得出现在浏览器请求、页面 HTML 或客户端 JavaScript 中。
