# 重构检查清单

> Vue 3/Nuxt 3 与 React/Next.js 项目代码重构流程与质量检查

---

## 目录

- [重构前准备](#重构前准备)
- [样式重构检查](#样式重构检查)
- [组件重构检查](#组件重构检查)
- [逻辑重构检查](#逻辑重构检查)
- [代码优化检查](#代码优化检查)
- [质量验证检查](#质量验证检查)
- [重构完成清单](#重构完成清单)

---

## 重构前准备

### 分析阶段

- [ ] **读取目标文件**：完整阅读并理解现有代码
- [ ] **识别问题类型**：
  - [ ] 文件超过 500 行？
  - [ ] 单函数超过 50 行？
  - [ ] 存在重复样式？
  - [ ] 存在可复用组件？
  - [ ] 缺少 TypeScript 类型？
  - [ ] 代码重复超过 3 次？
- [ ] **列出重构清单**：明确需要改进的具体项目

### 重构目标确认

- [ ] 确定重构范围（单文件/目录）
- [ ] 确定重构类型（样式/组件/逻辑/综合）
- [ ] 评估影响范围和风险

---

## 样式重构检查

### 变量抽离

- [ ] **颜色值** → `assets/styles/variables.scss`
  ```scss
  // 检查是否有硬编码的颜色值
  $color-primary: #409EFF;
  $color-text-primary: #303133;
  ```
- [ ] **间距值** → `assets/styles/variables.scss`
  ```scss
  $spacing-md: 16px;
  $spacing-lg: 24px;
  ```
- [ ] **字体大小** → `assets/styles/variables.scss`
  ```scss
  $font-size-base: 14px;
  $font-size-lg: 18px;
  ```
- [ ] **阴影效果** → `assets/styles/variables.scss`
  ```scss
  $shadow-base: 0 2px 8px rgba(0, 0, 0, 0.1);
  ```

### Mixin 封装

- [ ] **复用样式模式** → `assets/styles/mixins.scss`
  - [ ] 卡片基础样式 `@mixin card-base`
  - [ ] 文本溢出处理 `@mixin text-ellipsis`
  - [ ] Flex 布局 `@mixin flex-center`、`@mixin flex-between`
  - [ ] 页面容器 `@mixin page-container`

### BEM 命名规范

- [ ] **Block**: 独立组件名（如 `.news-card`）
- [ ] **Element**: 组件子元素（如 `.news-card__title`）
- [ ] **Modifier**: 状态变体（如 `.news-card--featured`）
- [ ] 避免过深嵌套（最多 `block__element--modifier`）
- [ ] 使用连字符连接单词，不用驼峰或下划线

### 样式作用域

- [ ] 组件样式使用 `<style scoped lang="scss">`
- [ ] 全局样式放在 `assets/styles/global.scss`
- [ ] UI 库覆盖放在 `assets/styles/element-override.scss`

---

## 组件重构检查

### 抽离标准（满足任一即抽离）

- [ ] 多页面/多处复用
- [ ] 代码超过 100 行
- [ ] 逻辑独立且可维护性高

### 组件目录分类

```
# Vue 项目
components/
├── common/      # 通用组件（按钮、卡片、标签）
├── layout/      # 布局组件（头部、页脚、侧边栏）
├── business/    # 业务组件（资讯卡片、论文卡片）
└── form/        # 表单组件（搜索框、筛选器）

# React 项目
src/
├── components/
│   ├── ui/          # 基础 UI 组件
│   ├── layout/      # 布局组件
│   └── features/    # 功能模块组件
├── hooks/           # 自定义 Hooks
└── lib/             # 工具函数
```

### 组件创建检查

- [ ] **文件命名**: PascalCase（如 `NewsCard.vue`、`NewsCard.tsx`）
- [ ] **Props 定义**: 使用 TypeScript 接口

  **Vue:**
  ```typescript
  interface Props {
    news: NewsItem
    loading?: boolean
  }
  defineProps<Props>()
  ```

  **React:**
  ```typescript
  interface NewsCardProps {
    news: NewsItem
    loading?: boolean
  }
  export function NewsCard({ news, loading }: NewsCardProps) { ... }
  ```
- [ ] **事件定义**: 明确事件类型

  **Vue:**
  ```typescript
  const emit = defineEmits<{
    click: [id: string]
    update: [value: number]
  }>()
  ```

  **React:**
  ```typescript
  interface Props {
    onClick?: (id: string) => void
    onUpdate?: (value: number) => void
  }
  ```
- [ ] **样式迁移**: 移动相关样式到新组件（scoped/modules）
- [ ] **优先使用 UI 库**: 基础组件不重复造轮子（Element Plus、shadcn/ui 等）

### 组件结构规范

- [ ] **Vue**: 导入顺序：Vue API → 组件 → Composables → Utils → Types
- [ ] **Vue**: 代码组织：Props/Emits → 状态 → 计算属性 → 方法 → 生命周期
- [ ] **React**: 导入顺序：React API → 组件 → Hooks → Utils → Types → Styles
- [ ] **React**: 代码组织：Hooks → Memoized values → Callbacks → Render

---

## 逻辑重构检查

### Composables / Hooks 抽离

**Vue 位置**: `composables/`
**React 位置**: `hooks/`

- [ ] **数据获取逻辑**

  **Vue:**
  ```typescript
  // composables/useFetchNews.ts
  export function useFetchNews() {
    const newsList = ref<NewsItem[]>([])
    const loading = ref(false)
    async function fetchNews() { /* ... */ }
    return { newsList, loading, fetchNews }
  }
  ```

  **React:**
  ```typescript
  // hooks/useFetchNews.ts
  export function useFetchNews() {
    const [newsList, setNewsList] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(false)
    const fetchNews = useCallback(async () => { /* ... */ }, [])
    return { newsList, loading, fetchNews }
  }
  ```
- [ ] **状态管理逻辑**

  **Vue:**
  ```typescript
  // composables/useSearchState.ts
  export function useSearchState() {
    const keyword = ref('')
    const filters = ref<FilterOptions>({})
    function reset() { /* ... */ }
    return { keyword, filters, reset }
  }
  ```

  **React:**
  ```typescript
  // hooks/useSearchState.ts
  export function useSearchState() {
    const [keyword, setKeyword] = useState('')
    const [filters, setFilters] = useState<FilterOptions>({})
    const reset = useCallback(() => { /* ... */ }, [])
    return { keyword, setKeyword, filters, setFilters, reset }
  }
  ```

### Utils 抽离

**位置**: `utils/`

- [ ] **纯函数工具**（无副作用、无状态）
  ```typescript
  // utils/formatDate.ts
  export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString()
  }
  ```
- [ ] **数据转换函数**
  ```typescript
  // utils/dataTransform.ts
  export function transformNewsData(raw: RawNews): NewsItem {
    return { /* ... */ }
  }
  ```

### Types 抽离

**位置**: `types/`

- [ ] **接口定义**
  ```typescript
  // types/news.ts
  export interface NewsItem {
    id: string
    title: string
    date: string
    content: string
  }
  ```
- [ ] **类型命名冲突**: 使用 `Type` 后缀
  ```typescript
  import AgentInfo from './AgentInfo.vue'
  import type { AgentInfoType } from '@/types/agent'
  ```

---

## 代码优化检查

### 函数优化

- [ ] 单函数不超过 50 行
- [ ] 复杂函数拆分为多个小函数
- [ ] 函数命名使用动词前缀（`get`、`set`、`handle`、`fetch`）

### 性能优化

**Vue:**
- [ ] 使用 `computed` 替代方法调用（缓存计算结果）
- [ ] 使用 `v-memo` 优化列表渲染
- [ ] 避免不必要的响应式数据

**React:**
- [ ] 使用 `useMemo` 缓存计算结果
- [ ] 使用 `useCallback` 缓存回调函数
- [ ] 使用 `React.memo` 优化组件重渲染
- [ ] 避免在渲染中创建新对象/数组

### 代码清理

- [ ] 移除未使用的变量和函数
- [ ] 移除注释掉的代码
- [ ] 移除调试用的 `console.log`

### TypeScript 规范

- [ ] Props/Emits 必须定义类型
- [ ] 函数参数/返回值必须标注类型
- [ ] 禁止使用 `any`（特殊情况需注释说明）
- [ ] 优先使用内置类型：`Record`、`Partial`、`Pick`、`Omit`

---

## 质量验证检查

### 自动化检查（必须按顺序执行）

```bash
# 1. 自动修复代码格式
pnpm lint:fix

# 2. 检查 TypeScript 类型错误
pnpm type-check

# 3. 运行测试（如果有）
pnpm test
```

### 手动验证

- [ ] **UI 100% 还原**：视觉效果与重构前完全一致
- [ ] **功能完整性**：
  - [ ] 所有交互正常工作
  - [ ] 路由跳转正确
  - [ ] 数据获取和展示正常
  - [ ] 表单提交和验证正常
- [ ] **边界情况**：
  - [ ] 空数据状态
  - [ ] 加载状态
  - [ ] 错误状态

---

## 重构完成清单

### 代码质量

- [ ] 单文件 ≤ 500 行
- [ ] 单函数 ≤ 50 行
- [ ] 代码复用：重复 > 3 次的已抽离
- [ ] 无 `any` 类型（或有注释说明）
- [ ] 无未使用的代码

### 样式规范

- [ ] 硬编码颜色/间距已抽离为变量
- [ ] 重复样式模式已封装为 Mixin
- [ ] CSS 类名符合 BEM 规范
- [ ] 组件样式使用 scoped

### 组件规范

- [ ] 可复用 UI 已抽离为组件
- [ ] 组件放置在正确的目录
- [ ] Props/Emits 类型完整
- [ ] 组件结构符合规范

### 逻辑规范

- [ ] 业务逻辑已抽离到 Composables
- [ ] 纯函数已抽离到 Utils
- [ ] 类型定义已抽离到 Types

### 验证通过

- [ ] `pnpm lint:fix` 无错误
- [ ] `pnpm type-check` 无错误
- [ ] UI 100% 还原
- [ ] 所有功能正常

---

## 常见场景速查

| 问题 | 解决方案 |
|-----|----------|
| 文件 > 500 行 | 抽离组件 + composables + 样式 |
| 样式重复 | SCSS 变量 + mixins + BEM |
| 逻辑重复 | composables + utils |
| 缺少类型 | 添加接口 + 抽离到 types/ |
| Element Plus 样式乱 | 统一在 `element-override.scss` 覆盖 |
| 函数过长 | 拆分为多个小函数 |
| 命名冲突 | 类型使用 Type 后缀，变量使用描述性前缀 |

---

## 重构示例

### 重构前

```vue
<!-- pages/news/index.vue - 600行，样式重复，逻辑混乱 -->
<template>
  <div class="news-page">
    <div class="search-box">
      <input v-model="keyword">
      <button @click="search">搜索</button>
    </div>
    <div class="list">
      <div v-for="item in list" class="item">
        <div class="title">{{ item.title }}</div>
        <div class="date">{{ formatDate(item.date) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const keyword = ref('')
const list = ref([])

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

async function search() { /* 复杂逻辑 */ }
</script>

<style scoped>
.news-page { padding: 20px; }
.item {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}
</style>
```

### 重构后

```vue
<!-- pages/news/index.vue - 清晰、可维护、可复用 -->
<template>
  <div class="news-page">
    <SearchBar v-model="keyword" @search="handleSearch" />
    <NewsList :items="newsList" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import SearchBar from '@/components/form/SearchBar.vue'
import NewsList from '@/components/business/NewsList.vue'
import { useFetchNews } from '@/composables/useFetchNews'

const keyword = ref('')
const { newsList, loading, search: handleSearch } = useFetchNews()
</script>

<style scoped lang="scss">
.news-page {
  @include page-container;
}
</style>
```

---

**版本**: 2.0.0
**最后更新**: 2026-01-13
**维护者**: AI-DEV-CONFIG Team
**主要更新**:
- 新增 React/Next.js 重构指南
- 更新组件目录结构支持多框架
- 添加 React Hooks 示例
- 添加 React 性能优化检查项
