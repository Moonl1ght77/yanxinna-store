# CLAUDE.md - YANXINNA 塑身衣独立站

## 01 WHAT 项目定位
YANXINNA 是一个面向海外市场的塑身衣/调整型内衣 B2B 产品展示与询盘独立站。品牌定位中高端，提供塑身衣、文胸、内裤等产品线，主打功能性（压缩塑形）与舒适度的平衡。站点提供俄语、美式英语、英式英语、法语和德语内容。

## 02 STACK 技术栈
- 框架：Next.js 15 (App Router)
- 语言：TypeScript
- UI：React 19 + Tailwind CSS 3
- 动画：Framer Motion
- 图标：Lucide React
- CMS：Headless WordPress + ACF PRO
- 部署：OpenNext + Cloudflare Workers
- 交易：无购物车、订单或在线支付，仅产品展示与询盘
- 字体：Inter（正文）+ Oswald（展示）
- 包管理：npm

## 03 CMD 关键命令
- 开发：`npm run dev`
- 构建：`npm run build`
- 启动：`npm run start`
- 测试：`npm test`
- 类型检查：`npm run typecheck`
- Worker 预览：`npm run preview`

## 04 DIR 目录结构
- `app/` - Next.js 页面路由（首页、商店、动态产品详情和只读同源 API）
- `components/` - UI 组件（按功能分：layout、ui、product、shop、home）
- `providers/` - Context Provider（语言/地区）
- `hooks/` - 自定义 Hooks（语言切换）
- `lib/wordpress/` - WordPress 服务端 API、验证、映射和缓存
- `types/` - TypeScript 产品类型定义
- `public/` - 静态资源（SVG 占位图）
- `wordpress/` - WordPress 自定义插件和草稿迁移工具
- `docs/wordpress/` - CMS 配置、部署和验收文档

## 05 STYLE 代码约定
- 缩进：2 空格
- 引号：双引号（TypeScript/JSX）
- 命名：组件用 PascalCase，函数/变量用 camelCase，文件名用 kebab-case
- 样式：优先使用 Tailwind CSS 工具类，自定义动画放在 globals.css
- 组件模式：客户端组件（"use client"）与服务端组件分离，客户端组件以 `-client.tsx` 结尾
- 类型：所有 Props 和数据结构必须定义 TypeScript 类型

## 06 GIT 与提交
- 分支命名：`feat/xxx`、`fix/xxx`、`chore/xxx`
- Commit 格式：`feat: 接入产品内容` / `fix: 修复产品筛选`
- 提交语言：中文

## 07 NO-GO 禁区
- 不要修改 `node_modules/`
- 不要删除 `.next/` 构建缓存（除非必要）
- 不要直接修改 `app/layout.tsx` 的全局结构，需讨论
- 不得增加价格、购物车、订单、在线支付或支付凭据
- WordPress 管理员密码和缓存刷新密钥不得进入客户端或 Git
- 接入 CMS 时保持现有视觉、页面布局和交互效果
- 不要修改 `tailwind.config.ts` 中已定义的颜色变量，新增需讨论
- 保持现有的组件分离模式（客户端/服务端组件）

## 08 ENV 环境
- 本地开发：`npm run dev`（默认端口 3000）
- 环境变量：`WORDPRESS_API_URL`、`WORDPRESS_REVALIDATE_SECRET`、`NEXT_PUBLIC_SITE_URL` 通过 `.env.local` 配置（不提交到 Git）
- 布局语言：默认俄语（`lang="ru"`）

## 09 MEMORY 记忆（每次必做）
- 本项目记忆：`E:\AI-Memory\vault\20-项目记忆\独立站\YANXINNA塑身衣\`
- 开工先读三份记忆：项目地图.md、当前进度.md、踩坑记录.md
- 收工按三问（长期有用/会复用/能验证）主动更新记忆，并输出【记忆存档回执】
- 完整规则见 `E:\AI-Memory\vault\INDEX.md`

---

**便签原则**：说过三遍的话，写进这里。每次 Claude 启动都会自动读取。
