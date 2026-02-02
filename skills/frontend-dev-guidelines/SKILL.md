---
name: frontend-dev-guidelines
description: 前端开发规范指南。涵盖 Vue 3/Nuxt 3、React/Next.js、TypeScript、Tailwind CSS/SCSS/CSS-in-JS 样式方案。适用于组件开发、代码重构、样式管理、类型定义。
---

# 前端开发规范指南

> 现代前端开发最佳实践 - Vue 3/Nuxt 3、React/Next.js、TypeScript、多种样式方案

---

## 📚 快速导航

| 主题 | 资源 | 说明 |
|------|------|------|
| 🎯 **Vue/Nuxt 开发** | [Vue 3 + Nuxt 3 指南](resources/vue-nuxt-guide.md) | 组件结构、Composables、路由、SSR |
| ⚛️ **React/Next.js 开发** | [React + Next.js 指南](resources/react-nextjs-guide.md) | 组件模式、Hooks、路由、数据获取 |
| 📘 **TypeScript 规范** | [TypeScript 规范](resources/typescript-guide.md) | 类型定义、内置类型、禁用规则 |
| 🎨 **样式管理** | [样式管理指南](resources/styling-guide.md) | SCSS 变量、Mixins、BEM 命名 |
| 🌊 **Tailwind CSS** | [Tailwind CSS 指南](resources/tailwind-guide.md) | 原子化样式、自定义配置 |
| 💅 **CSS-in-JS** | [CSS-in-JS 指南](resources/css-in-js-guide.md) | styled-components、Emotion |
| 🔄 **代码重构** | [重构检查清单](./resources/refactoring-checklist.md) | 重构流程、质量检查、最佳实践 |
| 📁 **代码组织** | [代码组织规范](resources/code-organization.md) | 目录结构、文件命名、组件抽离 |

---

## 🎯 核心原则

### 1. 保持简洁
- ❌ **避免过度设计**：只在必要时抽离
- ✅ **单文件 ≤500 行**：超过则拆分
- ✅ **单函数 ≤50 行**：复杂函数必须拆分
- ✅ **代码复用**：重复 >3 次必须抽离

### 2. 类型安全
- ✅ **强类型**：Props、事件、函数参数必须定义类型
- ❌ **禁止 `any`**：使用具体类型或 `unknown`
- ✅ **优先内置类型**：`Record`、`Partial`、`Pick`、`Omit`

### 3. API 稳定性
- ❌ **禁止弃用 API**：检查官方文档，避免 `@deprecated`
- ❌ **避免实验性 API**：不使用 `experimental` 或 `unstable`

### 4. 代码一致性
- ✅ **命名规范**：遵循统一的命名约定
- ✅ **结构规范**：统一的文件和代码结构
- ✅ **样式规范**：选择一种样式方案并坚持使用

---

## ⚡ 框架选择指南

### Vue 3 / Nuxt 3

**适用场景**：
- 团队熟悉 Vue 生态
- 需要渐进式采用
- 偏好 SFC（单文件组件）模式
- 中小型项目快速开发

**核心特性**：
- Composition API + `<script setup>`
- Composables 逻辑复用
- Pinia 状态管理
- Nuxt 3 SSR/SSG

### React / Next.js

**适用场景**：
- 团队熟悉 React 生态
- 需要高度灵活性
- 大型应用或复杂交互
- 丰富的社区资源

**核心特性**：
- Function Components + Hooks
- Server Components (Next.js 13+)
- App Router / Pages Router
- 丰富的状态管理选择

---

## ⚡ 快速参考

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数 | 小驼峰 + 动词前缀 | `firstName`, `getUserData()`, `handleClick()` |
| 常量 | 大写下划线 | `API_BASE_URL`, `MAX_RETRY_COUNT` |
| 类型/接口/组件 | 大驼峰 | `UserProfile`, `NewsItem`, `ApiResponse` |
| 组件文件 | 大驼峰 | `UserProfile.vue`, `NewsCard.tsx` |
| CSS 类 (BEM) | block__element--modifier | `.card__title--large` |
| CSS 类 (Tailwind) | 实用类组合 | `flex items-center gap-4` |
| 类型别名避免冲突 | Type 后缀 | `AgentInfoType`, `UserDataType` |

---

## 🔧 Vue 3 组件结构

```vue
<template>
  <div class="user-card">
    {{ displayName }}
  </div>
</template>

<script setup lang="ts">
// 1. 导入 - 顺序：Vue API → 组件 → Composables → Utils → Types
import { computed, ref, onMounted } from 'vue'
import UserAvatar from './UserAvatar.vue'
import { useUserData } from '@/composables/useUserData'
import { formatName } from '@/utils/formatters'
import type { UserType } from '@/types'

// 2. Props/Emits - 使用 Type 后缀避免与组件名冲突
interface Props {
  user: UserType
  count?: number
}
const props = withDefaults(defineProps<Props>(), { count: 0 })
const emit = defineEmits<{ update: [value: number] }>()

// 3. 状态
const isLoading = ref(false)

// 4. 计算属性
const displayName = computed(() => formatName(props.user.firstName, props.user.lastName))

// 5. 方法
function handleClick() {
  emit('update', props.count + 1)
}

// 6. 生命周期
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped lang="scss">
.user-card {
  @include card-base;

  &__title {
    color: $color-primary;
  }
}
</style>
```

---

## ⚛️ React 组件结构

```tsx
// UserCard.tsx
import { useState, useCallback, useMemo } from 'react'
import { UserAvatar } from './UserAvatar'
import { useUserData } from '@/hooks/useUserData'
import { formatName } from '@/utils/formatters'
import type { UserType } from '@/types'
import styles from './UserCard.module.css'

interface UserCardProps {
  user: UserType
  count?: number
  onUpdate?: (value: number) => void
}

export function UserCard({ user, count = 0, onUpdate }: UserCardProps) {
  // 1. Hooks
  const [isLoading, setIsLoading] = useState(false)
  const { userData } = useUserData(user.id)

  // 2. Memoized values
  const displayName = useMemo(
    () => formatName(user.firstName, user.lastName),
    [user.firstName, user.lastName]
  )

  // 3. Callbacks
  const handleClick = useCallback(() => {
    onUpdate?.(count + 1)
  }, [count, onUpdate])

  // 4. Render
  return (
    <div className={styles.userCard}>
      <UserAvatar user={user} />
      <span className={styles.title}>{displayName}</span>
      <button onClick={handleClick}>Update</button>
    </div>
  )
}
```

---

## 📘 TypeScript 规范

```typescript
// ✅ 优先使用 TS 内置类型
type UserMap = Record<string, User>        // 而非 { [key: string]: User }
type UserPartial = Partial<User>           // 而非手动添加 ?
type UserPick = Pick<User, 'id' | 'name'>  // 而非手动定义子接口
type UserOmit = Omit<User, 'age'>          // 而非手动排除属性

// ❌ 禁止使用 any
function process(data: any) { }            // 错误

// ✅ 使用具体类型或 unknown
function process(data: User) { }
function process(data: unknown) { }
```

---

## 🎨 样式方案对比

### SCSS + BEM

```scss
// assets/styles/variables.scss
$color-primary: #333;
$spacing-md: 20px;

// 组件中使用
.news-card {
  @include card-base;

  &__title {
    color: $color-primary;
    margin-bottom: $spacing-md;
  }

  &__title--large {
    font-size: 24px;
  }
}
```

### Tailwind CSS

```tsx
// 组件中使用
export function NewsCard({ title, featured }: NewsCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className={`text-gray-800 mb-4 ${featured ? 'text-2xl font-bold' : 'text-lg'}`}>
        {title}
      </h3>
    </div>
  )
}
```

### CSS-in-JS (styled-components)

```tsx
import styled from 'styled-components'

const Card = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const Title = styled.h3<{ $featured?: boolean }>`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.$featured ? '24px' : '16px'};
`

export function NewsCard({ title, featured }: NewsCardProps) {
  return (
    <Card>
      <Title $featured={featured}>{title}</Title>
    </Card>
  )
}
```

### CSS Modules

```tsx
// NewsCard.module.css
.card {
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.title {
  color: var(--color-primary);
}

.titleLarge {
  font-size: 24px;
}

// NewsCard.tsx
import styles from './NewsCard.module.css'

export function NewsCard({ title, featured }: NewsCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={`${styles.title} ${featured ? styles.titleLarge : ''}`}>
        {title}
      </h3>
    </div>
  )
}
```

---

## 🔍 代码质量检查

### 每次修改后必须执行

```bash
# 1. 自动修复代码格式（必须立即执行）
pnpm lint:fix

# 2. 检查 TypeScript 类型错误
pnpm type-check

# 3. 运行测试（如果有）
pnpm test
```

---

## 🛠️ 组件抽离标准

满足**任一条件**即抽离：
- ✅ 多页面复用
- ✅ 代码超过 100 行
- ✅ 逻辑独立且可维护性高

### 目录结构

```
components/
├── common/      # 通用组件（按钮、卡片、标签）
├── layout/      # 布局组件（头部、页脚、侧边栏）
├── business/    # 业务组件（资讯卡片、论文卡片）
└── form/        # 表单组件（搜索框、筛选器）

# Vue 项目
composables/     # 可复用业务逻辑
├── useFetchNews.ts
├── useSearchState.ts
└── useFilterState.ts

# React 项目
hooks/           # 自定义 Hooks
├── useFetchNews.ts
├── useSearchState.ts
└── useDebounce.ts

utils/           # 纯函数工具
├── formatDate.ts
├── stringUtils.ts
└── dataTransform.ts

types/           # 类型定义
├── api.ts
├── news.ts
├── paper.ts
└── components.ts
```

---

## 📋 重构流程

### 1. 分析代码
- 读取目标文件
- 识别问题：文件过大？重复样式？可复用组件？缺少类型？
- 列出重构清单

### 2. 执行重构

**样式**：
1. 抽离颜色/字体/间距 → 变量/主题
2. 封装复用样式模式 → mixins/组件
3. 统一命名规范

**组件**：
1. 识别可复用 UI 结构
2. 创建组件到 `components/` 对应目录
3. 定义 TypeScript 接口
4. 移动样式（scoped/modules）

**逻辑**：
1. 抽离业务逻辑 → `composables/` 或 `hooks/`
2. 抽离纯函数 → `utils/`
3. 抽离类型 → `types/`

### 3. 质量检查

```bash
pnpm lint:fix        # 自动修复格式问题
pnpm type-check      # 检查类型错误
```

- 手动验证 UI 100% 还原
- 测试所有功能（交互、路由、数据）

---

## 🔧 命名冲突解决方案

### 问题场景
在组件开发中,经常遇到组件名、类型名、变量名之间的命名冲突问题。

### 最佳实践

#### 1. 组件与类型冲突

```typescript
// ❌ 错误示例 - 组件名和类型名冲突
import AgentInfo from './AgentInfo.vue'
import type { AgentInfo } from '@/types/newsAgent'  // 命名冲突！

// ✅ 解决方案 - 类型添加 Type 后缀
import AgentInfo from './AgentInfo.vue'
import type { AgentInfoType } from '@/types/newsAgent'
```

#### 2. 变量与组件冲突

```typescript
// ❌ 错误示例 - 变量名和组件名冲突
import AgentInfo from './AgentInfo.vue'
const agentInfo = ref({ ... })  // 可能导致混淆

// ✅ 解决方案 - 变量使用描述性前缀
import AgentInfo from './AgentInfo.vue'
const currentAgentInfo = ref({ ... })
```

### 命名规则总结

| 场景 | 规则 | 示例 |
|------|------|------|
| 组件名 | 大驼峰，无后缀 | `AgentInfo`, `UserCard` |
| 类型名 | 大驼峰 + `Type` 后缀 | `AgentInfoType`, `UserCardType` |
| 变量名 | 小驼峰 + 描述性前缀 | `currentAgentInfo`, `selectedUser` |
| Props 变量 | 使用类型后缀的类型 | `agentInfo: AgentInfoType` |

---

## 🎓 最佳实践指南

最佳实践已按类别整理到对应的资源文档中：

### Vue/Nuxt 开发实践
👉 [Vue 3 + Nuxt 3 开发指南](resources/vue-nuxt-guide.md)
- 响应式数据选择、数据获取最佳实践
- 内存泄漏预防、组件导入问题
- 命名冲突解决、组件拆分策略

### React/Next.js 开发实践
👉 [React + Next.js 开发指南](resources/react-nextjs-guide.md)
- 组件设计模式、Hooks 最佳实践
- Server Components、数据获取策略
- 性能优化、错误边界

### TypeScript 类型实践
👉 [TypeScript 开发指南](resources/typescript-guide.md)
- Interface vs Type 选择
- 可选属性定义、JSON 数据处理
- 组件 Props 类型、类型定义组织

### 样式管理实践
👉 [样式管理指南](resources/styling-guide.md) - SCSS + BEM
👉 [Tailwind CSS 指南](resources/tailwind-guide.md) - 原子化样式
👉 [CSS-in-JS 指南](resources/css-in-js-guide.md) - styled-components/Emotion

### 通用解决方案

| 问题 | 快速解决方案 | 详细文档 |
|------|------------|---------｜
| 文件超过 500 行 | 拆分组件 + 抽离逻辑 + 抽离样式 | [代码组织](resources/code-organization.md) |
| 逻辑重复（>3 次） | 抽离到 `composables/`、`hooks/` 或 `utils/` | [代码组织](resources/code-organization.md) |
| 缺少类型定义 | 定义接口并抽离到 `types/` 目录 | [TypeScript指南](resources/typescript-guide.md) |

---

## 📖 详细文档

以下文档提供了各个领域的详细规范和最佳实践：

**框架开发**
- [Vue 3 + Nuxt 3 开发指南](resources/vue-nuxt-guide.md)
  - 组件结构规范、Props/Emits 最佳实践
  - Composables 使用、状态管理（Pinia）
  - 路由配置、SSR 最佳实践、性能优化
- [React + Next.js 开发指南](resources/react-nextjs-guide.md)
  - 函数组件、Hooks 最佳实践
  - Server Components、App Router
  - 状态管理、数据获取、性能优化

**TypeScript 规范**
- [TypeScript 规范](resources/typescript-guide.md)
  - 类型定义规范、内置工具类型
  - 禁止使用的类型、泛型使用
  - 函数类型定义、类型断言

**样式管理**
- [样式管理指南](resources/styling-guide.md)
  - SCSS 变量管理、Mixins 复用
  - BEM 命名规范、UI 库样式覆盖
- [Tailwind CSS 指南](resources/tailwind-guide.md)
  - 配置定制、实用类使用
  - 响应式设计、暗色模式
- [CSS-in-JS 指南](resources/css-in-js-guide.md)
  - styled-components、Emotion
  - 主题系统、动态样式

**代码重构**
- [重构检查清单](./resources/refactoring-checklist.md)
  - 重构前准备、执行流程
  - 质量检查、完成清单

**项目组织**
- [代码组织规范](resources/code-organization.md)
  - Vue/React 项目目录结构
  - 组件组织规范、文件命名规范
  - 代码分层架构、模块化原则

---

## 🚀 Git 提交规范

使用 Conventional Commits 格式：

```
<type>(<scope>): <subject>

类型：
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式（不影响功能）
- refactor: 重构
- perf: 性能优化
- test: 测试
- chore: 构建/工具

示例：
feat(auth): add login page
fix(user): resolve avatar display issue
refactor(news): extract NewsCard component
```

使用 `/commit` 命令自动生成符合规范的提交信息。

---

**版本**: 2.0.0
**最后更新**: 2026-01-13
**维护者**: AI-DEV-CONFIG Team
**主要更新**:
- 新增 React/Next.js 开发指南
- 新增 Tailwind CSS 样式指南
- 新增 CSS-in-JS 样式指南
- 重构文档结构，支持多框架
- 添加框架选择指南
- 优化样式方案对比
