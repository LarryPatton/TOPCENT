import catalog from "./generated/catalog.generated.json";

export const categories = catalog.categories;
export const products = catalog.products;

const uniqueSeries = new Set(products.map((product) => product.series).filter(Boolean));
const imageCount = products.filter((product) => product.image).length;

export const siteStats = [
  { label: "一级分类", value: `${categories.length}+` },
  { label: "分类条目", value: `${products.length}+` },
  { label: "已匹配图片", value: `${imageCount}+` },
  { label: "产品系列", value: `${uniqueSeries.size}+` },
];

export const advantages = [
  {
    title: "分类驱动",
    description: "网站产品体系由 Excel 分类表生成，一级、二级、三级顺序保持与源表一致。",
  },
  {
    title: "图片映射",
    description: "导入脚本按分类名、三级名和型号匹配图片，少量差异通过别名表维护。",
  },
  {
    title: "维护友好",
    description: "销售同事更新 Excel 和图片后，运行导入脚本即可刷新网站数据。",
  },
  {
    title: "可扩展",
    description: "后续可继续接入 PDF、CAD、STEP、规格参数和真实 SKU 数据。",
  },
];

function getProductsByCategorySlug(categorySlug, count = 4) {
  return products
    .filter((product) => product.path?.[0] === categorySlug)
    .slice(0, count)
    .map((product) => product.slug);
}

export const solutions = [
  {
    slug: "kitchen",
    name: "厨柜解决方案",
    description: "围绕高柜、地柜、转角柜、吊柜等厨柜功能类目组织产品入口。",
    industries: "住宅 / 精装 / 海外项目",
    productSlugs: getProductsByCategorySlug("kitchen-solutions"),
  },
  {
    slug: "wardrobe",
    name: "衣柜解决方案",
    description: "围绕挂衣、收纳、裤架、抽盒和升降系统组织衣柜五金体系。",
    industries: "住宅 / 全屋定制 / 经销",
    productSlugs: getProductsByCategorySlug("wardrobe-solutions"),
  },
  {
    slug: "sliding",
    name: "移门解决方案",
    description: "覆盖移门轮、轨道、折叠门和回旋门等移动门系统。",
    industries: "衣柜 / 商业空间 / 工程项目",
    productSlugs: getProductsByCategorySlug("sliding-solutions"),
  },
  {
    slug: "lighting",
    name: "照明解决方案",
    description: "覆盖灯带、插座、开关、轨道和电源等柜体照明与电气配套。",
    industries: "厨房 / 衣柜 / 商业展示",
    productSlugs: getProductsByCategorySlug("lighting-solutions"),
  },
];

export const supportResources = [
  {
    title: "导入报告",
    type: "Report",
    description: "每次运行导入脚本都会生成匹配结果，方便检查缺图、未使用图片和别名匹配。",
  },
  {
    title: "分类维护",
    type: "Catalog",
    description: "一级、二级、三级分类来自 Excel 第一张表，网站保持源表顺序。",
  },
  {
    title: "图片维护",
    type: "Image",
    description: "图片按一级分类归档，文件名优先使用“三级中文名-型号”的格式。",
  },
  {
    title: "资料扩展",
    type: "Files",
    description: "后续可把 PDF、CAD、STEP 文件纳入同一导入流程。",
  },
];

export const faqs = [
  {
    question: "网站分类数据从哪里来？",
    answer: "当前来自资源目录中的 Excel 第一张表“产品分类表0314调整版”。",
  },
  {
    question: "图片如何和表格匹配？",
    answer: "脚本优先匹配三级中文名和型号，其次匹配三级中文名，最后使用 resources/catalog-aliases.json 中的别名。",
  },
  {
    question: "销售更新资料后如何上线？",
    answer: "把更新后的 Excel 和图片放进资源目录，运行 npm run import:catalog，再构建或启动网站即可。",
  },
];

export const downloads = products
  .filter((product) => product.image)
  .map((product) => ({
    id: `${product.slug}-image`,
    title: `${product.name} 图片资料`,
    type: "图片资料",
    productSlug: product.slug,
    productModel: product.model || product.name,
    categorySlug: product.path?.[0] || "",
  }));

export const newsItems = [
  {
    slug: "catalog-import-workflow",
    title: "TOPCENT 产品目录导入流程建立",
    date: "2026-05-09",
    summary: "网站已支持从 Excel 和图片资源生成产品分类数据。",
  },
  {
    slug: "image-mapping-report",
    title: "图片匹配报告机制上线",
    date: "2026-05-09",
    summary: "导入后自动输出缺图、未使用图片和别名匹配信息。",
  },
  {
    slug: "catalog-maintenance-standard",
    title: "销售资料维护规范建立",
    date: "2026-05-09",
    summary: "通过统一字段和图片命名规范降低后续维护成本。",
  },
];

export const contactPoints = [
  {
    region: "总部 / Global HQ",
    address: "Guangdong, China",
    email: "sales@topcent.com",
    phone: "+86 000 0000 0000",
  },
  {
    region: "国际销售支持",
    address: "Export Service Desk",
    email: "global@topcent.com",
    phone: "+86 000 0000 1000",
  },
  {
    region: "技术支持中心",
    address: "Engineering Support Team",
    email: "support@topcent.com",
    phone: "+86 000 0000 2000",
  },
];
