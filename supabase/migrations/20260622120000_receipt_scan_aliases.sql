-- ============================================================
-- Receipt scanning — product_aliases learning table
-- ----------------------------------------------------------------
-- Backs the "Scan receipt/invoice" add method (Journey "Adding
-- Inventory" — Method 5). Receipts print abbreviated, merchant-specific
-- line text ("GV WHL MLK GAL"). When a crew confirms which catalog
-- product a given raw line maps to, we remember it here so the next
-- receipt that prints the same text auto-resolves with no fuzzy/LLM
-- pass. One row per (crew, normalized raw text); upserted on confirm.
--
-- Mutable cache, crew-scoped. No soft delete — a correction simply
-- upserts a new product_id over the old mapping.
-- ============================================================

create table public.product_aliases (
  alias_id    uuid        primary key default gen_random_uuid(),
  crew_id     uuid        not null references public.crews(crew_id),
  -- Normalized (trimmed + lower-cased) receipt line text. Normalization
  -- is done by the caller so lookups are a plain equality match.
  raw_text    text        not null check (length(raw_text) between 1 and 200),
  -- Optional merchant context for debugging / future per-store keys.
  merchant    text        null,
  product_id  uuid        not null references public.products(product_id),
  created_by  text        null     references public.users(user_id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  -- One mapping per crew per raw line; re-confirming overwrites it.
  constraint product_aliases_crew_raw_unique unique (crew_id, raw_text)
);

-- The hot path is an equality lookup on (crew_id, raw_text); the unique
-- constraint's index already serves it, so no extra index is needed.

create trigger product_aliases_set_updated_at
before update on public.product_aliases
for each row execute function public.set_updated_at();

alter table public.product_aliases enable row level security;

-- SELECT first (the RLS RETURNING trap): an upsert's RETURNING reads the
-- row back, so the SELECT policy must admit it after WITH CHECK passes.
create policy product_aliases_select
on public.product_aliases
for select
to authenticated
using (public.is_crew_member(crew_id));

create policy product_aliases_insert
on public.product_aliases
for insert
to authenticated
with check (public.is_crew_member(crew_id));

create policy product_aliases_update
on public.product_aliases
for update
to authenticated
using (public.is_crew_member(crew_id))
with check (public.is_crew_member(crew_id));
