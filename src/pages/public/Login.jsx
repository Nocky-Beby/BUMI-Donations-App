import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageIntro from "../../components/ui/PageIntro";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

const demoAccounts = [
  "donateur@bumi.org / password123 / rôle: donor",
  "admin@bumi.org / password123 / rôle: admin",
  "responsable@bumi.org / password123 / rôle: manager",
  "partenaire@bumi.org / password123 / rôle: partner",
];

export default function Login() {
  const [form, setForm] = useState({
    email: "donateur@bumi.org",
    password: "password123",
    role: "donor",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await login(form);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(result.redirectTo);
  };

  return (
    <div>
      <PageIntro
        title="Connexion sécurisée"
        description="Accède à ton espace personnel pour gérer les dons, consulter les besoins et suivre les affectations."
        gradient
      />

      <section className="py-16">
        <div className="container-app grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-slate-900">Comptes de test du backend</h2>
            <p className="mt-3 text-slate-600">
              Le backend est préchargé avec des comptes de départ pour tester chaque rôle dès la première installation.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {demoAccounts.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold text-slate-900">Se connecter</h2>
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="label">Adresse email</label>
                <input
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Mot de passe</label>
                <input
                  type="password"
                  className="input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Rôle</label>
                <select
                  className="input"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="donor">Donateur</option>
                  <option value="admin">Administrateur</option>
                  <option value="manager">Responsable</option>
                  <option value="partner">Partenaire</option>
                </select>
              </div>

              {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

              <Button type="submit">{isSubmitting ? "Connexion..." : "Se connecter"}</Button>
            </form>

            <p className="mt-6 text-sm text-slate-500">
              Nouveau donateur ?{" "}
              <Link to="/inscription" className="font-semibold text-brand-red">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
