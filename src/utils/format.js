export const formatCurrency = (value, currency = "CDF") => {
  const numeric = Number(value || 0);
  if (String(currency).toUpperCase() === "USD") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(numeric);
  }
  return `${new Intl.NumberFormat("fr-CD", { maximumFractionDigits: 0 }).format(numeric)} FC`;
};

export const formatDonationValue = (row) => formatCurrency(row?.amount || row?.value || 0, row?.currency || "CDF");

export const formatDate = (value) =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));

export const formatDateTime = (value) =>
  value
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value))
    : "-";

export const formatStatusLabel = (value) => {
  const labels = { submitted: "Soumis", validated: "Validé", received: "Reçu", allocated: "Affecté", distributed: "Distribué", closed: "Clôturé", open: "Publié", published: "Publié", draft: "Brouillon", satisfied: "Couvert", archived: "Archivé", active: "Actif", completed: "Terminé", urgent: "Urgent", high: "Très élevé", medium: "Moyen", low: "Faible", cash: "Espèces", donor: "Donateur", partner: "Partenaire", manager: "Responsable", admin: "Administrateur", pending: "En attente", delivered: "Envoyé", in_app_only: "Message interne" };
  const normalized = String(value || "").toLowerCase();
  return labels[normalized] || String(value || "");
};
