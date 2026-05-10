import { categories, products } from "../data/siteData";

export function flattenCategories(nodes = categories, trail = []) {
  return nodes.flatMap((node, index) => {
    const current = [...trail, node];
    const order = [...trail.map((item) => item.orderIndex || 1), index + 1];
    return [
      { ...node, trail: current, depth: current.length - 1, order },
      ...flattenCategories(node.children || [], current),
    ];
  });
}

export function findCategoryByPath(pathSegments = []) {
  if (!pathSegments.length) {
    return null;
  }

  let level = categories;
  let current = null;

  for (const segment of pathSegments) {
    current = level.find((item) => item.slug === segment) || null;
    if (!current) {
      return null;
    }
    level = current.children || [];
  }

  return current;
}

export function getCategoryTrail(pathSegments = []) {
  const trail = [];
  let level = categories;

  for (const segment of pathSegments) {
    const match = level.find((item) => item.slug === segment);
    if (!match) {
      break;
    }
    trail.push(match);
    level = match.children || [];
  }

  return trail;
}

export function findProductBySlug(slug) {
  return products.find((product) => product.slug === slug) || null;
}

export function getProductsByPath(pathSegments = []) {
  if (!pathSegments.length) {
    return products;
  }

  return products.filter((product) =>
    pathSegments.every((segment, index) => product.path[index] === segment)
  );
}

export function getProductsDirectlyUnderPath(pathSegments = []) {
  return products.filter(
    (product) =>
      product.path.length === pathSegments.length &&
      pathSegments.every((segment, index) => product.path[index] === segment)
  );
}

export function getDirectProductByPath(pathSegments = []) {
  const directMatches = products.filter(
    (product) =>
      product.path.length === pathSegments.length &&
      pathSegments.every((segment, index) => product.path[index] === segment)
  );

  return directMatches.length === 1 ? directMatches[0] : null;
}

export function getCategoryBySlug(slug) {
  return flattenCategories().find((item) => item.slug === slug) || null;
}

export function getCategoryLabel(slug) {
  return getCategoryBySlug(slug)?.name || slug;
}

export function getFilterOptions(scopedProducts) {
  const keys = ["material", "finish", "installation", "color", "series"];
  const invalidValues = new Set(["未指定", "无", "—", "-"]);

  return keys.reduce((accumulator, key) => {
    accumulator[key] = [
      ...new Set(
        scopedProducts
          .map((product) => product[key])
          .filter((value) => value && !invalidValues.has(value))
      ),
    ].sort();
    return accumulator;
  }, {});
}

export function getCategoryProducts(categoryPath) {
  return getProductsByPath(categoryPath);
}

export function getCategoryRepresentativeProduct(categoryPath) {
  return getCategoryProducts(categoryPath).find((product) => product.image) || getCategoryProducts(categoryPath)[0] || null;
}

export function getCategoryChildCount(categoryPath) {
  return findCategoryByPath(categoryPath)?.children?.length || 0;
}

export function formatCategoryOrder(order = []) {
  if (!order.length) {
    return "";
  }
  return order.length === 1
    ? String(order[0]).padStart(2, "0")
    : order.join(".");
}

export function getCategoryOrderForPath(pathSegments = []) {
  const order = [];
  let level = categories;

  for (const segment of pathSegments) {
    const index = level.findIndex((item) => item.slug === segment);
    if (index < 0) {
      break;
    }
    order.push(index + 1);
    level = level[index].children || [];
  }

  return order;
}

export function applyProductFilters(scopedProducts, filters) {
  const keyword = (filters.keyword || "").trim().toLowerCase();

  return scopedProducts
    .filter((product) => {
      if (keyword) {
        const haystack = [
          product.model,
          product.sku,
          product.name,
          product.nameEn,
          product.material,
          product.series,
          product.summary,
          ...(product.features || []),
          ...(product.applications || []),
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(keyword)) {
          return false;
        }
      }

      for (const key of ["material", "finish", "installation", "color", "series"]) {
        if (filters[key]?.length && !filters[key].includes(product[key])) {
          return false;
        }
      }

      return true;
    })
    .sort((left, right) => sortProducts(left, right, filters.sort));
}

function sortProducts(left, right, sort = "model-asc") {
  switch (sort) {
    case "name-desc":
      return right.name.localeCompare(left.name, "zh-CN");
    case "length-desc":
      return (right.length || 0) - (left.length || 0);
    case "length-asc":
      return (left.length || 0) - (right.length || 0);
    case "name-asc":
      return left.name.localeCompare(right.name, "zh-CN");
    case "model-desc":
      return (right.model || right.name).localeCompare(left.model || left.name, "en");
    case "model-asc":
    default:
      return (left.model || left.name).localeCompare(right.model || right.name, "en");
  }
}
