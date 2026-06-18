import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
