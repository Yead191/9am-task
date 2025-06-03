import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./routes/routes.jsx";
import { Toaster } from "sonner";
import ShopDashboard from "./pages/DashboardPages/ShopDashboard";

const hostnameParts = window.location.hostname.split(".");
const subdomain =
  hostnameParts.length >= 3 && hostnameParts[0] !== "localhost"
    ? hostnameParts[0]
    : null;

createRoot(document.getElementById("root")).render(
  <>
    <Toaster position="top-right" />
    {subdomain ? (
      <ShopDashboard shopName={subdomain} />
    ) : (
      <RouterProvider router={router} />
    )}
  </>
);
