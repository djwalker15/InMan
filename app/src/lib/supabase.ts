import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { useAuth } from '@clerk/clerk-react'
import { useMemo } from 'react'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Check app/.env.local.',
  )
}

export function useSupabase(): SupabaseClient {
  const { getToken } = useAuth()

  return useMemo(
    () =>
      createClient(supabaseUrl, supabasePublishableKey, {
        accessToken: () => getToken(),
      }),
    [getToken],
  )
}
