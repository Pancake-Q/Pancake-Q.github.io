# 样式管理指南

> SCSS 变量、Mixins、BEM 命名规范

---

## 目录

- [SCSS 变量管理](#scss-变量管理)
- [Mixins 复用](#mixins-复用)
- [BEM 命名规范](#bem-命名规范)
- [组件样式最佳实践](#组件样式最佳实践)
- [响应式设计](#响应式设计)
- [UI 库样式覆盖](#ui-库样式覆盖)
- [SCSS 文件组织](#scss-文件组织)
- [BEM 命名长度优化](#bem-命名长度优化)
- [样式冲突避免策略](#样式冲突避免策略)
- [样式重复处理](#样式重复处理)
- [UI 库样式统一覆盖](#ui-库样式统一覆盖)

---

## SCSS 变量管理

### 变量文件结构

**文件位置**: `assets/styles/variables.scss`

#### 颜色变量

```scss
// 主题色
$color-primary: #409EFF;
$color-success: #67C23A;
$color-warning: #E6A23C;
$color-danger: #F56C6C;
$color-info: #909399;

// 文本颜色
$color-text-primary: #303133;
$color-text-regular: #606266;
$color-text-secondary: #909399;
$color-text-placeholder: #C0C4CC;

// 背景和边框
$color-bg-primary: #FFFFFF;
$color-bg-secondary: #F5F7FA;
$color-border: #DCDFE6;
```

#### 间距和字体变量

```scss
// 间距
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-xxl: 48px;

// 字体大小
$font-size-xs: 12px;
$font-size-sm: 13px;
$font-size-base: 14px;
$font-size-md: 16px;
$font-size-lg: 18px;
$font-size-xl: 20px;
$font-size-xxl: 24px;

// 字重和行高
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-bold: 700;

$line-height-base: 1.5;
$line-height-tight: 1.25;
$line-height-loose: 1.75;
```

#### 样式效果变量

```scss
// 圆角
$border-radius-sm: 2px;
$border-radius-base: 4px;
$border-radius-md: 6px;
$border-radius-lg: 8px;
$border-radius-xl: 12px;
$border-radius-circle: 50%;

// 阴影
$shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
$shadow-base: 0 2px 8px rgba(0, 0, 0, 0.1);
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
$shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);

// 动画
$transition-fast: 0.15s;
$transition-base: 0.3s;
$transition-slow: 0.5s;

$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
$ease-out: cubic-bezier(0, 0, 0.2, 1);
$ease-in: cubic-bezier(0.4, 0, 1, 1);
```

#### 布局和断点变量

```scss
// 布局尺寸
$container-max-width: 1200px;
$header-height: 60px;
$sidebar-width: 240px;
$footer-height: 80px;

// 响应式断点
$breakpoint-xs: 480px;
$breakpoint-sm: 768px;
$breakpoint-md: 992px;
$breakpoint-lg: 1200px;
$breakpoint-xl: 1920px;

// z-index 层级
$z-index-dropdown: 1000;
$z-index-modal: 1500;
$z-index-notification: 2000;
$z-index-tooltip: 2500;
```

### 使用变量

```vue
<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.card {
  padding: $spacing-md;
  background: $color-bg-primary;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-base;
  transition: all $transition-base $ease-in-out;

  &:hover {
    box-shadow: $shadow-lg;
  }

  &__title {
    color: $color-text-primary;
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    margin-bottom: $spacing-sm;
  }

  &__content {
    color: $color-text-regular;
    font-size: $font-size-base;
    line-height: $line-height-base;
  }
}
</style>
```

---

## Mixins 复用

### 常用 Mixins

```scss
// assets/styles/mixins.scss

// === 卡片样式 ===
@mixin card-base {
  padding: $spacing-md;
  background: $color-bg-primary;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-base;
}

@mixin card-hover {
  transition: all $transition-base $ease-in-out;

  &:hover {
    box-shadow: $shadow-lg;
    transform: translateY(-2px);
  }
}

// === 文本溢出 ===
@mixin text-ellipsis($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
  }
}

// === Flex 布局 ===
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin flex-start {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

// === 清除浮动 ===
@mixin clearfix {
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}

// === 响应式设计 ===
@mixin respond-to($breakpoint) {
  @if $breakpoint == xs {
    @media (max-width: $breakpoint-xs) { @content; }
  }
  @else if $breakpoint == sm {
    @media (min-width: $breakpoint-sm) { @content; }
  }
  @else if $breakpoint == md {
    @media (min-width: $breakpoint-md) { @content; }
  }
  @else if $breakpoint == lg {
    @media (min-width: $breakpoint-lg) { @content; }
  }
  @else if $breakpoint == xl {
    @media (min-width: $breakpoint-xl) { @content; }
  }
}

// === 按钮样式 ===
@mixin button-variant($bg-color, $text-color: #fff) {
  background-color: $bg-color;
  color: $text-color;
  border: 1px solid $bg-color;
  transition: all $transition-base $ease-in-out;

  &:hover {
    background-color: lighten($bg-color, 10%);
    border-color: lighten($bg-color, 10%);
  }

  &:active {
    background-color: darken($bg-color, 5%);
    border-color: darken($bg-color, 5%);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// === 滚动条样式 ===
@mixin custom-scrollbar($width: 8px, $track-color: transparent, $thumb-color: #ddd) {
  &::-webkit-scrollbar {
    width: $width;
    height: $width;
  }

  &::-webkit-scrollbar-track {
    background: $track-color;
  }

  &::-webkit-scrollbar-thumb {
    background: $thumb-color;
    border-radius: $border-radius-lg;

    &:hover {
      background: darken($thumb-color, 10%);
    }
  }
}

// === 页面容器 ===
@mixin page-container {
  max-width: $container-max-width;
  margin: 0 auto;
  padding: $spacing-lg;

  @include respond-to(sm) {
    padding: $spacing-md;
  }

  @include respond-to(xs) {
    padding: $spacing-sm;
  }
}
```

### 使用 Mixins

```vue
<style scoped lang="scss">
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.news-card {
  @include card-base;
  @include card-hover;

  &__title {
    @include text-ellipsis(2);  // 两行溢出
    font-size: $font-size-lg;
    margin-bottom: $spacing-sm;
  }

  &__header {
    @include flex-between;
    margin-bottom: $spacing-md;
  }

  &__content {
    @include custom-scrollbar(6px, transparent, #ccc);
    max-height: 200px;
    overflow-y: auto;
  }
}

.page-wrapper {
  @include page-container;
}

.primary-button {
  @include button-variant($color-primary);
}

.danger-button {
  @include button-variant($color-danger);
}
</style>
```

---

## BEM 命名规范

### BEM 基础

**BEM = Block Element Modifier**

- **Block（块）**: 独立的组件
- **Element（元素）**: 块的组成部分
- **Modifier（修饰符）**: 块或元素的不同状态

**命名格式**:
- Block: `.block`
- Element: `.block__element`
- Modifier: `.block--modifier` 或 `.block__element--modifier`

### 正确示例

```vue
<template>
  <div class="news-card news-card--featured">
    <div class="news-card__header">
      <h3 class="news-card__title news-card__title--large">新闻标题</h3>
      <span class="news-card__date">2025-12-22</span>
    </div>
    <div class="news-card__content">
      <p class="news-card__description">新闻描述...</p>
    </div>
    <div class="news-card__footer">
      <button class="news-card__button news-card__button--primary">
        阅读更多
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Block
.news-card {
  @include card-base;

  // Modifier: 特色新闻
  &--featured {
    border: 2px solid $color-primary;
  }

  // Element: 头部
  &__header {
    @include flex-between;
    margin-bottom: $spacing-md;
  }

  // Element: 标题
  &__title {
    color: $color-text-primary;
    font-size: $font-size-md;

    // Modifier: 大标题
    &--large {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
    }
  }

  // Element: 日期
  &__date {
    color: $color-text-secondary;
    font-size: $font-size-sm;
  }

  // Element: 内容
  &__content {
    margin-bottom: $spacing-md;
  }

  // Element: 描述
  &__description {
    @include text-ellipsis(3);
    color: $color-text-regular;
  }

  // Element: 底部
  &__footer {
    @include flex-start;
  }

  // Element: 按钮
  &__button {
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius-base;
    cursor: pointer;

    // Modifier: 主要按钮
    &--primary {
      @include button-variant($color-primary);
    }

    // Modifier: 次要按钮
    &--secondary {
      @include button-variant($color-info);
    }
  }
}
</style>
```

### 错误示例（避免）

```scss
// ❌ 错误：过深嵌套
.news-card {
  .header {
    .title {
      .text {
        color: red;
      }
    }
  }
}

// ❌ 错误：使用驼峰命名
.newsCard {
  .cardTitle { }
}

// ❌ 错误：缩写不清晰
.nc {
  .nt { }
}

// ❌ 错误：使用下划线连接单词（应用连字符）
.news_card {
  .card_title { }
}
```

---

## 组件样式最佳实践

### 1. 使用 scoped 避免污染

```vue
<style scoped lang="scss">
// ✅ 样式仅应用于当前组件
.card {
  padding: $spacing-md;
}
</style>
```

### 2. 深度选择器（修改子组件样式）

```vue
<style scoped lang="scss">
// ✅ 使用 :deep() 修改子组件样式
.wrapper {
  :deep(.el-button) {
    margin-right: $spacing-sm;
  }
}

// ❌ 避免：移除 scoped
</style>
```

### 3. 全局样式

```scss
// assets/styles/global.scss

// ✅ 全局样式
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: $font-size-base;
  color: $color-text-primary;
  background: $color-bg-secondary;
}

a {
  text-decoration: none;
  color: $color-primary;
  transition: color $transition-base;

  &:hover {
    color: darken($color-primary, 10%);
  }
}
```

### 4. 组件库样式覆盖

```scss
// assets/styles/element-override.scss

// ✅ 统一覆盖 Element Plus 样式
.el-button {
  border-radius: $border-radius-base;
  font-weight: $font-weight-medium;
}

.el-card {
  border-radius: $border-radius-lg;
  box-shadow: $shadow-base;
}

.el-input__inner {
  border-radius: $border-radius-base;
  font-size: $font-size-base;
}
```

---

## 响应式设计

### 使用 Mixin

```vue
<style scoped lang="scss">
.news-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-md;

  // 大屏幕（≥1200px）
  @include respond-to(lg) {
    grid-template-columns: repeat(3, 1fr);
  }

  // 中等屏幕（≥992px）
  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
  }

  // 小屏幕（≥768px）
  @include respond-to(sm) {
    grid-template-columns: repeat(1, 1fr);
  }

  // 超小屏幕（<480px）
  @include respond-to(xs) {
    gap: $spacing-sm;
  }
}
</style>
```

### 移动端优先

```scss
// ✅ 推荐：移动端优先
.container {
  // 默认（移动端）
  padding: $spacing-sm;

  // 逐渐增大
  @include respond-to(sm) {
    padding: $spacing-md;
  }

  @include respond-to(lg) {
    padding: $spacing-lg;
  }
}
```

---

## UI 库样式覆盖

### Element Plus 覆盖

```scss
// assets/styles/element-override.scss
@import './variables.scss';

// === 按钮 ===
.el-button {
  border-radius: $border-radius-base;
  font-weight: $font-weight-medium;

  &--primary {
    background-color: $color-primary;
    border-color: $color-primary;
  }
}

// === 卡片 ===
.el-card {
  border-radius: $border-radius-lg;
  box-shadow: $shadow-base;

  &__header {
    padding: $spacing-md;
    border-bottom: 1px solid $color-border;
  }

  &__body {
    padding: $spacing-md;
  }
}

// === 输入框 ===
.el-input {
  &__inner {
    border-radius: $border-radius-base;
    font-size: $font-size-base;

    &:focus {
      border-color: $color-primary;
    }
  }
}

// === 表格 ===
.el-table {
  &__header {
    th {
      background-color: $color-bg-secondary;
      color: $color-text-primary;
      font-weight: $font-weight-medium;
    }
  }

  &__row {
    &:hover {
      background-color: lighten($color-bg-secondary, 2%);
    }
  }
}
```

### 在 nuxt.config.ts 中引入

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  css: [
    '@/assets/styles/variables.scss',
    '@/assets/styles/mixins.scss',
    '@/assets/styles/global.scss',
    '@/assets/styles/element-override.scss'
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/assets/styles/variables.scss";
            @import "@/assets/styles/mixins.scss";
          `
        }
      }
    }
  }
})
```

---

## SCSS 文件组织

合理的文件结构能提升样式代码的可维护性和复用性。

### 推荐的目录结构

```
assets/styles/
├── variables.scss          # 变量定义
├── mixins.scss             # Mixin 定义
├── global.scss             # 全局样式
├── element-override.scss   # UI 库覆盖
└── utils/
    ├── animations.scss     # 动画
    ├── helpers.scss        # 辅助类
    └── reset.scss          # 重置样式
```

### 文件职责

- **variables.scss**: 集中管理颜色、间距、字体等设计 token
- **mixins.scss**: 可复用的样式片段和工具函数
- **global.scss**: 全局基础样式（reset、通用类）
- **element-override.scss**: 统一覆盖 UI 库默认样式
- **utils/**: 辅助工具文件夹，按功能分类

### 文件引入顺序

在 `nuxt.config.ts` 中按照依赖关系引入：

```typescript
css: [
  '@/assets/styles/variables.scss',  // 1. 变量最先
  '@/assets/styles/mixins.scss',     // 2. Mixins 依赖变量
  '@/assets/styles/global.scss',     // 3. 全局样式
  '@/assets/styles/element-override.scss'  // 4. UI 库覆盖
]
```

---

## BEM 命名长度优化

BEM 命名遵循 `.block__element--modifier` 格式，有时类名会较长。

### 使用 SCSS 嵌套简化

SCSS 的嵌套特性可以让代码更简洁，同时保持 BEM 命名规范：

```scss
// ✅ 使用 SCSS 嵌套
.news-card {
  padding: $spacing-md;

  &__title {
    font-size: $font-size-lg;
  }  // 编译为 .news-card__title

  &__title--large {
    font-size: $font-size-xl;
  }  // 编译为 .news-card__title--large

  &__content {
    margin: $spacing-sm 0;
  }  // 编译为 .news-card__content
}

// ❌ 避免：过度拼接的类名
.news-card-header-title-text-wrapper { }
```

### 命名优化原则

1. **块名简洁明确**：使用 2-3 个单词，如 `news-card` 而非 `news-information-card`
2. **元素名单一职责**：`__title`、`__content` 而非 `__title-text-content`
3. **修饰符语义化**：`--large`、`--primary` 而非 `--state-1`
4. **避免深层嵌套**：最多 `block__element--modifier`，不要 `block__element__sub-element`

---

## 样式冲突避免策略

样式冲突是多人协作中常见问题，使用以下方法可以有效预防。

### 方案 1: 使用 scoped 样式

Vue 单文件组件的 `scoped` 属性会为样式添加唯一的 data 属性，确保样式仅作用于当前组件。

```vue
<!-- ✅ 推荐：使用 scoped -->
<template>
  <div class="title">新闻标题</div>
</template>

<style scoped lang="scss">
.title {
  color: $color-text-primary;  // 仅影响当前组件
  font-size: $font-size-lg;
}
</style>
```

**注意事项**：
- `scoped` 样式不影响子组件根元素
- 修改子组件样式需使用 `:deep()` 选择器
- 全局样式需在单独文件中定义

### 方案 2: 使用 BEM 命名规范

BEM 通过命名约定自然避免冲突，无需依赖工具。

```vue
<!-- ✅ 推荐：BEM 命名 -->
<template>
  <div class="news-card">
    <h3 class="news-card__title">新闻标题</h3>
    <p class="news-card__content">内容...</p>
  </div>
</template>

<style lang="scss">
.news-card {
  &__title {
    color: $color-text-primary;
  }  // .news-card__title 不会与其他组件冲突

  &__content {
    color: $color-text-regular;
  }
}
</style>
```

### 方案 3: 组合使用

在大型项目中，结合 `scoped` 和 BEM 可以获得最佳效果：

```vue
<style scoped lang="scss">
// scoped 提供基础隔离
// BEM 提供语义化和可维护性
.news-card {
  &__title { }
  &__content { }
}
</style>
```

---

## 样式重复处理

多个组件使用相同的颜色、间距、阴影等样式时，应该抽取到变量或 Mixin 中复用。

### 常见问题

在开发过程中，容易在每个组件中重复定义相同的样式值：

```scss
// ❌ 避免：在每个组件中重复定义
.card-1 {
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-2 {
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

这样的做法会导致：
- **维护困难**：修改样式需要更新多处
- **不一致风险**：容易出现微小差异
- **代码冗余**：增加文件体积

### 解决方案 1：使用变量

将常用的数值抽取到 `variables.scss` 中：

```scss
// assets/styles/variables.scss
$spacing-md: 20px;
$shadow-base: 0 2px 8px rgba(0, 0, 0, 0.1);

// 组件中使用
.card-1 {
  padding: $spacing-md;
  box-shadow: $shadow-base;
}

.card-2 {
  padding: $spacing-md;
  box-shadow: $shadow-base;
}
```

**适用场景**：单个样式属性的复用

### 解决方案 2：使用 Mixin

将整组样式封装为 Mixin：

```scss
// assets/styles/mixins.scss
@mixin card-base {
  padding: $spacing-md;
  box-shadow: $shadow-base;
  border-radius: $border-radius-base;
}

// 组件中使用
.card-1 {
  @include card-base;
}

.card-2 {
  @include card-base;
  background: $color-bg-secondary;  // 可添加额外样式
}
```

**适用场景**：多个样式属性组合的复用

---

## UI 库样式统一覆盖

在多个组件中分散覆盖 UI 库样式会导致样式不一致和维护困难。

### 常见问题

```scss
// ❌ 避免：在各个组件中分散覆盖
// ComponentA.vue
<style scoped lang="scss">
.el-button {
  border-radius: 4px;
}
</style>

// ComponentB.vue
<style scoped lang="scss">
.el-button {
  border-radius: 8px;  // 不一致！
}
</style>
```

这样会导致：
- **样式不一致**：不同组件中同一组件表现不同
- **难以维护**：需要修改时要找到所有覆盖位置
- **优先级混乱**：scoped 样式可能无法正确覆盖

### 推荐做法：统一覆盖文件

创建 `element-override.scss` 统一管理所有 UI 库样式覆盖：

```scss
// assets/styles/element-override.scss
@import './variables.scss';

.el-button {
  border-radius: $border-radius-base;  // 全局统一
  font-weight: $font-weight-medium;
}

.el-card {
  border-radius: $border-radius-lg;
  box-shadow: $shadow-base;
}

.el-input__inner {
  font-size: $font-size-base;

  &:focus {
    border-color: $color-primary;
  }
}
```

在 `nuxt.config.ts` 中全局引入：

```typescript
export default defineNuxtConfig({
  css: [
    '@/assets/styles/element-override.scss'
  ]
})
```

**优势**：
- 所有覆盖集中管理，易于维护
- 确保全局样式一致性
- 避免优先级冲突问题

---

**版本**: 1.1.0
**最后更新**: 2025-12-23
**维护者**: AI-DEV-CONFIG Team