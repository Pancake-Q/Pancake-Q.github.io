# TypeScript 规范指南

> TypeScript 类型安全最佳实践和禁用规则

---

## 目录

- [核心原则](#核心原则)
- [类型定义规范](#类型定义规范)
- [内置工具类型](#内置工具类型)
- [禁止使用的类型](#禁止使用的类型)
- [接口 vs 类型别名](#接口-vs-类型别名)
- [函数类型定义](#函数类型定义)
- [泛型使用](#泛型使用)
- [类型断言](#类型断言)
- [常见问题](#常见问题)

---

## 核心原则

### 1. 强类型优先

```typescript
// ✅ 推荐：明确类型
function getUserData(userId: string): Promise<User> {
  return fetch(`/api/users/${userId}`).then(res => res.json())
}

// ❌ 避免：隐式 any
function getUserData(userId) {  // 参数隐式 any
  return fetch(`/api/users/${userId}`).then(res => res.json())  // 返回值隐式 any
}
```

### 2. 禁止 any

```typescript
// ❌ 错误：使用 any
function process(data: any) {
  return data.value  // 无类型检查
}

// ✅ 推荐：使用具体类型
function process(data: User) {
  return data.name
}

// ✅ 推荐：使用 unknown（需要类型守卫）
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'name' in data) {
    return (data as { name: string }).name
  }
  throw new Error('Invalid data')
}

// ✅ 推荐：使用泛型
function process<T extends { name: string }>(data: T) {
  return data.name
}
```

### 3. 优先使用 TS 内置类型

```typescript
// ✅ 推荐：使用内置类型
type UserMap = Record<string, User>
type PartialUser = Partial<User>
type UserIdAndName = Pick<User, 'id' | 'name'>
type UserWithoutAge = Omit<User, 'age'>

// ❌ 避免：手动定义
type UserMap = { [key: string]: User }
type PartialUser = {
  id?: string
  name?: string
  email?: string
}
```

---

## 类型定义规范

### 基础类型定义

```typescript
// === 接口定义 ===
interface User {
  id: string
  name: string
  email: string
  age?: number                    // 可选属性
  readonly createdAt: Date        // 只读属性
}

// === 类型别名 ===
type UserId = string
type UserStatus = 'active' | 'inactive' | 'banned'  // 联合类型
type Point = { x: number; y: number }               // 对象类型

// === 枚举 ===
enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
  Guest = 'GUEST'
}

// ✅ 推荐：使用 const enum（编译后移除）
const enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500
}
```

### 复杂类型定义

```typescript
// === 嵌套对象 ===
interface UserProfile {
  user: {
    id: string
    name: string
  }
  settings: {
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

// === 数组类型 ===
type UserList = User[]                    // 推荐
type UserList = Array<User>               // 也可以

// === 元组 ===
type Coordinate = [number, number]        // [x, y]
type UserTuple = [string, number, boolean]  // [name, age, isActive]

// === 函数类型 ===
type GetUser = (id: string) => Promise<User>
type EventHandler = (event: Event) => void
```

---

## 内置工具类型

### Partial - 所有属性可选

```typescript
interface User {
  id: string
  name: string
  email: string
}

// ✅ 使用 Partial
type PartialUser = Partial<User>
// 等价于：
// {
//   id?: string
//   name?: string
//   email?: string
// }

// 使用场景：更新部分字段
function updateUser(userId: string, updates: Partial<User>) {
  // ...
}

updateUser('123', { name: 'New Name' })  // ✅ 只更新 name
```

### Required - 所有属性必需

```typescript
interface UserDraft {
  id?: string
  name?: string
  email?: string
}

// ✅ 使用 Required
type User = Required<UserDraft>
// 等价于：
// {
//   id: string
//   name: string
//   email: string
// }
```

### Pick - 选择部分属性

```typescript
interface User {
  id: string
  name: string
  email: string
  age: number
  address: string
}

// ✅ 使用 Pick
type UserPreview = Pick<User, 'id' | 'name'>
// 等价于：
// {
//   id: string
//   name: string
// }

// 使用场景：API 响应
function getUserPreview(id: string): Promise<UserPreview> {
  return fetch(`/api/users/${id}/preview`).then(res => res.json())
}
```

### Omit - 排除部分属性

```typescript
interface User {
  id: string
  name: string
  email: string
  password: string
}

// ✅ 使用 Omit
type SafeUser = Omit<User, 'password'>
// 等价于：
// {
//   id: string
//   name: string
//   email: string
// }

// 使用场景：返回给客户端的用户数据
function getUserProfile(id: string): Promise<SafeUser> {
  return fetch(`/api/users/${id}`).then(res => res.json())
}
```

### Record - 对象映射

```typescript
// ✅ 使用 Record
type UserMap = Record<string, User>
// 等价于：
// {
//   [key: string]: User
// }

type RolePermissions = Record<UserRole, string[]>
// {
//   [UserRole.Admin]: string[]
//   [UserRole.User]: string[]
//   [UserRole.Guest]: string[]
// }

// 使用场景
const permissions: RolePermissions = {
  [UserRole.Admin]: ['read', 'write', 'delete'],
  [UserRole.User]: ['read', 'write'],
  [UserRole.Guest]: ['read']
}
```

### Readonly - 只读

```typescript
interface User {
  id: string
  name: string
}

// ✅ 使用 Readonly
type ReadonlyUser = Readonly<User>
// 等价于：
// {
//   readonly id: string
//   readonly name: string
// }

// 使用场景：防止修改
function displayUser(user: Readonly<User>) {
  // user.name = 'New Name'  // ❌ 编译错误
  console.log(user.name)     // ✅ 只读
}
```

### ReturnType - 获取函数返回类型

```typescript
function getUser(id: string) {
  return {
    id,
    name: 'Alice',
    email: 'alice@example.com'
  }
}

// ✅ 使用 ReturnType
type User = ReturnType<typeof getUser>
// {
//   id: string
//   name: string
//   email: string
// }
```

### Awaited - 获取 Promise 返回类型

```typescript
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// ✅ 使用 Awaited
type User = Awaited<ReturnType<typeof fetchUser>>
```

---

## 禁止使用的类型

### 1. 禁止 any

```typescript
// ❌ 错误
function process(data: any) {
  return data.value
}

// ✅ 正确：使用具体类型
function process(data: User) {
  return data.name
}

// ✅ 正确：使用 unknown
function process(data: unknown) {
  if (isUser(data)) {
    return data.name
  }
}

// ✅ 正确：使用泛型
function process<T>(data: T) {
  return data
}
```

### 2. 谨慎使用 as（类型断言）

```typescript
// ❌ 避免：不安全的断言
const user = data as User  // 假设 data 是 User，但无法保证

// ✅ 推荐：使用类型守卫
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data
  )
}

if (isUser(data)) {
  console.log(data.name)  // ✅ 类型安全
}
```

### 3. 避免 object

```typescript
// ❌ 避免：过于宽泛
function process(data: object) {
  // data.name  // ❌ 错误：object 上没有 name
}

// ✅ 推荐：使用具体接口
interface Data {
  name: string
}

function process(data: Data) {
  console.log(data.name)  // ✅ 类型安全
}

// ✅ 推荐：使用 Record
function process(data: Record<string, unknown>) {
  if ('name' in data && typeof data.name === 'string') {
    console.log(data.name)
  }
}
```

---

## 接口 vs 类型别名

### 何时使用接口

```typescript
// ✅ 推荐：对象形状
interface User {
  id: string
  name: string
}

// ✅ 推荐：类继承
interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
}

// ✅ 推荐：声明合并
interface Window {
  myCustomProperty: string
}
```

### 何时使用类型别名

```typescript
// ✅ 推荐：联合类型
type Status = 'pending' | 'success' | 'error'

// ✅ 推荐：交叉类型
type UserWithRole = User & { role: string }

// ✅ 推荐：元组
type Point = [number, number]

// ✅ 推荐：映射类型
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

---

## 函数类型定义

### 函数声明

```typescript
// ✅ 完整类型定义
function add(a: number, b: number): number {
  return a + b
}

// ✅ 可选参数
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name
}

// ✅ 默认参数
function createUser(name: string, role: string = 'user'): User {
  return { id: '123', name, role }
}

// ✅ 剩余参数
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}
```

### 异步函数

```typescript
// ✅ Promise 返回类型
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// ✅ 处理错误
async function safelyFetchUser(id: string): Promise<User | null> {
  try {
    return await fetchUser(id)
  } catch (error) {
    console.error(error)
    return null
  }
}
```

### 函数类型

```typescript
// ✅ 类型别名
type MathOperation = (a: number, b: number) => number

const add: MathOperation = (a, b) => a + b
const subtract: MathOperation = (a, b) => a - b

// ✅ 接口
interface EventListener {
  (event: Event): void
}

const onClick: EventListener = (event) => {
  console.log('Clicked:', event.target)
}
```

---

## 泛型使用

### 基础泛型

```typescript
// ✅ 泛型函数
function identity<T>(value: T): T {
  return value
}

const num = identity(123)        // number
const str = identity('hello')    // string

// ✅ 泛型接口
interface Response<T> {
  data: T
  status: number
  message: string
}

const userResponse: Response<User> = {
  data: { id: '123', name: 'Alice' },
  status: 200,
  message: 'Success'
}
```

### 泛型约束

```typescript
// ✅ 约束泛型必须有特定属性
function getProperty<T extends { id: string }>(obj: T): string {
  return obj.id
}

getProperty({ id: '123', name: 'Alice' })  // ✅
// getProperty({ name: 'Bob' })             // ❌ 缺少 id

// ✅ 约束泛型为某个类型的子类型
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 }
}
```

### 实用泛型示例

```typescript
// ✅ API 响应包装
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url)
  return response.json()
}

// 使用
const userResponse = await fetchData<User>('/api/users/123')
const newsResponse = await fetchData<News[]>('/api/news')

// ✅ 分页数据
interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

const userList: PaginatedData<User> = {
  items: [{ id: '1', name: 'Alice' }],
  total: 100,
  page: 1,
  pageSize: 10
}
```

---

## 类型断言

### 安全的类型断言

```typescript
// ✅ 使用类型守卫
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof data.id === 'string' &&
    'name' in data &&
    typeof data.name === 'string'
  )
}

// 使用
const data: unknown = await fetchData()
if (isUser(data)) {
  console.log(data.name)  // ✅ 类型安全
}

// ❌ 不安全的断言
const user = data as User  // 假设 data 是 User，但可能不是
```

### as const 断言

```typescript
// ✅ 字面量类型
const colors = ['red', 'green', 'blue'] as const
type Color = typeof colors[number]  // 'red' | 'green' | 'blue'

// ✅ 只读对象
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
} as const

// config.apiUrl = 'https://new-api.com'  // ❌ 只读
```

---

## Interface vs Type 选择

TypeScript 提供了 `interface` 和 `type` 两种方式定义类型，它们有不同的使用场景。

### 使用 Interface

Interface 适合定义对象形状，支持扩展和声明合并：

```typescript
// ✅ 对象形状
interface User {
  id: string
  name: string
  email: string
}

// ✅ 扩展
interface AdminUser extends User {
  role: 'admin'
  permissions: string[]
}

// ✅ 声明合并
interface Window {
  myCustomProperty: string
}
```

### 使用 Type

Type 适合联合类型、交叉类型和映射类型：

```typescript
// ✅ 联合类型
type Status = 'pending' | 'success' | 'error'

// ✅ 交叉类型
type UserWithRole = User & { role: string }

// ✅ 映射类型
type ReadonlyUser = Readonly<User>

// ✅ 元组
type Point = [number, number]
```

**建议**：对象用 `interface`，联合/工具类型用 `type`。

---

## 可选属性定义

TypeScript 提供多种方式定义可选属性。

### 使用 ? 操作符

```typescript
interface User {
  id: string
  name: string
  email?: string      // 可选
  phone?: string      // 可选
}

// 使用
const user1: User = { id: '1', name: 'Alice' }  // ✅ email 可选
const user2: User = { id: '2', name: 'Bob', email: 'bob@example.com' }  // ✅
```

### 使用 Partial 工具类型

```typescript
// 将所有属性变为可选
type PartialUser = Partial<User>

// 等价于
type PartialUser = {
  id?: string
  name?: string
  email?: string
}

// 常用于更新操作
function updateUser(userId: string, updates: Partial<User>) {
  // ...
}
```

---

## JSON 数据处理

处理 JSON 数据时需要进行类型验证，而不是直接断言。

### 不安全的做法

```typescript
// ❌ 假设类型，不安全
const user = JSON.parse(jsonString) as User
```

### 安全的做法

```typescript
// ✅ 定义类型守卫
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof data.id === 'string' &&
    'name' in data &&
    typeof data.name === 'string'
  )
}

// ✅ 使用类型守卫验证
function parseUser(jsonString: string): User | null {
  try {
    const data = JSON.parse(jsonString)
    if (isUser(data)) {
      return data
    }
  } catch (error) {
    console.error('Invalid JSON:', error)
  }
  return null
}
```

---

## Vue 组件 Props 类型

在 Vue 3 中使用 TypeScript 定义 Props。

### 标准做法

```typescript
interface Props {
  user: UserType              // 必需
  title?: string              // 可选
  count?: number              // 可选
}

const props = withDefaults(defineProps<Props>(), {
  title: '默认标题',
  count: 0
})
```

### 避免命名冲突

```typescript
// ❌ Props 接口名可能与其他类型冲突
interface User {
  id: string
}

// ✅ 使用描述性名称
interface UserCardProps {
  user: UserType
  showAvatar?: boolean
}
```

---

## 命名冲突解决

在 Vue 项目中，组件名和类型名经常冲突。

### 组件与类型冲突

```typescript
// ❌ 命名冲突
import AgentInfo from './AgentInfo.vue'
import type { AgentInfo } from '@/types/newsAgent'  // 错误！

// ✅ 方案 1：类型添加 Type 后缀（推荐）
import AgentInfo from './AgentInfo.vue'
import type { AgentInfoType } from '@/types/newsAgent'

// ✅ 方案 2：使用 import 别名
import AgentInfo from './AgentInfo.vue'
import type { AgentInfo as IAgentInfo } from '@/types/newsAgent'
```

### 命名规范

- **组件名**：`AgentInfo`, `UserCard`（大驼峰，无后缀）
- **类型名**：`AgentInfoType`, `UserCardType`（大驼峰 + Type 后缀）
- **变量名**：`currentAgentInfo`, `selectedUser`（小驼峰 + 描述性前缀）

---

## 类型定义组织

类型定义应该集中管理，避免分散在各个组件中。

### 不推荐的做法

```typescript
// ❌ 每个组件都定义一次
// components/UserCard.vue
interface User {
  id: string
  name: string
}

// components/UserList.vue
interface User {  // 重复定义
  id: string
  name: string
}
```

### 推荐的做法

```typescript
// ✅ 统一在 types 目录定义
// types/user.ts
export interface UserType {
  id: string
  name: string
  email: string
}

export interface UserFormType {
  name: string
  email: string
}

export interface UserListItemType {
  id: string
  name: string
}

// components/UserCard.vue
import type { UserType } from '@/types/user'
```

### 推荐的目录结构

```
types/
├── api.ts           # API 响应类型
├── user.ts          # 用户相关类型
├── news.ts          # 新闻相关类型
├── newsAgent.ts     # 新闻智能体类型
└── components.ts    # 通用组件 Props 类型
```

**优点**：
- 类型复用性高
- 易于维护和更新
- 避免重复定义
- 类型导入路径清晰

---

**版本**: 1.1.0
**最后更新**: 2025-12-23
**维护者**: AI-DEV-CONFIG Team