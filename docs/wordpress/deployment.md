# 测试环境与生产部署

## 1. WordPress 服务器配置

不要把以下值提交到代码仓库。优先从主机 Secret Manager 或系统环境变量注入 `wp-config.php`：

```php
define('YANXINNA_FRONTEND_URL', getenv('YANXINNA_FRONTEND_URL'));
define('YANXINNA_REVALIDATE_SECRET', getenv('YANXINNA_REVALIDATE_SECRET'));
define('YANXINNA_ALLOWED_ORIGINS', getenv('YANXINNA_ALLOWED_ORIGINS'));
define('DISALLOW_FILE_EDIT', true);

// 发信（可选，不配则退回 PHP 的 mail()）。托管机常常没装 MTA，mail() 会静默失败。
define('YANXINNA_SMTP_HOST', getenv('YANXINNA_SMTP_HOST'));
define('YANXINNA_SMTP_PORT', 465);
define('YANXINNA_SMTP_USER', getenv('YANXINNA_SMTP_USER'));
define('YANXINNA_SMTP_PASS', getenv('YANXINNA_SMTP_PASS'));
```

发信注意两条：

- 云主机普遍封出站 **25 / 587**，先验端口再定方案：
  `for p in 465 587 25; do timeout 8 bash -c "echo > /dev/tcp/<SMTP主机>/$p" && echo "$p OPEN"; done`
  465 是隐式 TLS，插件按端口自动选 `ssl`/`tls`。
- 多数邮箱服务商要求**信封发件人等于认证账号**，插件已强制改写 `wp_mail_from`，所以发件人始终是 `YANXINNA_SMTP_USER`。

## 1b. 升级插件后必须重装角色权限

角色权限只在 `register_activation_hook` 里安装。**覆盖插件文件不会触发它**，所以凡是改动过权限（新增 CPT、改 `capability_type`、加 capability）的版本，升级后要手动跑一次，否则新权限不生效——连管理员都可能看不到新内容类型：

```bash
wp eval 'YANXINNA_Headless_Content::install_roles();'
```

复查（`yx_product_manager` 和 `administrator` 都要能看到询盘）：

```bash
wp eval '$pt=get_post_type_object("yx_inquiry"); foreach(["yx_product_manager","administrator"] as $r){ printf("%s: %s\n", $r, get_role($r)->has_cap($pt->cap->edit_posts)?"有":"没有"); }'
```

示例值：

```text
YANXINNA_FRONTEND_URL=https://yanxinna-store-cms-staging.example.workers.dev
YANXINNA_REVALIDATE_SECRET=<32位以上密码学随机值>
YANXINNA_ALLOWED_ORIGINS=https://yanxinna-store-cms-staging.example.workers.dev,https://www.example.com
```

同一个 `YANXINNA_REVALIDATE_SECRET` 只保存于 WordPress 服务器和 Cloudflare Secret。轮换时先更新 Worker，再更新 WordPress，并立即验证一次产品保存。

`YANXINNA_FRONTEND_URL` 必须是 **HTTPS 公网地址且使用标准端口**。WordPress 的 `wp_http_validate_url()` 会拒绝 loopback、私网 IP，以及 80/443/8080 之外的端口；被拒时 Webhook 直接跳过，唯一痕迹是 PHP 错误日志里的一行 `Cache refresh skipped: invalid frontend URL.`，后台没有任何提示。Cloudflare Worker 的 `*.workers.dev` 地址符合要求。

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

### 3.0 先创建两个 KV 命名空间（必做，否则完全没有缓存）

OpenNext 在 Cloudflare 上必须显式配置缓存后端。缺少绑定时 `next: { revalidate, tags }` 会**静默失效**：每个访客的每次访问都直接回源打 WordPress，`/api/revalidate` 也没有任何东西可刷。本地实测确认过这个行为。

```powershell
npx wrangler kv namespace create yanxinna-inc-cache
npx wrangler kv namespace create yanxinna-tag-cache
```

把两条命令输出的 `id` 填进 `wrangler.jsonc` 的 `kv_namespaces`，替换掉 `REPLACE_WITH_REAL_KV_ID_*` 占位值。绑定名不能改：

| 绑定名 | 用途 |
| --- | --- |
| `NEXT_INC_CACHE_KV` | 增量/fetch 数据缓存 |
| `NEXT_TAG_CACHE_KV` | tag 失效记录，`revalidateTag` 依赖它 |

本地 `npm run preview` 用 miniflare 模拟 KV，占位 id 也能跑；只有部署到 Cloudflare 才需要真实 id。

验证方法（本地已验证通过）：先请求一次产品接口建立缓存 → 直接改数据库但**不触发** WordPress 保存 → 再请求应仍返回旧值 → 在后台保存产品触发 Webhook → 再请求应返回新值。

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

