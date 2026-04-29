# API Reference — BUMI SQLite + Prisma

## Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Public
- `GET /api/public/needs`
- `GET /api/public/stats`
- `GET /api/public/reports`

## Users
- `GET /api/users`
- `PUT /api/users/me`

## Needs
- `GET /api/needs`
- `POST /api/needs`
- `PATCH /api/needs/:id`

## Donations
- `GET /api/donations`
- `GET /api/donations/my`
- `POST /api/donations`
- `PATCH /api/donations/:id/status`

## Tracking
- `GET /api/tracking/my`
- `GET /api/tracking/:donationId`

## Distributions
- `GET /api/distributions`
- `POST /api/distributions`

## Partners
- `GET /api/partners`
- `POST /api/partners`

## Reports
- `GET /api/reports/overview`

## Dashboard
- `GET /api/dashboard/summary`
