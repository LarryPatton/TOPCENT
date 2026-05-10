# TOPCENT 产品目录导入与更新流程

本文档说明如何把销售维护的 Excel 分类表和图片资源导入网站。

## 目标

网站的产品中心不再依赖手写数据，而是由资源文件生成：

```text
ziyuan/产品三级分类表 (2)(1).xlsx
ziyuan/三级分类图片（2）/
ziyuan/三级类目图片/
ziyuan/8.拉手解决方案/
```

运行导入脚本后会生成网站使用的数据和图片：

```text
src/data/generated/catalog.generated.json
src/data/generated/import-report.generated.json
public/catalog-images/
```

## 目录说明

```text
scripts/import_catalog.py
```

负责解析 Excel、匹配图片、复制图片、生成网站数据和导入报告。

```text
resources/catalog-aliases.json
```

维护少量名称不一致的别名。例如表格写“不锈钢嵌入拉手”，图片写“不锈钢嵌入型拉手”。

```text
src/data/generated/catalog.generated.json
```

网站读取的正式目录数据。不要手工修改，应该由脚本生成。

```text
src/data/generated/import-report.generated.json
```

导入检查报告，包含匹配到图片、缺失图片、未使用图片、别名匹配等信息。

## 更新流程

1. 销售或产品同事更新 Excel 和图片资源。
2. 将新文件放到 `ziyuan` 目录，保持原有目录结构。
3. 在项目根目录运行：

```bash
npm run import:catalog
```

4. 查看输出结果，重点关注：

```text
Matched images
Missing images
Unused images
```

5. 如果只是名称轻微不一致，优先修改 `resources/catalog-aliases.json`，再重新运行导入。
6. 如果确实缺图，让销售或产品同事补图。
7. 运行构建检查：

```bash
npm run build
```

8. 启动或刷新网站查看效果：

```bash
npm run dev
```

## 匹配规则

脚本按以下顺序匹配图片：

1. 一级分类中文名 + 三级中文名 + 型号。
2. 一级分类中文名 + 三级中文名。
3. 一级分类中文名 + 别名 + 型号。
4. 一级分类中文名 + 别名。

图片文件名推荐格式：

```text
三级中文名-型号.png
三级中文名-型号.jpg
```

例如：

```text
铝合金常规拉手-BD.3000.png
三节普通钢珠轨-SL.3450.png
缓冲铰链-CH.5531.png
```

## 导入报告解读

`matchedImages` 表示成功匹配到图片的目录项数量。

`missingImages` 表示 Excel 中有该分类项，但没有找到对应图片。处理方式是补图或补别名。

`unusedImages` 表示图片文件夹里有图片，但 Excel 中没有匹配项。处理方式是确认图片是否过期、命名是否错误、或者 Excel 是否漏行。

`slashRows` 表示 Excel 中三级分类为 `/` 的行。网站会把这类数据作为二级分类项处理。

## 当前状态

当前资源已完成一次导入：

```text
目录项：339
已匹配图片：251
缺失图片：88
未使用图片：63
```

这说明当前数据已经可以驱动网站，但后续还需要逐步清理命名差异和补齐缺失图片。

## 注意事项

不要直接修改 `src/data/generated/catalog.generated.json`。

不要直接修改 `public/catalog-images/` 里的图片。

如果需要修正匹配关系，优先修改源 Excel、源图片文件名或 `resources/catalog-aliases.json`。

后续如果接入 PDF、CAD、STEP，可以沿用同一机制：销售维护文件，脚本生成网站数据，网站读取生成结果。
