# 部署到 GitHub Pages 指南

> **你的最终访问地址：<https://lix53.github.io/managePage/>**
>
> 仓库：`lix53/managePage`

本项目已配置好两种部署方式，**任选其一**即可。

---

## ✅ 准备工作（一次性）

1. 在 GitHub 上**新建仓库** `managePage`（已有则跳过）。
2. 在仓库 **Settings → Pages**：
   - **方式一（推荐）**：Source 选 **GitHub Actions**
   - **方式二**：Source 选 **Deploy from a branch** → 分支选 `gh-pages` / `/(root)`
3. 把本地代码推上去：
   ```bash
   cd d:/projects/lix/Ai/myProjects/blackMart
   git init
   git add .
   git commit -m "init: 黑玛项目管家 V1.0"
   git branch -M main
   git remote add origin https://github.com/lix53/managePage.git
   git push -u origin main
   ```

---

## 方式一：GitHub Actions 自动部署（推荐 ⭐）

**优点**：以后 `git push` 后 2-3 分钟自动上线，零手动操作。

**配置文件**：`.github/workflows/deploy.yml`（已就绪，自动取仓库名 → 自动得到 `/managePage/`）

**步骤**：
1. 仓库 **Settings → Pages → Source** 选 **GitHub Actions**
2. 推送：
   ```bash
   git push origin main
   ```
3. 打开仓库 **Actions** 标签页，看到 "Deploy to GitHub Pages" 任务，约 2-3 分钟完成
4. 访问 <https://lix53.github.io/managePage/>

**常见小问题**：
- 如果 Actions 报权限错误 → 仓库 **Settings → Actions → General → Workflow permissions** 选 **Read and write permissions** 并保存

---

## 方式二：本地手动部署

**步骤**：
1. 仓库 **Settings → Pages → Source** 选 **Deploy from a branch** → `gh-pages` / `/(root)`
2. 本地执行：
   ```bash
   npm run deploy
   ```
   这条命令会：
   - 用 `/managePage/` 作为 base 构建产物到 `dist/`
   - 把 `dist/` 推到远端 `gh-pages` 分支
3. 等 1-2 分钟后访问 <https://lix53.github.io/managePage/>

> 首次会让你输入 GitHub 用户名 + Personal Access Token（不是密码）。

---

## 本地验证打包产物（不部署也能测）

```bash
# 构建
npm run build:gh

# 本地预览（模拟 GitHub Pages 子路径）
npx vite preview --base /managePage/ --port 4173
```

访问 <http://localhost:4173/managePage/> 即可看到完整效果。

---

## 部署后地址示例

| 页面 | URL |
|---|---|
| 主页（自动跳到登录） | `https://lix53.github.io/managePage/` |
| 看板页 | `https://lix53.github.io/managePage/#/main/dashboard` |
| 项目详情 | `https://lix53.github.io/managePage/#/project/p001` |

> 采用 hash 路由，任意页面刷新永不 404 ✅

---

## 一行总结

```bash
# 自动部署：直接 push
git push origin main

# 手动部署：
npm run deploy
```
