# 测试与上线清单

## 自动化

- [ ] `npm test` 全部通过。
- [ ] `npm run typecheck` 全部通过。
- [ ] `npm run build` 全部通过。
- [ ] 在 Linux/WSL/CI 执行 `npm run preview`，OpenNext Worker 可启动。
- [ ] 在目标 PHP 版本对插件全部 PHP 文件执行 `php -l`。
- [ ] 插件 ZIP 可安装、激活和停用，PHP/WordPress 日志无 fatal/error。

## WordPress CRUD 与状态

- [ ] Product Manager 可以新增、编辑、删除产品，上传媒体和维护分类。
- [ ] Product Manager 不能安装插件、改主题、改系统设置或管理用户。
- [ ] 产品编号重复时后台拒绝保存。
- [ ] 草稿、待审、私密、回收站产品不出现在 API。
- [ ] 完整产品发布后出现在列表与详情 API。
- [ ] 已发布产品切换为草稿后从前端下架。
- [ ] 缺主图、分类、规格、颜色或任一必填翻译的产品被 API 排除。
- [ ] 产品保存、状态切换、删除和分类变化都会触发缓存刷新。

## 字段、语言与媒体

- [ ] `ru-RU`、`en-US`、`en-GB`、`fr-FR`、`de-DE` 的名称、简介、完整描述、面料、洗护、卖点和 SEO 都正确。
- [ ] 颜色名称、参数 label/value、附件 label 都有五语内容。
- [ ] 主图、悬停图、图库、每个颜色的两张图片在桌面和移动端正常。
- [ ] PDF/资料附件能打开，URL 使用 HTTPS，文件类型符合白名单。
- [ ] slug 与产品编号唯一、稳定；修改 slug 后检查旧链接处理和搜索结果。

## API

- [ ] `/yanxinna/v1/products`、`/products/{slug}`、`/categories` 返回契约字段。
- [ ] `category`、`subcategory`、`featured`、`best_seller`、`search`、分页筛选正确。
- [ ] 无效 `page/per_page` 返回 400，不存在/下架产品返回 404。
- [ ] ACF PRO 停用演练返回 503，前端显示 API error；验证后立即恢复。
- [ ] API 输出不包含后台用户、密码、密钥、内部备注或未列入契约的 ACF 字段。
- [ ] 对公开产品路由发 POST/PUT/DELETE 返回 405。

## 前端功能与视觉

- [ ] 首页产品来自 WordPress，原 UI、间距、动画和响应式布局无意外变化。
- [ ] 产品列表视觉不变，分类筛选、空状态和加载状态正确。
- [ ] 搜索可按五语名称和产品编号查找。
- [ ] `/product/{slug}` 动态详情、图库、颜色、规格、参数、附件和 SEO 正确。
- [ ] 不存在的 slug 显示产品 404 且带 `noindex`。
- [ ] WordPress 网络中断/超时/500 时显示 API error 和重试入口。
- [ ] 询盘按钮打开带产品上下文的表单/邮件入口。
- [ ] 1440×900、390×844 以及真实 iOS/Android 浏览器完成视觉回归。
- [ ] 页面无水平溢出、断图、控制台错误或严重 Core Web Vitals 回退。

## 无交易元素验收

- [ ] 无价格、货币符号、促销价、数量选择器、Add to Cart、Buy Now。
- [ ] 无购物车、结账、订单、支付成功、Track Order 路由或入口。
- [ ] 无 Stripe、PayPal、WooCommerce 代码、脚本、环境变量或网络请求。
- [ ] 页头、页脚、公告、服务文案均为产品展示、OEM/ODM、物流与询盘语义。

## 安全与上线门禁

- [ ] 浏览器源码、构建产物和网络面板均无管理员密码或 `WORDPRESS_REVALIDATE_SECRET`。
- [ ] CORS 只允许测试/正式前端 origin，无 `*`、无 credentials。
- [ ] `/wp-admin/` 和 `/wp-login.php` 受 HTTPS、强密码、MFA/Access/WAF 保护。
- [ ] REST API 和登录入口速率限制已验证，不误伤正常前端访问。
- [ ] WordPress、数据库、媒体与当前前端版本都完成可恢复备份。
- [ ] staging 全部通过并由业务负责人确认五语内容后，才允许生产域名切换。
- [ ] 回滚责任人、旧 Pages/Worker 版本和执行窗口已记录。

