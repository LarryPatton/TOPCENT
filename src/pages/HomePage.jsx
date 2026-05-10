import { Link } from "react-router-dom";
import {
  advantages,
  categories,
  products,
} from "../data/siteData";
import ProductVisual from "../components/ProductVisual";
import { useLanguage, useLocalizedEntity } from "../i18n/LanguageContext";
import { getCategoryRepresentativeProduct } from "../utils/catalog";

export default function HomePage() {
  const { language, t } = useLanguage();
  const { categoryName, categorySecondary, productName, productSecondary } = useLocalizedEntity();
  const featuredProducts = products.filter((product) => product.image).slice(0, 4);
  const heroProduct =
    products.find((product) => product.path?.[0] === "slide-solutions" && product.image) ||
    products.find((product) => product.image) ||
    products[0];
  const capabilityItems =
    language === "en"
      ? [
          {
            title: "Catalog-Driven",
            description: "Product categories are generated from the Excel catalog while preserving source order.",
          },
          {
            title: "Image Mapping",
            description: "Images are matched by category, item name, model number, and maintained aliases.",
          },
          {
            title: "Maintenance Friendly",
            description: "Sales teams can update the spreadsheet and images, then refresh website data through one import command.",
          },
          {
            title: "Expandable",
            description: "The structure is ready for PDF, CAD, STEP, specifications, and real SKU data.",
          },
        ]
      : advantages;

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="container home-hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Modern Industrial Hardware System</span>
            <h1>{t("heroTitle")}</h1>
            <p>{t("heroDesc")}</p>
            <form className="home-search" action="/search">
              <input name="q" placeholder={t("heroSearchPlaceholder")} />
              <button type="submit">{t("search")}</button>
            </form>
            <div className="hero-search-tips">
              <strong>{t("hotSearch")}</strong>
              <Link to="/search?q=BD.3000">BD.3000</Link>
              <Link to="/search?q=%E9%93%9D%E5%90%88%E9%87%91%E6%8B%89%E6%89%8B">铝合金拉手</Link>
              <Link to="/search?q=%E4%B8%89%E8%8A%82%E7%BC%93%E5%86%B2%E8%BD%A8">三节缓冲轨</Link>
              <Link to="/search?q=%E9%9A%90%E8%97%8F%E5%BC%8F%E6%BB%91%E8%BD%A8">隐藏式滑轨</Link>
            </div>
          </div>

          <div className="hero-visual">
            <ProductVisual
              alt={heroProduct ? productName(heroProduct) : "TOPCENT"}
              image={heroProduct?.image}
              type={heroProduct?.visual || "handle"}
            />
          </div>
        </div>
      </section>

      <section className="container section-stack home-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Product Solutions</span>
            <h2>{t("productSolutionsTitle")}</h2>
            <p>{t("productSolutionsDesc")}</p>
          </div>
          <Link className="text-link" to="/products">
            {t("fullProductCenter")}
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((category, index) => {
            const representative = getCategoryRepresentativeProduct([category.slug]);

            return (
              <Link
                className="category-tile"
                key={category.slug}
                to={`/products/${category.slug}`}
              >
                <span>
                  <span className="category-order">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{categoryName(category)}</strong>
                  <small>{categorySecondary(category)}</small>
                </span>
                <ProductVisual
                  compact
                  alt={categoryName(category)}
                  image={representative?.image}
                  type={representative?.visual || "handle"}
                />
                <i>›</i>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container section-stack home-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Featured Systems</span>
            <h2>{t("featuredSystems")}</h2>
            <p>{t("featuredSystemsDesc")}</p>
          </div>
          <Link className="text-link" to="/products">
            {t("more")}
          </Link>
        </div>
        <div className="featured-strip">
          {featuredProducts.map((product) => (
            <Link className="featured-system-card" key={product.slug} to={`/products/${product.slug}`}>
              <ProductVisual compact alt={productName(product)} image={product.image} type={product.visual} />
              <span>
                <strong>{productName(product)}</strong>
                <small>{productSecondary(product)}</small>
              </span>
              <i>›</i>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section-stack home-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Product Capability</span>
            <h2>{t("productCapability")}</h2>
          </div>
        </div>
        <div className="advantage-grid">
          {capabilityItems.map((item) => (
            <article className="advantage-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
