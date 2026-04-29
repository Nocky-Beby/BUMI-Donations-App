import { useState } from "react";
import Button from "../../components/ui/Button";
import NeedCard from "../../components/ui/NeedCard";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { needsApi } from "../../services/api";
import { formatStatusLabel } from "../../utils/format";

const initialForm = {
  title: "",
  category: "",
  targetAmount: "",
  targetQuantity: "",
  priority: "urgent",
  unit: "FC",
  description: "",
  imageUrl: "",
};

export default function UpdateNeeds() {
  const [needs, setNeeds] = useState([]);
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
      const response = await needsApi.create({
        ...form,
        status: "published",
        targetAmount: form.targetAmount || 0,
        targetQuantity: form.targetQuantity || 0,
      });
      setMessage(response.message || "Besoin publié avec succès.");
      setForm(initialForm);
      await loadNeeds();
    } catch (apiError) {
      setError(apiError.message || "La publication du besoin a échoué.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatus = async (need, status) => {
    try {
      const response = await needsApi.update(need.id, { status });
      setMessage(response.message || `Statut mis à jour : ${formatStatusLabel(status)}.`);
      await loadNeeds();
    } catch (apiError) {
      setError(apiError.message || "Impossible de modifier le statut du besoin.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="card p-8">
        <h2 className="text-3xl font-bold text-slate-900">Mise à jour des besoins</h2>
        <p className="mt-3 text-slate-600">
          Documenter les besoins réels, publier les urgences terrain et clôturer manuellement un besoin si nécessaire.
        </p>
        <p className="mt-2 text-sm text-slate-500">Chaque besoin publié ici apparaît automatiquement sur le site public, dans les rapports et dans les vues partenaire et administrateur.</p>

        <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="label">Intitulé du besoin</label>
            <input className="input" placeholder="Ex. médicaments pédiatriques" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">Catégorie</label>
            <input className="input" placeholder="Santé, nutrition, éducation..." value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          </div>
          <div>
            <label className="label">Objectif montant</label>
            <input className="input" placeholder="Ex. 2000" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} />
          </div>
          <div>
            <label className="label">Objectif quantité</label>
            <input className="input" placeholder="Ex. 200 unités" value={form.targetQuantity} onChange={(e) => setForm({ ...form, targetQuantity: e.target.value })} />
          </div>
          <div>
            <label className="label">Priorité</label>
            <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="urgent">Urgent</option>
              <option value="high">Très élevé</option>
              <option value="medium">Moyen</option>
              <option value="low">Faible</option>
            </select>
          </div>
          <div>
            <label className="label">Unité</label>
            <input className="input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Image du besoin (URL)</label>
            <input className="input" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="Laisser vide pour utiliser une image BUMI par défaut" />
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          {message && <div className="md:col-span-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
          {error && <div className="md:col-span-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="md:col-span-2">
            <Button type="submit">{isSaving ? "Publication..." : "Publier le besoin"}</Button>
          </div>
        </form>
      </div>

      <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
        {needs.map((need) => (
          <div key={need.id} className="flex h-full flex-col gap-3">
            <NeedCard need={need} compact />
            <div className="mt-auto grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Button type="button" variant="secondary" className="w-full px-3 py-2 text-xs" onClick={() => handleStatus(need, "published")}>
                Publier
              </Button>
              <Button type="button" variant="soft" className="w-full px-3 py-2 text-xs" onClick={() => handleStatus(need, "closed")}>
                Clôturer
              </Button>
              <Button type="button" variant="warning" className="w-full px-3 py-2 text-xs" onClick={() => handleStatus(need, "archived")}>
                Archiver
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
