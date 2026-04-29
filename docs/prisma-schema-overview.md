# Vue d’ensemble du schéma Prisma BUMI

## Relations clés
- Un `user` peut créer plusieurs `donations`
- Un `need` peut recevoir plusieurs `donations`
- Une `donation` possède plusieurs entrées de `donation_tracking`
- Une `distribution` peut être liée à un `need` et éventuellement à une `donation`
- Un `user` peut être l’auteur d’une distribution, d’une mise à jour d’un besoin ou d’un audit

## Règles métier implicites
- les dons sont historisés par statut
- les besoins restent consultables dans le temps
- la distribution diminue le stock ou la valeur affectée
- les rapports peuvent être recalculés ou figés
- la traçabilité ne dépend pas seulement du don, mais aussi des actions système
