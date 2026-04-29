import { useState } from "react";
import DashboardHero from "../../components/dashboard/DashboardHero";
import KpiGrid from "../../components/dashboard/KpiGrid";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { dashboardApi, donationApi, reportsApi } from "../../services/api";
import { formatCurrency, formatDate, formatDonationValue, formatStatusLabel } from "../../utils/format";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [donations, setDonations] = useState([]);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [summaryResponse, donationsResponse, reportsResponse] = await Promise.all([
        dashboardApi.getSummary(),
        donationApi.all(),
        reportsApi.overview(),
      ]);
      setSummary(summaryResponse.summary);
      setDonations(donationsResponse.items || []);
      setOverview(reportsResponse);
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger le tableau de bord administrateur.");
    }
  };

  useAutoRefresh(loadData, 7000);

  const breakdown = summary?.donationBreakdown || {};
  const kpis = summary
    ? [
        { label: "Dons en FC", value: formatCurrency(breakdown.cashCdf || 0, 'CDF'), helper: "Espèces cumulées en francs" },
        { label: "Dons en USD", value: formatCurrency(breakdown.cashUsd || 0, 'USD'), helper: "Espèces cumulées en dollars" },
        { label: "Besoins ouverts", value: String(summary.openNeeds || 0), helper: "Demandes encore à couvrir" },
        { label: "Distributions enregistrées", value: String(summary.totalDistributions || 0), helper: "Sorties documentées" },
        { label: "Donateurs actifs", value: String(summary.activeDonors || 0), helper: "Comptes donateurs existants" },
      ]
    : [];

  const columns = [
    { key: "id", header: "Référence" },
    { key: "donorName", header: "Donateur" },
    { key: "type", header: "Type", render: (value) => formatStatusLabel(value) },
    { key: "amount", header: "Valeur", render: (_value, row) => formatDonationValue(row) },
    { key: "needTitle", header: "Besoin" },
    { key: "createdAt", header: "Date", render: (value) => formatDate(value) },
    { key: "status", header: "Statut", render: (value) => <Badge text={formatStatusLabel(value)} /> },
  ];

  return (
    <div className="space-y-8">
      <DashboardHero title="Superviser la plateforme" text="L’administrateur gère les donateurs, les dons, les partenaires, les besoins, les rapports, les paramètres globaux et distingue clairement les totaux en FC et en USD." action={<Button to="/admin/rapports">Voir les rapports</Button>} accent="orange" />

      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <p className="text-sm text-slate-500">Le tableau de bord se synchronise en direct après chaque mouvement en base.</p>

      <KpiGrid items={kpis} />

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Derniers dons enregistrés</h2>
          <DataTable columns={columns} rows={donations.slice(0, 8)} emptyMessage="Aucun don enregistré pour le moment." />
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold text-slate-900">Indicateurs de suivi</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Couverture des besoins</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{overview?.totals?.totalNeeds || 0}</p>
              <p className="mt-2 text-sm text-slate-600">Besoins totaux suivis par la plateforme</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Partenaires actifs</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{overview?.totals?.totalPartners || 0}</p>
              <p className="mt-2 text-sm text-slate-600">Structures visibles dans le suivi institutionnel</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Derniers statuts des dons</p>
              <div className="mt-3 flex flex-wrap gap-2">{(overview?.donationStatus || []).map((item) => <Badge key={item.status} text={`${formatStatusLabel(item.status)} (${item.total})`} />)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
