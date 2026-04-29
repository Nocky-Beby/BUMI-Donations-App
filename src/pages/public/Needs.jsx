import { useState } from "react";
import Button from "../../components/ui/Button";
import NeedCard from "../../components/ui/NeedCard";
import PageIntro from "../../components/ui/PageIntro";
import { useAuth } from "../../context/AuthContext";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { publicApi } from "../../services/api";

export default function Needs() {
  const { user, isAuthenticated } = useAuth();
  const [needs, setNeeds] = useState([]);
  const [error, setError] = useState("");
  const isBackofficeUser = isAuthenticated && ["admin", "manager"].includes(user?.role);

  const loadNeeds = async () => {
    try {
      const response = await publicApi.getNeeds();
      setNeeds(response.items || []);
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger les besoins pour le moment.");
    }
  };

  useAutoRefresh(loadNeeds, 12000, ["need.created", "need.updated"]);

  return (
    <div>
      <PageIntro
        title="Nos besoins en temps réel"
        description="Consultez les besoins réellement publiés par l’orphelinat BUMI. Les besoins couverts disparaissent automatiquement du site public tout en restant conservés dans l’historique d’administration."
        actions={
          <>
            <Button to="/connexion" disabled={isBackofficeUser}>Faire un don</Button>
            <Button to="/contact" variant="secondary">
              Nous contacter
            </Button>
          </>
        }
        gradient
      />

      <section className="py-16">
        <div className="container-app">
          <p className="mb-6 text-sm text-slate-500">Cette page se synchronise automatiquement dès qu’un besoin est publié, couvert, clôturé ou archivé.</p>
          {error && <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {needs.map((need) => (
              <NeedCard key={need.id} need={need} />
            ))}
          </div>
          {!needs.length && !error ? (
            <div className="card mt-8 p-8 text-center text-sm text-slate-500">
              Aucun besoin publié pour le moment.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
