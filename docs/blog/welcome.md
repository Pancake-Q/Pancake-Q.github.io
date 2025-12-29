---
title: 欢迎来到我的博客
description: 这是第一篇示例文章，介绍了如何使用 VitePress 构建博客
date: 2024-12-29
tags:
  - VitePress
  - 博客
  - 教程
---

# 欢迎来到我的博客

这是一篇示例文章，展示了如何使用 VitePress 创建一个现代化的博客。

## 为什么选择 VitePress？

VitePress 是一个基于 Vite 和 Vue 的静态站点生成器，具有以下优点：

- **快速开发**：得益于 Vite 的快速热更新
- **简单易用**：使用 Markdown 编写内容
- **高性能**：生成的静态站点加载速度极快
- **可定制**：基于 Vue 3，易于扩展和定制

## 主要特性

### 1. Markdown 扩展

VitePress 支持丰富的 Markdown 语法扩展：

::: tip 提示
这是一个提示容器
:::

::: warning 警告
这是一个警告容器
:::

::: danger 危险
这是一个危险警告容器
:::

### 2. 代码高亮

支持语法高亮和行号显示：

```typescript
interface User {
  name: string
  age: number
}

const user: User = {
  name: 'Alice',
  age: 25
}

console.log(user)
```

### 3. 表格支持

| 特性 | 支持 | 说明 |
|------|------|------|
| Markdown | ✅ | 完整支持 |
| Vue 组件 | ✅ | 可嵌入 Vue 组件 |
| TypeScript | ✅ | 原生支持 |
| 深色模式 | ✅ | 自动切换 |

### 4. Emoji 支持

VitePress 支持 Emoji：😊 🎉 🚀 ⚡

## 快速开始

如果你想创建自己的博客，可以按照以下步骤：

1. **克隆项目**

```bash
git clone https://github.com/yourusername/blog.git
cd blog
```

2. **安装依赖**

```bash
pnpm install
```

3. **启动开发服务器**

```bash
pnpm dev
```

4. **开始写作**

在 `docs/blog/` 目录下创建新的 Markdown 文件即可。

## 部署

项目已配置 GitHub Actions 自动部署，只需将代码推送到 GitHub，即可自动部署到 GitHub Pages。

## 总结

VitePress 是一个优秀的静态站点生成器，非常适合用来构建技术博客、文档网站等。希望这篇文章能帮助你快速上手！

## 参考链接

- [VitePress 官方文档](https://vitepress.dev/)
- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)