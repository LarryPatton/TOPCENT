import { Link } from "react-router-dom";
import { useLanguage, useLocalizedEntity } from "../i18n/LanguageContext";
import ProductVisual from "./ProductVisual";

export default function ProductCard({ product }) {
  const { t } = useLanguage();
  const { productName, productSecondary, productSummary, localizedValue } = useLocalizedEntity();

  return (
    <article className="product-card ui-card">
      <button className="favorite-button" type="button" aria-label={t("favorite")}>
        ☆
      </button>
      <div className="product-card-media">
        <ProductVisual compact alt={productName(product)} image={product.image} type={product.visual} />
      </div>
      <div className="product-card-body">
        <span className="product-model">{product.model || t("unknownModel")}</span>
        <h3>{productName(product)}</h3>
        <p>{productSecondary(product)}</p>
        <div className="product-chip-row">
          {[product.material, product.finish, product.weight ? `${product.weight}g` : ""]
            .filter((value) => value && value !== "未指定")
            .slice(0, 3)
            .map((value) => (
              <span key={value}>{localizedValue(value)}</span>
            ))}
        </div>
        <p className="product-range">{product.length ? `${product.length}mm` : productSummary(product)}</p>
        <div className="product-actions">
          <Link className="button button-secondary" to={`/products/${product.slug}`}>
            {t("viewDetail")} ›
          </Link>
        </div>
      </div>
    </article>
  );
}
