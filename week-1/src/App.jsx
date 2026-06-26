import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import NewPromptPage from "./pages/NewPromptPage.jsx";
import PromptDetailPage from "./pages/PromptDetailPage.jsx";

/**
 * Route table. Layout is a parent route so the navbar/header persists across
 * all child routes (which render into Layout's <Outlet />).
 *
 * Note: order matters — "/prompts/new" is declared before "/prompts/:id" so the
 * literal path wins over the dynamic param.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="prompts/new" element={<NewPromptPage />} />
        <Route path="prompts/:id" element={<PromptDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
