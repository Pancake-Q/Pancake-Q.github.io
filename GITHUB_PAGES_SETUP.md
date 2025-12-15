# GitHub Pages 部署配置指南

## 已完成的配置

✅ 创建了 GitHub Actions 工作流文件：`.github/workflows/deploy-docs.yml`

## 工作流说明

该工作流会在以下情况下自动触发：
- 当代码推送到 `main` 分支时
- 手动触发（通过 GitHub Actions 页面）

## 部署流程

1. **检出代码** - 获取完整的 Git 历史记录（用于显示最后更新时间）
2. **设置 pnpm** - 使用 pnpm v10
3. **设置 Node.js** - 使用 Node.js v22
4. **安装依赖** - 运行 `pnpm install --frozen-lockfile`
5. **构建站点** - 运行 `pnpm run build`
6. **部署到 GitHub Pages** - 将构建结果部署到 `gh-pages` 分支

## 在 GitHub 上启用 GitHub Pages

### 步骤 1：推送代码到 GitHub

```bash
git add .
git commit -m "feat: 添加 GitHub Actions 工作流以部署到 GitHub Pages"
git push origin main
```

### 步骤 2：在 GitHub 仓库中配置 GitHub Pages

1. 打开你的 GitHub 仓库
2. 点击 **Settings**（设置）
3. 在左侧菜单中找到 **Pages**
4. 在 **Source**（源）部分：
   - **Branch**: 选择 `gh-pages`
   - **Folder**: 选择 `/ (root)`
5. 点击 **Save**（保存）

### 步骤 3：配置 GitHub Actions 权限（如果需要）

如果部署失败，可能需要配置 Actions 权限：

1. 进入仓库的 **Settings** → **Actions** → **General**
2. 在 **Workflow permissions** 部分：
   - 选择 **Read and write permissions**
   - 勾选 **Allow GitHub Actions to create and approve pull requests**
3. 点击 **Save**

### 步骤 4：等待工作流完成

1. 进入仓库的 **Actions** 标签页
2. 查看 "部署文档" 工作流的运行状态
3. 等待工作流成功完成（绿色勾号）

### 步骤 5：访问你的站点

部署成功后，你的站点将在以下地址可用：

```
https://<username>.github.io/<repository-name>/
```

例如：`https://pancake-q.github.io/node-web/`

## 配置说明

### base URL 配置

在 `docs/.vuepress/config.js` 中已经配置了：

```javascript
base: "/node-web/"
```

如果你的仓库名称不是 `node-web`，请修改此配置为你的实际仓库名称：

```javascript
base: "/<你的仓库名>/"
```

如果你使用自定义域名，可以将 `base` 设置为 `"/"`。

### 自定义域名（可选）

如果想使用自定义域名：

1. 在 `docs/.vuepress/public/` 目录下创建 `CNAME` 文件
2. 在文件中写入你的域名，例如：`docs.example.com`
3. 在你的域名 DNS 设置中添加 CNAME 记录指向 `<username>.github.io`

## 本地测试

在推送到 GitHub 之前，可以本地测试构建：

```bash
# 开发模式
pnpm run dev

# 构建
pnpm run build

# 预览构建结果（需要安装 serve）
npx serve docs/.vuepress/dist
```

## 常见问题

### 1. 样式丢失或资源 404

确保 `base` 配置正确，应该与仓库名称匹配。

### 2. 部署失败

检查 Actions 日志，常见原因：
- 权限不足：配置 Actions 权限为读写
- 构建错误：本地先运行 `pnpm run build` 确保构建成功

### 3. 页面空白

- 检查浏览器控制台是否有错误
- 确认 `base` 路径配置正确
- 检查 `gh-pages` 分支是否有内容

## 工作流文件位置

`.github/workflows/deploy-docs.yml`

## 相关命令

```bash
# 启动开发服务器
pnpm run dev
# 或
pnpm run docs:dev

# 构建生产版本
pnpm run build
# 或
pnpm run docs:build
```

## 下次部署

以后每次推送到 `main` 分支时，GitHub Actions 会自动构建和部署。

你也可以在 GitHub Actions 页面手动触发部署。