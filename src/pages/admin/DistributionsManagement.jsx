import { useState } from "react";
import DataTable from "../../components/ui/DataTable";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { distributionApi } from "../../services/api";
import { formatCurrency, formatDateTime } from "../../utils/format";

export default function DistributionsManagement() {
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

  useAutoRefresh(loadDistributions, 10000, ["distribution.created", "donation.updated", "donation.allocated"]);

  const columns = [
    { key: "donationId", header: "Reference don", render: (value, row) => value || row.id },
    { key: "allocatedNeedTitle", header: "Besoin affecte" },
    {
      key: "totalDonationAmount",
      header: "Montant total du don",
      render: (value, row) => formatCurrency(value, row.currency),
    },
    {
      key: "distributedAmount",
      header: "Montant distribue",
      render: (value, row) => formatCurrency(value, row.currency),
    },
    { key: "receivedAt", header: "Don recu le", render: (value) => formatDateTime(value) },
    { key: "allocatedAt", header: "Affecte le", render: (value) => formatDateTime(value) },
    { key: "distributedAt", header: "Distribue le", render: (value) => formatDateTime(value) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Gestion des distributions</h2>
        <p className="mt-3 text-slate-600">
          Voir pour chaque don le montant total, le montant distribue, le besoin affecte et les
          dates de reception, d'affectation et de distribution.
        </p>
      </div>

      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <DataTable
        columns={columns}
        rows={distributions}
        emptyMessage="Aucune distribution enregistree pour le moment."
      />
    </div>
  );
}
