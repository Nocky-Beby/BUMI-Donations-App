import { useState } from "react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { distributionApi } from "../../services/api";
import { formatCurrency, formatDate, formatStatusLabel } from "../../utils/format";

export default function ManagerDistributionTracking() {
  const [distributions, setDistributions] = useState([]);
  const [error, setError] = useState("");

  const loadDistributions = async () => {
    try {
      const response = await distributionApi.all();
      setDistributions(response.items || []);
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger les distributions.");
    }
  };

  useAutoRefresh(loadDistributions, 10000);

  const columns = [
    { key: "id", header: "Référence" },
    { key: "needTitle", header: "Besoin" },
    { key: "beneficiaryGroup", header: "Bénéficiaires" },
    { key: "quantity", header: "Quantité" },
    { key: "amount", header: "Montant", render: (value) => formatCurrency(value) },
    { key: "distributedAt", header: "Date prévue", render: (value) => formatDate(value) },
    { key: "status", header: "État", render: (value) => <Badge text={formatStatusLabel(value)} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Suivi des distributions</h2>
        <p className="mt-3 text-slate-600">
          Contrôler l’avancement de la distribution des ressources vers les bénéficiaires.
        </p>
      </div>
      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <DataTable columns={columns} rows={distributions} emptyMessage="Aucune distribution disponible." />
    </div>
  );
}
