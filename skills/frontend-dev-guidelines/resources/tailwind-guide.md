# Tailwind CSS 开发指南

> 组件化封装优先，避免原子类堆叠，多人协作友好

---

## 目录

- [核心原则](#核心原则)
- [设计令牌系统](#设计令牌系统)
- [样式封装规范](#样式封装规范)
- [组件开发规范](#组件开发规范)
- [多人协作规范](#多人协作规范)
- [项目配置](#项目配置)

---

## 核心原则

### 三层封装架构

```
┌─────────────────────────────────────────────────────┐
│  业务代码层 - 只使用组件和语义化类名                    │
│  <Button variant="primary">提交</Button>             │
│  <div class="page-container">...</div>              │
├─────────────────────────────────────────────────────┤
│  组件层 - 使用 @apply 封装原子类                      │
│  .btn-primary { @apply ... }                        │
│  .page-container { @apply ... }                     │
├─────────────────────────────────────────────────────┤
│  设计令牌层 - CSS 变量定义                            │
│  --color-primary, --spacing-md, --radius-base       │
└─────────────────────────────────────────────────────┘
```

### ❌ 禁止：原子类堆叠

```tsx
// ❌ 禁止：业务代码中堆叠多个原子类
<button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2">
  提交
</button>

// ❌ 禁止：硬编码颜色
<div className="bg-blue-500 text-white hover:bg-blue-600">
```

### ✅ 推荐：组件化封装

```tsx
// ✅ 推荐：使用封装好的组件
<Button variant="primary">提交</Button>

// ✅ 推荐：使用语义化类名
<div className="page-container">
```

---

## 设计令牌系统

### CSS 变量定义

```css
/* styles/tokens.css */
:root {
  /* 颜色令牌 */
  --color-primary: 222.2 47.4% 11.2%;
  --color-primary-foreground: 210 40% 98%;
  --color-secondary: 210 40% 96.1%;
  --color-secondary-foreground: 222.2 47.4% 11.2%;
  --color-destructive: 0 84.2% 60.2%;
  --color-destructive-foreground: 210 40% 98%;
  --color-muted: 210 40% 96.1%;
  --color-muted-foreground: 215.4 16.3% 46.9%;
  --color-background: 0 0% 100%;
  --color-foreground: 222.2 84% 4.9%;
  --color-border: 214.3 31.8% 91.4%;

  /* 间距令牌 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* 圆角令牌 */
  --radius-sm: 0.25rem;
  --radius-base: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* 字体令牌 */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;

  /* 阴影令牌 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-base: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* 暗色模式 */
.dark {
  --color-primary: 210 40% 98%;
  --color-primary-foreground: 222.2 47.4% 11.2%;
  --color-background: 222.2 84% 4.9%;
  --color-foreground: 210 40% 98%;
  --color-border: 217.2 32.6% 17.5%;
  --color-muted: 217.2 32.6% 17.5%;
  --color-muted-foreground: 215 20.2% 65.1%;
}
```

---

## 样式封装规范

### 使用 @layer components 封装

```css
/* styles/components.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  /* ========== 按钮组件 ========== */
  .btn {
    @apply inline-flex items-center justify-center;
    @apply rounded-[var(--radius-base)] font-medium;
    @apply transition-colors duration-200;
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2;
    @apply disabled:pointer-events-none disabled:opacity-50;
  }

  .btn-primary {
    @apply btn;
    @apply bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))];
    @apply hover:bg-[hsl(var(--color-primary))]/90;
  }

  .btn-secondary {
    @apply btn;
    @apply bg-[hsl(var(--color-secondary))] text-[hsl(var(--color-secondary-foreground))];
    @apply hover:bg-[hsl(var(--color-secondary))]/80;
  }

  .btn-destructive {
    @apply btn;
    @apply bg-[hsl(var(--color-destructive))] text-[hsl(var(--color-destructive-foreground))];
    @apply hover:bg-[hsl(var(--color-destructive))]/90;
  }

  .btn-outline {
    @apply btn;
    @apply border border-[hsl(var(--color-border))] bg-transparent;
    @apply hover:bg-[hsl(var(--color-muted))];
  }

  .btn-ghost {
    @apply btn;
    @apply bg-transparent;
    @apply hover:bg-[hsl(var(--color-muted))];
  }

  /* 按钮尺寸 */
  .btn-sm {
    @apply h-9 px-3 text-sm;
  }

  .btn-md {
    @apply h-10 px-4 text-sm;
  }

  .btn-lg {
    @apply h-11 px-8 text-base;
  }

  /* ========== 卡片组件 ========== */
  .card {
    @apply rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))];
    @apply bg-[hsl(var(--color-background))];
    @apply shadow-[var(--shadow-sm)];
  }

  .card-header {
    @apply flex flex-col gap-1.5 p-6;
  }

  .card-title {
    @apply text-xl font-semibold leading-none tracking-tight;
  }

  .card-description {
    @apply text-sm text-[hsl(var(--color-muted-foreground))];
  }

  .card-content {
    @apply p-6 pt-0;
  }

  .card-footer {
    @apply flex items-center p-6 pt-0;
  }

  /* ========== 输入框组件 ========== */
  .input {
    @apply flex h-10 w-full rounded-[var(--radius-base)];
    @apply border border-[hsl(var(--color-border))];
    @apply bg-[hsl(var(--color-background))];
    @apply px-3 py-2 text-sm;
    @apply placeholder:text-[hsl(var(--color-muted-foreground))];
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2;
    @apply disabled:cursor-not-allowed disabled:opacity-50;
  }

  /* ========== 布局组件 ========== */
  .page-container {
    @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
  }

  .section {
    @apply py-12 sm:py-16 lg:py-20;
  }

  .stack {
    @apply flex flex-col gap-4;
  }

  .stack-sm {
    @apply flex flex-col gap-2;
  }

  .stack-lg {
    @apply flex flex-col gap-6;
  }

  .cluster {
    @apply flex flex-wrap items-center gap-4;
  }

  .cluster-sm {
    @apply flex flex-wrap items-center gap-2;
  }

  /* ========== 文本样式 ========== */
  .text-heading-1 {
    @apply text-4xl font-bold tracking-tight sm:text-5xl;
  }

  .text-heading-2 {
    @apply text-3xl font-semibold tracking-tight;
  }

  .text-heading-3 {
    @apply text-2xl font-semibold;
  }

  .text-body {
    @apply text-base text-[hsl(var(--color-foreground))];
  }

  .text-muted {
    @apply text-sm text-[hsl(var(--color-muted-foreground))];
  }

  /* ========== 表单组件 ========== */
  .form-group {
    @apply flex flex-col gap-2;
  }

  .form-label {
    @apply text-sm font-medium;
  }

  .form-error {
    @apply text-sm text-[hsl(var(--color-destructive))];
  }

  /* ========== 徽章组件 ========== */
  .badge {
    @apply inline-flex items-center rounded-full px-2.5 py-0.5;
    @apply text-xs font-medium;
  }

  .badge-primary {
    @apply badge;
    @apply bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))];
  }

  .badge-secondary {
    @apply badge;
    @apply bg-[hsl(var(--color-secondary))] text-[hsl(var(--color-secondary-foreground))];
  }

  .badge-outline {
    @apply badge;
    @apply border border-[hsl(var(--color-border))] bg-transparent;
  }
}
```

---

## 组件开发规范

### React 组件封装

```tsx
// components/ui/Button.tsx
import { forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const variantClass = `btn-${variant}`
    const sizeClass = `btn-${size}`

    return (
      <button
        ref={ref}
        className={`${variantClass} ${sizeClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
```

### Vue 组件封装

```vue
<!-- components/ui/Button.vue -->
<template>
  <button :class="buttonClasses" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})

const buttonClasses = computed(() => [
  `btn-${props.variant}`,
  `btn-${props.size}`,
])
</script>
```

### 业务代码使用示例

```tsx
// ✅ 正确：业务代码简洁清晰
import { Button } from '@/components/ui/Button'

function LoginPage() {
  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">登录</h2>
          <p className="card-description">请输入您的账号信息</p>
        </div>
        <div className="card-content">
          <div className="stack">
            <div className="form-group">
              <label className="form-label">邮箱</label>
              <input className="input" type="email" placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label className="form-label">密码</label>
              <input className="input" type="password" />
            </div>
            <Button variant="primary" size="md">登录</Button>
            <Button variant="outline" size="md">使用 GitHub 登录</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## 多人协作规范

### ✅ 允许的用法

| 场景 | 允许 | 示例 |
|------|------|------|
| UI 组件 | ✅ | `<Button variant="primary">` |
| 语义化类名 | ✅ | `className="card"` |
| 布局类名 | ✅ | `className="page-container"` |
| 间距微调 | ✅ | `className="card mt-4"` |
| 响应式显隐 | ✅ | `className="hidden md:block"` |

### ❌ 禁止的用法

| 场景 | 禁止 | 原因 |
|------|------|------|
| 原子类堆叠 | ❌ `className="flex items-center justify-center px-4 py-2..."` | 难以维护 |
| 硬编码颜色 | ❌ `className="bg-blue-500"` | 无法统一管理 |
| 内联复杂样式 | ❌ `className="hover:bg-blue-600 focus:ring-2..."` | 应封装为组件 |

### 类名数量限制

```tsx
// ✅ 推荐：最多 3 个类名
<div className="card mt-4 w-full">

// ⚠️ 警告：4-5 个类名需要评估是否应该封装
<div className="card mt-4 w-full rounded-lg shadow-lg">

// ❌ 禁止：超过 5 个类名必须封装
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border">
// 应该封装为：
<div className="list-item">
```

### ESLint 规则

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // 禁止硬编码颜色
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/bg-(red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone)-\\d+/]',
        message: '禁止使用硬编码颜色，请使用语义化类名',
      },
    ],
  },
}
```

### 代码审查清单

- [ ] 是否使用了封装的 UI 组件？
- [ ] 单个元素的类名是否超过 3 个？
- [ ] 是否存在硬编码颜色？
- [ ] 复杂样式是否已封装到 @layer components？
- [ ] 新增样式是否使用了设计令牌？

---

## 项目配置

### Tailwind 配置

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,vue}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          foreground: 'hsl(var(--color-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--color-secondary))',
          foreground: 'hsl(var(--color-secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--color-destructive))',
          foreground: 'hsl(var(--color-destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--color-muted))',
          foreground: 'hsl(var(--color-muted-foreground))',
        },
        background: 'hsl(var(--color-background))',
        foreground: 'hsl(var(--color-foreground))',
        border: 'hsl(var(--color-border))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
```

### 项目结构

```
src/
├── styles/
│   ├── tokens.css        # 设计令牌（CSS 变量）
│   ├── components.css    # @layer components 封装
│   └── globals.css       # 全局样式入口
├── components/
│   └── ui/               # UI 组件
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── index.ts
└── tailwind.config.ts
```

### 样式文件入口

```css
/* styles/globals.css */
@import './tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@import './components.css';

@layer base {
  body {
    @apply bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))];
  }
}
```

---

## 参考资源

- [shadcn/ui](https://ui.shadcn.com/) - 组件设计参考
- [Tailwind CSS @apply](https://tailwindcss.com/docs/reusing-styles) - 样式复用
- [Design Tokens](https://www.designtokens.org/) - 设计令牌规范

---

**版本**: 3.0.0
**最后更新**: 2026-01-13
**维护者**: AI-DEV-CONFIG Team
**核心理念**: 组件化封装优先，业务代码零原子类堆叠
