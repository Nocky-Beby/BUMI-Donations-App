export default function ProgressBar({ value }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
        <span>Progression</span>
        <span>{safeValue}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-red to-brand-green"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
