import { useMemo, useState } from "react";
import Badge from "../../components/ui/Badge";
import Timeline from "../../components/ui/Timeline";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { donationApi, trackingApi } from "../../services/api";
import { formatCurrency, formatDate, formatStatusLabel } from "../../utils/format";

const stages = ["submitted", "validated", "received", "allocated", "distributed", "closed"];

export default function DonationTracking() {
  const [historyRows, setHistoryRows] = useState([]);
  const [trackingRows, setTrackingRows] = useState([]);
  const [selectedDonationId, setSelectedDonationId] = useState("");
  const [error, setError] = useState("");

  const loadTracking = async () => {
    try {
      const [trackingResponse, historyResponse] = await Promise.all([
        trackingApi.my(),
        donationApi.myHistory(),
      ]);

      const nextTrackingRows = trackingResponse.items || [];
      const nextHistoryRows = historyResponse.items || [];

      setTrackingRows(nextTrackingRows);
      setHistoryRows(nextHistoryRows);
      setSelectedDonationId((current) =>
        nextHistoryRows.some((row) => row.id === current) ? current : nextHistoryRows[0]?.id || ""
      );
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger le suivi de vos dons.");
    }
  };

  useAutoRefresh(loadTracking, 10000);

  const donations = useMemo(() => {
    const groupedTracking = trackingRows.reduce((accumulator, item) => {
      if (!accumulator[item.donationId]) accumulator[item.donationId] = [];
      accumulator[item.donationId].push(item);
      return accumulator;
    }, {});

    return historyRows.map((row) => {
      const events = [...(groupedTracking[row.id] || [])].sort(
        (left, right) => new Date(left.date).getTime() - new Date(right.date).getTime()
      );

      return {
        ...row,
        events,
        latestEvent: events[events.length - 1] || null,
      };
    });
  }, [historyRows, trackingRows]);

  const selectedDonation = useMemo(
    () => donations.find((donation) => donation.id === selectedDonationId) || donations[0] || null,
    [donations, selectedDonationId]
  );

  const selectedAmounts = useMemo(() => {
    if (!selectedDonation) {
      return { allocatedAmount: null, distributedAmount: null };
    }

    const allocatedEvent = [...selectedDonation.events]
      .reverse()
      .find((event) => event.title === "allocated" && Number(event.amount || 0) > 0);
    const distributedEvent = [...selectedDonation.events]
      .reverse()
      .find((event) => event.title === "distributed" && Number(event.amount || 0) > 0);

    return {
      allocatedAmount:
        allocatedEvent?.amount ??
        (["allocated", "distributed", "closed"].includes(selectedDonation.status)
          ? Number(selectedDonation.amount || 0)
          : null),
      distributedAmount: distributedEvent?.amount ?? null,
    };
  }, [selectedDonation]);

  const timelineItems = useMemo(() => {
    if (!selectedDonation) return [];

    return selectedDonation.events.map((event, index) => ({
      id: event.id,
      step: `${formatStatusLabel(event.title)} - ${event.actor || "Suivi BUMI"}`,
      meta:
        event.amountLabel && Number(event.amount || 0) > 0
          ? `${event.amountLabel} : ${formatCurrency(event.amount, event.currency || selectedDonation.currency)}`
          : "",
      description: event.description || "",
      date: event.date,
      status: index === selectedDonation.events.length - 1 ? "current" : "done",
    }));
  }, [selectedDonation]);

  const selectedStageIndex = selectedDonation
    ? Math.max(stages.indexOf(selectedDonation.status), 0)
    : -1;

  return (
    <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
      <div className="space-y-6">
        <div className="card p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">
            Tracabilite
          </p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900">Suivi de l'affectation de mes dons</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Selectionnez un don pour voir son evolution complete, depuis l'enregistrement jusqu'a
            l'affectation et la distribution.
          </p>

          {selectedDonation && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Don suivi :</span> {selectedDonation.id}</p>
              <p className="mt-1"><span className="font-semibold text-slate-900">Valeur :</span> {formatCurrency(selectedDonation.amount, selectedDonation.currency)}</p>
              <p className="mt-1"><span className="font-semibold text-slate-900">Besoin :</span> {selectedDonation.purpose}</p>
              <p className="mt-1"><span className="font-semibold text-slate-900">Derniere mise a jour :</span> {selectedDonation.latestEvent ? formatDate(selectedDonation.latestEvent.date) : formatDate(selectedDonation.date)}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Montant affecte</p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {selectedAmounts.allocatedAmount !== null
                      ? formatCurrency(selectedAmounts.allocatedAmount, selectedDonation.currency)
                      : "En attente"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Montant distribue</p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {selectedAmounts.distributedAmount !== null
                      ? formatCurrency(selectedAmounts.distributedAmount, selectedDonation.currency)
                      : "Pas encore distribue"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-900">Mes dons suivis</h3>
          <div className="mt-5 space-y-3">
            {donations.map((donation) => (
              <button
                key={donation.id}
                type="button"
                onClick={() => setSelectedDonationId(donation.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selectedDonation?.id === donation.id
                    ? "border-brand-red bg-brand-blush"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{donation.purpose}</p>
                  <Badge text={formatStatusLabel(donation.status)} />
                </div>
                <p className="mt-2 text-sm text-slate-500">{formatCurrency(donation.amount, donation.currency)}</p>
                <p className="mt-1 text-xs text-slate-500">Don du {formatDate(donation.date)}</p>
              </button>
            ))}
            {!donations.length && (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                Aucun don a suivre pour le moment.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {selectedDonation && (
          <div className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Evolution du don</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">{selectedDonation.purpose}</h3>
              </div>
              <Badge text={formatStatusLabel(selectedDonation.status)} />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {stages.map((stage, index) => {
                const isReached = index <= selectedStageIndex;
                const isCurrent = index === selectedStageIndex;
                const stageAmount =
                  stage === "allocated" && selectedAmounts.allocatedAmount !== null
                    ? formatCurrency(selectedAmounts.allocatedAmount, selectedDonation.currency)
                    : stage === "distributed" && selectedAmounts.distributedAmount !== null
                      ? formatCurrency(selectedAmounts.distributedAmount, selectedDonation.currency)
                      : "";

                return (
                  <div
                    key={stage}
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      isCurrent
                        ? "border-brand-red bg-brand-blush text-brand-red"
                        : isReached
                          ? "border-green-200 bg-green-50 text-brand-green"
                          : "border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    <p className="font-semibold">{formatStatusLabel(stage)}</p>
                    {stageAmount && <p className="mt-1 text-xs opacity-80">{stageAmount}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Timeline items={timelineItems} />
      </div>
    </div>
  );
}
