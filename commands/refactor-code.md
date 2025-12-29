# 代码重构助手

> Vue 3 + Nuxt 3 项目代码重构专家，优化代码质量和可维护性

## 使用方式

在 Claude Code 中通过斜杠命令调用：

```bash
/refactor-code                           # 交互式重构
/refactor-code pages/news/index.vue    # 重构指定文件
/refactor-code components/              # 重构整个目录
```

---

## 核心规范

### 1. 样式管理
- **变量**: 颜色/字体/间距 → `assets/styles/variables.scss`
- **Mixins**: 复用样式 → `assets/styles/mixins.scss`
- **命名**: 严格使用 BEM（Block__Element--Modifier）
- **作用域**: 组件样式必须 `<style scoped lang="scss">`

### 2. 组件封装
**抽离标准**（满足任一即抽离）：
- 多页面复用
- 代码超过 100 行
- 逻辑独立且可维护性高

**目录结构**：
```
components/
├── common/      # 通用组件（按钮、卡片、标签）
├── layout/      # 布局组件（头部、页脚、侧边栏）
├── business/    # 业务组件（资讯卡片、论文卡片）
└── form/        # 表单组件（搜索框、筛选器）
```

**原则**：
- 优先使用 Element Plus 基础组件
- 组件命名使用 PascalCase

### 3. 代码质量
- **文件行数**: 单文件 ≤500 行
- **函数长度**: 单函数 ≤50 行
- **TypeScript**:
  - Props/Emits 必须定义类型
  - 函数参数/返回值必须标注类型
  - 禁止 `any`（特殊情况需注释）
- **代码复用**: 重复 >3 次必须抽离
- **UI 还原**: 重构后必须 100% 视觉一致

### 4. 逻辑抽离
- **Composables** (`composables/`): 可复用业务逻辑
  - 数据获取: `useFetchNews.ts`, `useFetchPapers.ts`
  - 状态管理: `useSearchState.ts`, `useFilterState.ts`
- **Utils** (`utils/`): 纯函数工具
  - `formatDate.ts`, `stringUtils.ts`, `dataTransform.ts`
- **Types** (`types/`): 类型定义
  - `api.ts`, `news.ts`, `paper.ts`, `components.ts`

## 重构流程

### 1. 分析代码
- 读取目标文件
- 识别问题：文件过大？重复样式？可复用组件？缺少类型？
- 列出重构清单

### 2. 执行重构
**样式**：
1. 抽离颜色/字体/间距 → variables
2. 封装复用样式模式 → mixins
3. 重命名 CSS 类为 BEM 规范

**组件**：
1. 识别可复用 UI 结构
2. 创建组件到 `components/` 对应目录
3. 定义 TypeScript 接口
4. 移动样式（scoped）

**逻辑**：
1. 抽离业务逻辑 → composables
2. 抽离纯函数 → utils
3. 抽离类型 → types

**优化**：
1. 拆分复杂函数
2. 移除未使用代码
3. 优化性能（computed/memo）

### 3. 质量检查
**必须按顺序执行**：
```bash
pnpm lint:fix        # 1. 立即执行，自动修复格式问题
pnpm type-check      # 2. 检查 TypeScript 类型错误
```
- 手动验证 UI 100% 还原
- 测试所有功能（交互、路由、数据）

## 快速示例

**样式抽离**：
```scss
// 重复值 → variables.scss
$spacing-md: 20px;
$color-primary: #333;
$shadow-base: 0 2px 8px rgba(0, 0, 0, 0.1);

// 重复模式 → mixins.scss
@mixin card-base {
  padding: $spacing-md;
  background: #fff;
  border-radius: 8px;
  box-shadow: $shadow-base;
}

// 使用
.news-card {
  @include card-base;
}
```

**组件抽离**：
```vue
<!-- components/business/NewsCard.vue -->
<script setup lang="ts">
interface Props {
  news: NewsItem
}
defineProps<Props>()
const emit = defineEmits<{ click: [id: string] }>()
</script>
```

**逻辑抽离**：
```ts
// composables/useFetchNews.ts
export function useFetchNews() {
  const newsList = ref<NewsItem[]>([])
  const loading = ref(false)

  async function fetchNews() { /* ... */ }

  return { newsList, loading, fetchNews }
}

// 页面使用
const { newsList, loading, fetchNews } = useFetchNews()
```

## 常见场景/

| 问题 | 解决方案 |
|-----|---------|
| 文件 >500 行 | 抽离组件 + composables + 样式 |
| 样式重复 | SCSS 变量 + mixins + BEM |
| 逻辑重复 | composables + utils |
| 缺少类型 | 添加接口 + 抽离到 types/ |
| Element Plus 样式乱 | 统一在 `element-override.scss` 覆盖 |

## 执行命令

调用 `/refactor-code` 时：
1. 询问重构目标（文件/目录）和重构类型
2. 分析代码，识别重构点
3. 创建 Todo List
4. 逐步执行，标记完成状态
5. 运行 lint + type-check
6. 验证 UI 和功能
7. 总结重构内容和改进点

## 完整重构示例

### 重构前（600行，样式重复，逻辑混乱）

```vue
<!-- pages/news/index.vue - 重构前 -->
<template>
  <div class="news-page">
    <div class="search-box">
      <input v-model="keyword">
      <button @click="search">
        搜索
      </button>
    </div>
    <div class="list">
      <div v-for="item in list" class="item">
        <div class="title">
          {{ item.title }}
        </div>
        <div class="date">
          {{ formatDate(item.date) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const keyword = ref('')
const list = ref([])

// 格式化日期（重复代码）
function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

async function search() { /* 复杂逻辑 */ }
</script>

<style scoped>
.news-page {
  padding: 20px;
} /* 重复样式 */
.search-box {
  /* ... */
}
.item {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}
</style>
```

### 重构后（清晰、可维护、可复用）

```vue
<!-- pages/news/index.vue - 重构后 -->
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

```vue
<!-- components/form/SearchBar.vue - 新组件 -->
<script setup lang="ts">
interface Props {
  modelValue: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': []
}>()
</script>
```

```typescript
// composables/useFetchNews.ts - 抽离逻辑
export function useFetchNews() {
  const newsList = ref<NewsItem[]>([])
  const loading = ref(false)

  async function search() {
    loading.value = true
    try {
      const res = await $fetch('/api/news')
      newsList.value = res.data
    }
    finally {
      loading.value = false
    }
  }

  return { newsList, loading, search }
}
```

```scss
// assets/styles/mixins.scss - 抽离样式
@mixin page-container {
  padding: $spacing-lg;
  max-width: 1200px;
  margin: 0 auto;
}
```

### 重构效果对比

| 指标 | 重构前 | 重构后 | 改进 |
|------|--------|--------|------|
| 文件行数 | 600 行 | 40 行 | ↓ 93% |
| 可复用组件 | 0 个 | 2 个 | ✅ |
| 可复用逻辑 | 0 个 | 1 个 | ✅ |
| 代码重复 | 多处 | 无 | ✅ |
| 类型安全 | 部分 | 完整 | ✅ |
| 可维护性 | 低 | 高 | ✅ |

## 注意事项

- ✅ UI 必须 100% 还原
- ✅ 优先使用 Element Plus
- ✅ 单文件 ≤500 行
- ✅ 能复用的必须封装
- ✅ 抽离共用样式
- ⚠️ 不过度设计，保持简单
- ⚠️ 保持可读性

---

**最后更新**: 2025-12-12
**版本**: 1.1.0
