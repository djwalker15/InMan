// Shared Clerk backend client. Reads CLERK_SECRET_KEY from the
// edge-function environment; that secret is set via the Supabase
// dashboard or `supabase secrets set` and is NEVER bundled with
// the function source.

import { createClerkClient } from 'npm:@clerk/backend@1'

const secretKey = Deno.env.get('CLERK_SECRET_KEY')
if (!secretKey) {
  throw new Error(
    'CLERK_SECRET_KEY is not set in the edge-function environment.',
  )
}

export const clerk = createClerkClient({ secretKey })
