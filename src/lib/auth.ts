import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type User } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

// Define a type for user metadata
export type UserMetadata = Record<string, unknown>

export const signUp = async (email: string, password: string, userData: UserMetadata) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData // Additional user metadata
    }
  })
   const user = data?.user  // This is where the user data comes from
  return { user, error }
  // Return the user and error (if any)
  // return { user: data?.user, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export { createClientComponentClient }
