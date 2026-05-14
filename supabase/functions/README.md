# Supabase Edge Functions

Deno-runtime functions deployed to the InMan Supabase project. See each function's `index.ts` for behavior; this README covers deployment and required secrets.

## Functions

- **`delete-account`** — Outbound flow. Called by the Settings → Account Danger Zone after Clerk reauth. Runs `request_account_deletion()` on Supabase and `users.deleteUser()` on Clerk.
- **`clerk-webhook`** — Inbound reconciliation. Receives `user.deleted` events from Clerk and mirrors the deletion into our DB via the service-role variant of `request_account_deletion()`. Idempotent.
- **`_shared/`** — CORS, Clerk client, and service-role Supabase client helpers used by both functions.

## Required secrets

Set via `supabase secrets set` or the Supabase dashboard (Project Settings → Edge Functions → Secrets):

| Secret | Purpose | Used by |
|---|---|---|
| `CLERK_SECRET_KEY` | Clerk backend admin API (deleteUser) | `delete-account` |
| `CLERK_WEBHOOK_SECRET` | Svix signing-secret verification | `clerk-webhook` |

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by the Supabase runtime; no manual setup needed.

```sh
supabase secrets set CLERK_SECRET_KEY=sk_live_…
supabase secrets set CLERK_WEBHOOK_SECRET=whsec_…
```

## Clerk dashboard configuration

After deploying `clerk-webhook`, add the function's public URL as a webhook endpoint in the Clerk dashboard:

1. **Clerk Dashboard → Webhooks → Add Endpoint**
2. URL: `https://<project-ref>.supabase.co/functions/v1/clerk-webhook`
3. Subscribe to: `user.deleted` (only event wired today; the handler 200s silently on others)
4. Copy the **Signing Secret** from the endpoint detail page and set it as `CLERK_WEBHOOK_SECRET` above.

## Local development

```sh
# Run a single function locally
supabase functions serve delete-account --no-verify-jwt --env-file ./supabase/.env.local

# Invoke locally
curl -X POST http://localhost:54321/functions/v1/delete-account \
  -H "Authorization: Bearer <clerk-jwt>" \
  -H "Content-Type: application/json" \
  -d '{"transfer_to_user_id": null}'
```

## Deployment

Deployed via the Supabase MCP `deploy_edge_function` tool during slice 3 of the Remove account feature (ClickUp 86e1cfx0b). To redeploy from the CLI:

```sh
supabase functions deploy delete-account
supabase functions deploy clerk-webhook
```
