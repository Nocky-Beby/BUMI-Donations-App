import { useState } from "react";
import NeedCard from "../../components/ui/NeedCard";
import Button from "../../components/ui/Button";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { needsApi } from "../../services/api";
import { formatStatusLabel } from "../../utils/format";

const initialForm = {
  title: "",
  category: "",
  description: "",
  imageUrl: "",
  priority: "medium",
  targetAmount: "",
  targetQuantity: "",
  unit: "FC",
  status: "published",
};

export default function NeedsManagement() {
  const [needs, setNeeds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadNeeds = async () => {
    try {
      const response = await needsApi.all();
      setNeeds(response.items || []);
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger les besoins.");
    }
  };

  useAutoRefresh(loadNeeds, 12000, ["need.created", "need.updated"]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSaving(true);

    try {
      const payload = {
        ...form,
        targetAmount: form.targetAmount || 0,
        targetQuantity: form.targetQuantity || 0,
      };
      const response = await needsApi.create(payload);
      setMessage(response.message || "Besoin cree avec succes.");
      setForm(initialForm);
      setShowForm(false);
      await loadNeeds();
    } catch (apiError) {
      setError(apiError.message || "La creation du besoin a echoue.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatus = async (need, status) => {
    try {
      const response = await needsApi.update(need.id, { status });
      setMessage(response.message || `Statut du besoin mis a jour : ${formatStatusLabel(status)}.`);
      await loadNeeds();
    } catch (apiError) {
      setError(apiError.message || "Impossible de modifier le statut du besoin.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Gestion des besoins</h2>
          <p className="mt-3 text-slate-600">
            Definir les priorites, publier les besoins, puis cloturer ou archiver manuellement si necessaire.
          </p>
        </div>
        <Button type="button" onClick={() => setShowForm((current) => !current)}>
          {showForm ? "Fermer le formulaire" : "Creer un besoin"}
        </Button>
      </div>

      {message && (
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {showForm && (
        <form className="card grid gap-5 p-8 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="label">Intitule du besoin</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Categorie</label>
            <input
              className="input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Montant cible</label>
            <input
              className="input"
              value={form.targetAmount}
              onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
              placeholder="Ex. 1000"
            />
          </div>
          <div>
            <label className="label">Quantite cible</label>
            <input
              className="input"
              value={form.targetQuantity}
              onChange={(e) => setForm({ ...form, targetQuantity: e.target.value })}
              placeholder="Ex. 50"
            />
          </div>
          <div>
            <label className="label">Unite</label>
            <input
              className="input"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Priorite</label>
            <select
              className="input"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="urgent">Urgent</option>
              <option value="high">Eleve</option>
              <option value="medium">Moyen</option>
              <option value="low">Faible</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">Image du besoin (URL)</label>
            <input
              className="input"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="Laisser vide pour utiliser une image BUMI par defaut"
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea
              className="textarea"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit">{isSaving ? "Publication..." : "Enregistrer le besoin"}</Button>
          </div>
        </form>
      )}

      <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
        {needs.map((need) => (
          <div key={need.id} className="flex h-full flex-col gap-3">
            <NeedCard need={need} compact />
            <div className="mt-auto grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Button
                type="button"
                variant="secondary"
                className="w-full px-3 py-2 text-xs"
                onClick={() => handleStatus(need, "published")}
              >
                Publier
              </Button>
              <Button
                type="button"
                variant="soft"
                className="w-full px-3 py-2 text-xs"
                onClick={() => handleStatus(need, "closed")}
              >
                Cloturer
              </Button>
              <Button
                type="button"
                variant="warning"
                className="w-full px-3 py-2 text-xs"
                onClick={() => handleStatus(need, "archived")}
              >
                Archiver
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
