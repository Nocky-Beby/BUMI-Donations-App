import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "../../context/AuthContext";

const BACKOFFICE_ROLES = new Set(["admin", "manager"]);
const MANAGER_BLOCKED_ROUTES = new Set([
  "/connexion",
  "/inscription",
  "/comment-faire-un-don",
]);
const DASHBOARD_BY_ROLE = {
  admin: "/admin",
  manager: "/responsable",
};

export default function PublicLayout() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  if (
    isAuthenticated &&
    BACKOFFICE_ROLES.has(user?.role) &&
    MANAGER_BLOCKED_ROUTES.has(location.pathname)
  ) {
    return <Navigate to={DASHBOARD_BY_ROLE[user.role] || "/"} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
