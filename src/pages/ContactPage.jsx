import { useState } from "react";
import { contactPoints } from "../data/siteData";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="container page-stack">
      <section className="page-hero">
        <span className="eyebrow">Contact</span>
        <h1>联系我们</h1>
        <p>询盘入口、销售联系和技术支持统一收口，方便客户和内部团队协同跟进。</p>
      </section>

      <div className="contact-layout">
        <section className="info-grid">
          {contactPoints.map((point) => (
            <article className="info-card" key={point.region}>
              <h2>{point.region}</h2>
              <p>{point.address}</p>
              <p>{point.email}</p>
              <p>{point.phone}</p>
            </article>
          ))}
        </section>

        <section className="contact-form-panel">
          <h2>项目询盘</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input name="name" placeholder="姓名 / 公司" required />
            <input name="email" placeholder="邮箱" type="email" required />
            <input name="model" placeholder="感兴趣的产品型号" />
            <textarea
              name="message"
              placeholder="请描述应用场景、所需资料或项目需求"
              rows="6"
              required
            />
            <button className="button" type="submit">
              提交询盘
            </button>
          </form>
          {submitted ? (
            <p className="form-success">已记录你的询盘信息。当前为演示环境，后续可接 CRM / 邮件服务。</p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
