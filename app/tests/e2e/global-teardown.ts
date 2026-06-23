import { Client } from 'pg'

/**
 * Sweeps everything the inventory-add E2E specs create so staging stays slim.
 *
 * Each run signs up a fresh user and builds a crew named `E2E Crew <stamp>`
 * (see helpers/onboard.ts), then writes spaces, crew-private products,
 * inventory_items, and purchase flows under it. The `flows` ledger (and its
 * detail tables) are immutable: BEFORE DELETE triggers raise an exception for
 * every role, so PostgREST/service-role deletes are impossible. We therefore
 * connect directly to Postgres and run the deletes under
 * `session_replication_role = 'replica'`, which disables user + FK/RI triggers
 * for the session — unblocking the ledger deletes and making them
 * order-independent.
 *
 * Runs as Playwright's globalTeardown. Self-skips when SUPABASE_DB_URL isn't
 * configured (matching how the specs skip without creds). Also deletes the
 * matching Clerk test users via the Backend API so the Clerk dev instance
 * doesn't accumulate either.
 *
 * Matching by the `E2E Crew %` name prefix means a run also clears stragglers
 * left by earlier failed runs, not just its own crews. SUPABASE_DB_URL must be
 * the session-mode pooler URI (IPv4, supports session_replication_role).
 */

const TEST_CREW_PREFIX = 'E2E Crew '
const E2E_CREW_IDS = `select crew_id from public.crews where name like '${TEST_CREW_PREFIX}%'`

// Deleted in any order (replica mode disables FK enforcement). Tables flagged
// optional are skipped when absent, so the sweep works across schema versions.
const TARGETS: { sql: string; optional?: boolean }[] = [
  { sql: `delete from public.flow_purchase_details where flow_id in (select flow_id from public.flows where crew_id in (${E2E_CREW_IDS}))` },
  { sql: `delete from public.flow_transfer_details where flow_id in (select flow_id from public.flows where crew_id in (${E2E_CREW_IDS}))`, optional: true },
  { sql: `delete from public.flow_adjustment_details where flow_id in (select flow_id from public.flows where crew_id in (${E2E_CREW_IDS}))`, optional: true },
  { sql: `delete from public.flows where crew_id in (${E2E_CREW_IDS})` },
  { sql: `delete from public.receipt_scan_aliases where crew_id in (${E2E_CREW_IDS})`, optional: true },
  { sql: `delete from public.inventory_items where crew_id in (${E2E_CREW_IDS})` },
  { sql: `delete from public.products where crew_id in (${E2E_CREW_IDS})` },
  { sql: `delete from public.spaces where crew_id in (${E2E_CREW_IDS})` },
  { sql: `delete from public.crew_members where crew_id in (${E2E_CREW_IDS})` },
]

export default async function globalTeardown() {
  const conn = process.env.SUPABASE_DB_URL
  if (!conn) {
    console.warn(
      '[e2e teardown] SUPABASE_DB_URL not set — skipping cleanup. Staging test ' +
        'data will accumulate. Add the session-pooler URI to app/.env.test (and ' +
        'CI secrets) to enable.',
    )
    return
  }

  const client = new Client({
    connectionString: conn,
    ssl: { rejectUnauthorized: false },
  })

  let clerkUserIds: string[] = []
  let crewCount = 0

  await client.connect()
  try {
    // Capture members (their user_id IS the Clerk `sub`) before deleting, for
    // the Clerk purge below.
    const members = await client.query<{ user_id: string }>(
      `select distinct cm.user_id from public.crew_members cm
         join public.crews c on c.crew_id = cm.crew_id
        where c.name like '${TEST_CREW_PREFIX}%'`,
    )
    clerkUserIds = members.rows.map((r) => r.user_id)

    await client.query('begin')
    // Disables immutability + FK triggers for this session only.
    await client.query(`set local session_replication_role = 'replica'`)

    for (const target of TARGETS) {
      if (target.optional && !(await tableExists(client, target.sql))) continue
      await client.query(target.sql)
    }

    const crews = await client.query(
      `delete from public.crews where name like '${TEST_CREW_PREFIX}%' returning crew_id`,
    )
    crewCount = crews.rowCount ?? 0

    if (clerkUserIds.length > 0) {
      await client.query(`delete from public.users where user_id = any($1)`, [
        clerkUserIds,
      ])
    }

    await client.query('commit')
  } catch (err) {
    await client.query('rollback').catch(() => {})
    console.warn(
      `[e2e teardown] cleanup failed, rolled back: ${
        err instanceof Error ? err.message : String(err)
      }`,
    )
    await client.end()
    return
  }
  await client.end()

  await deleteClerkUsers(clerkUserIds)

  console.log(
    `[e2e teardown] deleted ${crewCount} test crew(s) and ${clerkUserIds.length} ` +
      `Clerk test user(s).`,
  )
}

/** True when the table targeted by a `delete from public.<t> ...` exists. */
async function tableExists(client: Client, sql: string): Promise<boolean> {
  const match = /delete from (public\.[a-z_]+)/.exec(sql)
  if (!match) return false
  const { rows } = await client.query<{ r: string | null }>(
    `select to_regclass($1) as r`,
    [match[1]],
  )
  return rows[0]?.r != null
}

async function deleteClerkUsers(clerkUserIds: string[]) {
  const secret = process.env.CLERK_SECRET_KEY
  if (!secret || clerkUserIds.length === 0) return
  for (const id of clerkUserIds) {
    try {
      await fetch(`https://api.clerk.com/v1/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${secret}` },
      })
    } catch {
      // Best-effort: a user already gone (or transient error) shouldn't fail
      // the teardown.
    }
  }
}
