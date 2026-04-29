import Button from "../../components/ui/Button";
import PageIntro from "../../components/ui/PageIntro";

export default function Contact() {
  return (
    <div>
      <PageIntro
        title="Contact"
        description="Tu souhaites soutenir BUMI, proposer un partenariat ou obtenir plus d’informations sur les besoins et les rapports ? Notre équipe reste disponible."
        gradient
      />

      <section className="py-16 sm:py-20">
        <div className="container-app grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            {[
              ["Adresse", "Lubumbashi, République Démocratique du Congo"],
              ["Email", "contact@bumi.org"],
              ["Téléphone", "+243 99 000 0000"],
              ["Disponibilité", "Du lundi au vendredi, 08h00 - 17h00"],
            ].map(([label, value]) => (
              <div key={label} className="card p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-green">
                  {label}
                </p>
                <p className="mt-3 text-base text-slate-700">{value}</p>
              </div>
            ))}
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold text-slate-900">Envoyer un message</h2>
            <p className="mt-3 text-slate-600">
              Ce formulaire est prêt à être relié à un backend ou un service d’envoi.
            </p>

            <form className="mt-8 space-y-5">
              <div>
                <label className="label">Nom complet</label>
                <input className="input" placeholder="Votre nom" />
              </div>
              <div>
                <label className="label">Adresse email</label>
                <input type="email" className="input" placeholder="vous@exemple.com" />
              </div>
              <div>
                <label className="label">Sujet</label>
                <input className="input" placeholder="Objet du message" />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea className="textarea" placeholder="Décrivez votre besoin..." />
              </div>
              <Button type="button">Nous contacter</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
