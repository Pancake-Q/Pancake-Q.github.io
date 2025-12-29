# Vue 3 + Nuxt 3 开发指南

> Vue 3 Composition API + Nuxt 3 SSR 完整开发规范

---

## 目录

- [组件结构规范](#组件结构规范)
- [Composables 使用](#composables-使用)
- [状态管理](#状态管理)
- [路由配置](#路由配置)
- [SSR 最佳实践](#ssr-最佳实践)
- [性能优化](#性能优化)
- [常见问题](#常见问题)

---

## 组件结构规范

### 标准组件结构

```vue
<template>
  <div class="component-name">
    <!-- 模板内容 -->
  </div>
</template>

<script setup lang="ts">
// === 1. 导入依赖 ===
import { ref, computed, onMounted } from 'vue'
import type { User } from '@/types'

// === 2. Props 定义 ===
interface Props {
  user: User
  title?: string
  count?: number
}
const props = withDefaults(defineProps<Props>(), {
  title: '默认标题',
  count: 0
})

// === 3. Emits 定义 ===
const emit = defineEmits<{
  update: [value: number]
  delete: [id: string]
}>()

// === 4. 响应式状态 ===
const isLoading = ref(false)
const items = ref<Item[]>([])

// === 5. 计算属性 ===
const displayName = computed(() => {
  return `${props.user.firstName} ${props.user.lastName}`
})

// === 6. 方法 ===
function handleClick() {
  emit('update', props.count + 1)
}

async function fetchData() {
  isLoading.value = true
  try {
    const data = await $fetch('/api/data')
    items.value = data
  } finally {
    isLoading.value = false
  }
}

// === 7. 生命周期钩子 ===
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.component-name {
  @include card-base;

  &__title {
    color: $color-primary;
  }
}
</style>
```

### Props 最佳实践

```typescript
// ✅ 推荐：使用 TypeScript 接口 + withDefaults
interface Props {
  // 必需属性
  user: User
  // 可选属性
  title?: string
  count?: number
  // 联合类型
  status?: 'pending' | 'success' | 'error'
}
const props = withDefaults(defineProps<Props>(), {
  title: '默认标题',
  count: 0,
  status: 'pending'
})

// ❌ 避免：运行时声明（失去类型推导）
const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true
  },
  title: {
    type: String,
    default: '默认标题'
  }
})
```

### Emits 最佳实践

```typescript
// ✅ 推荐：使用 TypeScript 类型定义
const emit = defineEmits<{
  // 事件名: [参数类型]
  update: [value: number]
  delete: [id: string]
  submit: [data: FormData]
  change: [field: string, value: any]
}>()

// 调用
emit('update', 123)
emit('delete', 'user-id')

// ❌ 避免：运行时声明
const emit = defineEmits(['update', 'delete'])
```

---

## Composables 使用

### 创建 Composable

```typescript
// composables/useFetchNews.ts
export function useFetchNews() {
  const newsList = ref<NewsItem[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchNews(params?: NewsParams) {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/news', { params })
      newsList.value = data
    } catch (e) {
      error.value = e as Error
      console.error('Failed to fetch news:', e)
    } finally {
      loading.value = false
    }
  }

  // 自动执行
  onMounted(() => {
    fetchNews()
  })

  return {
    newsList: readonly(newsList),
    loading: readonly(loading),
    error: readonly(error),
    fetchNews
  }
}
```

### 使用 Composable

```vue
<script setup lang="ts">
import { useFetchNews } from '@/composables/useFetchNews'

const { newsList, loading, error, fetchNews } = useFetchNews()

function handleRefresh() {
  fetchNews({ page: 1 })
}
</script>
```

### Composable 命名规范

```typescript
// ✅ 推荐命名
useFetchNews()      // 数据获取
useSearchState()    // 状态管理
useAuth()           // 认证逻辑
useDebounce()       // 工具函数
useLocalStorage()   // 浏览器 API

// ❌ 避免命名
getNews()           // 不以 use 开头
fetchNewsComposable() // 不要加 Composable 后缀
```

---

## 状态管理

### 1. 组件内状态（简单场景）

```vue
<script setup lang="ts">
// 单个组件使用
const count = ref(0)
const isOpen = ref(false)
</script>
```

### 2. Composable 共享状态（中等场景）

```typescript
// composables/useSearchState.ts
const keyword = ref('')
const filters = ref<Filters>({})

export function useSearchState() {
  function updateKeyword(value: string) {
    keyword.value = value
  }

  function updateFilters(newFilters: Partial<Filters>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function reset() {
    keyword.value = ''
    filters.value = {}
  }

  return {
    keyword: readonly(keyword),
    filters: readonly(filters),
    updateKeyword,
    updateFilters,
    reset
  }
}
```

### 3. Pinia 全局状态（复杂场景）

```typescript
// stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  // Actions
  async function login(credentials: Credentials) {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials
    })
    user.value = data.user
  }

  function logout() {
    user.value = null
  }

  return {
    user: readonly(user),
    isAuthenticated,
    login,
    logout
  }
})
```

使用 Pinia Store：

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const { user, isAuthenticated } = storeToRefs(userStore)

function handleLogout() {
  userStore.logout()
}
</script>
```

---

## 路由配置

### Nuxt 3 文件路由

```
pages/
├── index.vue              → /
├── about.vue              → /about
├── news/
│   ├── index.vue          → /news
│   └── [id].vue           → /news/:id
├── user/
│   ├── [id]/
│   │   ├── index.vue      → /user/:id
│   │   └── posts.vue      → /user/:id/posts
```

### 动态路由参数

```vue
<script setup lang="ts">
// pages/news/[id].vue
const route = useRoute()
const id = computed(() => route.params.id as string)

// 获取数据
const { data: news } = await useFetch(`/api/news/${id.value}`)
</script>
```

### 编程式导航

```vue
<script setup lang="ts">
const router = useRouter()

// 路由跳转
function goToNews(id: string) {
  router.push(`/news/${id}`)
}

// 带查询参数
function goToSearch() {
  router.push({
    path: '/search',
    query: { keyword: 'vue', page: '1' }
  })
}

// 返回上一页
function goBack() {
  router.back()
}
</script>
```

### 路由守卫

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()

  if (!userStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
```

使用中间件：

```vue
<script setup lang="ts">
// pages/dashboard.vue
definePageMeta({
  middleware: 'auth'
})
</script>
```

---

## SSR 最佳实践

### 数据获取

```vue
<script setup lang="ts">
// ✅ 推荐：使用 useFetch（SSR 友好）
const { data: news, pending } = await useFetch('/api/news')

// ✅ 推荐：使用 useAsyncData（自定义逻辑）
const { data: user } = await useAsyncData('user', () => {
  return $fetch(`/api/users/${userId}`)
})

// ❌ 避免：直接使用 $fetch（不会在服务端执行）
const news = ref([])
onMounted(async () => {
  news.value = await $fetch('/api/news') // 仅客户端执行
})
</script>
```

### 仅客户端执行

```vue
<template>
  <div>
    <ClientOnly>
      <!-- 仅在客户端渲染 -->
      <Chart :data="chartData" />
      <template #fallback>
        <div>加载中...</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
// 仅客户端执行
onMounted(() => {
  // 浏览器 API
  const width = window.innerWidth
  console.log('Client only:', width)
})

// 或使用 process.client
if (process.client) {
  console.log('Running on client')
}
</script>
```

### Head 管理（SEO）

```vue
<script setup lang="ts">
// 设置页面 meta
useHead({
  title: '新闻详情',
  meta: [
    { name: 'description', content: '这是新闻详情页面' },
    { property: 'og:title', content: '新闻标题' },
    { property: 'og:image', content: 'https://example.com/image.jpg' }
  ]
})

// 动态 meta
const news = ref({ title: '', description: '' })

useHead({
  title: () => news.value.title,
  meta: [
    { name: 'description', content: () => news.value.description }
  ]
})
</script>
```

---

## 性能优化

### 1. 懒加载组件

```vue
<script setup lang="ts">
// 懒加载重型组件
const HeavyChart = defineAsyncComponent(() =>
  import('@/components/HeavyChart.vue')
)
</script>

<template>
  <Suspense>
    <HeavyChart :data="chartData" />
    <template #fallback>
      <div>加载图表中...</div>
    </template>
  </Suspense>
</template>
```

### 2. 计算属性缓存

```vue
<script setup lang="ts">
// ✅ 推荐：使用 computed（有缓存）
const fullName = computed(() => {
  return `${user.firstName} ${user.lastName}`
})

// ❌ 避免：使用方法（无缓存）
function getFullName() {
  return `${user.firstName} ${user.lastName}`
}
</script>
```

### 3. v-memo 优化列表

```vue
<template>
  <div v-for="item in list" :key="item.id" v-memo="[item.id, item.status]">
    <!-- 仅当 id 或 status 变化时重新渲染 -->
    <NewsCard :news="item" />
  </div>
</template>
```

### 4. Keep-Alive 缓存组件

```vue
<template>
  <KeepAlive :max="10">
    <component :is="currentComponent" />
  </KeepAlive>
</template>
```

---

## 响应式数据选择

在 Vue 3 中，`ref` 和 `reactive` 都可以创建响应式数据，但它们有不同的使用场景。

### 优先使用 ref

`ref` 更加灵活，适用于所有类型的数据：

```typescript
// ✅ 推荐：使用 ref
const count = ref(0)
const user = ref<User>({ name: 'Alice', age: 25 })
const isLoading = ref(false)
```

### 谨慎使用 reactive

`reactive` 主要用于对象，但解构会失去响应性：

```typescript
// ⚠️ 解构问题
const state = reactive({ count: 0, name: 'Alice' })
const { count } = state // ❌ count 失去响应性

// ✅ 使用 toRefs 保持响应性
const { count, name } = toRefs(state)
```

**建议**：除非有特殊需求，否则统一使用 `ref` 可以避免很多问题。

---

## 数据获取最佳实践

在 Nuxt 3 中，数据获取需要考虑 SSR（服务端渲染）的兼容性。

### SSR 友好的数据获取

```typescript
// ✅ 使用 useFetch（自动处理 SSR）
const { data, pending, error } = await useFetch('/api/news')

// ✅ 使用 useAsyncData（自定义逻辑）
const { data } = await useAsyncData('news-list', () =>
  $fetch('/api/news', { params: { page: 1 } })
)
```

### 避免仅客户端的数据获取

```typescript
// ❌ 错误：仅在客户端执行
onMounted(async () => {
  const data = await $fetch('/api/data')  // SSR 时不会执行
})
```

这种方式会导致服务端渲染时没有数据，用户会看到闪烁。

---

## 内存泄漏预防

Vue 3 会自动清理大部分订阅，但某些情况需要手动处理。

### 自动清理的场景

```typescript
// ✅ Vue 自动清理
watch(count, (newVal) => {
  console.log('Count changed:', newVal)
})

// ✅ Vue 自动清理
const unsubscribe = store.subscribe(() => {
  console.log('Store changed')
})
```

### 需要手动清理的场景

```typescript
// ⚠️ 定时器需要手动清理
const timer = setInterval(() => {
  console.log('Tick')
}, 1000)

onUnmounted(() => {
  clearInterval(timer) // 必须清理
})

// ⚠️ 第三方库订阅需要手动清理
const subscription = someLibrary.subscribe(callback)

onUnmounted(() => {
  subscription.unsubscribe()
})
```

**规则**：使用 `setInterval`、`setTimeout`、WebSocket、第三方库订阅时，务必在 `onUnmounted` 中清理。

---

## 组件导入问题

在 Vue 3 的 `<script setup>` 中，导入的组件会自动注册，但必须先导入。

### 常见错误

```vue
<template>
  <div class="page">
    <!-- ❌ 组件不显示 -->
    <user-card :user="user" />
  </div>
</template>

<script setup lang="ts">
// ❌ 忘记导入组件
const user = ref({ name: 'Alice' })
</script>
```

### 正确做法

```vue
<script setup lang="ts">
// ✅ 导入组件（自动注册）
import UserCard from '@/components/UserCard.vue'
const user = ref({ name: 'Alice' })
</script>
```

**提示**：如果组件不显示，首先检查是否忘记导入。

---

## 命名冲突解决

在项目中经常遇到组件名、类型名、变量名之间的冲突。

### 组件与类型冲突

```typescript
// ❌ 命名冲突
import AgentInfo from './AgentInfo.vue'
import type { AgentInfo } from '@/types/newsAgent'  // 错误！

// ✅ 类型添加 Type 后缀
import AgentInfo from './AgentInfo.vue'
import type { AgentInfoType } from '@/types/newsAgent'

const currentAgentInfo = ref<AgentInfoType>({
  id: 'news',
  agentName: '安全资讯智能体',
  version: '1.0'
})
```

### 变量与组件冲突

```typescript
// ❌ 容易混淆
import AgentInfo from './AgentInfo.vue'
const agentInfo = ref({ ... })  // 与组件名太相似

// ✅ 变量使用描述性前缀
import AgentInfo from './AgentInfo.vue'
const currentAgentInfo = ref({ ... })
const selectedAgentInfo = ref({ ... })
```

### 命名规范

- **组件名**：大驼峰，无后缀 (`AgentInfo`, `UserCard`)
- **类型名**：大驼峰 + `Type` 后缀 (`AgentInfoType`, `UserCardType`)
- **变量名**：小驼峰 + 描述性前缀 (`currentAgentInfo`, `selectedUser`)

---

## 组件拆分策略

单个组件超过 **500 行**时应该考虑拆分，以提高可维护性。

### 拆分原则

1. **按功能模块拆分**：头部、内容、底部各自独立
2. **抽离复用逻辑**：数据获取、状态管理等抽离到 composables
3. **保持单一职责**：每个组件只做一件事

### 拆分示例

```
原组件 (800 行)
├── MainComponent.vue (200 行)       # 主组件：组合子组件
├── components/
│   ├── Header.vue (100 行)          # 头部组件
│   ├── ContentList.vue (150 行)     # 内容列表
│   ├── FilterPanel.vue (120 行)     # 筛选面板
│   └── Pagination.vue (80 行)       # 分页组件
└── composables/
    ├── useDataFetch.ts (80 行)      # 数据获取逻辑
    └── useFilters.ts (70 行)        # 筛选逻辑
```

拆分后，每个文件职责清晰，更易于理解和维护。

---

**版本**: 1.1.0
**最后更新**: 2025-12-23
**维护者**: AI-DEV-CONFIG Team