import { useState } from "react";
import DashboardHero from "../../components/dashboard/DashboardHero";
import KpiGrid from "../../components/dashboard/KpiGrid";
import NeedCard from "../../components/ui/NeedCard";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { dashboardApi, distributionApi, needsApi } from "../../services/api";
import { formatCurrency, formatDate, formatStatusLabel } from "../../utils/format";

export default function ManagerDashboard() {
  const [summary, setSummary] = useState(null);
  const [needs, setNeeds] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [summaryResponse, needsResponse, distributionsResponse] = await Promise.all([
        dashboardApi.getSummary(),
        needsApi.all(),
        distributionApi.all(),
      ]);
      setSummary(summaryResponse.summary);
      setNeeds(needsResponse.items || []);
      setDistributions(distributionsResponse.items || []);
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger le tableau de bord du responsable.");
    }
  };

  useAutoRefresh(loadData, 7000, ["need.created", "need.updated", "distribution.created", "donation.created", "donation.updated", "donation.allocated"]);

  const breakdown = summary?.donationBreakdown || {};
  const kpis = summary
    ? [
        { label: "Dons en FC", value: formatCurrency(breakdown.cashCdf || 0, 'CDF'), helper: "Espèces reçues en francs" },
        { label: "Dons en USD", value: formatCurrency(breakdown.cashUsd || 0, 'USD'), helper: "Espèces reçues en dollars" },
        { label: "Besoins ouverts", value: String(summary.openNeeds || 0), helper: "Besoins encore à couvrir" },
        { label: "Distributions", value: String(summary.totalDistributions || 0), helper: "Sorties enregistrées" },
        { label: "Donateurs actifs", value: String(summary.activeDonors || 0), helper: "Comptes disponibles" },
      ]
    : [];

  const columns = [
    { key: "id", header: "Référence" },
    { key: "needTitle", header: "Besoin" },
    { key: "beneficiaryGroup", header: "Bénéficiaires" },
    { key: "quantity", header: "Quantité" },
    { key: "distributedAt", header: "Date", render: (value) => formatDate(value) },
    { key: "status", header: "Statut", render: (value) => <Badge text={formatStatusLabel(value)} /> },
  ];

  return (
    <div className="space-y-8">
      <DashboardHero title="Piloter les besoins et distributions" text="Le responsable met à jour les besoins réels de l’orphelinat, valide les réceptions de dons, décide leur affectation et suit les distributions terrain avec des totaux distincts en FC et en USD." accent="green" />

      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <p className="text-sm text-slate-500">Les cartes, besoins et distributions se mettent à jour automatiquement dès qu’un mouvement est enregistré.</p>

      <KpiGrid items={kpis} />

      <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Besoins prioritaires</h2>
          <div className="grid gap-6 md:grid-cols-2">{needs.slice(0, 2).map((need) => <NeedCard key={need.id} need={need} compact />)}</div>
        </div>

        <div>
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Distributions en suivi</h2>
          <DataTable columns={columns} rows={distributions.slice(0, 6)} emptyMessage="Aucune distribution enregistrée." />
        </div>
      </div>
    </div>
  );
}
