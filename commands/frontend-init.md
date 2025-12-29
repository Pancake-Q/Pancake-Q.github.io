# 前端项目初始化助手

顶级前端架构工程师，负责根据技术栈快速初始化规范化、工程化的前端项目。

## 核心目标

基于用户提供的技术栈，完成前端项目的完整初始化。

### 必备工程化内容
- ✅ 代码规范：`@antfu/eslint-config`
- ✅ 图标方案：Nuxt 用 `@nuxtjs/svg-sprite`，Vue/React 用 `svg-sprite-loader`
- ✅ Git 规范：`husky` + `commitlint` + `eslint`
- ✅ 容器化：`docker-compose` 一键部署
- ✅ TypeScript 完整类型支持
- ✅ 包管理器：`pnpm`

## 关键注意事项

### 1. TypeScript 类型检查
| 框架 | 命令 | package.json 配置 |
|------|------|------------------|
| Nuxt | `nuxt typecheck` | `"type-check": "nuxt typecheck"` |
| Vue 3 + Vite | 需安装 `vue-tsc` | `"type-check": "vue-tsc --noEmit"` |
| React | `tsc --noEmit` | `"type-check": "tsc --noEmit"` |

### 2. 文件编码
使用 Bash heredoc 生成中文文件，确保 UTF-8：
```bash
cat > README.md << 'EOF'
# 中文内容
EOF
```

### 3. TSConfig 配置

**⭐ 最佳实践：使用官方脚手架生成默认配置**

| 框架 | 初始化命令 |
|------|-----------|
| Nuxt 3 | `npx nuxi init my-app` |
| Vue 3 + Vite | `pnpm create vue@latest` |
| React + Vite | `pnpm create vite@latest my-app --template react-ts` |
| Next.js | `npx create-next-app@latest` |

**为什么？**
- ✅ 自动生成标准目录结构
- ✅ 预配置 TypeScript、Vite
- ✅ 避免手动配置出错
- ✅ 确保版本兼容

**Nuxt 特别注意**：
- ✅ 必须继承 `.nuxt/tsconfig.json`
- ❌ 不要覆盖 `include`、`exclude`、`paths`（Nuxt 自动管理）
- ❌ 不要添加 `types` 字段（通过 `.nuxt/nuxt.d.ts` 自动处理）
- ⚠️ 覆盖 `include` 会丢失模块类型定义

最小配置：
```json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true
  }
}
```

### 4. SCSS 配置
- ✅ 在 `nuxt.config.ts` 的 `additionalData` 中全局引入变量/mixins
- ❌ 不要在 `css` 数组中重复引入 SCSS 变量
- ✅ `css` 数组只引入 `reset.css`

## 执行流程

### 1. 解析技术栈
从文档中提取：
- 前端框架：Vue 3/React/Nuxt/Next.js
- UI 框架：Element Plus/Ant Design/Naive UI
- 构建工具：Vite/Webpack
- 状态管理：Pinia/Vuex/Redux/Zustand
- CSS 方案：SCSS/Less/Tailwind CSS
- 项目类型：管理后台/门户/H5/桌面应用
- 是否需要 SSR/SSG、i18n、SEO

### 2. 初始化项目（官方脚手架）
使用对应框架的官方 CLI 初始化。

**初始化后任务**：
1. 保留官方 `tsconfig.json`（不手动修改）
2. 添加工程化工具（ESLint、Husky、Commitlint）
3. 配置 UI 框架和状态管理
4. 添加样式重置文件
5. 配置 Docker

### 3. package.json 必备脚本
```json
{
  "scripts": {
    "dev": "启动开发服务器",
    "build": "构建生产版本",
    "preview": "预览生产构建",
    "lint": "代码检查",
    "lint:fix": "自动修复",
    "type-check": "TypeScript 类型检查",
    "prepare": "husky install"
  }
}
```

### 4. ESLint 配置

**eslint.config.js**：
```javascript
import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true, // Vue 项目
  // react: true, // React 项目
  typescript: true,

  // ⭐ 启用格式化器
  formatters: {
    css: true,
    html: true,
    markdown: true,
  },

  stylistic: {
    indent: 4,
    semi: false,
    quotes: 'single',
  },

  rules: {
    'vue/block-order': ['error', {
      order: ['template', 'script', 'style'],
    }],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/multi-word-component-names': 'off',
  },

  ignores: ['dist', '.output', '.nuxt', 'node_modules'],
})
```

**必需依赖**（使用 `latest` 安装）：
```bash
pnpm add -D @antfu/eslint-config@latest eslint@latest eslint-plugin-format@latest
```

### 5. Git Hooks 配置

**package.json**：
```json
{
  "scripts": {
    "prepare": "husky install",
    "lint-staged": "lint-staged"
  },
  "devDependencies": {
    "husky": "latest",
    "@commitlint/cli": "latest",
    "@commitlint/config-conventional": "latest",
    "lint-staged": "latest",
    "eslint-plugin-format": "latest"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": ["eslint --fix"],
    "*.{css,scss}": ["eslint --fix"]
  }
}
```

**安装命令**：
```bash
pnpm add -D husky@latest @commitlint/cli@latest @commitlint/config-conventional@latest lint-staged@latest eslint-plugin-format@latest
```

**.husky/pre-commit**（Husky v9+，直接写命令）：
```bash
pnpm lint-staged
```

**.husky/commit-msg**：
```bash
pnpm exec commitlint --edit $1
```

**commitlint.config.js**：
```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',
      'fix',
      'docs',
      'style',
      'refactor',
      'perf',
      'test',
      'chore',
      'revert',
    ]],
  },
}
```

### 6. Docker 配置

**Dockerfile**（基础镜像 `rd.clouditera.com/infra/node:20.0.0`）：
```dockerfile
# 构建阶段
FROM rd.clouditera.com/infra/node:20.0.0 AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# 生产阶段
FROM rd.clouditera.com/infra/node:20.0.0
WORKDIR /app
RUN npm install -g pnpm serve
COPY --from=builder /app/dist /app/dist
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**docker-compose.yml**：
```yaml
version: '3.8'
services:
  web:
    build: .
    container_name: frontend-app
    restart: unless-stopped
    ports: ['3000:3000']
    environment: [NODE_ENV=production]
    networks: [app-network]
networks:
  app-network:
    driver: bridge
```

### 7. 样式重置文件

**简化版 reset.css**（核心重置）：
```css
/* 盒模型 + 边距重置 */
*,
*::before,
*::after {
  box-sizing: border-box;
}
* {
  margin: 0;
  padding: 0;
}

/* 根元素 */
html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}
html,
body {
  height: 100%;
}
body {
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* 媒体元素 */
img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

/* 表单元素 */
input,
button,
textarea,
select {
  font: inherit;
}

/* 文本溢出 */
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

/* 列表、链接、按钮 */
ul,
ol {
  list-style: none;
}
a {
  text-decoration: none;
  color: inherit;
}
button {
  border: none;
  background: none;
  cursor: pointer;
}

/* 表格 */
table {
  border-collapse: collapse;
  border-spacing: 0;
}

/* 根层叠上下文 */
#app,
#root {
  isolation: isolate;
}
```

**在入口文件引入**：
```typescript
// main.ts (Vue) 或 main.tsx (React)
import '@/assets/styles/reset.css'
```

### 8. 版本控制配置

**.gitignore**（核心内容）：
```gitignore
# 系统
.DS_Store
Thumbs.db

# 依赖
node_modules/
*-lock.json
pnpm-lock.yaml

# 构建
dist/
.output/
.nuxt/
.next/
build/

# 环境变量
.env

# 日志
*.log

# 编辑器
.idea/
.vscode/
```

### 9. 其他配置

**.editorconfig**：
```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 4
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

**.dockerignore**：
```
node_modules
.git
.env
dist
.output
.nuxt
coverage
.vscode
.idea
```

## 开发规范要点

### 命名规范
| 类型 | 规范 | 示例 |
|------|------|------|
| 变量 | 小驼峰 | `firstName`, `isLoading` |
| 常量 | 大写下划线 | `API_URL`, `MAX_SIZE` |
| 函数 | 小驼峰 + 动词 | `getData()`, `handleClick()` |
| 类/组件 | 大驼峰 | `UserProfile`, `NewsCard` |
| 组件文件 | 大驼峰 | `UserProfile.vue` |
| 工具文件 | 小驼峰 | `formatDate.ts` |
| CSS (BEM) | block__element--modifier | `.card__title--primary` |

### Vue 3 核心规范
```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
})

const emit = defineEmits<{
  update: [value: number]
}>()
</script>

<style scoped lang="scss">
.card {
  /* BEM 命名 */
}
</style>
```

**关键点**：
- 使用 `<script setup>`
- Props/Emits 必须定义 TypeScript 类型
- 使用 Composition API
- 样式使用 `scoped`

### React/TypeScript 核心规范
```tsx
interface CardProps {
  title: string
  count?: number
  onUpdate?: (value: number) => void
}

export default function Card({ title, count = 0, onUpdate }: CardProps) {
  return <div className="card">{/* ... */}</div>
}
```

### 性能优化
- 路由级代码分割（动态导入）
- 组件懒加载：`defineAsyncComponent` (Vue) / `React.lazy` (React)
- 合理使用 `computed` / `useMemo`

### Git 提交规范
```
<type>(<scope>): <subject>

feat: 新功能
fix: 修复
docs: 文档
style: 格式
refactor: 重构
perf: 性能优化
test: 测试
chore: 构建/工具
```

## 输出清单

调用 `/frontend-init` 时，输出以下内容：

```
✅ 技术栈解析
✅ 项目结构（目录树）
✅ package.json（依赖+脚本）
✅ README.md
✅ .gitignore
✅ reset.css + 引入
✅ .editorconfig
✅ eslint.config.js
✅ tsconfig.json（官方脚手架生成）
✅ vite.config.ts / nuxt.config.ts / next.config.js
✅ .husky/pre-commit + commit-msg
✅ commitlint.config.js
✅ Dockerfile + docker-compose.yml + .dockerignore
✅ LICENSE + CHANGELOG.md
```

## 使用方式

在 Claude Code 中通过 `/frontend-init` 命令调用，提供技术栈或需求文档即可。

**支持框架**：Vue 3 + Vite、Nuxt.js、React + Vite、Next.js

---

**最后更新**: 2025-12-12
**版本**: 1.0.0
