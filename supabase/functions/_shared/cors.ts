// CORS headers shared across edge functions called from the browser.
// The clerk-webhook function is called server-to-server by Clerk and
// does not need these.

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
