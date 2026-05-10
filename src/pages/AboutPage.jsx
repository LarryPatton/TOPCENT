import { siteStats } from "../data/siteData";

export default function AboutPage() {
  return (
    <div className="container page-stack">
      <section className="page-hero">
        <span className="eyebrow">About TOPCENT</span>
        <h1>关于 TOPCENT</h1>
        <p>这里不是宣传型官网，而是围绕品牌、产品体系与工程能力形成一致认知的企业入口。</p>
      </section>

      <section className="stats-grid">
        {siteStats.map((item) => (
          <article className="stat-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="info-grid">
        <article className="info-card">
          <h2>品牌定位</h2>
          <p>现代工业五金产品导航系统，兼具 MISUMI 的结构能力、工业品牌的专业感与现代 SaaS 的交互秩序。</p>
        </article>
        <article className="info-card">
          <h2>制造能力</h2>
          <p>围绕标准件、定制件和工程资料输出构建完整的产品与交付流程。</p>
        </article>
        <article className="info-card">
          <h2>未来扩展</h2>
          <p>已预留收藏、对比、询盘、多语言、AI 搜索、3D 预览和 BIM 结构位。</p>
        </article>
      </section>
    </div>
  );
}
