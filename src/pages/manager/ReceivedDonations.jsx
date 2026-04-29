import { useMemo, useState } from "react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { distributionApi, donationApi, needsApi } from "../../services/api";
import { formatCurrency, formatDate, formatStatusLabel } from "../../utils/format";

const operationInitial = {
  donationId: "",
  needId: "",
  amount: "",
  quantity: "",
  beneficiaryGroup: "Enfants de l'orphelinat BUMI",
  notes: "",
};

const allocationStatuses = ["submitted", "validated", "received"];

export default function ReceivedDonations() {
  const [donations, setDonations] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [operationForm, setOperationForm] = useState(operationInitial);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    try {
      const [donationResponse, needResponse] = await Promise.all([donationApi.all(), needsApi.all()]);
      const donationItems = donationResponse.items || [];
      const needItems = needResponse.items || [];
      const pendingAllocationItems = donationItems.filter((item) => allocationStatuses.includes(item.status));

      setDonations(donationItems);
      setNeeds(needItems);
      setOperationForm((current) => ({
        ...current,
        donationId: pendingAllocationItems.some((item) => item.id === current.donationId) ? current.donationId : pendingAllocationItems[0]?.id || "",
        needId: current.needId || needItems[0]?.id || "",
      }));
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger les dons recus.");
    }
  };

  useAutoRefresh(loadData, 10000);

  const selectableDonations = useMemo(
    () => donations.filter((item) => allocationStatuses.includes(item.status)),
    [donations]
  );

  const selectedDonation = useMemo(
    () => selectableDonations.find((item) => item.id === operationForm.donationId) || null,
    [selectableDonations, operationForm.donationId]
  );

  const handleStatus = async (donationId, status) => {
    setMessage("");
    setError("");
    try {
      const response = await donationApi.updateStatus(donationId, {
        status,
        message: `Statut mis a jour par le responsable : ${formatStatusLabel(status)}.`,
      });
      setMessage(response.message || "Statut mis a jour.");
      await loadData();
    } catch (apiError) {
      setError(apiError.message || "Impossible de mettre a jour le statut du don.");
    }
  };

  const handleAllocate = async () => {
    if (!operationForm.donationId || !operationForm.needId) {
      setError("Selectionnez un don et un besoin avant l'affectation.");
      return;
    }

    setMessage("");
    setError("");
    try {
      const response = await donationApi.allocate(operationForm.donationId, {
        needId: operationForm.needId,
        message: operationForm.notes || "Don affecte par le responsable a un besoin terrain.",
      });
      setMessage(response.message || "Don affecte avec succes.");
      await loadData();
    } catch (apiError) {
      setError(apiError.message || "Impossible d'affecter ce don.");
    }
  };

  const handleDistribution = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSaving(true);

    try {
      const response = await distributionApi.create(operationForm);
      const remainingSelectable = selectableDonations.filter((item) => item.id !== operationForm.donationId);
      setMessage(response.message || "Distribution enregistree.");
      setOperationForm({
        ...operationInitial,
        donationId: remainingSelectable[0]?.id || "",
        needId: needs[0]?.id || "",
      });
      await loadData();
    } catch (apiError) {
      setError(apiError.message || "Impossible d'enregistrer la distribution.");
    } finally {
      setIsSaving(false);
    }
  };

  const prefillFromRow = (row) => {
    setOperationForm({
      donationId: row.id,
      needId: row.needId || needs[0]?.id || "",
      amount: row.amount || "",
      quantity: "",
      beneficiaryGroup: "Enfants de l'orphelinat BUMI",
      notes: row.description || "",
    });
  };

  const columns = [
    { key: "id", header: "Reference" },
    { key: "donorName", header: "Source" },
    { key: "type", header: "Type", render: (value) => formatStatusLabel(value) },
    { key: "needTitle", header: "Besoin" },
    { key: "amount", header: "Valeur", render: (value, row) => formatCurrency(value, row.currency) },
    { key: "receivedAt", header: "Reception", render: (value, row) => formatDate(value || row.createdAt) },
    { key: "status", header: "Statut", render: (value) => <Badge text={formatStatusLabel(value)} /> },
    {
      key: "actions",
      header: "Actions",
      render: (_value, row) => (
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" className="px-3 py-2 text-xs" onClick={() => handleStatus(row.id, "received")}>
            Marquer recu
          </Button>
          <Button type="button" variant="soft" className="px-3 py-2 text-xs" onClick={() => prefillFromRow(row)}>
            Preparer l'affectation
          </Button>
          <Button type="button" variant="warning" className="px-3 py-2 text-xs" onClick={() => prefillFromRow(row)}>
            Preparer la distribution
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Suivi des dons recus</h2>
        <p className="mt-3 text-slate-600">
          Verifier les contributions recues, decider leur affectation et enregistrer les distributions vers les beneficiaires.
        </p>
      </div>

      {message && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="card p-8">
        <h3 className="text-xl font-bold text-slate-900">Decider l'affectation des dons</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Le responsable choisit ici le don a traiter, le besoin a couvrir, valide la reception puis enregistre la distribution.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="label">Don en attente d'affectation</label>
            <select className="input" value={operationForm.donationId} onChange={(e) => setOperationForm({ ...operationForm, donationId: e.target.value })}>
              <option value="">Selectionner un don</option>
              {selectableDonations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.donorName} - {formatStatusLabel(item.type)} - {formatCurrency(item.amount, item.currency)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Besoin cible</label>
            <select className="input" value={operationForm.needId} onChange={(e) => setOperationForm({ ...operationForm, needId: e.target.value })}>
              <option value="">Selectionner un besoin</option>
              {needs.map((need) => (
                <option key={need.id} value={need.id}>{need.title}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedDonation && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-900">Don selectionne :</span> {selectedDonation.donorName}</p>
            <p className="mt-1"><span className="font-semibold text-slate-900">Valeur :</span> {formatCurrency(selectedDonation.amount, selectedDonation.currency)}</p>
            <p className="mt-1"><span className="font-semibold text-slate-900">Statut actuel :</span> {formatStatusLabel(selectedDonation.status)}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={() => handleStatus(operationForm.donationId, "received")}>Valider la reception</Button>
          <Button type="button" variant="soft" onClick={handleAllocate}>Affecter au besoin choisi</Button>
        </div>

        <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleDistribution}>
          <div>
            <label className="label">Montant distribue</label>
            <input className="input" value={operationForm.amount} onChange={(e) => setOperationForm({ ...operationForm, amount: e.target.value })} placeholder="Ex. 300" />
          </div>
          <div>
            <label className="label">Quantite distribuee</label>
            <input className="input" value={operationForm.quantity} onChange={(e) => setOperationForm({ ...operationForm, quantity: e.target.value })} placeholder="Ex. 20" />
          </div>
          <div>
            <label className="label">Groupe beneficiaire</label>
            <input className="input" value={operationForm.beneficiaryGroup} onChange={(e) => setOperationForm({ ...operationForm, beneficiaryGroup: e.target.value })} />
          </div>
          <div>
            <label className="label">Notes de terrain</label>
            <input className="input" value={operationForm.notes} onChange={(e) => setOperationForm({ ...operationForm, notes: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Button type="submit">{isSaving ? "Enregistrement..." : "Enregistrer la distribution"}</Button>
          </div>
        </form>
      </div>

      <DataTable columns={columns} rows={donations} emptyMessage="Aucun don recu pour le moment." />
    </div>
  );
}
