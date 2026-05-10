import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AppLayout from "./App";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import SearchPage from "./pages/SearchPage";
import { LanguageProvider } from "./i18n/LanguageContext";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products/*", element: <CatalogPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "*", element: <Navigate to="/products" replace /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  </React.StrictMode>
);
