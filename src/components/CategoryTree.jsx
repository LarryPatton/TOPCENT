import { Link } from "react-router-dom";
import { categories } from "../data/siteData";
import { useLanguage, useLocalizedEntity } from "../i18n/LanguageContext";
import { formatCategoryOrder, getDirectProductByPath } from "../utils/catalog";

function TreeNode({ node, activeSegments, trail = [], order = [], labels }) {
  const nextTrail = [...trail, node.slug];
  const nextOrder = order;
  const isActive = nextTrail.every((segment, index) => activeSegments[index] === segment);
  const directProduct = node.children?.length ? null : getDirectProductByPath(nextTrail);
  const href = directProduct ? `/products/${directProduct.slug}` : `/products/${nextTrail.join("/")}`;
  const shouldExpand = isActive && node.children?.length;

  return (
    <li className={`tree-node level-${trail.length} ${isActive ? "is-active" : ""}`}>
      <Link to={href}>
        <span>
          <b>{formatCategoryOrder(nextOrder)}</b>
          {labels.categoryName(node)}
        </span>
        <small>{labels.categorySecondary(node)}</small>
      </Link>

      {shouldExpand ? (
        <ul className="tree-group">
          {node.children.map((child, index) => (
            <TreeNode
              key={child.slug}
              activeSegments={activeSegments}
              labels={labels}
              node={child}
              order={[...nextOrder, index + 1]}
              trail={nextTrail}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function CategoryTree({ activeSegments }) {
  const { t } = useLanguage();
  const labels = useLocalizedEntity();

  return (
    <details className="sidebar-panel collapsible-panel" open>
      <summary className="panel-head">
        <span>
          <h3>{t("productTree")}</h3>
          <p>{t("categoryLevels")}</p>
        </span>
        <small />
      </summary>
      <ul className="tree-root">
        {categories.map((category, index) => (
          <TreeNode
            key={category.slug}
            activeSegments={activeSegments}
            labels={labels}
            node={category}
            order={[index + 1]}
          />
        ))}
      </ul>
    </details>
  );
}
