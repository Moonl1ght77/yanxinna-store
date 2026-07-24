# YANXINNA Headless WordPress CMS 交付说明

## 交付范围

本次改造把原前端中的产品 mock 数据迁移为 WordPress REST API 数据，同时保留既有产品列表、产品详情、导航和交互视觉。站点定位为外贸产品展示与询盘，不包含价格、购物车、结账、订单、在线支付、Stripe、PayPal 或 WooCommerce。

数据链路：

```text
商家后台 -> WordPress 产品与媒体 -> 只读 REST API
         -> Next.js 服务端数据层 -> 原有产品组件
         -> Cloudflare Worker
```

浏览器不直接保存 WordPress 管理凭据。前端只在服务端读取公开产品 API；缓存刷新密钥只存在于 WordPress 服务器配置和 Cloudflare Worker Secret 中。

## 代码与文档入口

- WordPress 插件：`wordpress/yanxinna-headless-products/`
- 可直接安装的插件包：`wordpress/dist/yanxinna-headless-products-1.0.0.zip`
- 初始产品数据：`wordpress/migration/products.json`
- WP-CLI 导入器：`wordpress/migration/import-products.php`
- 前端 WordPress 数据层：`lib/wordpress/`
- 前端缓存刷新接口：`app/api/revalidate/route.ts`
- 字段字典：[fields.md](fields.md)
- API 说明：[api.md](api.md)
- 本地运行：[local-development.md](local-development.md)
- 测试环境与生产部署：[deployment.md](deployment.md)
- 验收清单：[test-checklist.md](test-checklist.md)

## 需要安装的 WordPress 插件

只需要：

1. **ACF PRO**：使用 Gallery、Repeater 和 Relationship 字段；必须使用有效许可证。
2. **YANXINNA Headless Products**：本仓库提供的自定义插件。

不需要安装 WooCommerce、JWT Authentication、Custom Post Type UI、独立 CORS 插件或 SEO 插件。产品 SEO Title 和 SEO Description 已由自定义字段管理。

## WordPress 安装与配置

建议使用 WordPress 官方当前推荐的 PHP 8.3+、MySQL 8.0+ 或 MariaDB 10.11+，并全站启用 HTTPS。版本基线以 [WordPress 官方 Requirements](https://wordpress.org/about/requirements/) 为准。

1. 新建独立的 WordPress CMS 站点和数据库，不覆盖现有前端站点。
2. 完成 HTTPS、管理员账号、备份和更新策略。
3. 安装并激活 ACF PRO。
4. 在“插件 → 安装插件 → 上传插件”中上传 `wordpress/dist/yanxinna-headless-products-1.0.0.zip` 并激活。
5. 打开“设置 → 固定链接”，选择“文章名”并保存一次。
6. 在服务器的 `wp-config.php` 中加入 [deployment.md](deployment.md) 列出的三个常量。
7. 新建商家账号，并分配插件自动创建的 **YANXINNA Product Manager** 角色。该角色只能维护产品、分类和媒体，不能管理插件、主题、系统设置或其他用户。
8. 在“Products”中先新增或导入草稿，补齐五种语言和必填媒体，再人工发布。

发布后的完整产品会进入公开 API；草稿、待审、私密、回收站或字段不完整的产品都不会进入公开 API。后台“下架”使用“切换为草稿”或“移至回收站”。

## 上线原则与风险结论

代码层面已采用只读公开 API、字段白名单、输出清洗、最小权限角色、来源白名单 CORS、服务端缓存密钥和草稿优先迁移，可安全进入独立测试环境。

插件还会对**未登录访客**关闭 WordPress 默认的用户名枚举面，三处一并处理（已登录用户不受影响，后台区块编辑器照常工作）：

| 入口 | 默认行为 | 插件启用后 |
| --- | --- | --- |
| `/wp-json/wp/v2/users` | 200，返回全部用户名 | 404 |
| `/?author=N` | 301 跳转，URL 里带出用户名 | 404 |
| `/author/{slug}/` | 200，作者归档页 | 404 |

只堵 REST 端点是不够的，后两个入口泄露的是同一批用户名。

仍必须在测试环境验证 WordPress/PHP 运行时、真实媒体、五语内容、Cloudflare Worker Secret、Webhook、WAF/限流和视觉回归。未完成这些测试前，不应切换现有生产域名，也不应发布迁移后的产品。
