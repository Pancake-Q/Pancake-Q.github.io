---
allowed-tools: Bash
description: 生成英文 conventional commit 消息
argument-hint: [可选：提交范围或类型提示]
---

# 生成 Conventional Commit 消息

> 分析 git 变更并生成符合 Conventional Commits 规范的英文提交消息

## 使用方式

在 Claude Code 中通过命令面板或快捷键调用此命令：

```bash
/commit                    # 分析所有变更
/commit feat              # 指定类型为 feat
/commit fix: login       # 指定类型和范围
```

---

## 任务

分析 git 变更并生成符合 Conventional Commits 规范的**英文**提交消息。

## 执行步骤

1. 运行以下命令查看变更：
   ```bash
   git status
   git diff           # unstaged 变更
   git diff --cached  # staged 变更
   git log -3 --oneline  # 参考最近的提交风格
   ```

2. 分析变更内容，确定提交类型

3. 生成提交消息（**仅输出消息文本**，不执行 git commit）

## 提交格式

### 简单变更（单行）
```
<type>: <subject>
```

### 复杂变更（多行，带详细说明）
```
<type>: <subject>

<body>
- 要点1
- 要点2
- 要点3
```

**何时使用多行格式：**
- 修改了 3+ 个文件
- 删除/添加了依赖
- 重构涉及多个模块
- 需要解释"为什么"而非"做了什么"

## 类型说明

- `feat`: 新功能
- `fix`: 修复 bug
- `refactor`: 重构（无功能变更）
- `docs`: 文档更新
- `test`: 测试相关
- `chore`: 配置/依赖维护
- `style`: 代码格式调整
- `perf`: 性能优化

## 规则

- **语言**: 英文（即使代码注释是中文）
- **主题**: < 50 字符，祈使语气（add 而非 added）
- **聚焦**: 变更原因而非内容细节
- **无标点**: 主题行末尾无句号

## 示例

```
feat: add user authentication

refactor: remove redundant default Vite/Nuxt configurations

Remove explicit configurations that match framework defaults:
- cssCodeSplit (defaults to true in Vite)
- typescript.strict (defaults to true in Nuxt 3.12+)

docs: update API documentation

chore: upgrade dependencies to latest versions
```

## 安全检查

- ⚠️ 拒绝提交敏感文件（.env、credentials.json、密钥等）
- ⚠️ 提醒检查 .gitignore 配置
- ⚠️ 如发现敏感内容，警告用户

---

**最后更新**: 2025-12-12
**版本**: 1.1.0
