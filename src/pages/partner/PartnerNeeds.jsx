import { useState } from "react";
import NeedCard from "../../components/ui/NeedCard";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { publicApi } from "../../services/api";

export default function PartnerNeeds() {
  const [needs, setNeeds] = useState([]);
  const [error, setError] = useState("");

  const loadNeeds = async () => {
    try {
      const response = await publicApi.getNeeds();
      setNeeds(response.items || []);
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger les besoins.");
    }
  };

  useAutoRefresh(loadNeeds, 12000, ["need.created", "need.updated"]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Consultation des besoins</h2>
        <p className="mt-3 text-slate-600">Les partenaires accèdent aux besoins prioritaires pour orienter leurs interventions.</p>
      </div>

      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {needs.map((need) => (
          <NeedCard key={need.id} need={need} compact />
        ))}
      </div>
    </div>
  );
}
