import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getCurrentUser, signUp } from '@/lib/auth'
import { da } from 'zod/v4/locales'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    user_id, // Expect user_id from frontend or set it after Auth
    firstName,
    lastName,
    phone,
    address,
    city,
    province,
    postalCode,
    occupation,
    monthlyIncome,
    reference,
    companyName,
    businessNumber,
    propertyCount,
    experience,
    userType
  } = body

const { email, password, ...profile } = body

  // Create user in Supabase Auth
const { data, error: signUpError } = await supabaseAdmin.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`, // where Supabase redirects after confirmation
    data: {
      first_name: firstName,
      last_name: lastName,
      phone,
      user_type: userType,
    },
  },
})
  
    if (signUpError || !data?.user) {
    return NextResponse.json({ error: signUpError?.message }, { status: 400 })
  }

  // after creating the user with signUp
const profileData = {
  user_id: data.user.id,
  first_name: body.firstName,
  last_name: body.lastName,
  email: body.email,
  phone: body.phone,
  address: body.address,
  city: body.city,
  province: body.province,
  postal_code: body.postalCode,
  occupation: body.occupation,
  monthly_income: body.monthlyIncome,
  reference: body.references,        // ⚡ singular in DB
  company_name: body.companyName,
  business_number: body.businessNumber,
  property_count: body.propertyCount,
  experience: body.experience,
  user_type: body.userType,
}

const { error } = await supabaseAdmin.from('profile').insert([profileData])

if (error) {
  console.error("Profile insert error:", error)
  return NextResponse.json({ error: error.message }, { status: 400 })
}
  return NextResponse.json({ success: true }, { status: 200 })
}

