# 代码组织规范

> 项目结构、目录组织、文件命名规范

---

## 目录

- [项目目录结构](#项目目录结构)
- [组件组织规范](#组件组织规范)
- [文件命名规范](#文件命名规范)
- [代码分层架构](#代码分层架构)
- [模块化原则](#模块化原则)

---

## 项目目录结构

### Nuxt 3 标准结构

```
aigc-ow/
├── .claude/                    # Claude Code 配置
│   ├── commands/              # 自定义命令
│   ├── agents/                # 自定义 agents
│   └── skills/                # 自定义 skills
├── .nuxt/                     # Nuxt 构建输出（忽略）
├── .output/                   # 生产构建输出（忽略）
├── assets/                    # 静态资源
│   ├── images/               # 图片资源
│   ├── fonts/                # 字体文件
│   └── styles/               # 全局样式
│       ├── variables.scss    # SCSS 变量
│       ├── mixins.scss       # SCSS Mixins
│       ├── global.scss       # 全局样式
│       └── element-override.scss  # UI 库覆盖
├── components/                # Vue 组件
│   ├── common/               # 通用组件
│   ├── layout/               # 布局组件
│   ├── business/             # 业务组件
│   └── form/                 # 表单组件
├── composables/               # 组合式函数（Vue 3）
│   ├── useFetchNews.ts       # 数据获取
│   ├── useAuth.ts            # 认证逻辑
│   └── useSearchState.ts     # 状态管理
├── layouts/                   # 布局模板
│   ├── default.vue           # 默认布局
│   └── admin.vue             # 管理后台布局
├── middleware/                # 路由中间件
│   ├── auth.ts               # 认证中间件
│   └── redirect.ts           # 重定向中间件
├── pages/                     # 页面（文件路由）
│   ├── index.vue             # 首页
│   ├── news/                 # 新闻模块
│   │   ├── index.vue         # 列表页
│   │   └── [id].vue          # 详情页
│   └── user/                 # 用户模块
│       ├── [id]/
│       │   ├── index.vue
│       │   └── posts.vue
├── plugins/                   # Nuxt 插件
│   ├── element-plus.ts       # Element Plus
│   └── api.ts                # API 封装
├── public/                    # 公共静态文件
│   ├── favicon.ico
│   └── robots.txt
├── server/                    # 服务端代码
│   ├── api/                  # API 路由
│   ├── middleware/           # 服务端中间件
│   └── utils/                # 服务端工具
├── stores/                    # Pinia 状态管理
│   ├── user.ts               # 用户状态
│   └── app.ts                # 应用状态
├── types/                     # TypeScript 类型定义
│   ├── api.ts                # API 类型
│   ├── news.ts               # 新闻类型
│   ├── user.ts               # 用户类型
│   └── components.ts         # 组件类型
├── utils/                     # 工具函数
│   ├── formatDate.ts         # 日期格式化
│   ├── stringUtils.ts        # 字符串工具
│   └── validators.ts         # 验证函数
├── .env                       # 环境变量
├── .gitignore
├── nuxt.config.ts            # Nuxt 配置
├── package.json
├── tsconfig.json             # TypeScript 配置
└── README.md
```

### React 项目结构（参考）

```
my-react-app/
├── public/
├── src/
│   ├── api/                  # API 封装
│   ├── assets/               # 静态资源
│   ├── components/           # 组件
│   │   ├── common/
│   │   ├── layout/
│   │   └── business/
│   ├── hooks/                # 自定义 Hooks
│   ├── pages/                # 页面
│   ├── routes/               # 路由配置
│   ├── store/                # Redux/Zustand
│   ├── styles/               # 样式
│   ├── types/                # 类型定义
│   ├── utils/                # 工具函数
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── tsconfig.json
```

---

## 组件组织规范

### 组件分类

#### 1. Common 组件（通用组件）

**特点**：
- 纯 UI 组件，无业务逻辑
- 高度可复用
- 跨项目使用

```
components/common/
├── Button/
│   ├── Button.vue
│   ├── types.ts           # 组件类型定义
│   └── index.ts           # 导出
├── Card/
│   ├── Card.vue
│   └── index.ts
├── Tag/
│   ├── Tag.vue
│   └── index.ts
├── Icon/
│   ├── Icon.vue
│   └── index.ts
└── Modal/
    ├── Modal.vue
    └── index.ts
```

**示例**：

```vue
<!-- components/common/Button/Button.vue -->
<script setup lang="ts">
import type { ButtonProps } from './types'

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'medium',
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
```

```typescript
// components/common/Button/types.ts
export interface ButtonProps {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'default'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}
```

```typescript
// components/common/Button/index.ts
export { default as Button } from './Button.vue'
export type * from './types'
```

#### 2. Layout 组件（布局组件）

**特点**：
- 页面布局结构
- 提供插槽（slots）
- 全局使用

```
components/layout/
├── Header/
│   ├── Header.vue
│   └── index.ts
├── Footer/
│   ├── Footer.vue
│   └── index.ts
├── Sidebar/
│   ├── Sidebar.vue
│   └── index.ts
└── PageContainer/
    ├── PageContainer.vue
    └── index.ts
```

#### 3. Business 组件（业务组件）

**特点**：
- 包含业务逻辑
- 项目特定
- 可能依赖 API

```
components/business/
├── NewsCard/
│   ├── NewsCard.vue
│   ├── types.ts
│   └── index.ts
├── PaperCard/
│   ├── PaperCard.vue
│   └── index.ts
├── UserProfile/
│   ├── UserProfile.vue
│   └── index.ts
└── CommentList/
    ├── CommentList.vue
    └── index.ts
```

#### 4. Form 组件（表单组件）

**特点**：
- 表单相关
- 支持 v-model
- 验证逻辑

```
components/form/
├── SearchBar/
│   ├── SearchBar.vue
│   └── index.ts
├── FilterPanel/
│   ├── FilterPanel.vue
│   └── index.ts
├── DatePicker/
│   ├── DatePicker.vue
│   └── index.ts
└── Upload/
    ├── Upload.vue
    └── index.ts
```

---

## 文件命名规范

### 组件文件命名

```
✅ 推荐：PascalCase（大驼峰）
NewsCard.vue
UserProfile.vue
SearchBar.vue

❌ 避免：kebab-case
news-card.vue
user-profile.vue

❌ 避免：缩写不清晰
NC.vue
UP.vue
```

### 工具函数文件命名

```
✅ 推荐：camelCase（小驼峰）
formatDate.ts
stringUtils.ts
validators.ts

❌ 避免：PascalCase
FormatDate.ts
StringUtils.ts
```

### 类型定义文件命名

```
✅ 推荐：camelCase 或 PascalCase
types/
├── api.ts
├── news.ts
├── user.ts
└── components.ts

或

types/
├── Api.ts
├── News.ts
├── User.ts
└── Components.ts
```

### 页面文件命名

```
✅ 推荐：kebab-case 或 camelCase
pages/
├── index.vue
├── about.vue
├── news/
│   ├── index.vue
│   └── [id].vue
```

---

## 代码分层架构

### 1. 页面层（Pages）

**职责**：
- 页面路由
- 布局组合
- 数据获取入口

```vue
<!-- pages/news/index.vue -->
<template>
  <div class="news-page">
    <SearchBar v-model="keyword" @search="handleSearch" />
    <NewsList :items="newsList" :loading="loading" />
    <Pagination v-model="page" :total="total" />
  </div>
</template>

<script setup lang="ts">
// 页面只负责组合组件和数据流转
import { useFetchNews } from '@/composables/useFetchNews'
import { useSearchState } from '@/composables/useSearchState'

const { keyword, updateKeyword } = useSearchState()
const { newsList, loading, total, page, fetchNews } = useFetchNews()

function handleSearch() {
  fetchNews({ keyword: keyword.value, page: 1 })
}
</script>
```

### 2. 组件层（Components）

**职责**：
- UI 展示
- 用户交互
- 事件触发

```vue
<!-- components/business/NewsList.vue -->
<template>
  <div class="news-list">
    <NewsCard
      v-for="item in items"
      :key="item.id"
      :news="item"
      @click="handleClick(item.id)"
    />
  </div>
</template>

<script setup lang="ts">
import type { NewsItem } from '@/types/news'

interface Props {
  items: NewsItem[]
  loading?: boolean
}
defineProps<Props>()

const emit = defineEmits<{
  click: [id: string]
}>()

function handleClick(id: string) {
  emit('click', id)
}
</script>
```

### 3. 逻辑层（Composables/Hooks）

**职责**：
- 业务逻辑
- 状态管理
- 副作用处理

```typescript
// composables/useFetchNews.ts
export function useFetchNews() {
  const newsList = ref<NewsItem[]>([])
  const loading = ref(false)
  const total = ref(0)
  const page = ref(1)

  async function fetchNews(params?: NewsParams) {
    loading.value = true
    try {
      const { data } = await $fetch('/api/news', { params })
      newsList.value = data.items
      total.value = data.total
    } catch (error) {
      console.error('Failed to fetch news:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    newsList: readonly(newsList),
    loading: readonly(loading),
    total: readonly(total),
    page,
    fetchNews
  }
}
```

### 4. 工具层（Utils）

**职责**：
- 纯函数
- 通用工具
- 无副作用

```typescript
// utils/formatDate.ts
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('zh-CN')
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('zh-CN')
}

export function isToday(date: string | Date): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  return d.toDateString() === today.toDateString()
}
```

### 5. 类型层（Types）

**职责**：
- TypeScript 类型定义
- 接口定义
- 枚举定义

```typescript
// types/news.ts
export interface NewsItem {
  id: string
  title: string
  content: string
  author: string
  category: NewsCategory
  createdAt: string
  updatedAt: string
}

export enum NewsCategory {
  Tech = 'tech',
  Business = 'business',
  Sports = 'sports'
}

export interface NewsListParams {
  page: number
  pageSize: number
  keyword?: string
  category?: NewsCategory
}

export interface NewsListResponse {
  items: NewsItem[]
  total: number
}
```

---

## 模块化原则

### 1. 单一职责原则

```typescript
// ❌ 错误：一个文件做太多事
// utils/helpers.ts
export function formatDate() { }
export function fetchUsers() { }
export function validateForm() { }

// ✅ 正确：拆分为多个文件
// utils/formatDate.ts
export function formatDate() { }

// utils/apiClient.ts
export function fetchUsers() { }

// utils/validators.ts
export function validateForm() { }
```

### 2. 依赖倒置原则

```typescript
// ✅ 推荐：依赖抽象（接口）
interface NewsRepository {
  fetchNews(params: NewsParams): Promise<NewsItem[]>
}

function useFetchNews(repository: NewsRepository) {
  // 使用接口，而非具体实现
}

// ❌ 避免：直接依赖具体实现
function useFetchNews() {
  const data = await $fetch('/api/news')  // 硬编码 API
}
```

### 3. 开闭原则

```typescript
// ✅ 推荐：通过扩展而非修改
interface Filter {
  apply(items: NewsItem[]): NewsItem[]
}

class KeywordFilter implements Filter {
  apply(items: NewsItem[]): NewsItem[] {
    // 实现过滤逻辑
  }
}

class DateFilter implements Filter {
  apply(items: NewsItem[]): NewsItem[] {
    // 实现过滤逻辑
  }
}

// 添加新过滤器，无需修改现有代码
```

---

## 最佳实践

### 1. 避免深层嵌套

```vue
❌ 错误：过深的目录结构
components/
└── business/
    └── news/
        └── card/
            └── header/
                └── title/
                    └── Title.vue

✅ 推荐：扁平化结构
components/
└── business/
    ├── NewsCard.vue
    ├── NewsCardHeader.vue
    └── NewsCardTitle.vue
```

### 2. 统一导入导出

```typescript
// components/common/index.ts
export { default as Button } from './Button/Button.vue'
export { default as Card } from './Card/Card.vue'
export { default as Tag } from './Tag/Tag.vue'

// 使用
import { Button, Card, Tag } from '@/components/common'
```

### 3. 配置路径别名

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  alias: {
    '@': '.',
    '~': '.',
    '@components': './components',
    '@utils': './utils',
    '@types': './types'
  }
})

// 使用
import { formatDate } from '@utils/formatDate'
import type { NewsItem } from '@types/news'
import { NewsCard } from '@components/business'
```

---

**版本**: 1.0.0
**最后更新**: 2025-12-22
**维护者**: AI-DEV-CONFIG Team