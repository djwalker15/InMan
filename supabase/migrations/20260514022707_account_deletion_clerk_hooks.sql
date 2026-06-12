-- ============================================================
-- Slice 3 of "Remove account" (ClickUp 86e1c0hnp, subtask 86e1cfx0b)
--
-- DB-side helpers that the Clerk integration edge functions and the
-- post-auth restore-detection hook will call.
--
-- 1. check_restore_eligibility()
--    Returns (eligible boolean, deleted_at timestamptz). Callable by
--    authenticated users — lets the post-auth bootstrap decide whether
--    to show a "Welcome back, restore?" prompt without leaking detail
--    beyond what the user already owns.
--
-- 2. request_account_deletion(p_transfer_to_user_id, p_target_user_id)
--    Adds an optional p_target_user_id parameter so the Clerk webhook
--    can invoke the same orchestration logic without a JWT context.
--    When p_target_user_id is null → falls back to current_user_id()
--    (existing behavior; authenticated users delete themselves).
--    When p_target_user_id is provided → the caller MUST have no JWT
--    context (service-role / no user JWT). Authenticated users cannot
--    delete a different user.
-- ============================================================

-- ------------------------------------------------------------
-- check_restore_eligibility
-- The user can SELECT their own soft-deleted row via the existing
-- users_select_self policy (which intentionally has no deleted_at
-- filter). This RPC packages the eligibility check into a single
-- shape the UI can call.
-- ------------------------------------------------------------
create or replace function public.check_restore_eligibility()
returns table (
  eligible   boolean,
  deleted_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public, pg_catalog
as $$
declare
  v_caller     text;
  v_deleted_at timestamptz;
begin
  v_caller := public.current_user_id();
  if v_caller is null then
    raise exception 'Not authenticated';
  end if;

  select u.deleted_at into v_deleted_at
  from public.users u
  where u.user_id = v_caller;

  if not found then
    -- No row yet (first sign-in). Not deletion-eligible.
    eligible   := false;
    deleted_at := null;
    return next;
    return;
  end if;

  eligible   := v_deleted_at is not null
                 and v_deleted_at > now() - interval '30 days';
  deleted_at := v_deleted_at;
  return next;
end;
$$;

revoke execute on function public.check_restore_eligibility() from public;
grant  execute on function public.check_restore_eligibility() to authenticated;

-- ------------------------------------------------------------
-- request_account_deletion — replaced with target-user variant.
-- Both old (p_transfer_to_user_id only) and new (target + transfer)
-- callsites are supported via default-null parameters; positional
-- callers from slice 4 will pass (p_transfer_to_user_id, null) and
-- the webhook calls (null, p_target_user_id).
--
-- The old single-argument function is dropped first because adding
-- a second default parameter creates an ambiguous overload.
-- ------------------------------------------------------------
drop function if exists public.request_account_deletion(text);

create or replace function public.request_account_deletion(
  p_transfer_to_user_id text default null,
  p_target_user_id      text default null
)
returns table (
  user_id                text,
  crews_transferred      int,
  crews_marked_ownerless int,
  crews_soft_deleted     int
)
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_caller            text;
  v_target            text;
  v_already_deleted   timestamptz;
  v_transferred       int := 0;
  v_marked_ownerless  int := 0;
  v_soft_deleted      int := 0;
  v_other_admins      int;
  v_other_members     int;
  v_transferee_role   text;
  r                   record;
begin
  v_caller := public.current_user_id();

  -- Resolve the user to delete.
  --   p_target_user_id null  → self-delete (must have JWT).
  --   p_target_user_id given → admin/service-role path (caller MUST NOT
  --                             have a JWT; authenticated users cannot
  --                             delete other users via this RPC).
  if p_target_user_id is null then
    if v_caller is null then
      raise exception 'Not authenticated';
    end if;
    v_target := v_caller;
  else
    if v_caller is not null then
      raise exception 'Only the service role may delete a user other than themselves'
        using errcode = 'insufficient_privilege';
    end if;
    v_target := p_target_user_id;
  end if;

  -- Idempotency: target user row must exist and not already be soft-deleted.
  select u.deleted_at into v_already_deleted
  from public.users u
  where u.user_id = v_target;

  if not found then
    raise exception 'User not found' using errcode = 'no_data_found';
  end if;

  if v_already_deleted is not null then
    raise exception 'Account is already deleted' using errcode = 'invalid_parameter_value';
  end if;

  if p_transfer_to_user_id is not null and p_transfer_to_user_id = v_target then
    raise exception 'Cannot transfer ownership to yourself' using errcode = 'invalid_parameter_value';
  end if;

  -- Owned crews.
  for r in
    select c.crew_id
    from public.crews c
    where c.owner_id   = v_target
      and c.deleted_at is null
    order by c.crew_id
  loop
    select count(*) into v_other_admins
    from public.crew_members cm
    where cm.crew_id    = r.crew_id
      and cm.user_id    <> v_target
      and cm.role       = 'admin'
      and cm.deleted_at is null;

    select count(*) into v_other_members
    from public.crew_members cm
    where cm.crew_id    = r.crew_id
      and cm.user_id    <> v_target
      and cm.deleted_at is null;

    if p_transfer_to_user_id is not null then
      select cm.role into v_transferee_role
      from public.crew_members cm
      where cm.crew_id    = r.crew_id
        and cm.user_id    = p_transfer_to_user_id
        and cm.deleted_at is null;

      if v_transferee_role is null then
        raise exception 'Transferee is not an active member of crew %', r.crew_id
          using errcode = 'invalid_parameter_value';
      end if;
      if v_transferee_role <> 'admin' then
        raise exception 'Transferee must be an Admin of crew % to receive ownership', r.crew_id
          using errcode = 'invalid_parameter_value';
      end if;

      update public.crews
        set owner_id = p_transfer_to_user_id
        where crew_id = r.crew_id;

      update public.crew_members
        set deleted_at = now()
        where crew_id    = r.crew_id
          and user_id    = v_target
          and deleted_at is null;

      v_transferred := v_transferred + 1;

    elsif v_other_members > 0 then
      update public.crews
        set is_ownerless        = true,
            became_ownerless_at = now()
        where crew_id = r.crew_id;

      update public.crew_members
        set deleted_at = now()
        where crew_id    = r.crew_id
          and user_id    = v_target
          and deleted_at is null;

      v_marked_ownerless := v_marked_ownerless + 1;

    else
      update public.crews
        set deleted_at = now()
        where crew_id = r.crew_id;

      update public.crew_members
        set deleted_at = now()
        where crew_id    = r.crew_id
          and user_id    = v_target
          and deleted_at is null;

      v_soft_deleted := v_soft_deleted + 1;
    end if;
  end loop;

  -- Member-only crews.
  update public.crew_members cm
    set deleted_at = now()
    where cm.user_id    = v_target
      and cm.deleted_at is null
      and not exists (
        select 1
        from public.crews c
        where c.crew_id  = cm.crew_id
          and c.owner_id = v_target
      );

  update public.users
    set deleted_at            = now(),
        deletion_requested_at = now()
    where users.user_id = v_target;

  user_id                := v_target;
  crews_transferred      := v_transferred;
  crews_marked_ownerless := v_marked_ownerless;
  crews_soft_deleted     := v_soft_deleted;
  return next;
end;
$$;

revoke execute on function public.request_account_deletion(text, text) from public;
grant  execute on function public.request_account_deletion(text, text) to authenticated;
-- Service role bypasses revoke / grant separately; no explicit grant needed.

-- ------------------------------------------------------------
-- Self-assertions
-- ------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'check_restore_eligibility'
  ) then raise exception 'migration failed: check_restore_eligibility not created'; end if;

  -- request_account_deletion must now take (text, text).
  if not exists (
    select 1
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'request_account_deletion'
      and pg_get_function_arguments(p.oid) =
          'p_transfer_to_user_id text DEFAULT NULL::text, p_target_user_id text DEFAULT NULL::text'
  ) then raise exception 'migration failed: request_account_deletion signature wrong'; end if;

  -- The old single-arg variant must be gone.
  if exists (
    select 1
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'request_account_deletion'
      and pg_get_function_arguments(p.oid) = 'p_transfer_to_user_id text DEFAULT NULL::text'
  ) then raise exception 'migration failed: old single-arg request_account_deletion still present'; end if;
end $$;
