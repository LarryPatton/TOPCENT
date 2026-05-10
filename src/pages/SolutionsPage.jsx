import { Link } from "react-router-dom";
import { products, solutions } from "../data/siteData";

export default function SolutionsPage() {
  return (
    <div className="container page-stack">
      <section className="page-hero">
        <span className="eyebrow">Application Scenarios</span>
        <h1>解决方案</h1>
        <p>不是只列产品，而是围绕应用场景将系列、下载和销售路径组织成完整方案。</p>
      </section>

      <div className="solution-page-grid">
        {solutions.map((solution) => {
          const mappedProducts = solution.productSlugs
            .map((slug) => products.find((item) => item.slug === slug))
            .filter(Boolean);

          return (
            <article className="solution-detail-card" key={solution.slug}>
              <span className="eyebrow">{solution.industries}</span>
              <h2>{solution.name}</h2>
              <p>{solution.description}</p>
              <div className="solution-product-links">
                {mappedProducts.map((product) => (
                  <Link key={product.slug} to={`/products/${product.slug}`}>
                    {product.model} · {product.name}
                  </Link>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
