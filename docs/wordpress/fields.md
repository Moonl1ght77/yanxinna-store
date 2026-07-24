# 产品字段说明

## 内容模型

- WordPress Post Type：`yx_product`
- 分类法：`yx_product_category`，支持父分类和子分类
- 后台标题：仅用于后台识别；前台名称来自各语言的 `translations.*.name`
- slug：使用 WordPress 文章 slug，公开后作为 `/product/{slug}` 动态路由
- 发布状态：使用 WordPress 原生状态；只有 `publish` 会被公开 API 查询
- 主图：使用 WordPress Featured Image

支持的内容语言固定为：

- `ru-RU`
- `en-US`
- `en-GB`
- `fr-FR`
- `de-DE`

## 共享字段

| 后台字段 | API 字段 | 类型 | 发布所需 | 说明 |
| --- | --- | --- | --- | --- |
| Product number | `product_number` | Text | 是 | 产品编号，全站唯一 |
| Slug | `slug` | WordPress slug | 是 | 仅小写字母、数字和连字符 |
| Product Category | `category` | Taxonomy | 是 | 一级分类 |
| Product Subcategory | `subcategory` | Taxonomy | 否 | 二级分类 |
| Featured Image | `main_image` | Image | 是 | 产品主图 |
| Hover image | `hover_image` | Image | 否 | 列表悬停图 |
| Product gallery | `gallery` | Gallery | 否 | 产品详情图库 |
| Available specifications / sizes | `sizes[].value` | Repeater/Text | 是，至少 1 条 | 可选规格或尺码 |
| Available colours | `colors[]` | Repeater | 是，至少 1 条 | 颜色行还需颜色名、色值和两张图片 |
| Product parameters | `parameters[]` | Repeater | 否 | 每一项包含五语 label/value |
| PDF / document attachments | `attachments[]` | Repeater/File | 否 | 支持 pdf、doc、docx、xls、xlsx、zip |
| Compression level | `compression_level` | Select | 否 | `Light`、`Medium`、`Firm` |
| Featured on homepage | `featured` | Boolean | 否 | 首页推荐 |
| Best seller | `best_seller` | Boolean | 否 | 热销标签 |
| Display order | `sort_order` | Integer | 否 | 数字越小越靠前 |
| Related products | `complete_the_look` | Relationship | 否 | API 返回关联产品编号数组 |

### 颜色子字段

| 字段 | 类型 | 发布所需 |
| --- | --- | --- |
| `colors[].names.{locale}` | 五语 Text | 俄语必填，其余语言留空时 API 回退到俄语 |
| `colors[].hex` | Color Picker | 是，格式 `#RRGGBB` |
| `colors[].image` | Image | 是 |
| `colors[].hover_image` | Image | 是 |

### 产品参数子字段

| 字段 | 类型 | 规则 |
| --- | --- | --- |
| `parameters[].labels.{locale}` | 五语 Text | 添加该参数时俄语必填，其余语言回退到俄语 |
| `parameters[].values.{locale}` | 五语 Text | 添加该参数时俄语必填，其余语言回退到俄语 |

### 附件子字段

| 字段 | 类型 | 规则 |
| --- | --- | --- |
| `attachments[].file` | File | 添加附件时必填 |
| `attachments[].labels.{locale}` | 五语 Text | 添加附件时俄语必填，其余语言回退到俄语 |

## 每种语言的字段

以下字段位于 `translations.{locale}`，五种语言使用同一结构。**只有俄语（`ru-RU`，站点默认语言）整组必填**；英美、英英、法语、德语可以整组留空，留空的语言由 API 回退到俄语内容，产品照常在前台展示。

| 字段 | 类型 | 俄语 | 前端用途 |
| --- | --- | --- | --- |
| `name` | Text | 是 | 产品名称 |
| `short_description` | Textarea | 是 | 产品简介 |
| `description` | WYSIWYG | 是 | 完整描述，API 使用 WordPress HTML 白名单清洗 |
| `badge` | Text | 否 | 产品标签 |
| `fabric` | Text | 是 | 面料说明 |
| `care` | Text | 是 | 洗护说明 |
| `benefits[].value` | Repeater/Text | 是，至少 1 条 | 产品卖点 |
| `seo_title` | Text | 是 | 动态页面 SEO Title |
| `seo_description` | Textarea | 是 | 动态页面 SEO Description，后台限制 320 字符 |

## 公开完整性规则

即使 WordPress 状态是“已发布”，只要缺少以下任意一项，插件仍会从公开 API 中排除该产品并写入服务器错误日志：

- 产品编号、slug、一级分类、主图
- 至少一个规格、至少一个完整颜色
- **至少一种语言**的全套必填翻译字段

语言回退优先级：`ru-RU` → `en-US` → 第一个填写了内容的语言。也就是说只填了英语的产品也能正常上线，五种语言都会显示英语内容，直到有人补上对应翻译。

这条规则用于防止完全没有文案的半成品进入前台，同时不会因为少一种翻译就让整条产品从前台消失。正确流程仍然是“导入/创建草稿 → 补齐字段 → 预检 → 发布”。

