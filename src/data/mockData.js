export const siteStats = [
  { label: "Donateurs inscrits", value: "1 284" },
  { label: "Dons suivis", value: "3 912" },
  { label: "Besoins actifs", value: "24" },
  { label: "Enfants soutenus", value: "186" },
];

export const needs = [
  {
    id: 1,
    title: "Kits scolaires",
    category: "Éducation",
    priority: "Urgent",
    progress: 72,
    target: 150,
    collected: 108,
    description: "Fournitures pour la rentrée : cahiers, sacs, stylos, uniformes et livres.",
  },
  {
    id: 2,
    title: "Produits alimentaires",
    category: "Nutrition",
    priority: "Très élevé",
    progress: 48,
    target: 900,
    collected: 430,
    description: "Riz, farine, huile, haricots et produits essentiels pour la cuisine communautaire.",
  },
  {
    id: 3,
    title: "Matelas et couvertures",
    category: "Hébergement",
    priority: "Moyen",
    progress: 63,
    target: 80,
    collected: 50,
    description: "Renforcement des conditions d’hébergement et de repos des enfants.",
  },
  {
    id: 4,
    title: "Fonds de santé",
    category: "Santé",
    priority: "Urgent",
    progress: 39,
    target: 5000,
    collected: 1950,
    description: "Soins, médicaments, examens et urgences médicales des enfants.",
  },
];

export const testimonials = [
  {
    name: "Mado N.",
    role: "Donatrice régulière",
    quote:
      "Avec BUMI, je sais exactement à quoi sert mon soutien. Voir l’évolution de l’affectation de mon don me rassure énormément.",
  },
  {
    name: "Fondation Kivu Action",
    role: "Partenaire",
    quote:
      "La plateforme facilite la coordination, le suivi des besoins et la lecture des résultats. C’est un vrai outil de confiance.",
  },
  {
    name: "Sœur Rachel",
    role: "Responsable de l’orphelinat",
    quote:
      "La centralisation des informations nous permet de mieux planifier les priorités et de mieux rendre compte aux donateurs.",
  },
];

export const impactStories = [
  {
    title: "Une rentrée mieux préparée",
    text: "Les dons en fournitures ont permis à 92 enfants de reprendre l’école avec des kits complets et adaptés.",
  },
  {
    title: "Une meilleure disponibilité des repas",
    text: "Le suivi des apports alimentaires a permis de stabiliser le stock mensuel et d’éviter les ruptures.",
  },
  {
    title: "Un pilotage plus transparent",
    text: "Chaque contribution est enregistrée, affectée puis suivie jusqu’à la distribution finale.",
  },
];

export const donationHistory = [
  {
    id: "DON-2026-001",
    donor: "Marie Kabila",
    type: "Espèces",
    amount: 250,
    date: "2026-02-14",
    status: "Affecté",
    purpose: "Fonds de santé",
  },
  {
    id: "DON-2026-002",
    donor: "Joseph Ilunga",
    type: "Nature",
    amount: 120,
    date: "2026-02-21",
    status: "Distribué",
    purpose: "Kits scolaires",
  },
  {
    id: "DON-2026-003",
    donor: "ONG Espoir",
    type: "Espèces",
    amount: 900,
    date: "2026-03-02",
    status: "En attente d’affectation",
    purpose: "Nutrition",
  },
  {
    id: "DON-2026-004",
    donor: "Partenaire Mwana",
    type: "Nature",
    amount: 60,
    date: "2026-03-08",
    status: "Affecté",
    purpose: "Matelas et couvertures",
  },
];

export const trackingTimeline = [
  { step: "Don enregistré", date: "2026-03-02", status: "done" },
  { step: "Validation administrative", date: "2026-03-03", status: "done" },
  { step: "Affectation au besoin prioritaire", date: "2026-03-04", status: "done" },
  { step: "Distribution au bénéficiaire", date: "2026-03-06", status: "current" },
  { step: "Rapport d’impact disponible", date: "-", status: "upcoming" },
];

export const donors = [
  { id: 1, name: "Marie Kabila", email: "marie@example.com", phone: "+243 99 000 0001", contributions: 14, status: "Actif" },
  { id: 2, name: "Joseph Ilunga", email: "joseph@example.com", phone: "+243 99 000 0002", contributions: 9, status: "Actif" },
  { id: 3, name: "Sarah K.", email: "sarah@example.com", phone: "+243 99 000 0003", contributions: 3, status: "Nouveau" },
  { id: 4, name: "David M.", email: "david@example.com", phone: "+243 99 000 0004", contributions: 7, status: "Inactif" },
];

export const partners = [
  { id: 1, name: "Fondation Kivu Action", type: "ONG", lastSupport: "2026-03-01", impact: "Nutrition" },
  { id: 2, name: "Hope Children Network", type: "Partenaire privé", lastSupport: "2026-02-25", impact: "Éducation" },
  { id: 3, name: "Mwana Solidarité", type: "Association", lastSupport: "2026-02-17", impact: "Hébergement" },
];

export const distributions = [
  { id: "DIST-001", need: "Kits scolaires", quantity: "108 kits", date: "2026-03-05", status: "Terminé" },
  { id: "DIST-002", need: "Produits alimentaires", quantity: "430 kg", date: "2026-03-08", status: "En cours" },
  { id: "DIST-003", need: "Matelas et couvertures", quantity: "50 unités", date: "2026-03-10", status: "Planifié" },
];

export const reports = [
  { id: 1, title: "Rapport mensuel des dons", period: "Mars 2026", status: "Disponible" },
  { id: 2, title: "Rapport de distribution", period: "T1 2026", status: "Disponible" },
  { id: 3, title: "Rapport d’impact par besoin", period: "Février 2026", status: "En préparation" },
];

export const faqs = [
  {
    question: "Puis-je faire un don en FC ou en USD ?",
    answer:
      "Oui. La plateforme permet d’enregistrer les dons financiers ainsi que les dons matériels comme les vivres, vêtements, fournitures ou équipements.",
  },
  {
    question: "Comment la plateforme garantit-elle la transparence ?",
    answer:
      "Chaque contribution est enregistrée, affectée à un besoin identifié, puis suivie jusqu’à la distribution. Les rapports permettent de vérifier l’utilisation des dons.",
  },
  {
    question: "Qui peut accéder aux tableaux de bord ?",
    answer:
      "Les espaces de gestion sont adaptés aux rôles : donateur, administrateur, responsable de l’orphelinat et partenaire.",
  },
  {
    question: "Le système peut-il évoluer ?",
    answer:
      "Oui. L’architecture proposée prépare l’ajout futur des notifications, paiements en ligne, signatures, version mobile ou API.",
  },
];

export const actorCards = [
  {
    role: "Visiteur",
    title: "Découvrir la mission de BUMI",
    text: "Consulte les besoins, l’impact social, les témoignages et les informations utiles avant de s’engager.",
  },
  {
    role: "Donateur",
    title: "Contribuer et suivre son soutien",
    text: "Crée un compte, effectue un don et visualise l’affectation ainsi que l’historique de tes contributions.",
  },
  {
    role: "Administrateur",
    title: "Superviser la plateforme",
    text: "Gère les donateurs, les dons, les partenaires, les besoins, les paramètres globaux et génère des rapports Excel.",
  },
  {
    role: "Responsable",
    title: "Piloter les besoins et distributions",
    text: "Met à jour les besoins réels de l’orphelinat, valide les réceptions, décide des affectations et suit les distributions terrain.",
  },
  {
    role: "Partenaire",
    title: "Mesurer la portée des actions",
    text: "Suit ses contributions, consulte les besoins à fort impact et visualise les résultats des appuis réalisés.",
  },
];

export const demoUsers = [
  {
    email: "donateur@bumi.org",
    password: "password123",
    role: "donor",
    name: "Gloria Donatrice",
  },
  {
    email: "admin@bumi.org",
    password: "password123",
    role: "admin",
    name: "Admin BUMI",
  },
  {
    email: "responsable@bumi.org",
    password: "password123",
    role: "manager",
    name: "Responsable BUMI",
  },
  {
    email: "partenaire@bumi.org",
    password: "password123",
    role: "partner",
    name: "Partenaire Solidaire",
  },
];

export const dashboardStats = {
  donor: [
    { label: "Mes dons", value: "12" },
    { label: "Montant total", value: "$1 480" },
    { label: "Dons affectés", value: "10" },
    { label: "Rapports consultés", value: "6" },
  ],
  admin: [
    { label: "Dons ce mois", value: "184" },
    { label: "Donateurs actifs", value: "386" },
    { label: "Besoins urgents", value: "8" },
    { label: "Rapports générés", value: "23" },
  ],
  manager: [
    { label: "Besoins à jour", value: "24" },
    { label: "Réceptions validées", value: "57" },
    { label: "Distributions suivies", value: "18" },
    { label: "Zones appuyées", value: "5" },
  ],
  partner: [
    { label: "Contributions", value: "9" },
    { label: "Projets appuyés", value: "4" },
    { label: "Enfants impactés", value: "132" },
    { label: "Rapports reçus", value: "7" },
  ],
};
