import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./routes/routes.jsx";
import { Toaster } from "sonner";
import ShopDashboard from "./pages/DashboardPages/ShopDashboard";

// Determine subdomain
// const hostnameParts = window.location.hostname.split(".");
// const subdomain =
//   hostnameParts.length >= 3 && hostnameParts[0] !== "localhost"
//     ? hostnameParts[0]
//     : null;

// Create a fallback router for the ShopDashboard if needed
// const shopRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: <ShopDashboard shopName={subdomain} />,
//   },
// ]);

createRoot(document.getElementById("root")).render(
  <>
    <Toaster position="top-right" />
    <RouterProvider router={router} />
  </>
);
