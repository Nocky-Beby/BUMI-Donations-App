import { useState } from "react";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function DonorProfile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    organization: user?.organization || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const result = await updateProfile({
      name: form.name,
      phone: form.phone,
      organization: form.organization,
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setMessage(result.message || "Profil mis à jour.");
  };

  return (
    <div className="card p-8">
      <h2 className="text-3xl font-bold text-slate-900">Profil utilisateur</h2>
      <p className="mt-3 text-slate-600">
        Gérez les informations de base de votre compte donateur.
      </p>

      <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
        <div className="md:col-span-2">
          <label className="label">Nom complet</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Adresse email</label>
          <input type="email" className="input" value={form.email} disabled />
        </div>
        <div>
          <label className="label">Téléphone</label>
          <input
            className="input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="label">Organisation / structure</label>
          <input
            className="input"
            value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
          />
        </div>

        {message && (
          <div className="md:col-span-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="md:col-span-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="md:col-span-2">
          <Button type="submit">Mettre à jour mon profil</Button>
        </div>
      </form>
    </div>
  );
}
