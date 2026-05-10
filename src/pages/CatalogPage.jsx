import { useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import CategoryTree from "../components/CategoryTree";
import FilterPanel from "../components/FilterPanel";
import ProductCard from "../components/ProductCard";
import ProductVisual from "../components/ProductVisual";
import { categories, products } from "../data/siteData";
import {
  applyProductFilters,
  findCategoryByPath,
  findProductBySlug,
  getCategoryChildCount,
  getCategoryOrderForPath,
  getCategoryRepresentativeProduct,
  getCategoryTrail,
  getDirectProductByPath,
  getFilterOptions,
  getProductsByPath,
} from "../utils/catalog";

const PAGE_SIZE = 12;

function FilterBar({ filters, onKeywordChange, onSortChange }) {
  return (
    <div className="catalog-toolbar">
      <label className="toolbar-search">
        <span>分类内搜索</span>
        <input
          type="search"
          placeholder="型号 / 名称 / 材质 / 应用"
          value={filters.keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
        />
      </label>

      <label className="toolbar-select">
        <span>排序</span>
        <select value={filters.sort} onChange={(event) => onSortChange(event.target.value)}>
          <option value="model-asc">型号 A-Z</option>
          <option value="model-desc">型号 Z-A</option>
          <option value="name-asc">名称升序</option>
          <option value="name-desc">名称降序</option>
        </select>
      </label>
    </div>
  );
}

function Breadcrumbs({ trail, product }) {
  return (
    <nav className="breadcrumbs">
      <Link to="/">首页</Link>
      <Link to="/products">产品中心</Link>
      {trail.map((item, index) => (
        <Link
          key={item.slug}
          to={`/products/${trail.slice(0, index + 1).map((node) => node.slug).join("/")}`}
        >
          {item.name}
        </Link>
      ))}
      {product ? <span>{product.model}</span> : null}
    </nav>
  );
}

function ProductDetailPage({ product }) {
  const trail = getCategoryTrail(product.path);
  const categoryPathLabel = trail.map((item) => item.name).join(" / ");
  const relatedProducts = products
    .filter(
      (item) =>
        item.slug !== product.slug && item.path.slice(0, 2).join("/") === product.path.slice(0, 2).join("/")
    )
    .slice(0, 4);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("specs");

  const gallery = [
    { key: "main", label: "主图", visual: product.visual, image: product.image },
    { key: "side", label: "分类图", visual: product.visual, image: product.image },
    { key: "detail", label: "资料图", visual: product.visual, image: product.image },
  ];

  return (
    <div className="container page-stack">
      <Breadcrumbs product={product} trail={trail} />

      <section className="detail-hero">
        <div className="detail-gallery">
          <div className="detail-main-visual">
            <ProductVisual
              alt={product.name}
              image={gallery[galleryIndex].image}
              type={gallery[galleryIndex].visual}
            />
          </div>
          <div className="thumb-row">
            {gallery.map((item, index) => (
              <button
                key={item.key}
                className={`thumb-button ${galleryIndex === index ? "is-active" : ""}`}
                type="button"
                onClick={() => setGalleryIndex(index)}
              >
                <ProductVisual compact alt={product.name} image={item.image} type={item.visual} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="detail-summary">
          <span className="product-model">{product.model || "未设型号"}</span>
          <h1>{product.name}</h1>
          <p className="detail-english">{product.nameEn}</p>
          <p>{product.summary}</p>

          <dl className="detail-meta">
            <div>
              <dt>型号</dt>
              <dd>{product.model || "—"}</dd>
            </div>
            <div>
              <dt>SKU</dt>
              <dd>{product.sku || "—"}</dd>
            </div>
            <div>
              <dt>材质</dt>
              <dd>{product.material}</dd>
            </div>
            <div>
              <dt>表面处理</dt>
              <dd>{product.finish}</dd>
            </div>
            <div>
              <dt>安装方式</dt>
              <dd>{product.installation}</dd>
            </div>
            <div>
              <dt>长度</dt>
              <dd>{product.length ? `${product.length}mm` : "—"}</dd>
            </div>
            <div>
              <dt>孔距</dt>
              <dd>{product.holeSpacing ? `${product.holeSpacing}mm` : "—"}</dd>
            </div>
            <div>
              <dt>重量</dt>
              <dd>{product.weight ? `${product.weight}g` : "—"}</dd>
            </div>
          </dl>

          <div className="feature-tags">
            {product.features.map((feature) => (
              <span className="tag" key={feature}>
                {feature}
              </span>
            ))}
          </div>
        </div>

        <aside className="detail-actions">
          <div className="resource-actions">
            {["PDF资料", "CAD图纸", "3D模型", "安装指南"].map((item) => (
              <button
                className="resource-button is-disabled"
                disabled
                key={item}
                type="button"
                title="资料暂未接入"
              >
                <span>□</span>
                {item}
              </button>
            ))}
          </div>
        </aside>
      </section>

      <section className="detail-tabs">
        {[
          { key: "specs", label: "产品参数" },
          { key: "source", label: "来源信息" },
          { key: "related", label: "相关产品" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? "is-active" : ""}`}
            type="button"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {activeTab === "specs" ? (
        <section className="table-panel detail-spec-panel">
          <div>
            <table className="spec-table">
              <tbody>
                <tr>
                  <th>产品名称</th>
                  <td>{product.name}</td>
                </tr>
                <tr>
                  <th>型号</th>
                  <td>{product.model || "—"}</td>
                </tr>
                <tr>
                  <th>系列</th>
                  <td>{product.series}</td>
                </tr>
                <tr>
                  <th>材质</th>
                  <td>{product.material}</td>
                </tr>
                <tr>
                  <th>表面处理</th>
                  <td>{product.surface}</td>
                </tr>
                <tr>
                  <th>安装方式</th>
                  <td>{product.installation}</td>
                </tr>
                <tr>
                  <th>分类路径</th>
                  <td>{categoryPathLabel}</td>
                </tr>
                <tr>
                  <th>适用场景</th>
                  <td>{product.applications?.join("、") || "—"}</td>
                </tr>
              </tbody>
            </table>
            <p className="spec-note">以上数据来自当前分类表和图片资源，具体参数以后续产品规格数据为准。</p>
          </div>
          <div className="technical-drawing-panel">
            <ProductVisual alt={product.name} image={product.image} type={product.visual} />
            <span>技术图纸区域待接入</span>
          </div>
        </section>
      ) : null}

      {activeTab === "source" ? (
        <section className="info-grid">
          <article className="info-card">
            <h3>Excel 来源</h3>
            <p>{product.source?.row ? `来自产品分类表第 ${product.source.row} 行。` : "暂无来源行号。"}</p>
          </article>
          <article className="info-card">
            <h3>维护人员</h3>
            <p>{product.source?.engineer || "未记录"}</p>
          </article>
          <article className="info-card">
            <h3>备注</h3>
            <p>{product.source?.note || "无备注"}</p>
          </article>
        </section>
      ) : null}

      {activeTab === "related" ? (
        <section className="product-grid">
          {relatedProducts.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </section>
      ) : null}
    </div>
  );
}

function getCategoryHref(pathSegments) {
  const category = findCategoryByPath(pathSegments);
  const directProduct = category?.children?.length
    ? null
    : getDirectProductByPath(pathSegments);

  return directProduct ? `/products/${directProduct.slug}` : `/products/${pathSegments.join("/")}`;
}

function CollapsibleSection({ title, kicker, children, defaultOpen = true, action }) {
  return (
    <details className="catalog-section collapsible-panel" open={defaultOpen}>
      <summary className="section-heading">
        <div>
          {kicker ? <span className="eyebrow">{kicker}</span> : null}
          <h2>{title}</h2>
        </div>
        <span className="section-summary-action">{action}</span>
      </summary>
      {children}
    </details>
  );
}

function CategoryOverviewCard({ category, pathSegments }) {
  const representative = getCategoryRepresentativeProduct(pathSegments);
  const childCount = getCategoryChildCount(pathSegments);
  const productCount = getProductsByPath(pathSegments).length;

  return (
    <Link className="category-overview-card" to={getCategoryHref(pathSegments)}>
      <ProductVisual
        compact
        alt={category.name}
        image={representative?.image}
        type={representative?.visual || "handle"}
      />
      <span className="category-overview-body">
        <strong>{category.name}</strong>
        <small>{childCount ? `${childCount} 个子分类` : `${productCount} 个产品`}</small>
        <p>{category.overview || category.description}</p>
      </span>
      <i>›</i>
    </Link>
  );
}

function Pagination({ currentPage, totalPages, total, onPageChange }) {
  if (totalPages <= 1) {
    return <div className="pagination-bar"><span>共 {total} 个产品</span></div>;
  }

  return (
    <div className="pagination-bar">
      <span>共 {total} 个产品</span>
      <div className="pagination-controls">
        <button type="button" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            className={page === currentPage ? "is-active" : ""}
            type="button"
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button type="button" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
          ›
        </button>
      </div>
      <span>每页 {PAGE_SIZE} 条</span>
    </div>
  );
}

function CatalogLanding({
  activeSegments,
  filters,
  onKeywordChange,
  onSortChange,
  onToggleFilter,
  onReset,
  onPageChange,
}) {
  const scopedProducts = getProductsByPath(activeSegments);
  const selectedCategory = findCategoryByPath(activeSegments) || categories[0];
  const heroProduct = scopedProducts.find((product) => product.image) || scopedProducts[0];
  const filterOptions = getFilterOptions(scopedProducts);
  const filteredProducts = applyProductFilters(scopedProducts, filters);
  const trail = getCategoryTrail(activeSegments);
  const isFirstLevel = activeSegments.length === 1;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(filters.page || 1, 1), totalPages);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const featuredProducts = scopedProducts.filter((product) => product.image).slice(0, isFirstLevel ? 5 : 12);

  return (
    <div className="container page-stack catalog-page">
      <Breadcrumbs trail={trail} />

      <section className="catalog-hero">
        <div>
          <span className="eyebrow">{selectedCategory.nameEn}</span>
          <h1>{selectedCategory.name}</h1>
          <p>{selectedCategory.description || selectedCategory.overview}</p>
          <div className="hero-stats-inline">
            <span>{scopedProducts.length} 个产品</span>
            <span>{selectedCategory.children?.length || 0} 个子分类</span>
            <span>{getCategoryOrderForPath(activeSegments).join(".") || "产品中心"}</span>
          </div>
        </div>
        <div className="catalog-hero-card">
          <ProductVisual
            alt={heroProduct?.name || selectedCategory.name}
            image={heroProduct?.image}
            type={heroProduct?.visual || "handle"}
          />
        </div>
      </section>

      <div className="catalog-layout">
        <div className="catalog-left">
          <CategoryTree activeSegments={activeSegments} />
          <FilterPanel
            onReset={onReset}
            onToggleFilter={onToggleFilter}
            options={filterOptions}
            selectedFilters={filters}
          />
        </div>

        <div className="catalog-right">
          {selectedCategory.children?.length ? (
            <CollapsibleSection title={isFirstLevel ? "二级分类" : "下级分类"} kicker="Categories">
              <section className="category-overview-grid">
                {selectedCategory.children.map((child) => (
                  <CategoryOverviewCard
                    key={child.slug}
                    category={child}
                    pathSegments={[...activeSegments, child.slug]}
                  />
                ))}
              </section>
            </CollapsibleSection>
          ) : null}

          <CollapsibleSection title={isFirstLevel ? "精选产品" : "产品列表"} kicker="Products">
            {!isFirstLevel ? (
              <CatalogToolbarRow
                filters={filters}
                onKeywordChange={onKeywordChange}
                onSortChange={onSortChange}
                resultsCount={filteredProducts.length}
              />
            ) : null}

            <section className={isFirstLevel ? "featured-product-row" : "catalog-product-grid"}>
              {(isFirstLevel ? featuredProducts : paginatedProducts).length ? (
                (isFirstLevel ? featuredProducts : paginatedProducts).map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))
              ) : (
                <div className="empty-state">
                  <h3>当前没有匹配结果</h3>
                  <p>可以清空筛选条件，或回到上一级分类继续浏览。</p>
                </div>
              )}
            </section>

            {!isFirstLevel ? (
              <Pagination
                currentPage={currentPage}
                onPageChange={onPageChange}
                total={filteredProducts.length}
                totalPages={totalPages}
              />
            ) : null}
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}

function CatalogToolbarRow({ filters, onKeywordChange, onSortChange, resultsCount }) {
  return (
    <section className="toolbar-panel">
      <CatalogSummary resultsCount={resultsCount} />
      <FilterBar filters={filters} onKeywordChange={onKeywordChange} onSortChange={onSortChange} />
    </section>
  );
}

function CatalogSummary({ resultsCount }) {
  return (
    <div className="result-summary">
      <strong>共 {resultsCount} 个产品</strong>
      <span>工业目录模式: 分类树 + 筛选系统 + 产品详情</span>
    </div>
  );
}

export default function CatalogPage() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const catchAll = params["*"] || "";
  const segments = catchAll.split("/").filter(Boolean);
  const product = segments.length === 1 ? findProductBySlug(segments[0]) : null;
  const directProduct = !product && segments.length > 1 ? getDirectProductByPath(segments) : null;

  const filters = useMemo(
    () => ({
      keyword: searchParams.get("keyword") || "",
      sort: searchParams.get("sort") || "model-asc",
      material: searchParams.get("material")?.split("|").filter(Boolean) || [],
      finish: searchParams.get("finish")?.split("|").filter(Boolean) || [],
      installation: searchParams.get("installation")?.split("|").filter(Boolean) || [],
      color: searchParams.get("color")?.split("|").filter(Boolean) || [],
      series: searchParams.get("series")?.split("|").filter(Boolean) || [],
      page: Number(searchParams.get("page") || 1),
    }),
    [searchParams]
  );

  const activeSegments = product ? product.path : segments.length ? segments : [categories[0]?.slug].filter(Boolean);

  function patchSearchParams(nextValues) {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(nextValues).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && !value.length)) {
        nextParams.delete(key);
        return;
      }
      nextParams.set(key, Array.isArray(value) ? value.join("|") : value);
    });
    setSearchParams(nextParams, { replace: true });
  }

  function toggleFilter(key, value) {
    const values = filters[key].includes(value)
      ? filters[key].filter((item) => item !== value)
      : [...filters[key], value];

    patchSearchParams({ [key]: values });
  }

  function resetFilters() {
    setSearchParams(new URLSearchParams(), { replace: true });
  }

  function changePage(page) {
    patchSearchParams({ page: String(page) });
  }

  if (product) {
    return <ProductDetailPage product={product} />;
  }

  if (directProduct) {
    return <Navigate replace to={`/products/${directProduct.slug}`} />;
  }

  return (
    <CatalogLanding
      activeSegments={activeSegments}
      filters={filters}
      onKeywordChange={(value) => patchSearchParams({ keyword: value })}
      onReset={resetFilters}
      onPageChange={changePage}
      onSortChange={(value) => patchSearchParams({ sort: value })}
      onToggleFilter={toggleFilter}
    />
  );
}
