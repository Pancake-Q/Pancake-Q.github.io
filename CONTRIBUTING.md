# 贡献指南

感谢你对本项目的关注！

## 开发流程

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的修改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 提交规范

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响代码运行）
- `refactor`: 重构（既不是新功能也不是 bug 修复）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：
```
feat: 添加文章标签功能
fix: 修复移动端导航栏显示问题
docs: 更新 README 安装说明
```

## 文章编写规范

### 文件命名

- 使用小写字母和连字符：`my-article-title.md`
- 避免使用中文文件名
- 文件名应简洁且有意义

### Frontmatter

每篇文章应包含以下 frontmatter：

```yaml
---
title: 文章标题
description: 文章简短描述
date: 2024-01-01
tags:
  - 标签1
  - 标签2
---
```

### 内容规范

- 使用中文撰写
- 代码块应指定语言以启用语法高亮
- 图片放在 `docs/public/images/` 目录下
- 使用相对路径引用图片

## 代码规范

### TypeScript

- 使用 TypeScript 编写配置和组件
- 为所有函数提供类型注解
- 避免使用 `any` 类型

### 样式

- 使用 CSS 变量进行主题定制
- 遵循 VitePress 默认主题的变量命名规范

## 本地测试

在提交 PR 之前，请确保：

1. 本地开发服务器运行正常
2. 构建命令执行成功
3. 没有 TypeScript 类型错误
4. 检查页面在不同设备上的显示效果

```bash
# 开发测试
pnpm dev

# 构建测试
pnpm build
pnpm preview
```

## 问题反馈

如果你发现了 bug 或有功能建议，欢迎[提交 Issue](../../issues/new)。

提交 Issue 时请包含：

- 问题的详细描述
- 复现步骤（如果是 bug）
- 截图（如果适用）
- 环境信息（浏览器版本、操作系统等）