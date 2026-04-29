import { useState } from "react";
import DashboardHero from "../../components/dashboard/DashboardHero";
import KpiGrid from "../../components/dashboard/KpiGrid";
import NotificationsPanel from "../../components/dashboard/NotificationsPanel";
import Button from "../../components/ui/Button";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { dashboardApi, notificationsApi, reportsApi } from "../../services/api";
import { formatCurrency } from "../../utils/format";

export default function PartnerDashboard() {
  const [summary, setSummary] = useState(null);
  const [overview, setOverview] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [summaryResponse, overviewResponse, notificationsResponse] = await Promise.all([
        dashboardApi.getSummary(),
        reportsApi.overview(),
        notificationsApi.my(),
      ]);
      setSummary(summaryResponse.summary);
      setOverview(overviewResponse);
      setNotifications(notificationsResponse.items || []);
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger la vue partenaire.");
    }
  };

  useAutoRefresh(loadData, 7000);

  const handleRead = async (id) => {
    await notificationsApi.markRead(id);
    await loadData();
  };

  const breakdown = summary?.donationBreakdown || {};
  const kpis = summary
    ? [
        { label: "Mes contributions", value: String(summary.donationsCount || 0), helper: "Appuis enregistrés" },
        { label: "Espèces en FC", value: formatCurrency(breakdown.cashCdf || 0, 'CDF'), helper: "Total partenaire en francs" },
        { label: "Espèces en USD", value: formatCurrency(breakdown.cashUsd || 0, 'USD'), helper: "Total partenaire en dollars" },
        { label: "Messages reçus", value: String(summary.notificationsCount || 0), helper: "Confirmations et affectations" },
      ]
    : [];

  return (
    <div className="space-y-8">
      <DashboardHero title="Mesurer la portée des actions" text="Le partenaire suit ses contributions, distingue les montants en FC et en USD, consulte les besoins à fort impact et visualise les résultats des appuis réalisés." action={<Button to="/partenaire/impact">Voir l’impact</Button>} />

      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <p className="text-sm text-slate-500">Les données partenaire se synchronisent en direct à chaque mouvement enregistré.</p>

      <KpiGrid items={kpis} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6"><h3 className="text-xl font-bold text-slate-900">Besoins suivis</h3><p className="mt-4 text-sm leading-6 text-slate-600">{overview?.totals?.totalNeeds || 0} besoins documentés dans la plateforme.</p></div>
        <div className="card p-6"><h3 className="text-xl font-bold text-slate-900">Besoins encore publiés</h3><p className="mt-4 text-sm leading-6 text-slate-600">{overview?.totals?.openNeeds || 0} besoins nécessitent encore une mobilisation.</p></div>
        <div className="card p-6"><h3 className="text-xl font-bold text-slate-900">Distributions réalisées</h3><p className="mt-4 text-sm leading-6 text-slate-600">{overview?.totals?.totalDistributions || 0} distributions sont déjà documentées.</p></div>
      </div>

      <NotificationsPanel items={notifications.slice(0, 6)} onMarkRead={handleRead} />
    </div>
  );
}
