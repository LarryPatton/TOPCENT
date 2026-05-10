import { Link, useSearchParams } from "react-router-dom";
import { categories, downloads, products } from "../data/siteData";

function includesQuery(fields, query) {
  return fields.join(" ").toLowerCase().includes(query.toLowerCase());
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const categoryResults = query
    ? categories.filter((category) =>
        includesQuery([category.name, category.nameEn, category.description], query)
      )
    : [];

  const productResults = query
    ? products.filter((product) =>
        includesQuery(
          [
            product.model,
            product.name,
            product.nameEn,
            product.material,
            product.series,
            product.summary,
          ],
          query
        )
      )
    : [];

  const documentResults = query
    ? downloads.filter((item) =>
        includesQuery([item.title, item.type, item.productModel], query)
      )
    : [];

  return (
    <div className="container page-stack">
      <section className="page-hero">
        <span className="eyebrow">Search First</span>
        <h1>搜索结果</h1>
        <p>工业产品网站优先服务“已知型号”和“已知用途”的快速查找路径。</p>
      </section>

      <section className="search-summary">
        <strong>{query ? `关键词: ${query}` : "请输入搜索关键词"}</strong>
        <span>
          分类 {categoryResults.length} / 产品 {productResults.length} / 文档 {documentResults.length}
        </span>
      </section>

      <div className="search-layout">
        <section className="search-column">
          <div className="section-heading compact">
            <h2>分类结果</h2>
          </div>
          <div className="stack-cards">
            {categoryResults.length ? (
              categoryResults.map((item) => (
                <Link className="list-card" key={item.slug} to={`/products/${item.slug}`}>
                  <strong>{item.name}</strong>
                  <span>{item.nameEn}</span>
                  <p>{item.description}</p>
                </Link>
              ))
            ) : (
              <div className="empty-state compact">
                <p>没有匹配的分类结果。</p>
              </div>
            )}
          </div>
        </section>

        <section className="search-column">
          <div className="section-heading compact">
            <h2>产品结果</h2>
          </div>
          <div className="stack-cards">
            {productResults.length ? (
              productResults.map((item) => (
                <Link className="list-card" key={item.slug} to={`/products/${item.slug}`}>
                  <strong>{item.model}</strong>
                  <span>
                    {item.name} / {item.nameEn}
                  </span>
                  <p>{item.summary}</p>
                </Link>
              ))
            ) : (
              <div className="empty-state compact">
                <p>没有匹配的产品结果。</p>
              </div>
            )}
          </div>
        </section>

        <section className="search-column">
          <div className="section-heading compact">
            <h2>文档结果</h2>
          </div>
          <div className="stack-cards">
            {documentResults.length ? (
              documentResults.map((item) => (
                <Link className="list-card" key={item.id} to={`/downloads?type=${encodeURIComponent(item.type)}`}>
                  <strong>{item.title}</strong>
                  <span>{item.type}</span>
                  <p>关联产品: {item.productModel}</p>
                </Link>
              ))
            ) : (
              <div className="empty-state compact">
                <p>没有匹配的文档结果。</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
