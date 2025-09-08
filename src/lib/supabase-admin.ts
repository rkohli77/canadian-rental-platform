import { createServerClient, type CookieOptions } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

const dummyCookies = {
  get: (_key: string) => undefined,
  set: (_key: string, _value: string, _options?: CookieOptions) => {},
  remove: (_key: string, _options?: CookieOptions) => {}
}

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
}

export const supabaseAdmin = createServerClient(supabaseUrl, serviceRoleKey, { cookies: dummyCookies })
