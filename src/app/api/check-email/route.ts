import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// --- API route implementation for /api/check-email ---
export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ exists: false }, { status: 200 })
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ exists: false, error: "Supabase Admin client not available" }, { status: 500 })
    }
    // Query all users using Supabase Admin client
    const { data, error } = await supabaseAdmin.auth.admin.listUsers()
    if (error || !data || !Array.isArray(data.users)) {
      return NextResponse.json({ exists: false }, { status: 200 })
    }
    const exists = data.users.some((user) => (user.email || "").toLowerCase() === email.toLowerCase())
    return NextResponse.json({ exists }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ exists: false }, { status: 200 })
  }
}