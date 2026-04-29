import { useState } from "react";
import DashboardHero from "../../components/dashboard/DashboardHero";
import KpiGrid from "../../components/dashboard/KpiGrid";
import NeedCard from "../../components/ui/NeedCard";
import Timeline from "../../components/ui/Timeline";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { dashboardApi, notificationsApi, publicApi, trackingApi } from "../../services/api";
import NotificationsPanel from "../../components/dashboard/NotificationsPanel";
import Button from "../../components/ui/Button";
import { formatCurrency } from "../../utils/format";

export default function DonorDashboard() {
  const [summary, setSummary] = useState(null);
  const [needs, setNeeds] = useState([]);
  const [trackingItems, setTrackingItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [summaryResponse, needsResponse, trackingResponse, notificationsResponse] = await Promise.all([
        dashboardApi.getSummary(),
        publicApi.getNeeds(),
        trackingApi.my(),
        notificationsApi.my(),
      ]);
      setSummary(summaryResponse.summary);
      setNeeds(needsResponse.items || []);
      setTrackingItems(trackingResponse.items || []);
      setNotifications(notificationsResponse.items || []);
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger votre tableau de bord.");
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
        { label: "Mes dons", value: String(summary.donationsCount || 0), helper: "Contributions enregistrées" },
        { label: "Espèces en FC", value: formatCurrency(breakdown.cashCdf || 0, 'CDF'), helper: "Total personnel en francs" },
        { label: "Espèces en USD", value: formatCurrency(breakdown.cashUsd || 0, 'USD'), helper: "Total personnel en dollars" },
        { label: "Messages reçus", value: String(summary.notificationsCount || 0), helper: "Confirmations et affectations" },
      ]
    : [];

  const timeline = trackingItems.slice(0, 5).map((item, index) => ({ id: item.id, step: `${item.title} — ${item.actor || "Suivi BUMI"}`, date: item.date, status: index === 0 ? "current" : "done" }));

  return (
    <div className="space-y-8">
      <DashboardHero title="Contribuer et suivre son soutien" text="Créez un don, consultez vos contributions en FC et en USD, suivez l’affectation et visualisez l’historique complet de votre soutien à BUMI." action={<Button to="/espace-donateur/faire-un-don">Faire un don</Button>} />

      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <KpiGrid items={kpis} />

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <section>
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Besoins recommandés</h2>
          <div className="grid gap-6 md:grid-cols-2">{needs.slice(0, 2).map((need) => <NeedCard key={need.id} need={need} compact />)}</div>
        </section>

        <section>
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Dernier suivi</h2>
          <Timeline items={timeline} />
        </section>
      </div>

      <NotificationsPanel items={notifications.slice(0, 6)} onMarkRead={handleRead} />
    </div>
  );
}
