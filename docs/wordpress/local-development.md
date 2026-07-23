# 本地运行方式

## 前端

环境要求：Node.js 20+、npm，以及一个可访问的真实 WordPress 测试站点。单元测试使用契约 fixture，不依赖真实 WordPress；运行页面时必须能访问真实 API。

```powershell
Copy-Item .env.example .env.local
```

编辑 `.env.local`：

```dotenv
WORDPRESS_API_URL=https://cms-staging.example.com/wp-json/yanxinna/v1
WORDPRESS_REVALIDATE_SECRET=至少32位且与WordPress测试站一致的随机密钥
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

然后运行：

```powershell
npm install
npm run dev
npm test
npm run typecheck
```

打开 `http://localhost:3000`。建议依次检查首页、`/shop`、分类筛选、搜索、一个真实 `/product/{slug}`、一个不存在的 slug 和询盘弹窗。

Cloudflare Worker 本地预览：

```powershell
Copy-Item .dev.vars.example .dev.vars
npm run preview
```

OpenNext 官方建议 Next.js 本地开发使用 `.env` 文件，Worker 本地预览使用 `.dev.vars`；两个文件都已被 Git 忽略。Windows 原生环境若遇到 OpenNext 构建兼容问题，使用 WSL2 或 Linux CI 运行预览。

## WordPress

1. 在本地或独立测试域安装 WordPress 和 ACF PRO。
2. 安装 `wordpress/yanxinna-headless-products/` 插件。
3. 在 `wp-config.php` 设置测试前端 URL、随机密钥和允许来源，示例见 [deployment.md](deployment.md)。
4. 保存固定链接。
5. 创建一条完整的测试产品并发布。
6. 访问：

```text
https://cms-staging.example.com/wp-json/yanxinna/v1/products
```

## 导入现有 mock 产品

`products.json` 中的迁移记录全部标记为草稿，且 `ru-RU`、`fr-FR`、`de-DE` 翻译仍需商家补录。先确认 `--media-base-url` 能公开访问 JSON 中引用的现有图片：

```powershell
wp eval-file "C:\secure-path\import-products.php" -- --media-base-url=https://current-assets.example.com/
```

将 `products.json` 与 `import-products.php` 放在同一安全目录后执行。导入器以 `product_number` 匹配，重复运行会更新既有记录；所有创建或更新的产品都会保持草稿，绝不自动发布。执行后检查 created、updated、failed 计数和 WordPress 媒体库。

