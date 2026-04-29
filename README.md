# BUMI Donations App - SQLite + Prisma

Application full-stack de gestion de dons pour l'orphelinat BUMI.

Cette version est pensee pour un developpement local simple sous Windows, sans Docker et sans PostgreSQL, avec une base SQLite et une architecture suffisamment propre pour un projet academique, une demo ou un prototype evolutif.

## Vue d'ensemble

L'application permet de :

- publier et suivre les besoins de l'orphelinat
- enregistrer des dons en especes en FC ou en USD
- valider, recevoir, affecter et distribuer les dons
- notifier les utilisateurs concernes
- suivre l'evolution complete d'un don
- produire des tableaux de bord et des rapports Excel

## Stack technique

- Frontend : React + Vite + Tailwind CSS
- Backend : Express
- ORM : Prisma
- Base de donnees : SQLite
- Authentification : JWT avec gestion des roles
- Temps reel : Server-Sent Events (SSE) + rafraichissement periodique

## Roles disponibles

- `donor` : donateur
- `admin` : administrateur
- `manager` : responsable de l'orphelinat
- `partner` : partenaire

## Comptes de demonstration

- `donateur@bumi.org / password123 / donor`
- `admin@bumi.org / password123 / admin`
- `responsable@bumi.org / password123 / manager`
- `partenaire@bumi.org / password123 / partner`

## Fonctionnalites actuelles

### 1. Espace public

- page d'accueil avec statistiques globales
- pages publiques : accueil, a propos, besoins, guide du don, impact, contact, FAQ
- affichage des besoins publies en temps reel
- mise a jour automatique des besoins publics apres publication, cloture, archivage ou nouvelle affectation

### 2. Espace donateur

- tableau de bord donateur
- creation de dons en especes uniquement
- choix de la devise : `CDF` ou `USD`
- historique des dons
- suivi detaille d'un don
- affichage du :
  - montant total du don
  - montant affecte
  - montant distribue
  - statut courant
  - timeline des etapes du don
- consultation du profil
- notifications internes lors des changements importants

### 3. Espace responsable

- publication et mise a jour des besoins
- affichage temps reel des besoins
- validation de reception d'un don
- affectation d'un don a un besoin
- enregistrement des distributions
- rapports terrain
- generation d'un rapport Excel
- affichage des montants en devise d'origine

### 4. Espace administrateur

- gestion des donateurs
- gestion des dons
- gestion des besoins
- gestion des partenaires
- gestion des distributions
- rapports et statistiques
- generation d'un rapport Excel
- vue detaillee des distributions avec :
  - montant total du don
  - montant distribue
  - besoin affecte
  - date/heure de reception
  - date/heure d'affectation
  - date/heure de distribution

### 5. Espace partenaire

- tableau de bord partenaire
- consultation des besoins
- consultation des contributions
- suivi de l'impact

## Regles fonctionnelles appliquees

### Dons

- les dons en nature estimes ont ete retires de l'application
- l'application gere actuellement uniquement les dons en especes
- un don peut etre saisi en `CDF` ou en `USD`
- l'affichage utilisateur conserve la devise d'origine du don
- une equivalence en FC existe encore en interne pour certains calculs consolides

### Cycle de vie d'un don

Le cycle suivi dans l'application est :

`submitted -> validated -> received -> allocated -> distributed -> closed`

Chaque etape peut produire :

- une entree de suivi
- une notification interne
- une mise a jour des tableaux de bord

### Suivi des distributions

- un don deja affecte ne doit plus apparaitre dans la liste des dons en attente d'affectation du responsable
- l'administrateur voit clairement le besoin affecte, le montant distribue et les dates importantes

### Acces aux pages publiques selon le role

- les utilisateurs `admin` et `manager` peuvent consulter les pages publiques d'information
- les actions de donation sont desactivees pour `admin` et `manager` sur l'accueil et les pages de besoins
- les routes liees a l'action de don (`/connexion`, `/inscription`, `/comment-faire-un-don`) sont restreintes pour les roles backoffice

## Temps reel

L'application utilise :

- un flux SSE sur `/api/events`
- des rafraichissements automatiques cote frontend

Cela permet de mettre a jour automatiquement :

- les besoins publics
- les tableaux de bord
- certains rapports
- les suivis de dons

## Rapports

### Admin

- indicateurs globaux
- mouvements recents
- resume financier
- export Excel

### Responsable

- besoins ouverts
- distributions terminees
- dons en FC
- dons en USD
- progression des besoins
- export Excel

## Notifications

Les donateurs et partenaires peuvent recevoir des notifications internes lors des actions suivantes :

- enregistrement du don
- validation
- reception
- affectation a un besoin
- distribution

Les emails peuvent etre actives via la configuration SMTP du backend.

## Modele de donnees principal

Les entites principales sont :

- `User`
- `Partner`
- `Need`
- `Donation`
- `DonationTracking`
- `Distribution`
- `Notification`
- `ReportSnapshot`
- `AuditLog`

Fichier principal du schema :

- `server/prisma/schema.prisma`

## Demarrage rapide

Depuis la racine du projet :

```powershell
copy .\.env.example .\.env
copy .\server\.env.example .\server\.env
npm install
npm run db:init
npm run fullstack
```

Acces local :

- Frontend : `http://localhost:5173`
- API health check : `http://localhost:5000/api/health`

## Scripts utiles

### Racine

- `npm run client` : lance le frontend
- `npm run server` : lance l'API
- `npm run fullstack` : lance frontend + backend
- `npm run build` : build du frontend
- `npm run preview` : preview du frontend
- `npm run db:init` : generation Prisma + push schema + seed
- `npm run db:generate` : genere le client Prisma
- `npm run db:push` : applique le schema Prisma
- `npm run db:seed` : recharge les donnees de demonstration

### Workspace server

- `npm --workspace server run dev` : lance l'API en mode watch
- `npm --workspace server run start` : lance l'API en mode simple
- `npm --workspace server run db:reset` : reset complet de la base locale

## Variables d'environnement

### Frontend

Fichier : `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend

Fichier : `server/.env`

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="bumi-super-secret-key"
PORT=5000
CLIENT_URL="http://localhost:5173"
MAIL_FROM="no-reply@bumi.local"
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
USD_TO_CDF="2800"
```

## Structure utile

- `src/` : interface React
- `src/pages/public/` : pages publiques
- `src/pages/donor/` : espace donateur
- `src/pages/admin/` : espace administrateur
- `src/pages/manager/` : espace responsable
- `src/pages/partner/` : espace partenaire
- `src/components/` : composants UI, layout, dashboard
- `src/hooks/useAutoRefresh.js` : synchro automatique + SSE
- `server/src/routes/` : routes API Express
- `server/src/utils/` : fonctions utilitaires metier
- `server/prisma/schema.prisma` : schema de donnees
- `server/prisma/seed.js` : donnees de demonstration
- `docs/` : documentation projet

## Etat actuel de l'application

Version courante :

- dons en especes uniquement
- suivi detaille des montants affectes et distribues
- publication de besoins en temps reel
- rapports admin et responsable
- export Excel
- restrictions d'actions de don pour les roles backoffice
- vues admin enrichies pour les distributions

## Remarques

- la base SQLite locale est creee automatiquement dans `server/prisma/dev.db`
- le projet est adapte a une demonstration locale rapide
- plusieurs vues ont ete reajustees pour un meilleur alignement des cartes et des boutons
