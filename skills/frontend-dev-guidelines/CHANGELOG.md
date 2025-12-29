# Changelog

All notable changes to the frontend-dev-guidelines skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-22

### Added
- 初始版本发布
- 前端开发核心原则（简洁、类型安全、API 稳定性、一致性）
- 命名规范（变量、函数、组件、CSS 类）
- Vue 3 + Nuxt 3 组件结构规范
- TypeScript 类型安全最佳实践
- SCSS 样式管理（变量、Mixins、BEM 命名）
- 代码质量检查流程（lint、type-check、test）
- 组件抽离标准和目录结构
- 代码重构流程（分析、执行、检查）
- 常见问题解决方案
- Git 提交规范（Conventional Commits）

### Resources
- Vue 3 + Nuxt 3 开发指南（resources/vue-nuxt-guide.md）
- TypeScript 规范（resources/typescript-guide.md）
- 样式管理指南（resources/styling-guide.md）
- 重构检查清单（resources/refactoring-checklist.md）
- 代码组织规范（resources/code-organization.md）

### Technical Details
- 主文件保持在 280 行（< 500 行限制）✅
- 使用渐进式披露，详细内容在 resources/
- 支持多种触发方式（关键词 + 意图模式 + 文件触发）
- 集成现有命令文档（refactor-code.md、dev-guide.md）

### Trigger Configuration
- **Keywords**: Vue, React, Nuxt, TypeScript, 重构, 组件, SCSS, BEM 等 26 个
- **Intent Patterns**: 8 个意图模式（重构、创建、抽离、规范等）
- **File Triggers**: `**/*.vue`, `**/*.tsx`, `**/*.jsx`, `**/components/**/*` 等

---

**维护者**: AI-DEV-CONFIG Team