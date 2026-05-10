import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export default function Header() {
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();
  const [keyword, setKeyword] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const query = keyword.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar-inner">
          <Link className="brand" to="/">
            <span className="brand-mark">TC</span>
            <span>
              <strong>TOPCENT</strong>
              <small>Industrial Product Navigation System</small>
            </span>
          </Link>

          <form className="header-search" onSubmit={handleSubmit}>
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={t("heroSearchPlaceholder")}
              aria-label={t("search")}
            />
            <button type="submit">{t("search")}</button>
          </form>

          <nav className={`header-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary">
            <NavLink
              className={({ isActive }) => `nav-link ${isActive ? "is-active" : ""}`}
              to="/products"
              onClick={() => setMenuOpen(false)}
            >
              {t("productCenter")}
            </NavLink>
          </nav>

          <div className="topbar-links">
            <button
              className="language-switch"
              type="button"
              onClick={toggleLanguage}
              aria-label={t("languageLabel")}
            >
              ◎ {language === "zh" ? "中文" : "EN"}⌄
            </button>
            <button
              className="menu-toggle"
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Menu"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
