export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/images/bumi-logo.png"
        alt="Logo BUMI"
        className={compact ? "h-10 w-10 rounded-2xl object-cover" : "h-12 w-12 rounded-2xl object-cover"}
      />
      <div>
        <p className="font-bold text-slate-900">BUMI</p>
        <p className="text-xs text-slate-500">Un avenir meilleur pour l’enfant</p>
      </div>
    </div>
  );
}
