import { faqs, supportResources } from "../data/siteData";

export default function SupportPage() {
  return (
    <div className="container page-stack">
      <section className="page-hero">
        <span className="eyebrow">Technical Support</span>
        <h1>技术支持</h1>
        <p>工业网站必须让工程师、销售和客户快速获取说明、文档、安装信息和常见问题答案。</p>
      </section>

      <section className="info-grid">
        {supportResources.map((item) => (
          <article className="info-card" key={item.title}>
            <span className="eyebrow">{item.type}</span>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="faq-list">
        {faqs.map((faq) => (
          <details className="faq-item" key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
