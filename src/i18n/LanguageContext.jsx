import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);

const STORAGE_KEY = "topcent-language";
const supportedLanguages = ["zh", "en"];

const valueMap = {
  zh: {
    empty: "—",
    notSpecified: "未指定",
    none: "无",
    unknownModel: "未设型号",
    productCenter: "产品中心",
    search: "搜索",
    languageLabel: "语言",
    productTree: "产品树",
    categoryLevels: "一级 / 二级 / 三级分类",
    filters: "筛选",
    realFiltersOnly: "仅显示已有数据维度",
    clear: "清空",
    categories: "分类",
    products: "产品",
    documents: "文档",
    subCategories: "子分类",
    categoryEntry: "产品分类与资料入口",
    categoryOverviewPrefix: "按",
    categoryOverviewSuffix: "的二级、三级类目组织图片、型号和基础资料。",
    catalogMode: "工业目录模式: 分类树 + 筛选系统 + 产品详情",
    emptyResultsTitle: "当前没有匹配结果",
    emptyResultsBody: "可以清空筛选条件，或回到上一级分类继续浏览。",
    inCategorySearch: "分类内搜索",
    inCategorySearchPlaceholder: "型号 / 名称 / 材质 / 应用",
    sort: "排序",
    modelAsc: "型号 A-Z",
    modelDesc: "型号 Z-A",
    nameAsc: "名称升序",
    nameDesc: "名称降序",
    totalProducts: "共 {count} 个产品",
    perPage: "每页 {count} 条",
    featuredProducts: "精选产品",
    productList: "产品列表",
    secondLevelCategories: "二级分类",
    childCategories: "下级分类",
    home: "首页",
    model: "型号",
    sku: "SKU",
    material: "材质",
    finish: "表面处理",
    surface: "表面处理",
    installation: "安装方式",
    length: "长度",
    holeSpacing: "孔距",
    weight: "重量",
    series: "系列",
    categoryPath: "分类路径",
    applications: "适用场景",
    productName: "产品名称",
    productParams: "产品参数",
    sourceInfo: "来源信息",
    relatedProducts: "相关产品",
    mainImage: "主图",
    categoryImage: "分类图",
    dataImage: "资料图",
    pdf: "PDF资料",
    cad: "CAD图纸",
    model3d: "3D模型",
    installGuide: "安装指南",
    resourcesPending: "资料暂未接入",
    specNote: "以上数据来自当前分类表和图片资源，具体参数以后续产品规格数据为准。",
    drawingPending: "技术图纸区域待接入",
    excelSource: "Excel 来源",
    sourceRow: "来自产品分类表第 {row} 行。",
    noSourceRow: "暂无来源行号。",
    owner: "维护人员",
    noOwner: "未记录",
    note: "备注",
    noNote: "无备注",
    viewDetail: "查看详情",
    favorite: "收藏",
    productCapability: "产品系统能力",
    featuredSystems: "精选产品系列",
    more: "查看更多",
    fullProductCenter: "查看完整产品中心",
    productSolutionsTitle: "15 大产品解决方案",
    productSolutionsDesc: "覆盖全部工业五金，满足多场景应用需求",
    featuredSystemsDesc: "高品质工业五金产品系列",
    heroTitle: "TOPCENT 产品中心",
    heroDesc: "工业五金产品导航系统，支持型号、分类与产品搜索，快速找到所需产品与资料。",
    heroSearchPlaceholder: "搜索型号、产品或分类",
    hotSearch: "热门搜索:",
    footerDesc: "现代工业五金产品信息平台，当前版本聚焦产品中心、分类导航和产品资料展示。",
    footerProductEntry: "产品入口",
    footerModelSearch: "型号搜索",
    footerDataState: "数据状态",
    footerExcelImport: "Excel 分类导入",
    footerImageMapping: "图片资源映射",
    contact: "联系方式",
    searchFirst: "Search First",
    searchResults: "搜索结果",
    searchPageDesc: "工业产品网站优先服务“已知型号”和“已知用途”的快速查找路径。",
    keyword: "关键词: {query}",
    enterKeyword: "请输入搜索关键词",
    categoryResults: "分类结果",
    productResults: "产品结果",
    documentResults: "文档结果",
    noCategoryResults: "没有匹配的分类结果。",
    noProductResults: "没有匹配的产品结果。",
    noDocumentResults: "没有匹配的文档结果。",
    linkedProduct: "关联产品: {model}",
  },
  en: {
    empty: "—",
    notSpecified: "Not specified",
    none: "None",
    unknownModel: "No model",
    productCenter: "Product Center",
    search: "Search",
    languageLabel: "Language",
    productTree: "Product Tree",
    categoryLevels: "Level 1 / Level 2 / Level 3",
    filters: "Filters",
    realFiltersOnly: "Only dimensions available in current data",
    clear: "Clear",
    categories: "Categories",
    products: "Products",
    documents: "Documents",
    subCategories: "subcategories",
    categoryEntry: "Product category and resource entry",
    categoryOverviewPrefix: "",
    categoryOverviewSuffix: " is organized by subcategory, product image, model, and base information.",
    catalogMode: "Industrial catalog mode: product tree + filters + product details",
    emptyResultsTitle: "No matching results",
    emptyResultsBody: "Clear filters or move back to a higher-level category.",
    inCategorySearch: "Search in category",
    inCategorySearchPlaceholder: "Model / name / material / application",
    sort: "Sort",
    modelAsc: "Model A-Z",
    modelDesc: "Model Z-A",
    nameAsc: "Name A-Z",
    nameDesc: "Name Z-A",
    totalProducts: "{count} products",
    perPage: "{count} per page",
    featuredProducts: "Featured Products",
    productList: "Product List",
    secondLevelCategories: "Second-Level Categories",
    childCategories: "Child Categories",
    home: "Home",
    model: "Model",
    sku: "SKU",
    material: "Material",
    finish: "Finish",
    surface: "Surface",
    installation: "Installation",
    length: "Length",
    holeSpacing: "Hole spacing",
    weight: "Weight",
    series: "Series",
    categoryPath: "Category Path",
    applications: "Applications",
    productName: "Product Name",
    productParams: "Product Parameters",
    sourceInfo: "Source Info",
    relatedProducts: "Related Products",
    mainImage: "Main Image",
    categoryImage: "Category Image",
    dataImage: "Data Image",
    pdf: "PDF",
    cad: "CAD",
    model3d: "3D Model",
    installGuide: "Installation Guide",
    resourcesPending: "Resource not connected yet",
    specNote: "Data is generated from the current catalog spreadsheet and image resources. Final specifications should follow official product data.",
    drawingPending: "Technical drawing area pending",
    excelSource: "Excel Source",
    sourceRow: "Source row {row} in the catalog spreadsheet.",
    noSourceRow: "No source row recorded.",
    owner: "Owner",
    noOwner: "Not recorded",
    note: "Note",
    noNote: "No note",
    viewDetail: "View Details",
    favorite: "Favorite",
    productCapability: "Product Capability",
    featuredSystems: "Featured Systems",
    more: "View More",
    fullProductCenter: "View Full Product Center",
    productSolutionsTitle: "15 Product Solution Categories",
    productSolutionsDesc: "Industrial hardware coverage for multiple application scenarios.",
    featuredSystemsDesc: "Selected industrial hardware product systems.",
    heroTitle: "TOPCENT Product Center",
    heroDesc: "Industrial hardware navigation system supporting model, category, and product search.",
    heroSearchPlaceholder: "Search model, product, or category",
    hotSearch: "Popular:",
    footerDesc: "Modern industrial hardware information platform focused on product center, category navigation, and product resources.",
    footerProductEntry: "Product Entry",
    footerModelSearch: "Model Search",
    footerDataState: "Data Status",
    footerExcelImport: "Excel category import",
    footerImageMapping: "Image resource mapping",
    contact: "Contact",
    searchFirst: "Search First",
    searchResults: "Search Results",
    searchPageDesc: "Fast lookup paths for known model numbers and known application needs.",
    keyword: "Keyword: {query}",
    enterKeyword: "Enter a search keyword",
    categoryResults: "Category Results",
    productResults: "Product Results",
    documentResults: "Document Results",
    noCategoryResults: "No matching category results.",
    noProductResults: "No matching product results.",
    noDocumentResults: "No matching document results.",
    linkedProduct: "Linked product: {model}",
  },
};

const filterLabels = {
  material: { zh: "材质", en: "Material" },
  finish: { zh: "表面处理", en: "Finish" },
  installation: { zh: "安装方式", en: "Installation" },
  color: { zh: "颜色", en: "Color" },
  series: { zh: "系列", en: "Series" },
};

const valueTranslations = {
  未指定: "Not specified",
  无: "None",
  冷轧钢: "Cold-rolled steel",
  不锈钢: "Stainless steel",
  铝合金: "Aluminum alloy",
  锌合金: "Zinc alloy",
  塑料: "Plastic",
  塑胶: "Plastic",
  铁: "Iron",
  铜: "Copper",
  玻璃: "Glass",
  木质: "Wood",
  镀锌: "Galvanized",
  电解: "Electrolytic",
  侧装: "Side mount",
  底装: "Bottom mount",
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === "undefined") {
      return "zh";
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    return supportedLanguages.includes(stored) ? stored : "zh";
  });

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo(() => {
    function setLanguage(nextLanguage) {
      if (supportedLanguages.includes(nextLanguage)) {
        setLanguageState(nextLanguage);
      }
    }

    function toggleLanguage() {
      setLanguageState((current) => (current === "zh" ? "en" : "zh"));
    }

    function t(key, params = {}) {
      const template = valueMap[language][key] || valueMap.zh[key] || key;
      return Object.entries(params).reduce(
        (text, [name, replacement]) => text.replace(`{${name}}`, replacement),
        template
      );
    }

    function localizedValue(valueText) {
      if (!valueText) {
        return t("empty");
      }

      if (language === "zh") {
        return valueText;
      }

      return valueTranslations[valueText] || valueText;
    }

    return {
      language,
      setLanguage,
      toggleLanguage,
      t,
      localizedValue,
      filterLabel: (key) => filterLabels[key]?.[language] || key,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}

export function useLocalizedEntity() {
  const { language, t, localizedValue } = useLanguage();

  function categoryName(category) {
    return language === "en" ? category.nameEn || category.name : category.name;
  }

  function categorySecondary(category) {
    return language === "en" ? category.name : category.nameEn;
  }

  function categoryDescription(category) {
    if (language === "zh") {
      return category.description || category.overview;
    }

    return `${category.nameEn || category.name} ${t("categoryEntry")}.`;
  }

  function categoryOverview(category) {
    if (language === "zh") {
      return category.overview || category.description;
    }

    return `${category.nameEn || category.name}${t("categoryOverviewSuffix")}`;
  }

  function productName(product) {
    return language === "en" ? product.nameEn || product.name : product.name;
  }

  function productSecondary(product) {
    return language === "en" ? product.name : product.nameEn;
  }

  function productSummary(product, trail = []) {
    if (language === "zh") {
      return product.summary;
    }

    const path = trail.length
      ? trail.map((item) => item.nameEn || item.name).join(" / ")
      : product.nameEn || product.name;
    return path;
  }

  function productFeature(feature) {
    return localizedValue(feature);
  }

  function list(values = []) {
    return values.map(localizedValue).join(language === "zh" ? "、" : ", ");
  }

  return {
    categoryName,
    categorySecondary,
    categoryDescription,
    categoryOverview,
    productName,
    productSecondary,
    productSummary,
    productFeature,
    localizedValue,
    list,
  };
}
