import { newsItems } from "../data/siteData";

export default function NewsPage() {
  return (
    <div className="container page-stack">
      <section className="page-hero">
        <span className="eyebrow">Newsroom</span>
        <h1>新闻中心</h1>
        <p>用来承接品牌动态、产品更新、目录发布和经销支持内容。</p>
      </section>

      <section className="news-grid">
        {newsItems.map((item) => (
          <article className="news-card" key={item.slug}>
            <span>{item.date}</span>
            <h2>{item.title}</h2>
            <p>{item.summary}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
