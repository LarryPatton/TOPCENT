import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container footer-grid footer-grid-compact">
        <div>
          <div className="footer-brand">TOPCENT</div>
          <p>{t("footerDesc")}</p>
        </div>

        <div>
          <h4>{t("footerProductEntry")}</h4>
          <div className="footer-links">
            <Link to="/products">{t("productCenter")}</Link>
            <Link to="/search?q=BD.3000">{t("footerModelSearch")}</Link>
          </div>
        </div>

        <div>
          <h4>{t("footerDataState")}</h4>
          <div className="footer-links footer-meta">
            <span>{t("footerExcelImport")}</span>
            <span>{t("footerImageMapping")}</span>
            <span>Product Center Only</span>
          </div>
        </div>

        <div>
          <h4>{t("contact")}</h4>
          <div className="footer-links footer-meta">
            <span>+86 574 8627 0910</span>
            <span>info@topcent.com</span>
            <span>浙江省宁波市鄞州区姜山镇科技园区</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
