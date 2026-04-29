import Button from "../ui/Button";
import { formatDate, formatStatusLabel } from "../../utils/format";

export default function NotificationsPanel({ items = [], onMarkRead }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Messages de confirmation</h3>
          <p className="mt-2 text-sm text-slate-600">
            Les donateurs et partenaires reçoivent ici un message dès qu’un don est validé, affecté ou distribué.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {items.length ? items.map((item) => (
          <div key={item.id} className={`rounded-2xl border p-4 ${item.read ? "border-slate-200 bg-white" : "border-pink-200 bg-brand-blush"}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{formatDate(item.createdAt)} · {formatStatusLabel(item.status)}</p>
              </div>
              {!item.read && onMarkRead ? (
                <Button type="button" variant="secondary" className="px-3 py-2 text-xs" onClick={() => onMarkRead(item.id)}>
                  Marquer comme lu
                </Button>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.message}</p>
          </div>
        )) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
            Aucun message de confirmation pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
