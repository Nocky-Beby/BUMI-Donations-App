import { useState } from "react";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";
import Button from "../../components/ui/Button";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { reportsApi } from "../../services/api";
import { exportWorkbookToExcel } from "../../utils/export";
import { formatCurrency, formatDate, formatDonationValue, formatStatusLabel } from "../../utils/format";

export default function ReportsPage() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadOverview = async () => {
    try {
      const response = await reportsApi.overview();
      setOverview(response);
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger les rapports.");
    }
  };

  useAutoRefresh(loadOverview, 7000);

  const totals = overview?.totals || {};
  const breakdown = totals.donationBreakdown || {};
  const totalDistributions = Number(totals.totalDistributions || 0);
  const totalNeeds = Number(totals.totalNeeds || 0);
  const openNeeds = Number(totals.openNeeds || 0);
  const allocatedOrDistributed = (overview?.donationStatus || [])
    .filter((item) => ["allocated", "distributed", "closed"].includes(item.status))
    .reduce((sum, item) => sum + item.total, 0);
  const totalStatus = (overview?.donationStatus || []).reduce((sum, item) => sum + item.total, 0);
  const allocationRate = totalStatus ? Math.round((allocatedOrDistributed / totalStatus) * 100) : 0;
  const distributionRate = totalStatus ? Math.round((totalDistributions / totalStatus) * 100) : 0;
  const coverageRate = totalNeeds ? Math.round(((totalNeeds - openNeeds) / totalNeeds) * 100) : 0;

  const handleExport = () => {
    exportWorkbookToExcel(
      [
        {
          name: "Synthese",
          rows: [
            {
              "Dons en FC": formatCurrency(breakdown.cashCdf, "CDF"),
              "Dons en USD": formatCurrency(breakdown.cashUsd, "USD"),
              "Besoins totaux": totalNeeds,
              "Besoins ouverts": openNeeds,
              Distributions: totalDistributions,
              "Taux d'affectation": `${allocationRate}%`,
              "Taux de distribution": `${distributionRate}%`,
              "Niveau de couverture": `${coverageRate}%`,
            },
          ],
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
            Statut: formatStatusLabel(item.status),
            Date: formatDate(item.createdAt),
          })),
        },
      ],
      `rapport-bumi-${new Date().toISOString().slice(0, 10)}.xls`
    );
    setMessage("Le rapport Excel a ete genere avec succes.");
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
          <h2 className="text-3xl font-bold text-slate-900">Rapports et statistiques</h2>
          <p className="mt-3 text-slate-600">
            Consolider les informations cles pour piloter les decisions, rassurer les donateurs et
            informer les partenaires.
          </p>
        </div>
        <Button type="button" onClick={handleExport}>
          Generer un rapport Excel
        </Button>
      </div>

      <p className="text-sm text-slate-500">
        Les indicateurs se recalculent en direct apres chaque don, affectation, validation ou
        distribution.
      </p>
      {message && (
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}
      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard
          label="Taux d'affectation"
          value={`${allocationRate}%`}
          helper="Part des dons deja affectes ou distribues"
        />
        <StatCard
          label="Taux de distribution"
          value={`${distributionRate}%`}
          helper="Part des dons ayant abouti a une distribution"
        />
        <StatCard
          label="Niveau de couverture"
          value={`${coverageRate}%`}
          helper="Part des besoins deja couverts ou clotures"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {(overview?.donationStatus || []).map((item) => (
          <div key={item.status} className="card p-6">
            <p className="text-sm text-slate-500">Flux des dons</p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">{formatStatusLabel(item.status)}</h3>
            <div className="mt-4">
              <Badge text={`${item.total} enregistrements`} />
            </div>
            <div className="mt-6 h-3 rounded-full bg-slate-100">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-brand-red to-brand-green"
                style={{ width: `${Math.min(100, (item.total / Math.max(totalStatus, 1)) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-4 text-2xl font-bold text-slate-900">Derniers mouvements enregistres</h3>
        <DataTable columns={columns} rows={overview?.recentDonations || []} emptyMessage="Aucun mouvement recent." />
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-bold text-slate-900">Resume financier</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Dons en FC</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formatCurrency(breakdown.cashCdf || 0, "CDF")}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Dons en USD</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formatCurrency(breakdown.cashUsd || 0, "USD")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
