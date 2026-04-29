import { useState } from "react";
import Button from "../../components/ui/Button";
import SectionHeader from "../../components/ui/SectionHeader";
import StatCard from "../../components/ui/StatCard";
import NeedCard from "../../components/ui/NeedCard";
import { useAuth } from "../../context/AuthContext";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { actorCards, testimonials } from "../../data/mockData";
import { publicApi } from "../../services/api";
import { formatCurrency } from "../../utils/format";

const domains = [
  {
    title: "Education",
    text: "Un soutien scolaire coherent pour accompagner la scolarisation, les fournitures et l'encadrement educatif.",
    image: "/images/needs-education.jpg",
  },
  {
    title: "Sante",
    text: "Un suivi medical plus rapide pour repondre aux urgences et renforcer la protection des enfants.",
    image: "/images/hero-children.jpg",
  },
  {
    title: "Protection",
    text: "Une tracabilite claire pour que chaque appui ameliore concretement les conditions de vie dans le village d'enfants.",
    image: "/images/about-children.jpg",
  },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [needs, setNeeds] = useState([]);
  const [error, setError] = useState("");
  const isBackofficeUser = isAuthenticated && ["admin", "manager"].includes(user?.role);

  const loadData = async () => {
    try {
      const [statsResponse, needsResponse] = await Promise.all([
        publicApi.getStats(),
        publicApi.getNeeds(),
      ]);
      setStats(statsResponse.stats || null);
      setNeeds(needsResponse.items || []);
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de synchroniser les informations publiques.");
    }
  };

  useAutoRefresh(loadData, 8000, ["need.created", "need.updated"]);

  const donationBreakdown = stats?.donationBreakdown || {};
  const siteStats = [
    { label: "Donateurs inscrits", value: String(stats?.donors || 0), helper: "Communaute engagee" },
    { label: "Dons en francs congolais", value: formatCurrency(donationBreakdown.cashCdf || 0, "CDF"), helper: "Especes enregistrees en FC" },
    { label: "Dons en dollars", value: formatCurrency(donationBreakdown.cashUsd || 0, "USD"), helper: "Especes enregistrees en USD" },
    { label: "Partenaires suivis", value: String(stats?.partners || 0), helper: "Organisations mobilisees" },
    { label: "Campagnes reussies", value: String(stats?.completedNeeds || 0), helper: "Besoins couverts ou clotures" },
  ];

  return (
    <div>
      <section className="bg-brand-hero text-white">
        <div className="container-app grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20">
              Transparence - Tracabilite - Impact social
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              BUMI, un avenir meilleur pour chaque enfant accompagne.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">
              Decouvrir la mission, consulter les besoins reels, contribuer en confiance et suivre
              l'affectation des dons : la plateforme centralise toute la chaine de solidarite
              autour de l'orphelinat BUMI.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button to="/connexion" disabled={isBackofficeUser}>
                Faire un don
              </Button>
              <Button to="/besoins" variant="secondary">
                Voir les besoins
              </Button>
              <Button to="/a-propos" variant="soft">
                En savoir plus
              </Button>
            </div>
            {isBackofficeUser && (
              <p className="mt-4 text-sm text-white/80">
                En mode administration, les actions de don restent desactivees sur cette page.
              </p>
            )}
            <p className="mt-5 text-sm text-white/80">
              Les montants en FC et en USD se mettent a jour automatiquement apres chaque nouveau
              mouvement.
            </p>
            {error && <p className="mt-3 text-sm text-red-100">{error}</p>}
          </div>

          <div className="grid gap-5">
            <img
              src="/images/hero-children.jpg"
              alt="Enfants accompagnes par BUMI"
              className="h-[320px] w-full rounded-[2rem] object-cover shadow-2xl shadow-black/20"
            />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {siteStats.map((item) => (
                <StatCard key={item.label} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-app">
          <SectionHeader
            eyebrow="Vision de la plateforme"
            title="Un site pense pour chaque acteur de la solidarite"
            description="Le visiteur decouvre, le donateur contribue, l'administrateur supervise, le responsable pilote les besoins terrain et le partenaire mesure la portee des actions."
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {actorCards.map((actor) => (
              <div key={actor.role} className="card p-6">
                <p className="text-sm font-semibold text-brand-red">{actor.role}</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">{actor.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">{actor.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-app">
          <SectionHeader
            eyebrow="Besoins en temps reel"
            title="Les campagnes et priorites actuelles de BUMI"
            description="Les besoins sont mis a jour par les responsables, publies par la plateforme et synchronises automatiquement avec les statistiques et rapports."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {needs.slice(0, 4).map((need) => (
              <NeedCard key={need.id} need={need} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-app">
          <SectionHeader
            eyebrow="Nos domaines d'action"
            title="Un impact concret sur la vie des enfants"
            description="L'application rend visibles les besoins et les resultats dans les domaines qui structurent le quotidien des enfants pris en charge."
            align="center"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {domains.map((item) => (
              <div key={item.title} className="card overflow-hidden">
                <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-hero py-16 text-white sm:py-20">
        <div className="container-app text-center">
          <SectionHeader
            eyebrow="Ensemble, changeons des vies"
            title="Votre generosite peut offrir un avenir meilleur"
            description="Chaque don compte, chaque affectation est suivie et chaque distribution peut etre consultee par les acteurs autorises."
            align="center"
          />
          <div className="mt-12 flex justify-center">
            <Button to="/connexion" variant="secondary" disabled={isBackofficeUser}>
              Faire un don maintenant
            </Button>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-3xl border border-white/10 bg-white/10 p-8 text-left backdrop-blur"
              >
                <p className="text-base leading-7 text-slate-50">"{testimonial.quote}"</p>
                <div className="mt-6">
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-200">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
