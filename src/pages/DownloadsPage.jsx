import { Link, useSearchParams } from "react-router-dom";
import { downloads } from "../data/siteData";

export default function DownloadsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeType = searchParams.get("type") || "全部";
  const types = ["全部", ...new Set(downloads.map((item) => item.type))];
  const items =
    activeType === "全部" ? downloads : downloads.filter((item) => item.type === activeType);

  return (
    <div className="container page-stack">
      <section className="page-hero">
        <span className="eyebrow">Download Center</span>
        <h1>下载中心</h1>
        <p>当前已接入产品图片资料，后续可继续扩展 PDF、CAD、STEP 与安装文件。</p>
      </section>

      <div className="download-type-bar">
        {types.map((type) => (
          <button
            className={`filter-chip ${activeType === type ? "is-active" : ""}`}
            key={type}
            type="button"
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              if (type === "全部") {
                next.delete("type");
              } else {
                next.set("type", type);
              }
              setSearchParams(next, { replace: true });
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <section className="download-grid">
        {items.map((item) => (
          <article className="download-card" key={item.id}>
            <span className="download-type">{item.type}</span>
            <h3>{item.title}</h3>
            <p>关联产品: {item.productModel}</p>
            <div className="download-actions">
              <Link className="button button-secondary" to={`/products/${item.productSlug}`}>
                查看产品
              </Link>
              <Link className="button" to={`/products/${item.productSlug}`}>
                打开资料
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
