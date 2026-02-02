# React + Next.js 开发指南

> React 18+ 和 Next.js 14+ 现代开发最佳实践

---

## 目录

- [组件结构规范](#组件结构规范)
- [Hooks 最佳实践](#hooks-最佳实践)
- [状态管理](#状态管理)
- [数据获取](#数据获取)
- [路由配置](#路由配置)
- [Server Components](#server-components)
- [性能优化](#性能优化)
- [错误处理](#错误处理)
- [常见问题](#常见问题)

---

## 组件结构规范

### 函数组件标准结构

```tsx
// UserCard.tsx
import { useState, useCallback, useMemo, useEffect } from 'react'
import { UserAvatar } from './UserAvatar'
import { useUserData } from '@/hooks/useUserData'
import { formatName } from '@/utils/formatters'
import type { UserType } from '@/types'
import styles from './UserCard.module.css'

// === 1. Props 接口定义 ===
interface UserCardProps {
  user: UserType
  count?: number
  onUpdate?: (value: number) => void
  className?: string
}

// === 2. 组件定义 ===
export function UserCard({
  user,
  count = 0,
  onUpdate,
  className,
}: UserCardProps) {
  // 3. Hooks（按顺序：useState → useRef → useContext → 自定义 hooks）
  const [isLoading, setIsLoading] = useState(false)
  const { userData, refetch } = useUserData(user.id)

  // 4. 派生状态（useMemo）
  const displayName = useMemo(
    () => formatName(user.firstName, user.lastName),
    [user.firstName, user.lastName]
  )

  // 5. 事件处理（useCallback）
  const handleClick = useCallback(() => {
    onUpdate?.(count + 1)
  }, [count, onUpdate])

  // 6. 副作用（useEffect）
  useEffect(() => {
    // 初始化逻辑
  }, [])

  // 7. 条件渲染逻辑
  if (isLoading) {
    return <div>Loading...</div>
  }

  // 8. 渲染
  return (
    <div className={`${styles.userCard} ${className ?? ''}`}>
      <UserAvatar user={user} />
      <span className={styles.title}>{displayName}</span>
      <button onClick={handleClick}>Update</button>
    </div>
  )
}
```

### 导入顺序规范

```tsx
// 1. React 核心
import { useState, useEffect, useCallback, useMemo } from 'react'

// 2. 第三方库
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'

// 3. 内部组件
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

// 4. Hooks
import { useAuth } from '@/hooks/useAuth'
import { useDebounce } from '@/hooks/useDebounce'

// 5. 工具函数
import { formatDate } from '@/utils/formatters'

// 6. 类型
import type { UserType, PostType } from '@/types'

// 7. 样式
import styles from './Component.module.css'
```

### Props 定义最佳实践

```tsx
// ✅ 推荐：使用 interface + 解构默认值
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// ✅ 继承原生元素属性
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="input-wrapper">
      {label && <label>{label}</label>}
      <input className={clsx('input', className)} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  )
}
```

---

## Hooks 最佳实践

### useState

```tsx
// ✅ 简单状态
const [count, setCount] = useState(0)
const [user, setUser] = useState<UserType | null>(null)

// ✅ 惰性初始化（避免重复计算）
const [data, setData] = useState(() => expensiveComputation())

// ✅ 函数式更新（基于前值更新）
setCount(prev => prev + 1)
setUser(prev => prev ? { ...prev, name: 'New Name' } : null)

// ❌ 避免：直接修改对象
setUser({ ...user, name: 'New Name' }) // user 可能是旧值
```

### useEffect

```tsx
// ✅ 正确的依赖数组
useEffect(() => {
  fetchUser(userId)
}, [userId]) // userId 变化时重新获取

// ✅ 清理副作用
useEffect(() => {
  const subscription = subscribe(callback)
  return () => subscription.unsubscribe()
}, [])

// ✅ 异步操作处理
useEffect(() => {
  let isMounted = true

  async function fetchData() {
    const result = await api.getData()
    if (isMounted) {
      setData(result)
    }
  }

  fetchData()
  return () => { isMounted = false }
}, [])

// ❌ 避免：在 effect 中直接使用 async
useEffect(async () => { // 错误！
  const data = await fetchData()
}, [])
```

### useMemo 和 useCallback

```tsx
// ✅ useMemo：缓存计算结果
const sortedItems = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items]
)

// ✅ useCallback：缓存函数引用
const handleSubmit = useCallback((data: FormData) => {
  onSubmit(data)
}, [onSubmit])

// ❌ 避免：不必要的 useMemo/useCallback
const doubled = useMemo(() => count * 2, [count]) // 简单计算不需要
const handleClick = useCallback(() => setOpen(true), []) // 无依赖的简单函数不需要
```

### useRef

```tsx
// ✅ DOM 引用
const inputRef = useRef<HTMLInputElement>(null)

function focusInput() {
  inputRef.current?.focus()
}

// ✅ 存储可变值（不触发重渲染）
const timerRef = useRef<NodeJS.Timeout | null>(null)

useEffect(() => {
  timerRef.current = setInterval(() => {
    console.log('tick')
  }, 1000)

  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }
}, [])
```

### 自定义 Hooks

```tsx
// hooks/useFetch.ts
import { useState, useEffect } from 'react'

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Fetch failed')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// 使用
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error } = useFetch<UserType>(`/api/users/${userId}`)

  if (loading) return <Spinner />
  if (error) return <Error message={error.message} />
  if (!user) return null

  return <div>{user.name}</div>
}
```

### useDebounce Hook

```tsx
// hooks/useDebounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// 使用
function SearchInput() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery)
    }
  }, [debouncedQuery])

  return <input value={query} onChange={e => setQuery(e.target.value)} />
}
```

---

## 状态管理

### 1. 组件内状态

```tsx
// 简单场景：useState
const [count, setCount] = useState(0)
const [isOpen, setIsOpen] = useState(false)
```

### 2. 组件间共享状态（Context）

```tsx
// context/AuthContext.tsx
import { createContext, useContext, useState, useCallback } from 'react'

interface AuthContextType {
  user: UserType | null
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null)

  const login = useCallback(async (credentials: Credentials) => {
    const userData = await api.login(credentials)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### 3. 全局状态（Zustand）

```tsx
// store/useUserStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UserState {
  user: UserType | null
  isLoading: boolean
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoading: false,

        login: async (credentials) => {
          set({ isLoading: true })
          try {
            const user = await api.login(credentials)
            set({ user, isLoading: false })
          } catch {
            set({ isLoading: false })
            throw new Error('Login failed')
          }
        },

        logout: () => {
          set({ user: null })
        },
      }),
      { name: 'user-store' }
    )
  )
)

// 使用
function UserProfile() {
  const { user, logout } = useUserStore()

  if (!user) return null

  return (
    <div>
      <span>{user.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### 4. 服务器状态（React Query / TanStack Query）

```tsx
// hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId),
    staleTime: 5 * 60 * 1000, // 5 分钟内不重新获取
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserData) => api.updateUser(data),
    onSuccess: (_, variables) => {
      // 更新缓存
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
    },
  })
}

// 使用
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useUser(userId)
  const updateUser = useUpdateUser()

  if (isLoading) return <Spinner />
  if (error) return <Error message={error.message} />

  return (
    <div>
      <span>{user.name}</span>
      <button onClick={() => updateUser.mutate({ id: userId, name: 'New Name' })}>
        Update
      </button>
    </div>
  )
}
```

---

## 数据获取

### Next.js App Router 数据获取

```tsx
// app/users/[id]/page.tsx
// Server Component（默认）
async function UserPage({ params }: { params: { id: string } }) {
  const user = await fetch(`https://api.example.com/users/${params.id}`).then(
    res => res.json()
  )

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}

export default UserPage
```

### 客户端数据获取

```tsx
'use client'

import { useQuery } from '@tanstack/react-query'

function UserPosts({ userId }: { userId: string }) {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetch(`/api/users/${userId}/posts`).then(res => res.json()),
  })

  if (isLoading) return <Spinner />

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### 数据获取策略对比

| 方式 | 场景 | 优点 | 缺点 |
|------|------|------|------|
| Server Component | SEO 重要、初始加载 | 更快的首屏、SEO 友好 | 无交互能力 |
| Client fetch | 用户交互后获取 | 可交互、动态更新 | 需要 loading 状态 |
| React Query | 缓存、轮询、乐观更新 | 强大的缓存管理 | 额外依赖 |
| SWR | 简单缓存需求 | 轻量、简单 API | 功能较少 |

---

## 路由配置

### Next.js App Router 结构

```
app/
├── layout.tsx              # 根布局
├── page.tsx                # 首页 /
├── about/
│   └── page.tsx            # /about
├── blog/
│   ├── page.tsx            # /blog
│   └── [slug]/
│       └── page.tsx        # /blog/:slug
├── users/
│   ├── page.tsx            # /users
│   └── [id]/
│       ├── page.tsx        # /users/:id
│       └── posts/
│           └── page.tsx    # /users/:id/posts
└── api/
    └── users/
        └── route.ts        # API: /api/users
```

### 动态路由

```tsx
// app/blog/[slug]/page.tsx
interface BlogPostPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug)

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}

// 静态生成
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}
```

### 客户端导航

```tsx
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 编程式导航
  function handleClick() {
    router.push('/dashboard')
  }

  function handleSearch(query: string) {
    const params = new URLSearchParams(searchParams)
    params.set('q', query)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <nav>
      {/* 声明式导航 */}
      <Link href="/" className={pathname === '/' ? 'active' : ''}>
        Home
      </Link>
      <Link href="/about">About</Link>

      {/* 编程式导航 */}
      <button onClick={handleClick}>Go to Dashboard</button>
    </nav>
  )
}
```

### 路由保护

```tsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')

  // 未认证用户重定向到登录页
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
}
```

---

## Server Components

### Server vs Client Components

```tsx
// ✅ Server Component（默认）
// - 可以直接访问数据库
// - 可以使用 fs、path 等 Node.js API
// - 不能使用 useState、useEffect
// - 不能使用浏览器 API

async function ServerComponent() {
  const data = await db.query('SELECT * FROM users')
  return <div>{data.length} users</div>
}

// ✅ Client Component
// - 使用 'use client' 指令
// - 可以使用 hooks
// - 可以使用浏览器 API

'use client'

import { useState } from 'react'

function ClientComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### 组合模式

```tsx
// app/dashboard/page.tsx (Server Component)
import { Suspense } from 'react'
import { UserList } from './UserList'        // Server Component
import { SearchBar } from './SearchBar'      // Client Component
import { LoadingSpinner } from './Loading'

export default async function DashboardPage() {
  return (
    <div>
      {/* Client Component */}
      <SearchBar />

      {/* Server Component with Suspense */}
      <Suspense fallback={<LoadingSpinner />}>
        <UserList />
      </Suspense>
    </div>
  )
}

// UserList.tsx (Server Component)
async function UserList() {
  const users = await db.users.findMany()
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

// SearchBar.tsx (Client Component)
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    router.push(`/search?q=${query}`)
  }

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
    </div>
  )
}
```

### 传递数据到 Client Components

```tsx
// ✅ 正确：Server Component 获取数据，传递给 Client Component
// app/page.tsx (Server Component)
import { InteractiveChart } from './InteractiveChart'

export default async function Page() {
  const data = await fetchChartData() // 服务端获取数据

  return <InteractiveChart data={data} /> // 传递给客户端组件
}

// InteractiveChart.tsx (Client Component)
'use client'

import { useState } from 'react'

interface Props {
  data: ChartData
}

export function InteractiveChart({ data }: Props) {
  const [zoom, setZoom] = useState(1)

  return (
    <div>
      <Chart data={data} zoom={zoom} />
      <button onClick={() => setZoom(z => z + 0.1)}>Zoom In</button>
    </div>
  )
}
```

---

## 性能优化

### 1. React.memo

```tsx
// ✅ 避免不必要的重渲染
const ExpensiveComponent = React.memo(function ExpensiveComponent({
  data,
  onAction,
}: Props) {
  // 只有 props 变化时才重渲染
  return <div>{/* 复杂渲染逻辑 */}</div>
})

// ✅ 自定义比较函数
const ListItem = React.memo(
  function ListItem({ item, onSelect }: Props) {
    return <div onClick={() => onSelect(item.id)}>{item.name}</div>
  },
  (prevProps, nextProps) => prevProps.item.id === nextProps.item.id
)
```

### 2. 代码分割

```tsx
import { lazy, Suspense } from 'react'

// ✅ 懒加载组件
const HeavyChart = lazy(() => import('./HeavyChart'))
const SettingsPanel = lazy(() => import('./SettingsPanel'))

function Dashboard() {
  return (
    <div>
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart />
      </Suspense>

      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsPanel />
      </Suspense>
    </div>
  )
}
```

### 3. 虚拟列表

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  })

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${virtualRow.start}px)`,
              height: `${virtualRow.size}px`,
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 4. 图片优化（Next.js）

```tsx
import Image from 'next/image'

// ✅ 使用 Next.js Image 组件
function Avatar({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={100}
      height={100}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      priority={false} // 设为 true 优先加载（如首屏图片）
    />
  )
}
```

### 5. 避免不必要的渲染

```tsx
// ❌ 每次渲染都创建新对象
function Parent() {
  return <Child style={{ color: 'red' }} onClick={() => {}} />
}

// ✅ 使用 useMemo/useCallback 或提升到组件外
const style = { color: 'red' }

function Parent() {
  const handleClick = useCallback(() => {}, [])
  return <Child style={style} onClick={handleClick} />
}
```

---

## 错误处理

### Error Boundary

```tsx
// components/ErrorBoundary.tsx
'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <div>Something went wrong</div>
    }

    return this.props.children
  }
}

// 使用
function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <MainContent />
    </ErrorBoundary>
  )
}
```

### Next.js Error Handling

```tsx
// app/error.tsx (自动错误边界)
'use client'

import { useEffect } from 'react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}

// app/global-error.tsx (全局错误处理)
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  )
}
```

### 异步错误处理

```tsx
// ✅ 使用 try-catch
async function fetchData() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Fetch failed:', error)
    throw error
  }
}

// ✅ React Query 错误处理
function UserProfile({ userId }: { userId: string }) {
  const { data, error, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  return <div>{data?.name}</div>
}
```

---

## 常见问题

### 1. 无限循环

```tsx
// ❌ 错误：每次渲染都触发 effect
useEffect(() => {
  setData(transformData(rawData))
}, [rawData, transformData]) // transformData 每次都是新引用

// ✅ 解决方案 1：使用 useCallback
const transform = useCallback((data) => {
  return data.map(/* ... */)
}, [])

useEffect(() => {
  setData(transform(rawData))
}, [rawData, transform])

// ✅ 解决方案 2：直接在 effect 中定义函数
useEffect(() => {
  function transformData(data) {
    return data.map(/* ... */)
  }
  setData(transformData(rawData))
}, [rawData])
```

### 2. 闭包陷阱

```tsx
// ❌ 错误：闭包捕获旧值
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count) // 始终是 0
      setCount(count + 1) // 始终设为 1
    }, 1000)
    return () => clearInterval(timer)
  }, []) // 空依赖数组

  return <div>{count}</div>
}

// ✅ 解决方案：使用函数式更新
useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1) // 使用函数式更新
  }, 1000)
  return () => clearInterval(timer)
}, [])
```

### 3. 条件渲染中的 Hooks

```tsx
// ❌ 错误：条件调用 hooks
function Component({ isLoggedIn }) {
  if (isLoggedIn) {
    const [user, setUser] = useState(null) // 违反 hooks 规则
  }
}

// ✅ 解决方案：始终调用 hooks
function Component({ isLoggedIn }) {
  const [user, setUser] = useState(null) // 始终调用

  if (!isLoggedIn) {
    return <LoginForm />
  }

  return <UserProfile user={user} />
}
```

### 4. 类型冲突

```tsx
// ❌ 组件与类型同名
import UserCard from './UserCard'
import type { UserCard } from '@/types' // 冲突！

// ✅ 方案 1：类型添加后缀
import UserCard from './UserCard'
import type { UserCardType } from '@/types'

// ✅ 方案 2：重命名导入
import UserCard from './UserCard'
import type { UserCard as IUserCard } from '@/types'
```

### 5. 过度渲染

```tsx
// ❌ Context 导致整个子树重渲染
const AppContext = createContext({})

function App() {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')

  // 任何状态变化都会导致所有消费者重渲染
  return (
    <AppContext.Provider value={{ user, theme, setUser, setTheme }}>
      <ChildComponents />
    </AppContext.Provider>
  )
}

// ✅ 拆分 Context
const UserContext = createContext({})
const ThemeContext = createContext({})

function App() {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <ChildComponents />
      </ThemeContext.Provider>
    </UserContext.Provider>
  )
}
```

---

**版本**: 1.0.0
**最后更新**: 2026-01-13
**维护者**: AI-DEV-CONFIG Team
