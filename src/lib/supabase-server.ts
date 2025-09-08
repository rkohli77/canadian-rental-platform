import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const createSupabaseServerClient = () =>
  createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async get(name: string) {
        const store = await cookies();
        const value = store.get(name);
        return value?.value ?? null;
      },
      async set(name: string, value: string, options?: CookieOptions) {
        const store = await cookies();
        store.set(name, value, options);
      },
      async remove(name: string, options?: CookieOptions) {
        const store = await cookies();
        store.delete(name);
      },
    },
  })