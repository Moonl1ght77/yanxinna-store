# CLAUDE.md - YANXINNA 塑身衣独立站

## 01 WHAT 项目定位
YANXINNA 是一个面向俄罗斯市场的塑身衣/调整型内衣电商独立站。品牌定位中高端，提供塑身衣、文胸、内裤等产品线，主打功能性（压缩塑形）与舒适度的平衡。目标用户为关注身材管理的俄罗斯女性消费者。

## 02 STACK 技术栈
- 框架：Next.js 15 (App Router)
- 语言：TypeScript
- UI：React 19 + Tailwind CSS 3
- 动画：Framer Motion
- 图标：Lucide React
- 支付：Stripe Checkout
- 字体：Inter（正文）+ Oswald（展示）
- 包管理：npm

## 03 CMD 关键命令
- 开发：`npm run dev`
- 构建：`npm run build`
- 启动：`npm run start`
- 注：暂无测试和类型检查脚本，如需可添加 `tsc --noEmit`

## 04 DIR 目录结构
- `app/` - Next.js 页面路由（首页、商店、商品详情、购物车、结账）
- `components/` - UI 组件（按功能分：layout、ui、cart、product、shop、home）
- `providers/` - Context Provider（购物车、语言/地区）
- `hooks/` - 自定义 Hooks（购物车、语言切换）
- `lib/` - 工具函数（region 逻辑）
- `types/` - TypeScript 类型定义（product、cart）
- `public/` - 静态资源（SVG 占位图）
- `app/api/` - API 路由（Stripe 支付）

## 05 STYLE 代码约定
- 缩进：2 空格
- 引号：双引号（TypeScript/JSX）
- 命名：组件用 PascalCase，函数/变量用 camelCase，文件名用 kebab-case
- 样式：优先使用 Tailwind CSS 工具类，自定义动画放在 globals.css
- 组件模式：客户端组件（"use client"）与服务端组件分离，客户端组件以 `-client.tsx` 结尾
- 类型：所有 Props 和数据结构必须定义 TypeScript 类型

## 06 GIT 与提交
- 分支命名：`feat/xxx`、`fix/xxx`、`chore/xxx`
- Commit 格式：`feat: 添加购物车功能` / `fix: 修复结账页面样式`
- 提交语言：中文

## 07 NO-GO 禁区
- 不要修改 `node_modules/`
- 不要删除 `.next/` 构建缓存（除非必要）
- 不要直接修改 `app/layout.tsx` 的全局结构，需讨论
- 不要移除 Stripe 集成相关代码
- 不要修改 `tailwind.config.ts` 中已定义的颜色变量，新增需讨论
- 保持现有的组件分离模式（客户端/服务端组件）

## 08 ENV 环境
- 本地开发：`npm run dev`（默认端口 3000）
- 环境变量：Stripe 密钥等敏感信息通过 `.env.local` 配置（不提交到 Git）
- 布局语言：默认俄语（`lang="ru"`）

---

**便签原则**：说过三遍的话，写进这里。每次 Claude 启动都会自动读取。
