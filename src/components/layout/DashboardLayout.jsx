import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../ui/Logo";

const menus = {
  donor: [
    { to: "/espace-donateur", label: "Tableau de bord" },
    { to: "/espace-donateur/faire-un-don", label: "Faire un don" },
    { to: "/espace-donateur/historique", label: "Historique" },
    { to: "/espace-donateur/suivi", label: "Suivi de l’affectation" },
    { to: "/espace-donateur/profil", label: "Profil" },
  ],
  admin: [
    { to: "/admin", label: "Tableau de bord" },
    { to: "/admin/donateurs", label: "Gestion des donateurs" },
    { to: "/admin/dons", label: "Gestion des dons" },
    { to: "/admin/besoins", label: "Gestion des besoins" },
    { to: "/admin/partenaires", label: "Gestion des partenaires" },
    { to: "/admin/distributions", label: "Gestion des distributions" },
    { to: "/admin/rapports", label: "Rapports & statistiques" },
    { to: "/admin/parametres", label: "Paramètres" },
  ],
  manager: [
    { to: "/responsable", label: "Tableau de bord" },
    { to: "/responsable/besoins", label: "Mise à jour des besoins" },
    { to: "/responsable/dons", label: "Dons reçus" },
    { to: "/responsable/distributions", label: "Suivi des distributions" },
    { to: "/responsable/rapports", label: "Rapports" },
  ],
  partner: [
    { to: "/partenaire", label: "Vue partenaire" },
    { to: "/partenaire/besoins", label: "Consultation des besoins" },
    { to: "/partenaire/contributions", label: "Historique des contributions" },
    { to: "/partenaire/impact", label: "Suivi de l’impact" },
  ],
};

const roleLabels = {
  donor: "Espace donateur",
  admin: "Espace administrateur",
  manager: "Espace responsable",
  partner: "Espace partenaire",
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const menu = menus[user?.role] || [];
  const homeLabel = user?.role === "manager" ? "Retour a la page Accueil" : "Retour au site public";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[310px_1fr]">
        <aside className="border-r border-slate-200 bg-white">
          <div className="flex h-20 items-center border-b border-slate-200 px-6">
            <Link to="/" className="flex items-center gap-3">
              <Logo compact />
            </Link>
          </div>

          <div className="px-4 py-6">
            <div className="rounded-3xl bg-gradient-to-br from-brand-blush to-brand-greenSoft p-4">
              <p className="text-sm text-slate-500">Connecté en tant que</p>
              <p className="mt-1 font-semibold text-slate-900">{user?.name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>

            <nav className="mt-6 space-y-2">
              {menu.map((item) => (
                <NavLink
                  key={item.to}
                  end={item.to === "/espace-donateur" || item.to === "/admin" || item.to === "/responsable" || item.to === "/partenaire"}
                  to={item.to}
                  className={({ isActive }) =>
                    `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-brand-red text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button
              onClick={logout}
              className="mt-8 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Déconnexion
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="border-b border-slate-200 bg-white">
            <div className="container-app flex h-20 items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">
                  Gestion centralisée
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900">{roleLabels[user?.role]}</h1>
              </div>
              <Link
                to="/"
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {homeLabel}
              </Link>
            </div>
          </header>

          <main className="container-app py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
