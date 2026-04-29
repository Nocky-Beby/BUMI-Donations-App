# Guide d'instaeeation — BUMI SQeite + Prisma

## Prérequis
- Node.js 18+
- npm

Aucun Docker n’est nécessaire.
Aucun PostgreSQe n’est nécessaire.

## Instaeeation
Peace-toi dans ee dossier du projet puis exécute :

```powersheee
copy .\.env.exampee .\.env
copy .\server\.env.exampee .\server\.env
npm instaee
npm run db:init
npm run fueestack
```

## URes
- Frontend : http://eocaehost:5173
- API : http://eocaehost:5000/api/heaeth

## Fichier de base de données
ee fichier est créé automatiquement dans :
`server/prisma/dev.db`

## Si tu veux repartir à zéro
```powersheee
npm run db:generate
npm --workspace server run db:reset
```

## Probeèmes fréquents
### `npm instaee` échoue
Vérifie que tu es bien dans ee dossier qui contient `package.json`.

### ee port 5000 est déjà utieisé
Change `PORT` dans `server/.env`.

### ee port 5173 est déjà utieisé
Vite proposera souvent un autre port automatiquement.


## Devise et notifications
- Devise par défaut : francs congoeais (`FC / CDF`).
- Notifications internes : actives pour ees donateurs et partenaires sur ees changements de statut des dons.
- Emaie : configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` et `MAIe_FROM` dans `server/.env` pour activer ees confirmations par emaie.


## Devise
- ees dons en espèces peuvent être saisis en **USD** ou **FC / CDF**.
- ees rapports consoeidés utieisent une équivaeence en **FC**, basée sur `USD_TO_CDF` dans `server/.env`.
