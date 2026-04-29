import { formatDate } from "../../utils/format";

export default function Timeline({ items }) {
  return (
    <div className="card p-6">
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={item.id || item.step} className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`mt-1 h-4 w-4 rounded-full ${
                  item.status === "done"
                    ? "bg-brand-green"
                    : item.status === "current"
                      ? "bg-brand-red"
                      : "bg-slate-300"
                }`}
              />
              {index < items.length - 1 && <span className="mt-2 h-full w-px bg-slate-200" />}
            </div>
            <div className="pb-2">
              <p className="font-semibold text-slate-900">{item.step}</p>
              {item.meta && <p className="mt-1 text-sm font-medium text-slate-700">{item.meta}</p>}
              {item.description && <p className="mt-1 text-sm text-slate-500">{item.description}</p>}
              <p className="mt-1 text-sm text-slate-500">
                {item.date === "-" ? "A venir" : formatDate(item.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
