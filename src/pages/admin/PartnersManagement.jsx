import { useState } from "react";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { partnersApi } from "../../services/api";
import { formatDate, formatStatusLabel } from "../../utils/format";

const initialForm = {
  name: "",
  contactPerson: "",
  email: "",
  phone: "",
  sector: "",
};

export default function PartnersManagement() {
  const [partners, setPartners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadPartners = async () => {
    try {
      const response = await partnersApi.all();
      setPartners(response.items || []);
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger les partenaires.");
    }
  };

  useAutoRefresh(loadPartners, 12000);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSaving(true);

    try {
      const response = await partnersApi.create(form);
      setMessage(response.message || "Partenaire ajouté avec succès.");
      setForm(initialForm);
      setShowForm(false);
      await loadPartners();
    } catch (apiError) {
      setError(apiError.message || "La création du partenaire a échoué.");
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    { key: "name", header: "Partenaire" },
    { key: "contactPerson", header: "Contact" },
    { key: "email", header: "Email" },
    { key: "sector", header: "Secteur" },
    { key: "createdAt", header: "Ajouté le", render: (value) => formatDate(value) },
    { key: "status", header: "Statut", render: (value) => <Badge text={formatStatusLabel(value)} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Gestion des partenaires</h2>
          <p className="mt-3 text-slate-600">
            Suivre les organisations soutenant BUMI et documenter leurs contributions.
          </p>
        </div>
        <Button type="button" onClick={() => setShowForm((current) => !current)}>
          {showForm ? "Fermer le formulaire" : "Ajouter un partenaire"}
        </Button>
      </div>

      {message && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {showForm && (
        <form className="card grid gap-5 p-8 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="label">Nom du partenaire</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Personne de contact</label>
            <input className="input" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Téléphone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Secteur</label>
            <input className="input" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} placeholder="ONG, entreprise, église, fondation..." />
          </div>
          <div className="md:col-span-2">
            <Button type="submit">{isSaving ? "Enregistrement..." : "Enregistrer le partenaire"}</Button>
          </div>
        </form>
      )}

      <DataTable columns={columns} rows={partners} emptyMessage="Aucun partenaire enregistré pour le moment." />
    </div>
  );
}
