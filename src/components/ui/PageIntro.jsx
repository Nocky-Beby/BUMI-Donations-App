export default function PageIntro({ title, description, actions, gradient = false }) {
  return (
    <section className={gradient ? "bg-brand-hero text-white" : "bg-white"}>
      <div className="container-app py-14 sm:py-16">
        <div className="max-w-4xl">
          <h1 className={`text-4xl font-bold tracking-tight sm:text-5xl ${gradient ? "text-white" : "text-slate-900"}`}>
            {title}
          </h1>
          <p className={`mt-5 text-lg leading-8 ${gradient ? "text-white/90" : "text-slate-600"}`}>{description}</p>
          {actions && <div className="mt-8 flex flex-wrap gap-4">{actions}</div>}
        </div>
      </div>
    </section>
  );
}
