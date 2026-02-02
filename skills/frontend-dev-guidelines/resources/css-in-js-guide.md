# CSS-in-JS 开发指南

> styled-components 和 Emotion 最佳实践

---

## 目录

- [styled-components](#styled-components)
- [Emotion](#emotion)
- [主题系统](#主题系统)
- [动态样式](#动态样式)
- [性能优化](#性能优化)
- [与 Next.js 集成](#与-nextjs-集成)
- [最佳实践](#最佳实践)

---

## styled-components

### 安装

```bash
pnpm add styled-components
pnpm add -D @types/styled-components
```

### 基础用法

```tsx
import styled from 'styled-components'

// 基础样式
const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`

// 使用
function App() {
  return <Button onClick={() => console.log('clicked')}>Click me</Button>
}
```

### 带 Props 的样式

```tsx
interface ButtonProps {
  $variant?: 'primary' | 'secondary' | 'danger'
  $size?: 'sm' | 'md' | 'lg'
}

const Button = styled.button<ButtonProps>`
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  /* 变体样式 */
  background-color: ${props => {
    switch (props.$variant) {
      case 'secondary': return '#e5e7eb'
      case 'danger': return '#ef4444'
      default: return '#3b82f6'
    }
  }};

  color: ${props => props.$variant === 'secondary' ? '#374151' : 'white'};

  /* 尺寸样式 */
  padding: ${props => {
    switch (props.$size) {
      case 'sm': return '0.375rem 0.75rem'
      case 'lg': return '0.75rem 1.5rem'
      default: return '0.5rem 1rem'
    }
  }};

  font-size: ${props => {
    switch (props.$size) {
      case 'sm': return '0.875rem'
      case 'lg': return '1.125rem'
      default: return '1rem'
    }
  }};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`

// 使用
<Button $variant="primary" $size="lg">Large Primary</Button>
<Button $variant="danger" $size="sm">Small Danger</Button>
```

**注意**: 使用 `$` 前缀的 props 不会传递到 DOM 元素。

### 继承样式

```tsx
const BaseButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`

const PrimaryButton = styled(BaseButton)`
  background-color: #3b82f6;
  color: white;
  border: none;

  &:hover {
    background-color: #2563eb;
  }
`

const OutlineButton = styled(BaseButton)`
  background-color: transparent;
  color: #3b82f6;
  border: 2px solid #3b82f6;

  &:hover {
    background-color: #3b82f6;
    color: white;
  }
`
```

### 样式化现有组件

```tsx
import Link from 'next/link'

// 样式化 Next.js Link
const StyledLink = styled(Link)`
  color: #3b82f6;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

// 样式化自定义组件（需要接收 className）
function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>
}

const StyledCard = styled(Card)`
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`
```

### 全局样式

```tsx
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.5;
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.background};
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`

// 在 App 根组件使用
function App() {
  return (
    <>
      <GlobalStyle />
      <MainContent />
    </>
  )
}
```

---

## Emotion

### 安装

```bash
pnpm add @emotion/react @emotion/styled
```

### 基础用法（styled API）

```tsx
import styled from '@emotion/styled'

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`
```

### css prop（推荐）

```tsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const buttonStyle = css`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`

function Button() {
  return <button css={buttonStyle}>Click me</button>
}

// 内联使用
function InlineExample() {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        gap: 1rem;
      `}
    >
      <span>Content</span>
    </div>
  )
}
```

### 对象样式

```tsx
import styled from '@emotion/styled'

// 使用对象而非模板字符串
const Button = styled.button({
  padding: '0.5rem 1rem',
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#2563eb',
  },
})

// 带 props
interface ButtonProps {
  $primary?: boolean
}

const DynamicButton = styled.button<ButtonProps>(props => ({
  padding: '0.5rem 1rem',
  backgroundColor: props.$primary ? '#3b82f6' : '#e5e7eb',
  color: props.$primary ? 'white' : '#374151',
  border: 'none',
  borderRadius: '0.5rem',
}))
```

### 组合样式

```tsx
import { css } from '@emotion/react'

const baseStyles = css`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
`

const primaryStyles = css`
  ${baseStyles}
  background-color: #3b82f6;
  color: white;
`

const secondaryStyles = css`
  ${baseStyles}
  background-color: #e5e7eb;
  color: #374151;
`

function Button({ variant = 'primary' }: { variant?: 'primary' | 'secondary' }) {
  return (
    <button css={variant === 'primary' ? primaryStyles : secondaryStyles}>
      Button
    </button>
  )
}
```

---

## 主题系统

### 定义主题类型

```tsx
// types/theme.ts
export interface Theme {
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    error: string
    success: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    full: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
    }
  }
}
```

### 创建主题

```tsx
// theme/index.ts
import type { Theme } from '@/types/theme'

export const lightTheme: Theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    error: '#ef4444',
    success: '#22c55e',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
  },
}

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
  },
}
```

### 使用主题（styled-components）

```tsx
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from '@/theme'

// 扩展默认主题类型
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

// Provider
function App() {
  const [isDark, setIsDark] = useState(false)

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <MainContent />
    </ThemeProvider>
  )
}

// 在组件中使用
const Card = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.md};
`

const Title = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.xl};
  margin-bottom: ${props => props.theme.spacing.sm};
`
```

### 使用主题（Emotion）

```tsx
import { ThemeProvider, useTheme } from '@emotion/react'
import type { Theme } from '@/types/theme'

// 扩展 Emotion 主题类型
declare module '@emotion/react' {
  export interface Theme extends Theme {}
}

// Provider
function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <MainContent />
    </ThemeProvider>
  )
}

// 在组件中使用
const Card = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface};
`

// 使用 hook
function Component() {
  const theme = useTheme()

  return (
    <div
      css={css`
        color: ${theme.colors.text};
        padding: ${theme.spacing.md};
      `}
    >
      Content
    </div>
  )
}
```

---

## 动态样式

### 条件样式

```tsx
interface CardProps {
  $elevated?: boolean
  $selected?: boolean
}

const Card = styled.div<CardProps>`
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 2px solid transparent;
  transition: all 0.2s;

  /* 条件样式 */
  ${props => props.$elevated && `
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `}

  ${props => props.$selected && `
    border-color: #3b82f6;
    background: #eff6ff;
  `}
`

// 使用 css helper
import { css } from 'styled-components'

const elevatedStyle = css`
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
`

const Card = styled.div<{ $elevated?: boolean }>`
  padding: 1rem;
  background: white;
  ${props => props.$elevated && elevatedStyle}
`
```

### 响应式样式

```tsx
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
}

const media = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
}

const Container = styled.div`
  padding: 1rem;

  ${media.md} {
    padding: 2rem;
  }

  ${media.lg} {
    padding: 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
`
```

### 动画

```tsx
import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const FadeInDiv = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
`

const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`

// 条件动画
interface AnimatedProps {
  $animate?: boolean
}

const AnimatedCard = styled.div<AnimatedProps>`
  ${props => props.$animate && `
    animation: ${fadeIn} 0.3s ease-out;
  `}
`
```

---

## 与 Next.js 集成

### styled-components 配置

```tsx
// next.config.js
module.exports = {
  compiler: {
    styledComponents: true,
  },
}

// lib/registry.tsx (App Router)
'use client'

import { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}

// app/layout.tsx
import { StyledComponentsRegistry } from '@/lib/registry'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

### Emotion 配置

```tsx
// app/providers.tsx
'use client'

import { ThemeProvider } from '@emotion/react'
import { theme } from '@/theme'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

---

## 最佳实践

### 1. 组件组织

```tsx
// 推荐：组件和样式放在一起
// components/Button/Button.tsx
import styled from 'styled-components'

const StyledButton = styled.button`
  /* 样式 */
`

export function Button(props: ButtonProps) {
  return <StyledButton {...props} />
}

// 或分离样式文件
// components/Button/Button.styles.ts
import styled from 'styled-components'

export const Container = styled.div``
export const Title = styled.h2``
export const Content = styled.p``

// components/Button/Button.tsx
import * as S from './Button.styles'

export function Button() {
  return (
    <S.Container>
      <S.Title>Title</S.Title>
      <S.Content>Content</S.Content>
    </S.Container>
  )
}
```

### 2. 避免内联样式

```tsx
// ❌ 避免：每次渲染都创建新样式
function Component() {
  return (
    <div
      css={css`
        color: red;
      `}
    >
      Content
    </div>
  )
}

// ✅ 推荐：提取到组件外
const redText = css`
  color: red;
`

function Component() {
  return <div css={redText}>Content</div>
}

// ✅ 推荐：使用 styled 组件
const RedText = styled.div`
  color: red;
`

function Component() {
  return <RedText>Content</RedText>
}
```

### 3. 使用 transient props

```tsx
// ✅ 使用 $ 前缀防止 props 传递到 DOM
interface Props {
  $isActive: boolean  // 不会传递到 DOM
  onClick: () => void // 会传递到 DOM
}

const Item = styled.div<Props>`
  color: ${props => props.$isActive ? 'blue' : 'gray'};
`

// ❌ 不使用 $ 前缀会导致警告
const Item = styled.div<{ isActive: boolean }>`
  color: ${props => props.isActive ? 'blue' : 'gray'};
`
// Warning: React does not recognize the `isActive` prop on a DOM element.
```

### 4. 类型安全

```tsx
import styled, { DefaultTheme, css } from 'styled-components'

// 主题类型
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string
      text: string
    }
  }
}

// 组件 Props 类型
interface ButtonProps {
  $variant?: 'primary' | 'secondary'
  $size?: 'sm' | 'md' | 'lg'
}

const Button = styled.button<ButtonProps>`
  background: ${props => props.theme.colors.primary};
  padding: ${props => {
    switch (props.$size) {
      case 'sm': return '0.25rem 0.5rem'
      case 'lg': return '0.75rem 1.5rem'
      default: return '0.5rem 1rem'
    }
  }};
`
```

### 5. 性能优化

```tsx
// ✅ 使用 attrs 减少样式重计算
const Input = styled.input.attrs(props => ({
  type: 'text',
  placeholder: props.placeholder || 'Enter text',
}))`
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
`

// ✅ 避免不必要的插值
// ❌
const Box = styled.div`
  padding: ${props => '1rem'};
`

// ✅
const Box = styled.div`
  padding: 1rem;
`

// ✅ 复杂计算使用 useMemo
function Component({ color }: { color: string }) {
  const styles = useMemo(() => css`
    color: ${color};
    /* 复杂样式计算 */
  `, [color])

  return <div css={styles}>Content</div>
}
```

---

## 样式方案对比

| 特性 | styled-components | Emotion | Tailwind CSS |
|------|------------------|---------|-------------|
| 学习曲线 | 中等 | 中等 | 低 |
| 包大小 | ~12KB | ~11KB | ~3KB (JIT) |
| 运行时 | 有 | 有 | 无 |
| SSR 支持 | 需配置 | 内置 | 内置 |
| TypeScript | 良好 | 良好 | 良好 |
| 动态样式 | 优秀 | 优秀 | 有限 |
| IDE 支持 | 良好 | 良好 | 优秀 |
| 主题系统 | 内置 | 内置 | 配置 |

### 选择建议

- **styled-components**: 需要强大的主题和动态样式，团队熟悉 CSS-in-JS
- **Emotion**: 需要更灵活的 API（css prop），Next.js 集成更简单
- **Tailwind CSS**: 追求开发速度，不需要复杂动态样式
- **CSS Modules**: 简单项目，不需要动态样式或主题

---

**版本**: 1.0.0
**最后更新**: 2026-01-13
**维护者**: AI-DEV-CONFIG Team
