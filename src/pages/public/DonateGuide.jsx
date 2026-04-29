import Button from "../../components/ui/Button";
import PageIntro from "../../components/ui/PageIntro";

const steps = [
  {
    title: "1. Créer un compte",
    text: "Le donateur s’inscrit afin de sécuriser ses informations et d’accéder à son historique personnel.",
  },
  {
    title: "2. Choisir le type de don",
    text: "La plateforme prend en charge les dons en especes en FC ou en USD selon les besoins disponibles.",
  },
  {
    title: "3. Confirmer l’enregistrement",
    text: "Le don est validé puis intégré au circuit de traçabilité pour permettre un suivi clair.",
  },
  {
    title: "4. Suivre l’affectation",
    text: "Le donateur visualise à quel besoin sa contribution est liée et l’étape de distribution associée.",
  },
];

export default function DonateGuide() {
  return (
    <div>
      <PageIntro
        title="Comment faire un don"
        description="Le parcours a été conçu pour rester simple, humain et rassurant. En quelques étapes, un donateur peut contribuer et suivre l’utilisation réelle de son soutien."
        actions={
          <>
            <Button to="/inscription">S’inscrire</Button>
            <Button to="/connexion" variant="secondary">
              Se connecter
            </Button>
          </>
        }
        gradient
      />

      <section className="py-16 sm:py-20">
        <div className="container-app grid gap-6 lg:grid-cols-2">
          {steps.map((step) => (
            <div key={step.title} className="card p-8">
              <h2 className="text-2xl font-bold text-slate-900">{step.title}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-app grid gap-8 lg:grid-cols-3">
          {[
            {
              title: "Dons en espèces",
              text: "Destinés aux besoins monétaires comme la santé, les urgences ou certains achats stratégiques.",
            },
            {
              title: "Dons en USD",
              text: "Vivres, vêtements, fournitures, équipements et matériels utiles à l’orphelinat.",
            },
            {
              title: "Dons partenaires",
              text: "Contributions plus structurées avec visibilité sur l’impact et les rapports associés.",
            },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
