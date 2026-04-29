import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import PageIntro from "../../components/ui/PageIntro";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await register(form);

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
        title="Créer un compte donateur"
        description="Inscris-toi pour faire un don, consulter ton historique personnel et suivre l’affectation de tes contributions."
        gradient
      />

      <section className="py-16">
        <div className="container-app max-w-3xl">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-slate-900">Inscription</h2>
            <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
              <div className="md:col-span-2">
                <label className="label">Nom complet</label>
                <input
                  className="input"
                  value={form.fullname}
                  onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                  placeholder="Votre nom complet"
                  required
                />
              </div>
              <div>
                <label className="label">Adresse email</label>
                <input
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="vous@exemple.com"
                  required
                />
              </div>
              <div>
                <label className="label">Téléphone</label>
                <input
                  className="input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+243 ..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Mot de passe</label>
                <input
                  type="password"
                  className="input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimum 8 caractères"
                  required
                />
              </div>

              {error && (
                <div className="md:col-span-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="md:col-span-2 flex flex-wrap items-center gap-4">
                <Button type="submit">{isSubmitting ? "Création..." : "S’inscrire"}</Button>
                <p className="text-sm text-slate-500">
                  Déjà inscrit ?{" "}
                  <Link to="/connexion" className="font-semibold text-brand-red">
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
