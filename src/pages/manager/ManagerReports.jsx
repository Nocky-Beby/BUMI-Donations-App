import { useState } from "react";
import StatCard from "../../components/ui/StatCard";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { reportsApi } from "../../services/api";
import { exportWorkbookToExcel } from "../../utils/export";
import { formatCurrency, formatDate, formatDonationValue, formatStatusLabel } from "../../utils/format";

export default function ManagerReports() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadOverview = async () => {
    try {
      const response = await reportsApi.overview();
      setOverview(response);
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger les rapports terrain.");
    }
  };

  useAutoRefresh(loadOverview, 7000);

  const totals = overview?.totals || {};
  const breakdown = totals.donationBreakdown || {};
  const totalDonationsValue = Number(totals.totalDonationsValue || 0);
  const totalDistributions = Number(totals.totalDistributions || 0);
  const totalNeeds = Number(totals.totalNeeds || 0);
  const openNeeds = Number(totals.openNeeds || 0);

  const handleExport = () => {
    exportWorkbookToExcel(
      [
        {
          name: "Synthese terrain",
          rows: [{
            "Dons en FC": formatCurrency(breakdown.cashCdf || 0, "CDF"),
            "Dons en USD": formatCurrency(breakdown.cashUsd || 0, "USD"),
            "Equivalent total FC": formatCurrency(totalDonationsValue),
            "Besoins totaux": totalNeeds,
            "Besoins ouverts": openNeeds,
            Distributions: totalDistributions,
          }],
        },
        {
          name: "Statuts des dons",
          rows: (overview?.donationStatus || []).map((item) => ({
            Statut: formatStatusLabel(item.status),
            Total: item.total,
          })),
        },
        {
          name: "Progression besoins",
          rows: (overview?.needsProgress || []).map((need) => ({
            Besoin: need.title,
            Statut: formatStatusLabel(need.status),
            "Montant actuel": need.currentAmount,
            "Montant cible": need.targetAmount,
            Progression: `${need.progress}%`,
          })),
        },
        {
          name: "Mouvements recents",
          rows: (overview?.recentDonations || []).map((item) => ({
            Reference: item.id,
            Donateur: item.donor,
            Besoin: item.needTitle || "Non affecte",
            Valeur: formatCurrency(item.value, item.currency),
            Devise: item.currency,
            Equivalence_FC: formatCurrency(item.normalizedValueCdf, "CDF"),
            Statut: formatStatusLabel(item.status),
            Date: formatDate(item.createdAt),
          })),
        },
      ],
      `rapport-terrain-bumi-${new Date().toISOString().slice(0, 10)}.xls`
    );
    setMessage("Le rapport Excel terrain a ete genere avec succes.");
  };

  const columns = [
    { key: "id", header: "Reference" },
    { key: "donor", header: "Donateur" },
    { key: "needTitle", header: "Besoin" },
    { key: "value", header: "Valeur", render: (_value, row) => formatDonationValue(row) },
    { key: "createdAt", header: "Date", render: (value) => formatDate(value) },
    { key: "status", header: "Statut", render: (value) => <Badge text={formatStatusLabel(value)} /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Consultation des rapports</h2>
          <p className="mt-3 text-slate-600">Lire les syntheses utiles pour la coordination terrain, les besoins et les distributions.</p>
        </div>
        <Button type="button" onClick={handleExport}>Generer un rapport Excel</Button>
      </div>

      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
      <p className="text-sm text-slate-500">Les rapports terrain se recalculent automatiquement selon les mouvements de la base.</p>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Besoins ouverts" value={String(totals.openNeeds || 0)} />
        <StatCard label="Distributions terminees" value={String(totals.totalDistributions || 0)} />
        <StatCard label="Dons en FC" value={formatCurrency(breakdown.cashCdf || 0, "CDF")} />
        <StatCard label="Dons en USD" value={formatCurrency(breakdown.cashUsd || 0, "USD")} />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {(overview?.needsProgress || []).slice(0, 6).map((need) => (
          <div key={need.title} className="card p-6">
            <p className="text-sm text-slate-500">Couverture du besoin</p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">{need.title}</h3>
            <div className="mt-4"><Badge text={`${need.progress}% couvert`} /></div>
          </div>
        ))}
      </div>

      <DataTable columns={columns} rows={overview?.recentDonations || []} emptyMessage="Aucun mouvement terrain recent." />
    </div>
  );
}
