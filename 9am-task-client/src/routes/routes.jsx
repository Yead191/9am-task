import { createBrowserRouter } from "react-router";
import Root from "../layouts/Root";
import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "@/layouts/Dashboard";
import ShopDashboard from "@/pages/DashboardPages/ShopDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      //   { path: "about", Component: About },
      {
        path: "login",
        Component: Login,
      },
      { path: "register", Component: Register },
    ],
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
]);

export default router;
