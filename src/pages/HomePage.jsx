import { Link } from "react-router-dom";
import {
  advantages,
  categories,
  products,
} from "../data/siteData";
import ProductVisual from "../components/ProductVisual";
import { getCategoryRepresentativeProduct } from "../utils/catalog";

export default function HomePage() {
  const featuredProducts = products.filter((product) => product.image).slice(0, 4);
  const heroProduct =
    products.find((product) => product.path?.[0] === "slide-solutions" && product.image) ||
    products.find((product) => product.image) ||
    products[0];

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="container home-hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Modern Industrial Hardware System</span>
            <h1>TOPCENT 产品中心</h1>
            <p>
              工业五金产品导航系统，支持型号、分类与产品搜索，快速找到所需产品与资料。
            </p>
            <form className="home-search" action="/search">
              <input name="q" placeholder="搜索型号、产品或分类" />
              <button type="submit">搜索</button>
            </form>
            <div className="hero-search-tips">
              <strong>热门搜索:</strong>
              <Link to="/search?q=BD.3000">BD.3000</Link>
              <Link to="/search?q=%E9%93%9D%E5%90%88%E9%87%91%E6%8B%89%E6%89%8B">铝合金拉手</Link>
              <Link to="/search?q=%E4%B8%89%E8%8A%82%E7%BC%93%E5%86%B2%E8%BD%A8">三节缓冲轨</Link>
              <Link to="/search?q=%E9%9A%90%E8%97%8F%E5%BC%8F%E6%BB%91%E8%BD%A8">隐藏式滑轨</Link>
            </div>
          </div>

          <div className="hero-visual">
            <ProductVisual
              alt={heroProduct?.name || "TOPCENT 产品"}
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
            <h2>15 大产品解决方案</h2>
            <p>覆盖全部工业五金，满足多场景应用需求</p>
          </div>
          <Link className="text-link" to="/products">
            查看完整产品中心
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
                  <strong>{category.name}</strong>
                  <small>{category.nameEn}</small>
                </span>
                <ProductVisual
                  compact
                  alt={category.name}
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
            <h2>精选产品系列</h2>
            <p>高品质工业五金产品系列</p>
          </div>
          <Link className="text-link" to="/products">
            查看更多
          </Link>
        </div>
        <div className="featured-strip">
          {featuredProducts.map((product) => (
            <Link className="featured-system-card" key={product.slug} to={`/products/${product.slug}`}>
              <ProductVisual compact alt={product.name} image={product.image} type={product.visual} />
              <span>
                <strong>{product.name}</strong>
                <small>{product.nameEn}</small>
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
            <h2>产品系统能力</h2>
          </div>
        </div>
        <div className="advantage-grid">
          {advantages.map((item) => (
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
