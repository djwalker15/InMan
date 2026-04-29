-- ============================================================
-- Phase 2 — spaces slice
-- Enum: unit_type (7 levels)
-- Tables: spaces (self-referencing tree), space_templates
-- Helper: is_crew_member (SECURITY DEFINER) — re-usable across phases
-- Seeds: two system templates (Standard Kitchen, Bar Setup)
-- ============================================================

-- ------------------------------------------------------------
-- unit_type enum
-- ------------------------------------------------------------
create type public.unit_type as enum (
  'premises',
  'area',
  'zone',
  'section',
  'sub_section',
  'container',
  'shelf'
);

-- ------------------------------------------------------------
-- spaces: self-referencing tree, soft delete
-- ------------------------------------------------------------
create table public.spaces (
  space_id    uuid              primary key default gen_random_uuid(),
  crew_id     uuid              not null references public.crews(crew_id),
  parent_id   uuid              null     references public.spaces(space_id),
  unit_type   public.unit_type  not null,
  name        text              not null check (length(name) between 1 and 64),
  notes       text              null,
  created_by  text              not null references public.users(user_id),
  created_at  timestamptz       not null default now(),
  updated_at  timestamptz       not null default now(),
  deleted_at  timestamptz       null,
  -- Premises must be a root (no parent); everything else must have a parent.
  constraint spaces_premises_root_check check (
    (unit_type = 'premises' and parent_id is null)
    or
    (unit_type <> 'premises' and parent_id is not null)
  )
);

create index spaces_crew_parent_idx
  on public.spaces (crew_id, parent_id)
  where deleted_at is null;

create index spaces_crew_premises_idx
  on public.spaces (crew_id)
  where deleted_at is null and parent_id is null;

create trigger spaces_set_updated_at
before update on public.spaces
for each row execute function public.set_updated_at();

alter table public.spaces enable row level security;

-- ------------------------------------------------------------
-- space_templates: nullable crew_id (NULL = system-provided)
-- ------------------------------------------------------------
create table public.space_templates (
  template_id    uuid        primary key default gen_random_uuid(),
  crew_id        uuid        null     references public.crews(crew_id),
  name           text        not null check (length(name) between 1 and 80),
  description    text        null,
  template_data  jsonb       not null,
  created_by     text        null     references public.users(user_id),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz null
);

create index space_templates_crew_idx
  on public.space_templates (crew_id)
  where deleted_at is null;

create trigger space_templates_set_updated_at
before update on public.space_templates
for each row execute function public.set_updated_at();

alter table public.space_templates enable row level security;

-- ------------------------------------------------------------
-- Helper: is the caller an active member of the given crew?
-- SECURITY DEFINER avoids policy recursion when crew_members is
-- queried from within the spaces / space_templates RLS policies.
-- ------------------------------------------------------------
create or replace function public.is_crew_member(target_crew_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.crew_members
    where crew_id    = target_crew_id
      and user_id    = public.current_user_id()
      and deleted_at is null
  );
$$;

revoke execute on function public.is_crew_member(uuid) from public;
grant  execute on function public.is_crew_member(uuid) to authenticated;

-- ------------------------------------------------------------
-- spaces RLS — SELECT first (avoids INSERT RETURNING trap)
-- ------------------------------------------------------------

create policy spaces_select
on public.spaces
for select
to authenticated
using (
  deleted_at is null
  and public.is_crew_member(crew_id)
);

create policy spaces_insert
on public.spaces
for insert
to authenticated
with check (public.is_crew_admin_or_owner(crew_id));

create policy spaces_update
on public.spaces
for update
to authenticated
using (public.is_crew_admin_or_owner(crew_id))
with check (public.is_crew_admin_or_owner(crew_id));

create policy spaces_delete
on public.spaces
for delete
to authenticated
using (public.is_crew_admin_or_owner(crew_id));

-- ------------------------------------------------------------
-- space_templates RLS
-- System templates (crew_id IS NULL) are visible to everyone
-- authenticated; crew templates are visible to crew members.
-- Mutations are restricted to crew owners/admins on their own
-- templates only — system templates are locked from app-level
-- writes (only seedable via migrations / service role).
-- ------------------------------------------------------------

create policy space_templates_select
on public.space_templates
for select
to authenticated
using (
  deleted_at is null
  and (
    crew_id is null
    or public.is_crew_member(crew_id)
  )
);

create policy space_templates_insert
on public.space_templates
for insert
to authenticated
with check (
  crew_id is not null
  and public.is_crew_admin_or_owner(crew_id)
);

create policy space_templates_update
on public.space_templates
for update
to authenticated
using (
  crew_id is not null
  and public.is_crew_admin_or_owner(crew_id)
)
with check (
  crew_id is not null
  and public.is_crew_admin_or_owner(crew_id)
);

create policy space_templates_delete
on public.space_templates
for delete
to authenticated
using (
  crew_id is not null
  and public.is_crew_admin_or_owner(crew_id)
);

-- ------------------------------------------------------------
-- Seed system templates (crew_id IS NULL).
-- These trees stamp under an existing Premises; they don't
-- include a Premises node themselves (that's the user's input).
-- ------------------------------------------------------------

insert into public.space_templates (crew_id, name, description, template_data, created_by)
values
(
  null,
  'Standard Kitchen',
  'A common kitchen layout — pantry, back wall cabinets and drawers, fridge.',
  '{
    "name": "Kitchen",
    "unit_type": "area",
    "children": [
      {
        "name": "Pantry",
        "unit_type": "zone",
        "children": [
          {"name": "Top Shelf", "unit_type": "shelf", "children": []},
          {"name": "Middle Shelf", "unit_type": "shelf", "children": []},
          {"name": "Bottom Shelf", "unit_type": "shelf", "children": []}
        ]
      },
      {
        "name": "Back Wall",
        "unit_type": "zone",
        "children": [
          {
            "name": "Above Counter",
            "unit_type": "section",
            "children": [
              {"name": "Cabinet 1", "unit_type": "sub_section", "children": []},
              {"name": "Cabinet 2", "unit_type": "sub_section", "children": []},
              {"name": "Cabinet 3", "unit_type": "sub_section", "children": []}
            ]
          },
          {
            "name": "Below Counter",
            "unit_type": "section",
            "children": [
              {"name": "Drawer 1", "unit_type": "sub_section", "children": []},
              {"name": "Drawer 2", "unit_type": "sub_section", "children": []}
            ]
          }
        ]
      },
      {
        "name": "Fridge",
        "unit_type": "zone",
        "children": [
          {"name": "Main Compartment", "unit_type": "sub_section", "children": []},
          {"name": "Freezer Drawer", "unit_type": "sub_section", "children": []}
        ]
      }
    ]
  }'::jsonb,
  null
),
(
  null,
  'Bar Setup',
  'A basic bar — backbar shelves, frontbar speed rail and garnishes, reach-in cooler.',
  '{
    "name": "Bar",
    "unit_type": "area",
    "children": [
      {
        "name": "Backbar",
        "unit_type": "zone",
        "children": [
          {"name": "Top Shelf", "unit_type": "shelf", "children": []},
          {"name": "Middle Shelf", "unit_type": "shelf", "children": []},
          {"name": "Bottom Shelf", "unit_type": "shelf", "children": []}
        ]
      },
      {
        "name": "Frontbar",
        "unit_type": "zone",
        "children": [
          {"name": "Speed Rail", "unit_type": "container", "children": []},
          {"name": "Garnish Tray", "unit_type": "container", "children": []}
        ]
      },
      {
        "name": "Reach-in Cooler",
        "unit_type": "zone",
        "children": [
          {"name": "Top", "unit_type": "shelf", "children": []},
          {"name": "Middle", "unit_type": "shelf", "children": []},
          {"name": "Bottom", "unit_type": "shelf", "children": []}
        ]
      }
    ]
  }'::jsonb,
  null
);
