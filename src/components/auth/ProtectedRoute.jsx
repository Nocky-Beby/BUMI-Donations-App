import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="card max-w-md p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">
            Vérification
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Chargement de votre session</h2>
          <p className="mt-3 text-slate-600">
            Nous confirmons vos informations d’accès pour sécuriser l’espace BUMI.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
