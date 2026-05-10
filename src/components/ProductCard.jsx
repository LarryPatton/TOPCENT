import { Link } from "react-router-dom";
import ProductVisual from "./ProductVisual";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <button className="favorite-button" type="button" aria-label="收藏">
        ☆
      </button>
      <div className="product-card-media">
        <ProductVisual compact alt={product.name} image={product.image} type={product.visual} />
      </div>
      <div className="product-card-body">
        <span className="product-model">{product.model || "未设型号"}</span>
        <h3>{product.name}</h3>
        <p>{product.nameEn}</p>
        <div className="product-chip-row">
          {[product.material, product.finish, product.weight ? `${product.weight}g` : ""]
            .filter((value) => value && value !== "未指定")
            .slice(0, 3)
            .map((value) => (
              <span key={value}>{value}</span>
            ))}
        </div>
        <p className="product-range">{product.length ? `${product.length}mm` : product.summary}</p>
        <div className="product-actions">
          <Link className="button button-secondary" to={`/products/${product.slug}`}>
            查看详情 ›
          </Link>
        </div>
      </div>
    </article>
  );
}
