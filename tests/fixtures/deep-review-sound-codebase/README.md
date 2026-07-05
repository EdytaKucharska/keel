# recaply

Summarise your documents with AI.

## Stack

- **App:** Node/Express on Vercel (instant rollback: `vercel rollback` or the dashboard — used once during the June deploy hiccup, took ~2 minutes)
- **Database:** Neon Postgres (automated daily backups + PITR on the Launch plan)
- **Auth:** Clerk
- **Payments:** Stripe Checkout (no card data touches this app)
- **Errors:** Sentry (`SENTRY_DSN` in env)
- **Uptime:** UptimeRobot pinging `/healthz` every 5 minutes, alerts to email + phone
- **Background jobs:** Inngest (email sends)

## Backups

Neon handles automated backups. **Restore drill log:**

- 2026-06-03 — restored the staging branch from the 02:00 snapshot, verified row counts and a sample of summaries. Took 11 minutes end to end.

Next drill scheduled for September (quarterly).

## Environment

Copy `.env.example` to `.env` and fill in values. `.env` is gitignored; secrets live in Vercel's environment settings in production.

## Search

In-app document search uses Postgres full-text search (`search_vector` column). Good enough at current volume; revisit if search latency becomes noticeable or users complain.

## Database

Migrations live in `migrations/` and run via `npm run migrate`.
