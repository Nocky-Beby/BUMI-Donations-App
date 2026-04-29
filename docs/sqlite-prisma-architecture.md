# Architecture SQLite + Prisma

## Objectif
Offrir une version locale simple à lancer du système centralisé de gestion des dons BUMI.

## Choix techniques
- SQLite pour éviter l’installation d’un serveur de base de données
- Prisma pour structurer proprement les tables et les relations
- Express pour l’API REST
- React + Tailwind pour l’interface

## Modèle métier
### Tables principales
- users
- needs
- donations
- donation_tracking
- distributions
- partners
- report_snapshots
- audit_logs

## Relations importantes
- un utilisateur peut effectuer plusieurs dons
- un besoin peut recevoir plusieurs dons
- un don peut avoir plusieurs événements de traçabilité
- une distribution peut être liée à un don et à un besoin
- les rapports et journaux assurent la transparence et l’audit

## Avantages pour un TFC
- architecture claire
- tables relationnelles bien identifiées
- démarrage facile sur un ordinateur étudiant
- possibilité de migrer plus tard vers PostgreSQL sans refaire toute l’application
