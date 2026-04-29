import { useState } from "react";
import Button from "../../components/ui/Button";
import { donationApi, publicApi } from "../../services/api";
import { formatCurrency } from "../../utils/format";
import useAutoRefresh from "../../hooks/useAutoRefresh";

const initialState = {
  amount: "",
  currency: "CDF",
  needId: "",
  description: "",
};

export default function MakeDonation() {
  const [form, setForm] = useState(initialState);
  const [needs, setNeeds] = useState([]);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadNeeds = async () => {
    const response = await publicApi.getNeeds();
    setNeeds(response.items || []);
  };
  useAutoRefresh(loadNeeds, 20000, ["need.created", "need.updated"]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });
    try {
      const payload = {
        ...form,
        amount: Number(form.amount) || 0,
      };
      const response = await donationApi.create(payload);
      setStatus({ type: "success", message: response.message || "Votre don en especes a bien ete enregistre." });
      setForm(initialState);
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Impossible d'enregistrer le don." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
      <form className="card p-8" onSubmit={handleSubmit}>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">Contribution</p>
        <h2 className="mt-4 text-3xl font-bold text-slate-900">Faire un don en especes</h2>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Enregistrez un montant en FC ou en USD et suivez ensuite sa validation, son affectation et sa distribution.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div>
            <label className="label">Devise</label>
            <select name="currency" className="input" value={form.currency} onChange={handleChange}>
              <option value="CDF">Franc congolais (FC)</option>
              <option value="USD">Dollar americain (USD)</option>
            </select>
          </div>
          <div>
            <label className="label">Montant</label>
            <input
              name="amount"
              className="input"
              value={form.amount}
              onChange={handleChange}
              placeholder={form.currency === "USD" ? "Ex. 100" : "Ex. 250000"}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Besoin cible</label>
            <select name="needId" className="input" value={form.needId} onChange={handleChange}>
              <option value="">Affectation plus tard</option>
              {needs.map((need) => (
                <option key={need.id} value={need.id}>{need.title}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea name="description" className="textarea" value={form.description} onChange={handleChange} placeholder="Precise l'objectif de ton don." />
          </div>
        </div>

        {status.message ? <div className={`mt-6 rounded-2xl px-4 py-3 text-sm ${status.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{status.message}</div> : null}
        <div className="mt-8"><Button type="submit">{isSubmitting ? "Enregistrement..." : "Confirmer mon don"}</Button></div>
      </form>

      <div className="space-y-6">
        <div className="card p-8">
          <h3 className="text-2xl font-bold text-slate-900">Regles de calcul</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>- Les dons en especes peuvent etre enregistres en FC ou en USD.</li>
            <li>- Les montants en USD sont convertis en francs congolais dans les rapports.</li>
            <li>- Le suivi affiche ensuite la validation, la reception, l'affectation et la distribution.</li>
          </ul>
        </div>
        <div className="card p-8">
          <h3 className="text-2xl font-bold text-slate-900">Exemples</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>{formatCurrency(250000, "CDF")} pour les fournitures scolaires</p>
            <p>{formatCurrency(100, "USD")} pour un appui medical urgent</p>
            <p>{formatCurrency(750000, "CDF")} pour le programme nutrition</p>
          </div>
        </div>
      </div>
    </div>
  );
}
