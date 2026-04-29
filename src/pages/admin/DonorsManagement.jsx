import { useState } from "react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { usersApi } from "../../services/api";
import { formatDate, formatStatusLabel } from "../../utils/format";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  organization: "",
};

export default function DonorsManagement() {
  const [donors, setDonors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadDonors = async () => {
    try {
      const response = await usersApi.all();
      setDonors((response.items || []).filter((item) => item.role === "donor"));
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger les donateurs.");
    }
  };

  useAutoRefresh(loadDonors, 12000);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSaving(true);

    try {
      const response = await usersApi.create({ ...form, role: "donor" });
      setMessage(response.message || "Donateur ajouté avec succès.");
      setForm(initialForm);
      setShowForm(false);
      await loadDonors();
    } catch (apiError) {
      setError(apiError.message || "La création du donateur a échoué.");
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    { key: "name", header: "Nom" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Téléphone" },
    { key: "contributions", header: "Contributions" },
    { key: "createdAt", header: "Créé le", render: (value) => formatDate(value) },
    { key: "status", header: "Statut", render: (value) => <Badge text={formatStatusLabel(value)} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Gestion des donateurs</h2>
          <p className="mt-3 text-slate-600">
            Administrer les comptes, suivre l’activité et renforcer l’engagement des contributeurs.
          </p>
        </div>
        <Button type="button" onClick={() => setShowForm((current) => !current)}>
          {showForm ? "Fermer le formulaire" : "Ajouter un donateur"}
        </Button>
      </div>

      {message && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {showForm && (
        <form className="card grid gap-5 p-8 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <label className="label">Nom complet</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="label">Téléphone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Mot de passe initial</label>
            <input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div>
            <label className="label">Organisation (optionnel)</label>
            <input className="input" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Button type="submit">{isSaving ? "Enregistrement..." : "Enregistrer le donateur"}</Button>
          </div>
        </form>
      )}

      <DataTable columns={columns} rows={donors} emptyMessage="Aucun donateur enregistré pour le moment." />
    </div>
  );
}
