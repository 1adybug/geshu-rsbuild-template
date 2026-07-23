# 项目介绍

格数科技 Rsbuild 项目模板

## 创建新项目

```bash
git clone https://github.com/1adybug/geshu-rsbuild-template my-new-project
cd my-new-project
git remote rename origin template
git remote set-url --push template no_push://template
```

## 开发端口

开发服务读取进程环境变量 `PORT`，未设置时使用 `5173`。PowerShell 中可这样指定端口：

```powershell
$env:PORT = "5174"
pnpm dev
```
