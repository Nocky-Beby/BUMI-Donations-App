import PageIntro from "../../components/ui/PageIntro";
import SectionHeader from "../../components/ui/SectionHeader";

const values = [
  {
    title: "Notre mission",
    text: "Assurer la protection et l’éducation des enfants orphelins et vulnérables, tout en renforçant la confiance entre BUMI, les donateurs, les partenaires et les responsables terrain.",
  },
  {
    title: "Notre vision",
    text: "Construire une société où chaque enfant congolais accède à un cadre de vie digne, à la santé, à l’éducation et à un accompagnement durable.",
  },
  {
    title: "Nos valeurs",
    text: "Solidarité, engagement, protection de l’enfant, durabilité des actions, autonomisation et confiance entre tous les acteurs impliqués.",
  },
  {
    title: "Pourquoi la plateforme ?",
    text: "Digitaliser la gestion des dons pour mieux piloter les besoins réels, publier les urgences, suivre l’affectation et produire des rapports fiables.",
  },
];

export default function About() {
  return (
    <div>
      <PageIntro
        title="À propos de BUMI"
        description="BUMI, « la vie » en langue Luba, agit pour offrir un avenir meilleur aux enfants vulnérables. Cette plateforme numérique renforce la gestion des dons, la transparence et la confiance autour de cette mission."
        gradient
      />

      <section className="py-16 sm:py-20">
        <div className="container-app grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="card p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">Notre histoire</p>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">Une action née au service des enfants vulnérables de RDC</h2>
              <div className="mt-5 space-y-4 text-base leading-7 text-slate-600">
                <p>
                  Créée en 1985, BUMI s’est donnée pour mission de répondre aux défis de santé publique, de sous-développement et de pauvreté en assurant la protection et l’éducation des enfants orphelins et vulnérables.
                </p>
                <p>
                  L’organisation accompagne aujourd’hui des enfants accueillis dans le village d’enfants et soutient également la scolarisation et l’accès aux soins à travers des actions suivies sur le terrain.
                </p>
                <p>
                  Le projet web centralise désormais les besoins, les dons, les distributions et les rapports afin d’offrir une visibilité claire à tous les acteurs autorisés.
                </p>
              </div>
            </div>

            <img src="/images/about-children.jpg" alt="Enfants de BUMI" className="h-[360px] w-full rounded-[2rem] object-cover shadow-card" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((item) => (
              <div key={item.title} className="card p-6">
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-app">
          <SectionHeader
            eyebrow="Pourquoi cette application ?"
            title="Répondre aux limites d’une gestion manuelle des dons"
            description="La plateforme réduit la dispersion des informations, permet la publication des besoins en temps réel et améliore la traçabilité jusqu’à la distribution finale."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              "Suivi incomplet des dons en esp�ces.",
              "Difficulté à visualiser les besoins réels au bon moment.",
              "Faible visibilité sur l’affectation, la validation et la distribution finale.",
            ].map((point) => (
              <div key={point} className="card p-6 text-sm leading-7 text-slate-600">
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
