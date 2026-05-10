# TOPCENT Industrial Product Navigation System

TOPCENT 产品中心网站，当前重点是产品分类、产品树、图片映射、搜索和产品详情。

## 技术栈

- Vite
- React
- React Router
- Node.js 22

项目代码本身支持 macOS、Windows 和 Linux。仓库里的 `.local/` 是本机临时 Node 目录，不会提交到 GitHub。

## 首次安装

Windows、macOS、Linux 都先安装 Node.js 22 LTS。

如果需要导入 Excel 产品数据，还需要安装 Python 3。

然后在项目根目录运行：

```bash
npm install
```

## 本地开发

普通启动：

```bash
npm run dev
```

一键重启开发服务：

```bash
npm run restart:dev
```

这个命令会自动结束占用 `4173` 端口的旧进程，并重新启动到：

```text
http://localhost:4173/
```

Windows 用户也可以双击：

```text
restart-dev.bat
```

macOS 用户也可以双击：

```text
restart-dev.command
```

## 更新产品目录

销售或产品同事更新 Excel 和图片资源后，运行：

```bash
npm run import:catalog
```

脚本会自动在 macOS/Linux 上寻找 `python3` 或 `python`，在 Windows 上寻找 `py -3`、`python` 或 `python3`。

然后再运行：

```bash
npm run build
```

导入说明见：

```text
docs/catalog-import-workflow.md
docs/sales-catalog-asset-standard.md
```

## 构建检查

```bash
npm run build
```

构建产物在 `dist/`，该目录不提交到 GitHub。
