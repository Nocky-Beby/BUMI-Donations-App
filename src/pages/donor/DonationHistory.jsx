import { useState } from "react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { donationApi } from "../../services/api";
import { formatCurrency, formatDate, formatStatusLabel } from "../../utils/format";

export default function DonationHistory() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    try {
      const response = await donationApi.myHistory();
      setRows(response.items || []);
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger l’historique des dons.");
    }
  };
  useAutoRefresh(loadHistory, 10000);

  const columns = [
    { key: "id", header: "Référence" },
    { key: "type", header: "Type" },
    { key: "amount", header: "Valeur", render: (value, row) => formatCurrency(value, row.currency) },
    { key: "purpose", header: "Besoin ciblé" },
    { key: "date", header: "Date", render: (value) => formatDate(value) },
    { key: "status", header: "Statut", render: (value) => <Badge text={formatStatusLabel(value)} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Historique de mes dons</h2>
        <p className="mt-3 text-slate-600">Visualisez vos contributions passées, leur devise et leur état d’affectation.</p>
      </div>
      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
