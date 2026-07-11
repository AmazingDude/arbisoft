import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import NewPromptPage from "./pages/NewPromptPage.jsx";
import PromptDetailPage from "./pages/PromptDetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

/**
 * Route table. Auth pages are public; everything under ProtectedRoute
 * requires a valid JWT session.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="prompts/new" element={<NewPromptPage />} />
          <Route path="prompts/:id" element={<PromptDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
