# 测试环境与生产部署

## 1. WordPress 服务器配置

不要把以下值提交到代码仓库。优先从主机 Secret Manager 或系统环境变量注入 `wp-config.php`：

```php
define('YANXINNA_FRONTEND_URL', getenv('YANXINNA_FRONTEND_URL'));
define('YANXINNA_REVALIDATE_SECRET', getenv('YANXINNA_REVALIDATE_SECRET'));
define('YANXINNA_ALLOWED_ORIGINS', getenv('YANXINNA_ALLOWED_ORIGINS'));
define('DISALLOW_FILE_EDIT', true);
```

示例值：

```text
YANXINNA_FRONTEND_URL=https://yanxinna-store-cms-staging.example.workers.dev
YANXINNA_REVALIDATE_SECRET=<32位以上密码学随机值>
YANXINNA_ALLOWED_ORIGINS=https://yanxinna-store-cms-staging.example.workers.dev,https://www.example.com
```

同一个 `YANXINNA_REVALIDATE_SECRET` 只保存于 WordPress 服务器和 Cloudflare Secret。轮换时先更新 Worker，再更新 WordPress，并立即验证一次产品保存。

## 2. WordPress 安全基线

- CMS、REST API 和媒体全部使用 HTTPS。
- 商家使用 `YANXINNA Product Manager`，管理员账号只用于系统维护。
- 开启 WordPress、插件、主题和服务器补丁更新，启用每日数据库/媒体备份并验证恢复。
- 在 Cloudflare/WAF 对 `/wp-login.php` 和 `/wp-admin/` 做登录保护；对 `/wp-json/yanxinna/v1/*` 做合理速率限制，不缓存错误响应。
- CORS 只列出明确的测试/正式前端 origin，不使用 `*`，不允许 credentials。
- 确认公开 API 的非 GET/OPTIONS 请求返回 405。
- 字段插件（ACF PRO 或 Secure Custom Fields）未激活时停止上线；插件会让产品 API 返回 503。本地实测免费的 **Secure Custom Fields 6.9.2** 已含 repeater 和 gallery，可完整替代 ACF PRO；正式站二选一，**不可两个同时装**。

CORS 只约束浏览器跨域访问，不是数据保密机制。产品 API 本身是公开只读数据，真正的写入安全依赖 WordPress 登录、角色权限、HTTPS、WAF 和补丁管理。

## 3. Cloudflare 测试 Worker

仓库默认 Worker 名为 `yanxinna-store-cms-staging`，不会覆盖现有站点。

在 Cloudflare Dashboard 的 Worker **Build variables and secrets** 与 **Runtime variables/secrets** 中都配置：

| 变量 | 类型 | 说明 |
| --- | --- | --- |
| `WORDPRESS_API_URL` | 加密 Secret 或服务端变量 | `https://.../wp-json/yanxinna/v1` |
| `WORDPRESS_REVALIDATE_SECRET` | Secret | 与 WordPress 一致，至少 32 位 |
| `NEXT_PUBLIC_SITE_URL` | Build variable + Runtime variable | 测试 Worker 的完整 HTTPS URL |

如果使用 CLI 写入 Secret：

```powershell
npx wrangler secret put WORDPRESS_API_URL
npx wrangler secret put WORDPRESS_REVALIDATE_SECRET
npx wrangler secret put NEXT_PUBLIC_SITE_URL
```

注意：`wrangler secret put` 会生成并部署新的 Worker 版本。首次安全上线应先在 Dashboard 创建测试 Worker，或使用版本化 Secret 工作流，再执行：

```powershell
npm ci
npm test
npm run typecheck
npm run deploy -- --keep-vars
```

OpenNext 官方建议使用适配器命令构建/部署，并在 Dashboard 配置生产运行变量；`--keep-vars` 防止部署覆盖 Dashboard 中的变量。部署完成后不要立即绑定生产域名，先完成 [test-checklist.md](test-checklist.md)。

## 4. 正式切换

只有全部测试通过并有 WordPress、数据库、媒体和现有前端回滚备份后才执行：

1. 为正式 Worker 使用独立名称或 Cloudflare environment。
2. 配置正式 WordPress URL、正式前端 URL、正式 CORS origin 和新的一组刷新密钥。
3. 部署并通过临时 `workers.dev` 或 staging 域完成冒烟测试。
4. 降低 DNS TTL，记录现有 Cloudflare Pages 部署版本和域名绑定。
5. 在低流量窗口把正式域名绑定到已验证的 Worker。
6. 检查首页、产品列表、详情、搜索、询盘、404、API error、五语、移动端、Webhook 和日志。
7. 稳定观察后再恢复常规 TTL。

## 5. 回滚

出现影响访问、产品数据错误、缓存不刷新或视觉回归时：

1. 立即把正式域名重新绑定到切换前记录的 Cloudflare Pages/Worker 版本。
2. 不删除 WordPress 数据；将有问题的产品改为草稿即可下架。
3. 保留失败 Worker 版本和 WordPress/PHP 日志用于定位。
4. 修复后只在 staging 重跑完整清单，再重新切换。

回滚前端域名不会破坏 WordPress 产品数据；产品迁移导入默认草稿，也不会直接影响当前生产内容。

参考：

- [OpenNext Cloudflare 环境变量](https://opennext.js.org/cloudflare/howtos/env-vars)
- [OpenNext Cloudflare CLI](https://opennext.js.org/cloudflare/cli)
- [Cloudflare Worker Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

