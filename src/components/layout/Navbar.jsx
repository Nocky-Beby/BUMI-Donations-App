import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import { useAuth } from "../../context/AuthContext";

const publicLinks = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "À propos" },
  { to: "/besoins", label: "Nos besoins" },
  { to: "/comment-faire-un-don", label: "Faire un don" },
  { to: "/impact", label: "Impact" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
];

const DASHBOARD_BY_ROLE = {
  donor: "/espace-donateur",
  admin: "/admin",
  manager: "/responsable",
  partner: "/partenaire",
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isManager = isAuthenticated && user?.role === "manager";
  const isHomePage = location.pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-lg">
      <div className="container-app flex h-20 items-center justify-between gap-4">
        <Link to="/" className="shrink-0">
          <Logo compact />
        </Link>

        {!isManager && (
          <nav className="hidden items-center gap-6 lg:flex">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive ? "text-brand-red" : "text-slate-600 hover:text-brand-red"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="hidden items-center gap-3 lg:flex">
          {isManager ? (
            isHomePage ? (
              <Button to="/responsable" variant="secondary">
                Mon espace
              </Button>
            ) : (
              <Button to="/" variant="secondary">
                Retour a la page Accueil
              </Button>
            )
          ) : isAuthenticated ? (
            <>
              <Button to={DASHBOARD_BY_ROLE[user.role]} variant="secondary">
                Mon espace
              </Button>
              <Button onClick={logout} variant="primary">
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button to="/connexion" variant="secondary">
                Se connecter
              </Button>
              <Button to="/inscription">S’inscrire</Button>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 lg:hidden"
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-app flex flex-col gap-4 py-5">
            {!isManager &&
              publicLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-slate-700"
                >
                  {link.label}
                </NavLink>
              ))}
            <div className="flex flex-wrap gap-3 pt-2">
              {isManager ? (
                isHomePage ? (
                  <Button to="/responsable" variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
                    Mon espace
                  </Button>
                ) : (
                  <Button to="/" variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
                    Retour a la page Accueil
                  </Button>
                )
              ) : isAuthenticated ? (
                <>
                  <Button to={DASHBOARD_BY_ROLE[user.role]} variant="secondary" className="flex-1">
                    Mon espace
                  </Button>
                  <Button onClick={logout} className="flex-1">
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button to="/connexion" variant="secondary" className="flex-1">
                    Se connecter
                  </Button>
                  <Button to="/inscription" className="flex-1">
                    S’inscrire
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
