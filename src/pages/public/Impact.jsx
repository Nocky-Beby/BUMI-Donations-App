import { useState } from "react";
import PageIntro from "../../components/ui/PageIntro";
import SectionHeader from "../../components/ui/SectionHeader";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import useAutoRefresh from "../../hooks/useAutoRefresh";
import { testimonials } from "../../data/mockData";
import { publicApi } from "../../services/api";
import { formatCurrency } from "../../utils/format";

export default function Impact() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState({ monthly: [], byCategory: [] });
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [statsResponse, reportsResponse] = await Promise.all([publicApi.getStats(), publicApi.getReports()]);
      setStats(statsResponse.stats || null);
      setReports(reportsResponse || { monthly: [], byCategory: [] });
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Impossible de charger les indicateurs d’impact.");
    }
  };

  useAutoRefresh(loadData, 8000);
  const breakdown = stats?.donationBreakdown || {};

  return (
    <div>
      <PageIntro title="Témoignages et impact" description="La valeur d’une plateforme solidaire se mesure dans la qualité du suivi, la confiance créée et les résultats observables pour les enfants." gradient />

      <section className="py-16">
        <div className="container-app grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Donateurs suivis" value={String(stats?.donors || 0)} helper="Comptes engagés sur la plateforme" />
          <StatCard label="Dons en FC" value={formatCurrency(breakdown.cashCdf || 0, 'CDF')} helper="Espèces enregistrées en FC" />
          <StatCard label="Dons en USD" value={formatCurrency(breakdown.cashUsd || 0, 'USD')} helper="Espèces enregistrées en USD" />
          <StatCard label="Distributions documentées" value={String(stats?.distributions || 0)} helper="Actions suivies sur le terrain" />
        </div>
      </section>

      <section className="py-16">
        <div className="container-app grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <img src="/images/hero-children.jpg" alt="Impact BUMI" className="h-full min-h-[320px] w-full rounded-[2rem] object-cover shadow-card" />
          <div className="card p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">Transparence active</p>
            <h3 className="mt-4 text-3xl font-bold text-slate-900">Une visibilité continue sur les actions menées</h3>
            <p className="mt-5 text-base leading-7 text-slate-600">Les rapports publics se recalculent automatiquement après chaque don, affectation, validation ou distribution. Les montants en FC et en USD restent visibles separement.</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-app">
          <SectionHeader eyebrow="Rapports" title="Évolution mensuelle et lecture par catégorie" description="Les responsables et les partenaires peuvent interpréter rapidement la dynamique des contributions." />
          {error && <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(reports.monthly || []).map((report) => (
              <div key={report.month} className="card p-6">
                <p className="text-sm text-slate-500">{report.month}</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">Rapport mensuel consolidé</h3>
                <p className="mt-3 text-sm text-slate-600">Équivalent suivi sur la période : {formatCurrency(report.total)}</p>
                <div className="mt-4"><Badge text="Disponible" /></div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(reports.byCategory || []).map((item) => (
              <div key={item.category} className="card p-6">
                <p className="text-sm text-slate-500">Catégorie suivie</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">{item.category}</h3>
                <p className="mt-4 text-sm text-slate-600">Valeur cumulée (équivalent FC) : {formatCurrency(item.total)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-app grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="card p-8">
              <p className="text-base leading-7 text-slate-600">“{testimonial.quote}”</p>
              <div className="mt-6"><p className="font-semibold text-slate-900">{testimonial.name}</p><p className="text-sm text-slate-500">{testimonial.role}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
