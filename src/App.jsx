import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  return null;
}

export default function AppLayout() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Header />
      <main className="page-shell">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
