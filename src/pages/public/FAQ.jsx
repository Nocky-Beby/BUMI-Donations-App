import PageIntro from "../../components/ui/PageIntro";
import { faqs } from "../../data/mockData";

export default function FAQ() {
  return (
    <div>
      <PageIntro
        title="Foire aux questions"
        description="Retrouve les réponses essentielles concernant le fonctionnement de la plateforme, les dons et le suivi des actions."
        gradient
      />

      <section className="py-16">
        <div className="container-app max-w-4xl space-y-5">
          {faqs.map((faq) => (
            <div key={faq.question} className="card p-6">
              <h2 className="text-xl font-bold text-slate-900">{faq.question}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
