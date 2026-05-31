-- ============================================================
-- Slice 4 of "Remove account" (ClickUp 86e1c0hnp, subtask 86e1cfx86)
--
-- preview_account_deletion()
--   One row per crew the caller is in (owner or member). Lets the
--   Settings → Account Danger Zone show a precise impact summary
--   before the user confirms, and lets the transferee picker render
--   per-crew admin candidates without a second round-trip.
--
-- Outcome values:
--   'transfer'    — caller owns this crew; at least one other Admin
--                   exists. The UI must pick a transferee.
--   'ownerless'   — caller owns this crew; other members exist but
--                   no other Admin. Crew enters ownerless state.
--   'solo_delete' — caller owns this crew; no other members. Crew
--                   is soft-deleted alongside the user.
--   'leave'       — caller is a member (not the Owner). Just their
--                   crew_members row will be soft-deleted.
-- ============================================================

create or replace function public.preview_account_deletion()
returns table (
  crew_id            uuid,
  crew_name          text,
  caller_role        text,
  outcome            text,
  admin_candidates   jsonb,
  default_transferee text
)
language plpgsql
stable
security definer
set search_path = public, pg_catalog
as $$
declare
  v_caller             text;
  r                    record;
  v_other_admins       int;
  v_other_members      int;
  v_admin_candidates   jsonb;
  v_default_transferee text;
begin
  v_caller := public.current_user_id();
  if v_caller is null then
    raise exception 'Not authenticated';
  end if;

  -- Owned crews (caller appears here exactly once per owned crew).
  for r in
    select c.crew_id as cid, c.name as cname
    from public.crews c
    where c.owner_id   = v_caller
      and c.deleted_at is null
    order by c.name, c.crew_id
  loop
    select
      count(*) filter (where cm.role = 'admin'),
      coalesce(
        jsonb_agg(
          jsonb_build_object('user_id', cm.user_id)
          order by cm.created_at, cm.user_id
        ) filter (where cm.role = 'admin'),
        '[]'::jsonb
      ),
      (
        select cm2.user_id
        from public.crew_members cm2
        where cm2.crew_id    = r.cid
          and cm2.user_id    <> v_caller
          and cm2.role       = 'admin'
          and cm2.deleted_at is null
        order by cm2.created_at, cm2.user_id
        limit 1
      ),
      count(*)
    into v_other_admins, v_admin_candidates, v_default_transferee, v_other_members
    from public.crew_members cm
    where cm.crew_id    = r.cid
      and cm.user_id    <> v_caller
      and cm.deleted_at is null;

    crew_id     := r.cid;
    crew_name   := r.cname;
    caller_role := 'owner';
    if v_other_admins > 0 then
      outcome            := 'transfer';
      admin_candidates   := v_admin_candidates;
      default_transferee := v_default_transferee;
    elsif v_other_members > 0 then
      outcome            := 'ownerless';
      admin_candidates   := null;
      default_transferee := null;
    else
      outcome            := 'solo_delete';
      admin_candidates   := null;
      default_transferee := null;
    end if;
    return next;
  end loop;

  -- Member-only crews (exclude any crew the caller owns, dedupe
  -- against the legacy 'admin' crew_members row owners typically
  -- carry).
  for r in
    select cm.crew_id as cid, c.name as cname, cm.role as crole
    from public.crew_members cm
    join public.crews c on c.crew_id = cm.crew_id
    where cm.user_id    = v_caller
      and cm.deleted_at is null
      and c.deleted_at  is null
      and c.owner_id    <> v_caller
    order by c.name, cm.crew_id
  loop
    crew_id            := r.cid;
    crew_name          := r.cname;
    caller_role        := r.crole;
    outcome            := 'leave';
    admin_candidates   := null;
    default_transferee := null;
    return next;
  end loop;
end;
$$;

revoke execute on function public.preview_account_deletion() from public;
grant  execute on function public.preview_account_deletion() to authenticated;

-- Self-assertion
do $$
begin
  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'preview_account_deletion'
  ) then raise exception 'migration failed: preview_account_deletion not created'; end if;
end $$;
