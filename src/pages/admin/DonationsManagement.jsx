import { useState } from "react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { donationApi } from "../../services/api";
import { exportToExcel } from "../../utils/export";
import { formatCurrency, formatDate, formatStatusLabel } from "../../utils/format";

export default function DonationsManagement() {
  const [donations, setDonations] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadDonations = async () => {
    try {
      const response = await donationApi.all();
      setDonations(response.items || []);
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger les dons.");
    }
  };
  useAutoRefresh(loadDonations, 10000);

  const handleExport = () => {
    const rows = donations.map((item) => ({ Référence: item.id, Donateur: item.donorName, Type: formatStatusLabel(item.type), Valeur: formatCurrency(item.amount, item.currency), Devise: item.currency, Equivalence_FC: formatCurrency(item.normalizedValueCdf, 'CDF'), Besoin: item.needTitle || 'Non affecté', Source: formatStatusLabel(item.source), Statut: formatStatusLabel(item.status), Date: formatDate(item.createdAt), Description: item.description || '' }));
    exportToExcel(rows, `dons-bumi-${new Date().toISOString().slice(0,10)}.xls`, 'Dons');
    setMessage('Le fichier Excel des dons a été généré.');
  };

  const columns = [
    { key: 'id', header: 'Référence' },
    { key: 'donorName', header: 'Donateur' },
    { key: 'type', header: 'Type', render: (value) => formatStatusLabel(value) },
    { key: 'amount', header: 'Valeur', render: (value, row) => formatCurrency(value, row.currency) },
    { key: 'needTitle', header: 'Besoin' },
    { key: 'createdAt', header: 'Date', render: (value) => formatDate(value) },
    { key: 'status', header: 'Statut', render: (value) => <Badge text={formatStatusLabel(value)} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Gestion des dons</h2>
          <p className="mt-3 text-slate-600">Contrôler les enregistrements, affectations et validations des dons en especes.</p>
        </div>
        <Button type="button" onClick={handleExport}>Exporter en Excel</Button>
      </div>
      <p className="text-sm text-slate-500">Les dons peuvent être saisis en USD ou en FC. Les rapports consolident aussi une équivalence en FC.</p>
      {message && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <DataTable columns={columns} rows={donations} emptyMessage="Aucun don enregistré pour le moment." />
    </div>
  );
}
