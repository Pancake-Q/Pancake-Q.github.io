# VitePress Blog

一个基于 VitePress 构建的现代化博客项目。

## 特性

- 基于 VitePress 2.x 构建
- 支持 TypeScript
- 完整的 SEO 优化配置
- 响应式设计
- 深色模式支持
- 本地搜索功能
- 自动化部署到 GitHub Pages
- 中文界面

## 项目结构

```
blog/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 自动部署配置
├── docs/
│   ├── .vitepress/
│   │   ├── theme/
│   │   │   ├── index.ts        # 自定义主题入口
│   │   │   └── style.css       # 自定义样式
│   │   ├── config.mts          # VitePress 配置文件
│   │   └── env.d.ts            # TypeScript 类型声明
│   ├── blog/                   # 博客文章目录
│   │   └── index.md
│   ├── categories/             # 分类目录
│   │   ├── frontend/
│   │   ├── backend/
│   │   └── tools/
│   ├── public/                 # 静态资源
│   ├── index.md                # 首页
│   └── about.md                # 关于页面
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 快速开始

### 环境要求

- Node.js 18+
- pnpm 10.13.0+

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
pnpm dev
```

启动开发服务器后，访问 http://localhost:5173

### 构建生产版本

```bash
pnpm build
```

### 本地预览构建结果

```bash
pnpm preview
```

## 配置说明

### 基本配置

编辑 `docs/.vitepress/config.mts` 文件进行配置：

- `title`: 网站标题
- `description`: 网站描述
- `themeConfig.nav`: 导航栏配置
- `themeConfig.sidebar`: 侧边栏配置
- `themeConfig.socialLinks`: 社交链接

### 自定义主题

主题文件位于 `docs/.vitepress/theme/`：

- `index.ts`: 主题入口，可以注册全局组件
- `style.css`: 自定义 CSS 变量和样式

### GitHub Pages 部署

项目已配置 GitHub Actions 自动部署工作流。当推送代码到 `main` 分支时，会自动构建并部署到 GitHub Pages。

**部署步骤：**

1. 在 GitHub 仓库设置中，进入 Settings > Pages
2. 在 Source 下选择 "GitHub Actions"
3. 推送代码到 main 分支即可触发自动部署

**配置 base 路径（如果不是部署到根域名）：**

在 `docs/.vitepress/config.mts` 中添加：

```ts
export default defineConfig({
  base: '/your-repo-name/',
  // ... 其他配置
})
```

## 写作指南

### 创建新文章

1. 在 `docs/blog/` 或对应的分类目录下创建 `.md` 文件
2. 添加 frontmatter 元数据：

```md
---
title: 文章标题
description: 文章描述
date: 2024-01-01
tags:
  - 标签1
  - 标签2
---

# 文章内容
```

3. 在对应的 `index.md` 中添加文章链接

### Markdown 扩展

VitePress 支持多种 Markdown 扩展：

- 自定义容器（提示、警告等）
- 代码块高亮
- 行号显示
- 代码组
- 表格
- Emoji
- 目录
- 数学公式（需要插件）

查看 [VitePress Markdown 文档](https://vitepress.dev/guide/markdown) 了解更多。

## 技术栈

- [VitePress](https://vitepress.dev/) - 静态站点生成器
- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集

## 许可证

MIT License

## 参考资源

- [VitePress 官方文档](https://vitepress.dev/)
- [VitePress GitHub](https://github.com/vuejs/vitepress)
- [Vue 3 文档](https://vuejs.org/)
