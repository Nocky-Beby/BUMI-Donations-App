import { useState } from "react";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { publicApi, reportsApi } from "../../services/api";
import { formatCurrency, formatStatusLabel } from "../../utils/format";

export default function PartnerImpact() {
  const [stats, setStats] = useState(null);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [statsResponse, overviewResponse] = await Promise.all([publicApi.getStats(), reportsApi.overview()]);
      setStats(statsResponse.stats);
      setOverview(overviewResponse);
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger l’impact partenaire.");
    }
  };

  useAutoRefresh(loadData, 7000);
  const breakdown = stats?.donationBreakdown || {};

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Suivi de l’impact</h2>
        <p className="mt-3 text-slate-600">Les partenaires disposent d’une visibilité sur la portée sociale de leurs contributions.</p>
      </div>

      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Donateurs suivis" value={String(stats?.donors || 0)} />
        <StatCard label="Besoins ouverts" value={String(stats?.openNeeds || 0)} />
        <StatCard label="Dons en FC" value={formatCurrency(breakdown.cashCdf || 0, 'CDF')} />
        <StatCard label="Dons en USD" value={formatCurrency(breakdown.cashUsd || 0, 'USD')} />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{(overview?.donationStatus || []).map((item) => (
        <div key={item.status} className="card p-6"><p className="text-sm text-slate-500">État des contributions</p><h3 className="mt-2 text-xl font-bold text-slate-900">{formatStatusLabel(item.status)}</h3><div className="mt-4"><Badge text={`${item.total} mouvements`} /></div></div>
      ))}</div>
    </div>
  );
}
