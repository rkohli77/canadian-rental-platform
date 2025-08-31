// Remove PlanetScale setup
// import { connect } from '@planetscale/database'

// Add Supabase setup
import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server components
export const createServerClient = () => createServerComponentClient()

// For client components
export const createBrowserClient = () => createClientComponentClient()