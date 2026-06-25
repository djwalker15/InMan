# Supabase Edge Functions

Deno-runtime functions deployed to the InMan Supabase project. See each function's `index.ts` for behavior; this README covers deployment and required secrets.

## Functions

- **`delete-account`** — Outbound flow. Called by the Settings → Account Danger Zone after type-DELETE confirmation. Runs `request_account_deletion()` (soft-delete on the Supabase side). Does NOT call Clerk: the 30-day restore-within-cool-down decision requires the Clerk identity to stay valid during the window so the user can sign back in to trigger `restore_account()`. Clerk hard-delete is deferred to a future ticket.
- **`clerk-webhook`** — Inbound reconciliation. Receives `user.deleted` events from Clerk and mirrors the deletion into our DB via the service-role variant of `request_account_deletion()`. Idempotent.
- **`parse-receipt`** — Receipt/invoice scan add method (Adding Inventory journey, Method 5). Claude vision extracts line items, then resolves each to a catalog product via `product_aliases` lookup → `search_products_fuzzy` → a Claude disambiguation pass. Returns resolved rows; the client gates ambiguous/new lines behind an explicit pick/create, then commits via the `bulk_import_inventory` RPC.
- **`_shared/`** — CORS and service-role Supabase client helpers used by the functions.

## Required secrets

Set via `supabase secrets set` or the Supabase dashboard (Project Settings → Edge Functions → Secrets):

| Secret | Purpose | Used by |
|---|---|---|
| `CLERK_WEBHOOK_SECRET` | Svix signing-secret verification | `clerk-webhook` |
| `ANTHROPIC_API_KEY` | Claude vision receipt parsing | `parse-receipt` |
| `RECEIPT_MODEL` (optional) | Override the Claude model (default `claude-sonnet-4-6`) | `parse-receipt` |

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by the Supabase runtime; no manual setup needed.

```sh
supabase secrets set CLERK_WEBHOOK_SECRET=whsec_…
```

> `CLERK_SECRET_KEY` was previously listed here for an immediate Clerk delete-user call in `delete-account`. That step was removed when the restore-within-cool-down decision landed; reintroduce when the deferred Clerk hard-delete is implemented.

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

### Testing receipt scan locally

`parse-receipt` spans migrations + RPCs + the function + the UI, so exercise the whole
thing against a throwaway local stack. The only real credential needed is an Anthropic key;
`SUPABASE_URL` and the anon/service keys are auto-injected by the local runtime.

```sh
# 1. Boot the local stack and apply ALL migrations (incl. product_aliases,
#    search_products_fuzzy, bulk_import_inventory's p_source) + seeds.
supabase start
supabase db reset

# 2. Put the key where the served function can read it:
#    supabase/.env.local →  ANTHROPIC_API_KEY=sk-ant-…
#    (optional)            RECEIPT_MODEL=claude-haiku-4-5   # cheaper while iterating

# 3. Serve the function. --no-verify-jwt for the same reason as the others:
#    Clerk JWTs don't pass Supabase's gateway check.
supabase functions serve parse-receipt --env-file ./supabase/.env.local --no-verify-jwt
```

Point the app at the local stack in `app/.env.local` (keep your Clerk dev key — the local
stack trusts that Clerk domain via `config.toml [auth.third_party.clerk]`):

```sh
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<local anon key printed by `supabase start`>
```

Then `cd app && npm run dev`, sign up (fresh DB → onboard to get a Crew + Premises), and go
to **Add inventory → Scan a receipt**. On desktop the `capture="environment"` input just
opens a file picker, so any receipt photo works. Verify in Studio (`http://localhost:54323`)
that `flow_purchase_details.unit_cost` / `source = 'receipt_scan'` and `product_aliases` rows
landed; re-scanning the same receipt should auto-resolve via the alias you just wrote.

To iterate on the extraction prompt without the UI, invoke the function directly with a real
Clerk JWT (`await window.Clerk.session.getToken()` in the running app's console) and your
crew_id:

```sh
IMG=$(base64 -w0 receipt.jpg)
curl -s -X POST http://localhost:54321/functions/v1/parse-receipt \
  -H "Authorization: Bearer <clerk-jwt>" -H "Content-Type: application/json" \
  -d "{\"image\":\"$IMG\",\"mime\":\"image/jpeg\",\"crew_id\":\"<crew-id>\"}" | jq
```

Run `supabase stop` when done.

## Deployment

Deployed via the Supabase MCP `deploy_edge_function` tool during slice 3 of the Remove account feature (ClickUp 86e1cfx0b). To redeploy from the CLI:

```sh
supabase functions deploy delete-account --no-verify-jwt
supabase functions deploy clerk-webhook --no-verify-jwt
```

> **Both functions deploy with `verify_jwt: false`.** This project uses Clerk as a third-party auth provider; Clerk-signed JWTs don't validate against Supabase's native JWT secret at the edge-function gateway. PostgREST is the layer configured to trust Clerk, so we accept the request at the gateway and let the inner Supabase calls verify auth via PostgREST. Each function still enforces its own auth check (Authorization header for `delete-account`, svix signature for `clerk-webhook`). Do not flip `verify_jwt` back to `true` without changing the auth strategy — it will reject every Clerk JWT.
