# InMan

Inventory management for crews — track what you have, where it lives, and how it flows in and out.

This repository holds the product end to end: the live frontend, the database schema, the design vault, and the design-system handoff. `docs/CLAUDE.md` is the authoritative project brief (architecture, data model, journeys) — read it before changing anything structural.

## Repo layout

| Path | What it is |
|---|---|
| `app/` | Live frontend — Vite 8, React 19, TypeScript, React Router v7, Clerk v5, Supabase JS v2, Tailwind v4 |
| `supabase/` | Canonical schema (`migrations/`), edge functions (`functions/`), project config (`config.toml`) |
| `site/` | Product/marketing site (Astro) with release announcements *(Phase 8 — not yet created)* |
| `docs/` | Obsidian vault — design + product source of truth (`docs/CLAUDE.md` first) |
| `inman-design-system/` | Read-only design handoff bundle; tokens mirrored into `app/src/index.css` |

## Environments

| Environment | Git branch | Supabase | Clerk | Cloudflare Pages | URL |
|---|---|---|---|---|---|
| Staging | `dev` | `staging` branch of `gewrsrbjkgffukzbnenl` | dev instance (`pk_test`) | `inman-app-staging` | `inman-staging.tenacioustech.app` |
| Production | `main` | `gewrsrbjkgffukzbnenl` | production instance (`pk_live`) | `inman-app` | product domain (TBD) |
| Product site | `main` (`site/**`) | — | — | `inman-site` | TBD |

- Every push to `dev` deploys to staging (migrations → edge functions → app). Every push to `main` deploys to production behind a **manual approval gate** (GitHub `production` environment).
- `VITE_*` values are baked at build time from GitHub environment variables — Cloudflare dashboard env vars are not used.
- Migrations flow staging → prod **via git**: the same `supabase/migrations/*.sql` files soak on staging, then apply to prod when `dev` merges to `main`. Never use the Supabase dashboard "merge branch" button.

## Local setup

```sh
cd app
cp .env.example .env.local   # fill in Clerk + Supabase dev keys
npm ci
npm run dev
```

Tests: `npm run test` (vitest watch), `npm run test:run` (single pass), `npm run test:e2e` (Playwright; needs real creds in `app/.env.test`, skips without them). Pre-commit runs eslint + `vitest related` on staged files via husky.

## Releases

Conventional Commits drive everything: merges to `main` feed [release-please](https://github.com/googleapis/release-please), which maintains a release PR (version bump + `app/CHANGELOG.md`). Merging that PR tags `inman-vX.Y.Z`, publishes a GitHub Release, and rebuilds the product site's What's New page.

Commit style: `feat(scope): …`, `fix(scope): …`, `chore(scope): …` — `feat`/`fix` are what show up in client-facing release notes.

## CI/CD reference

Workflows live in `.github/workflows/`:

| Workflow | Trigger | Does |
|---|---|---|
| `ci.yml` | PRs to `dev`/`main`; called by deploys | lint, typecheck, vitest, build |
| `deploy-staging.yml` | push to `dev` | Supabase config/db/functions → staging branch, app → CF Pages staging |
| `deploy-prod.yml` | push to `main` (approval-gated) | same, against production |
| `release-please.yml` | push to `main` | release PR / GitHub Releases / changelog |
| `deploy-site.yml` | `site/**` or changelog changes on `main` | product site → CF Pages |
| `e2e.yml` | after staging deploys + nightly | Playwright smoke against staging |

Secrets/vars live in GitHub repo settings (repo-level: Supabase access token + Cloudflare token/account; per-environment: Supabase refs/URLs/keys and Clerk keys). The rollout plan and runbook details are tracked in ClickUp under **Work → InMan → 🚀 Infra & Releases**.
