import Badge from "./Badge";
import ProgressBar from "./ProgressBar";
import Button from "./Button";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency, formatStatusLabel } from "../../utils/format";
import { resolveNeedImage } from "../../utils/needMedia";

function getProgress(need) {
  if (typeof need.progress === "number") return need.progress;
  if (need.targetAmount > 0) return Math.round((Number(need.currentAmount || 0) / Number(need.targetAmount || 1)) * 100);
  if (need.targetQuantity > 0) return Math.round((Number(need.currentQuantity || 0) / Number(need.targetQuantity || 1)) * 100);
  return 0;
}

function getCollected(need) {
  if (need.collected) return need.collected;
  if (Number(need.targetAmount) > 0) return formatCurrency(Number(need.currentAmount || 0));
  return `${Number(need.currentQuantity || 0)} ${need.unit || "unites"}`;
}

function getTarget(need) {
  if (need.target) return need.target;
  if (Number(need.targetAmount) > 0) return formatCurrency(Number(need.targetAmount || 0));
  return `${Number(need.targetQuantity || 0)} ${need.unit || "unites"}`;
}

export default function NeedCard({ need, compact = false }) {
  const { user, isAuthenticated } = useAuth();
  const progress = getProgress(need);
  const isBackofficeUser = isAuthenticated && ["admin", "manager"].includes(user?.role);

  return (
    <div className="card flex h-full flex-col overflow-hidden">
      <img src={resolveNeedImage(need)} alt={need.title} className="h-48 w-full object-cover" />
      <div className="flex h-full flex-col p-6">
        <div className="md:min-h-[7.5rem]">
          <div className="flex flex-wrap gap-2">
            <Badge text={formatStatusLabel(need.status)} />
            <Badge text={formatStatusLabel(need.priority)} />
          </div>
          <p className="mt-3 text-sm font-semibold text-brand-red">{need.category}</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900 md:min-h-[3.5rem]">{need.title}</h3>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600 md:min-h-[4.5rem]">{need.description}</p>

        <div className="mt-auto">
          <ProgressBar value={progress} />

          <div className="mt-4 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span>Collecte : {getCollected(need)}</span>
            <span className="sm:text-right">Cible : {getTarget(need)}</span>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500 md:min-h-[3.75rem]">
            Mis a jour automatiquement selon les dons, affectations et distributions valides.
          </div>

          {!compact && (
            <div className="mt-6">
              <Button
                to="/connexion"
                variant="secondary"
                className="w-full"
                disabled={isBackofficeUser}
              >
                Soutenir ce besoin
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
