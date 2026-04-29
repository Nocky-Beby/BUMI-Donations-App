const badgeStyles = {
  Urgent: "bg-red-50 text-red-700 ring-red-200",
  "Très élevé": "bg-orange-50 text-orange-700 ring-orange-200",
  Moyen: "bg-pink-50 text-pink-700 ring-pink-200",
  Disponible: "bg-green-50 text-green-700 ring-green-200",
  "En préparation": "bg-yellow-50 text-yellow-700 ring-yellow-200",
  Affecté: "bg-blue-50 text-blue-700 ring-blue-200",
  Distribué: "bg-green-50 text-green-700 ring-green-200",
  "En attente d’affectation": "bg-yellow-50 text-yellow-700 ring-yellow-200",
  Terminé: "bg-green-50 text-green-700 ring-green-200",
  "En cours": "bg-pink-50 text-pink-700 ring-pink-200",
  Planifié: "bg-slate-100 text-slate-700 ring-slate-200",
  Actif: "bg-green-50 text-green-700 ring-green-200",
  Nouveau: "bg-pink-50 text-pink-700 ring-pink-200",
  Inactif: "bg-slate-100 text-slate-700 ring-slate-200",
  Publié: "bg-pink-50 text-pink-700 ring-pink-200",
  Couvert: "bg-green-50 text-green-700 ring-green-200",
  Clôturé: "bg-slate-100 text-slate-700 ring-slate-200",
  Archivé: "bg-slate-100 text-slate-700 ring-slate-200",
  Validé: "bg-green-50 text-green-700 ring-green-200",
  Reçu: "bg-blue-50 text-blue-700 ring-blue-200",
  Soumis: "bg-yellow-50 text-yellow-700 ring-yellow-200",
};

export default function Badge({ text }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        badgeStyles[text] || "bg-slate-100 text-slate-700 ring-slate-200"
      }`}
    >
      {text}
    </span>
  );
}
