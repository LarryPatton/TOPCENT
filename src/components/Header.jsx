import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/products", label: "产品中心" },
];

export default function Header() {
  const navigate = useNavigate();
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
              placeholder="输入产品型号、名称、材质或应用场景"
              aria-label="站内搜索"
            />
            <button type="submit">搜索</button>
          </form>

          <div className="topbar-links">
            <span className="language-switch" aria-label="语言">
              ◎ 中文⌄
            </span>
            <button
              className="menu-toggle"
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="打开导航"
            >
              {menuOpen ? "关闭" : "菜单"}
            </button>
          </div>
        </div>
      </div>

      <div className={`main-nav ${menuOpen ? "is-open" : ""}`}>
        <div className="container main-nav-inner">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "is-active" : ""}`
              }
              to={item.to}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
