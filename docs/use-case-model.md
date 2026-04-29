# Modelisation des cas d'utilisation BUMI

Ce document aligne l'application avec le diagramme `DCUF.pdf`.

## Acteurs
  Visiteur : consulte les besoins publics et peut s'inscrire.
  Donateur : se connecte, fait un don en especes, consulte son historique.
  Partenaire : se connecte, consulte les besoins, suit ses contributions et l'impact.
  Responsable : gere les besoins terrain, valide la reception et affecte les dons.
  Administrateur : gere les besoins, les dons, les partenaires, les utilisateurs et les rapports.

## Cas d'utilisation couverts
  S'inscrire : creation d'un compte donateur via `/auth/register`.
  Se connecter : authentification par email, mot de passe et role via `/auth/login`.
  Consulter les besoins : lecture publique et espaces connectes.
  Faire un don en especes : `Donation.type = CASH`, montant, devise et valeur normalisee.
  Valider la reception d'un don : `Donation.received_at` et `Donation.received_by_id`.
  Affecter un don a un besoin : `Donation.need_id`, `Donation.allocated_at` et `Donation.allocated_by_id`.
  Gerer les besoins : creation, mise a jour, publication, cloture et archivage.
  Gerer les dons : suivi des statuts, historique et export.
  Generer un rapport : synthese des dons, besoins, partenaires et distributions.

## Trace de cycle de vie d'un don
  `SUBMITTED` : don cree par un donateur, partenaire ou administrateur.
  `VALIDATED` : don controle par l'administration.
  `RECEIVED` : reception confirmee par le responsable.
  `ALLOCATED` : don affecte a un besoin.
  `DISTRIBUTED` : distribution enregistree aux beneficiaires.
  `CLOSED` : dossier cloture.
