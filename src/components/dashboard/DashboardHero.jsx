export default function DashboardHero({ title, text, action, accent = "red" }) {
  const accentMap = {
    red: "from-brand-blush to-white",
    green: "from-brand-greenSoft to-white",
    gold: "from-brand-sand to-white",
  };

  return (
    <div className={`rounded-[2rem] bg-gradient-to-br ${accentMap[accent] || accentMap.red} p-8 shadow-card`}>
      <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
