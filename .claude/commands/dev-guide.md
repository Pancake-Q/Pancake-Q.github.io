# 前端开发规范指南

> 前端开发专家，确保代码符合最佳实践和团队规范。适用于 Vue 3、Nuxt 3、React 项目。

## 使用方式

在 Claude Code 中通过斜杠命令调用：

```bash
/dev-guide                    # 查看完整开发规范
/dev-guide naming            # 查看命名规范
/dev-guide typescript        # 查看 TypeScript 规范
```

---

## 核心原则

1. **保持简洁**: 避免过度设计，只在必要时抽离
2. **类型安全**: TS 强类型，禁止 `any`，优先用内置类型
3. **API 稳定性**: 禁止使用弃用/实验性 API
4. **代码复用**: 重复 >3 次必须抽离
5. **一致性**: 遵循命名、结构、样式规范

## 快速参考

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数 | 小驼峰 + 动词前缀 | `firstName`, `getUserData()`, `handleClick()` |
| 常量 | 大写下划线 | `API_BASE_URL`, `MAX_RETRY_COUNT` |
| 类型/接口/组件 | 大驼峰 | `UserProfile`, `NewsItem`, `ApiResponse` |
| 组件文件 | 大驼峰 | `UserProfile.vue`, `NewsCard.tsx` |
| CSS 类 (BEM) | block__element--modifier | `.card__title--large` |

### TypeScript 规范

```typescript
// ✅ 优先使用 TS 内置类型
type UserMap = Record<string, User>           // 而非 { [key: string]: User }
type UserPartial = Partial<User>              // 而非手动添加 ?
type UserPick = Pick<User, 'id' | 'name'>     // 而非手动定义子接口
type UserOmit = Omit<User, 'age'>             // 而非手动排除属性

// ❌ 禁止使用 any
function process(data: any) { }               // 错误

// ✅ 使用具体类型或 unknown
function process(data: User) { }
function process(data: unknown) { }
```

### API 使用规范

**禁止使用弃用和实验性 API**：
- 检查官方文档，避免使用标记为 `@deprecated` 的 API
- 避免使用标记为 `experimental` 或 `unstable` 的 API
- 使用 ESLint 插件检测弃用 API（如 `eslint-plugin-deprecation`）

### Vue 3 核心规范

```vue
<script setup lang="ts">
// 1. 导入 → 2. Props/Emits → 3. 状态 → 4. 计算属性 → 5. 方法 → 6. 生命周期
interface Props { title: string; count?: number }
const props = withDefaults(defineProps<Props>(), { count: 0 })
const emit = defineEmits<{ update: [value: number] }>()
</script>

<template>
  <div class="user-card">{{ title }}</div>
</template>

<style scoped lang="scss">
.user-card { &__title { } }
</style>
```

### React 核心规范

```tsx
interface UserCardProps { user: User; onEdit?: (id: string) => void }

export default function UserCard({ user, onEdit }: UserCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const displayName = useMemo(() => `${user.firstName} ${user.lastName}`, [user])
  const handleClick = useCallback(() => onEdit?.(user.id), [user.id, onEdit])
  return <div className="user-card">{displayName}</div>
}
```

## 代码质量检查

### 每次修改后必须执行

```bash
# 1. 自动修复代码格式（必须立即执行）
pnpm lint:fix

# 2. 检查 TypeScript 类型错误
pnpm type-check

# 3. 运行测试（如果有）
pnpm test
```

### Git 提交规范（Conventional Commits）

```
<type>(<scope>): <subject>
feat/fix/docs/style/refactor/perf/test/chore

# 示例
feat(auth): add login page
fix(user): resolve avatar display issue
```

## 常见问题和解决方案

| 问题 | 解决方案 |
|------|---------|
| 文件超过 500 行 | 拆分组件 + 抽离 composables/hooks + 抽离样式 |
| 样式重复 | 抽离到 variables.scss 和 mixins.scss |
| 逻辑重复（>3 次） | 抽离到 composables/hooks 或 utils |
| 缺少类型定义 | 定义接口并抽离到 types/ 目录 |
| UI 库样式覆盖混乱 | 统一在 `styles/element-override.scss` 中覆盖 |
| 组件过于复杂 | 拆分为多个小组件 + 使用组合式逻辑 |

## 详细文档

完整的开发规范和最佳实践请参考：
- 📖 [完整开发规范指南](../../docs/DEV_GUIDE.md)

包含详细内容：
- 命名规范（变量、函数、组件、文件、CSS）
- TypeScript 规范（类型定义、内置类型、禁用规则）
- API 使用规范（弃用 API、实验性 API）
- Vue 3 开发规范（组件结构、状态管理、路由）
- React 开发规范（组件结构、Hooks 使用）
- 代码组织规范（目录结构、文件大小、组件抽离）
- 样式规范（SCSS 变量、Mixins、BEM 命名）
- 逻辑抽离规范（Composables、Hooks、Utils）
- 性能优化（懒加载、缓存优化）

---

**最后更新**: 2025-12-12
**版本**: 2.0.0
