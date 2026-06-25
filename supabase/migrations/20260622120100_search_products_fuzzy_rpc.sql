-- ============================================================
-- Receipt scanning — search_products_fuzzy RPC
-- ----------------------------------------------------------------
-- Trigram-ranked catalog search over the existing products.name GIN
-- index (products_name_trgm_idx). Used by the parse-receipt edge
-- function to pull candidate products for each receipt line before LLM
-- disambiguation, and reusable by the in-app product picker.
--
-- Scope mirrors the products SELECT policy: system catalog (crew_id is
-- null) plus the caller's crew, active rows only. Returns the top
-- p_limit matches ordered by similarity, then name.
-- ============================================================

create or replace function public.search_products_fuzzy(
  p_crew_id uuid,
  p_query   text,
  p_limit   int default 5
)
returns table (
  product_id          uuid,
  crew_id             uuid,
  name                text,
  brand               text,
  barcode             text,
  default_category_id uuid,
  similarity          real
)
language plpgsql
stable
security definer
set search_path = public, pg_catalog
as $$
begin
  if public.current_user_id() is null then
    raise exception 'Not authenticated';
  end if;

  if not public.is_crew_member(p_crew_id) then
    raise exception 'Not a member of this Crew';
  end if;

  if p_query is null or length(trim(p_query)) = 0 then
    return;
  end if;

  return query
    select
      p.product_id,
      p.crew_id,
      p.name,
      p.brand,
      p.barcode,
      p.default_category_id,
      similarity(p.name, p_query) as similarity
    from public.products p
    where p.deleted_at is null
      and (p.crew_id is null or p.crew_id = p_crew_id)
      and p.name % p_query                       -- trigram index predicate
    order by similarity(p.name, p_query) desc, p.name asc
    limit greatest(p_limit, 1);
end;
$$;

revoke execute on function public.search_products_fuzzy(uuid, text, int) from public;
grant  execute on function public.search_products_fuzzy(uuid, text, int) to authenticated;
