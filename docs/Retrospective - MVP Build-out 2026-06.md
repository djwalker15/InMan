# Retrospective — MVP Build-out (2026-06)

> **Phase:** MVP Build-out — design vault → MVP journeys → account deletion → launch infra
> **Window:** 2026-04-06 → 2026-06-15 (106 commits)
> **Author:** mined from the project record, not from memory
> **Date:** 2026-06-19

This is a retrospective built from evidence, not impressions. Every claim below is tagged
so it can be audited:

- **`af0e84f`** — a git commit (`git show <hash>`)
- **`86e1x41uc`** — a ClickUp task id (`app.clickup.com/t/<id>`)
- **`feedback_rls_insert_returning_trap`** — an auto-memory file under the project memory dir
- **`session c3c74a2e`** — a Claude Code session transcript

Sources mined: the full `git log`, all 9 project auto-memories, `docs/Session Handoff -
2026-05-13.md`, the ClickUp **Work → InMan** folder (Infra & Releases phase chain, the
Bugs list, and ~40 Walkthrough Feedback items), and the session transcripts.

---

## 1. What worked — structure + process

### Vault-first design before code
A complete Obsidian design vault — 43 entities, 26 journeys, 19 architecture decisions —
existed before the first line of `app/` was written. The first ~25 commits
(`95fb104` → `4ce9e75`, 2026-04-06 → 2026-04-11) are *all* documentation: data model,
journeys, ERD, canvas. `docs/CLAUDE.md` became the single authoritative brief that
implementation sessions consulted instead of re-deriving decisions. The payoff is visible
in how cleanly later schema work fell out — the account-deletion design (below) was
essentially a reading of decisions already recorded, not a fresh argument.

### Phased vertical slicing, with sub-slice tasks that map 1:1 to commits
The build ran Phase 0 (scaffold) → Phase 1 (DB) → Phases 2–6 (journey-by-journey: spaces,
inventory, crews, account, reorganize). ClickUp's *Design System Implementation* list
carries P-numbered tasks (`[P3.3]`, `[P4.1]`, `[P5.6]`, `[P6.4]`…) that line up one-to-one
with `feat(...)` commits — e.g. `[P4.2] Search + stacking filters` ↔ `feat(inventory):
search and stacking filters`. The slice boundaries held: there is no large
"rewrite/rework" commit in the history. Each phase closed and the next opened cleanly.

### Session-handoff docs as a ritual
`0625d9f docs(vault): session handoff for 2026-05-13` and the resulting
`docs/Session Handoff - 2026-05-13.md` let a later session resume cold — it records test
state (305 green), DB state, the patterns established that session, and a 6-item "Known
gaps" list. This is cheaper than re-reading code history and is the reason context
survived across many separate sessions without drift.

### SECURITY DEFINER RPC gating for sensitive mutations
`crew_members` and `spaces` structural mutations route through `SECURITY DEFINER` RPCs
(`change_member_role`, `set_member_permissions`, `move_space`, `merge_spaces`,
`delete_space_with_items`, `split_space`, `cascade_soft_delete_spaces`) so the gating rule
lives in exactly one place. The strongest evidence this was the right call: when the
soft-delete RLS bug surfaced (see §2), the fix was to *move into* this pattern
(`c0ba1b7 fix(spaces): inline tree delete via cascade_soft_delete_spaces RPC`), not to
patch policies. The pattern absorbed the bug class.

### Enum + child-table polymorphism (no nullable FKs on parents)
Flow, RecipeIngredient, ShoppingListItem, and WasteEvent all use an enum discriminator +
one child table per type. This kept the immutable ledger clean and made attribution
durable: the account-deletion design could leave `flows.performed_by` etc. pointing at the
original Clerk `sub` with no anonymization, because the ledger was never polluted with
nullable parent FKs. A schema decision made on day one paid a dividend two months later.

### Issue-intake subagent + in-app feedback → ClickUp
`68a5dea chore(agent): add InMan issue-intake subagent` plus the in-app feedback widget
(`submit-feedback` edge function → ClickUp Inbox, `project_in_app_feedback_clickup`) turned
walkthrough feedback into structured tasks instead of losing it in chat. The ~40 items in
the **Walkthrough Feedback** list are the proof of throughput — bugs like "Spaces uses data
from previous crew" (`86e1c1a9k`, since `complete`) were captured, triaged, and closed
rather than forgotten.

### Config-as-code + staging-soak deploy pipeline
`2aef5d3 chore(deploy): staging/prod deploy workflows, e2e smoke, supabase config-as-code`
established that migrations flow **git → staging → prod**, never the dashboard. The
Infra & Releases phase chain (`86e1v3w08` Phase 0 → `86e1v3xuz` Phase 8) is mostly Closed,
and release-please drives the product-site "What's New" from the changelog
(`2f4bc98 feat(site): … changelog-driven What's New`). Schema is version-controlled and
soaks on staging before prod.

### Test discipline wired into the commit gate
vitest + playwright + a husky pre-commit running `eslint --max-warnings=0` and
`vitest related --run` on staged files. By the 2026-05-13 handoff the suite was **54 files
/ 305 tests green**, lint and `tsc --noEmit` clean. The pre-commit gate kept regressions
off `main`.

---

## 2. What hurt / what I'd do differently — each tied to its root decision

### Developing against prod Supabase, with no local stack
**Decision that caused it:** day one chose remote-only development against the prod project
(`gewrsrbjkgffukzbnenl`). **What it cost:** migration-history drift bad enough that prod's
`supabase_migrations.schema_migrations` had to be *rewritten* on 2026-06-12 to match the
canonical files (`project_prod_migration_history_snapshot`). The original 28 prod rows
included orphans with no files (`debug_claims_tmp`, `tmp_crews_insert_true` — temp debug
applied straight to prod) and a double-applied `cascade_soft_delete_spaces_rpc`. The fix is
still only a backlog item: **"Set up a local Supabase development environment (stop
developing against prod)"** (`86e1yr2r3`, open). *Do differently:* stand up `supabase start`
on day one; treat prod as append-only-via-CI from the start.

### The RLS RETURNING/SELECT trap, learned twice
**Decision:** SELECT policies that filter `deleted_at IS NULL` + reliance on
`.insert().select()`. **What it cost:** the misleading `new row violates row-level security
policy` error hit twice — first on crews INSERT (creator not yet a member), then again on
the spaces soft-delete UPDATE (`86e163q9z`), where writing `deleted_at` made the new row
fail its own SELECT policy. Both were debugged from scratch before the rule was written
down (`feedback_rls_insert_returning_trap`). *Do differently:* the memory should have
existed after the *first* occurrence; codify policy-design rules in `docs/CLAUDE.md` before
writing the second table's RLS.

### A hand-rolled CI/CD pipeline that bypassed Supabase's branching integration
**Decision:** custom GitHub Actions deploy instead of the Supabase GitHub branching
integration. **What it cost:** the staging branch silently rejected *every* Clerk JWT with
**401** since creation — the whole signed-in app was unusable on staging — because Supabase
branches don't inherit the parent's third-party-auth config, and `config push` doesn't
register it. It needed a Management-API self-heal step on every deploy
(`project_staging_branch_clerk_tpa`). *Do differently:* either use the managed branching
integration, or budget day-one for the config surface (`auth`, third-party providers) that
a hand-rolled pipeline silently drops.

### CI behavior diverging from local assumptions
A cluster of CI-only failures, all rooted in "CI isn't my laptop":
- E2E scheduled runs hung **4–6 hours** because the `timeout-minutes` guard lived on `dev`
  while `main` (which `schedule`/`workflow_run` actually executes) ran unbounded
  (`86e1x41xb`, `feedback_ci_workflow_default_branch`).
- Playwright's runtime browser install stalled in CI; fixed by pinning the
  `mcr.microsoft.com/playwright` container (`86e1x41uc`, `e3f3f6f`).
- release-please couldn't open its PR until a repo Actions setting was toggled
  (`release-please-blocked-by-actions-pr-setting`).
- A cancelled prod deploy needed root-causing (`86e1x4245`).

The auth-flow E2E smoke is **still failing** (`86e1x6e0j`, open) — sign-up never advances
`/sign-up → /onboarding` after email-code verify. *Do differently:* stand up CI parity
(containerized browsers, explicit timeouts, branch-aware workflows) at Phase 0, not retrofit
it in June.

### Crew-switch global state not syncing across views — a recurring bug class
The same defect recurred across views: switching the active crew didn't propagate.
`2591aa0 fix(crews): sync active-crew selection across views`, `7aca122 fix(spaces): scope
onboarding spaces lookup to active crew`, and Walkthrough items `86e1c1bpb` /
`86e17zumh` / `86e1c1a9k` are all the same root cause. *Do differently:* design one central,
reactive active-crew store on day one rather than threading crew scope per-view and patching
the misses one at a time.

### Shipping a feature before its safe-delete primitive existed
Phase 2's inline tree Delete soft-deleted Space rows but orphaned the inventory items
pointing at them; the proper RPC (`delete_space_with_items`) didn't arrive until Phase 6.4.
The gap sat open as Known-gap #1 in the 2026-05-13 handoff for weeks before
`c0ba1b7`/`d6eb37e` closed it. *Do differently:* when a destructive action has data
side-effects, build the side-effect handler in the same slice, not a later phase.

### Repeated small foot-guns that each became a memory only after biting
- Supabase test mocks must be `Error` instances, not `{message}` — cost ~15 min on the
  first test run (`feedback_supabase_mock_error_must_be_error_instance`).
- Figma-exported SVGs stretch unless `preserveAspectRatio="none"` is stripped on ingest
  (`feedback_figma_svg_export_stretch`).
- RPCs needed `unit_type::text` casts (`2f83dba fix(db): cast unit_type::text in
  delete/merge RPCs`).
- `request_account_deletion` had an ambiguous `user_id` reference
  (`4a6b1d5 fix(account): … ambiguous user_id`).

None is individually serious; the pattern is the lesson — the convention/memory should
exist before the second occurrence, not after.

### Documentation drift in the "source of truth"
`docs/CLAUDE.md` was dated **"April 9, 2026"** though it documents work through Phase 6, and
the **"Superseded Guidance" section that the root `CLAUDE.md` advertised did not actually
exist** (`grep -rn Superseded docs/` returned nothing). The stale date was flagged in the
2026-05-13 handoff (Known-gap #6) and went unfixed for over a month. *Do differently:* a doc
that wins all conflicts has to be maintained as one — date it on each edit and actually keep
the reversed-decisions section it promises. **(Fixed 2026-06-19:** the header was re-dated and
the Superseded Guidance section backfilled as part of this retrospective.)**

---

## 3. Day-one decisions

### Paid off
- **Clerk text `user_id` + `auth.jwt()->>'sub'` everywhere; never `auth.uid()`.** Committing
  to text IDs and the JWT claim from `feat(db): Phase 1 auth slice` meant no mid-project
  UUID-vs-text migration. Every RLS policy and column followed the same rule.
- **Flow ledger as canonical, quantity as cache.** A single immutable transaction ledger with
  a trigger-maintained cache held up across inventory, transfer, reorganize, and waste design
  without contortions.
- **Soft deletes + immutable ledger.** This is what made the 30-day-restore account-deletion
  design (`27a0c9d`/`ec3470c`/`256d11f`) fall out cleanly — tombstone the slim `users` row,
  retain ledger attribution, no cascading anonymization.
- **Enum + child-table polymorphism.** No nullable FKs on parents; clean unions; durable
  attribution (see §1).
- **Deferring `kiosk_pin` to first kiosk use** (`feedback_onboarding_friction`,
  `docs: defer kiosk_pin …`). Kept sign-up low-friction; the right call, made before any
  onboarding code existed.
- **Vault-first.** The single biggest accelerant — decisions were argued once, in docs, then
  implemented.

### Wish we'd made on day one
- **A local Supabase dev stack.** The single most expensive omission — it caused the
  migration-history drift and the temp-debug-in-prod rows (§2).
- **A central reactive active-crew store.** Would have pre-empted an entire recurring bug
  class across dashboard/spaces/onboarding (§2).
- **The RPC-gating convention, written down before the first RLS bug.** The pattern was
  excellent; we just discovered it reactively.
- **CI parity with local at Phase 0.** Containerized Playwright, explicit timeouts, and
  branch-aware workflow placement would have avoided the 4–6h hangs and the stalled browser
  install (§2).
- **Treating `docs/CLAUDE.md` as a living, dated doc** with its Superseded Guidance section
  populated as decisions reversed — instead of letting it freeze at April 9.

---

## Carry-forward checklist (into v1.1 Waste)

1. **Land a local Supabase stack first** and close `86e1yr2r3` — stop developing against prod.
2. **Centralize active-crew state** before adding more crew-scoped views.
3. ~~**Backfill the "Superseded Guidance" section** in `docs/CLAUDE.md` and re-date the header.~~ ✅ Done 2026-06-19.
4. **Fix the open E2E auth-flow smoke** (`86e1x6e0j`) so the deploy gate is trustworthy again.
5. **Build destructive actions with their data-side-effect handler in the same slice.**

---

*Evidence index: commits via `git show <hash>`; ClickUp ids at `app.clickup.com/t/<id>`;
memories under the project memory dir; transcripts under the project session dir.*
