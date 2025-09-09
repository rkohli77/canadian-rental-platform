import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
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

  // ✅ Add validation here
  const email = body.email?.trim()
  const password = body.password?.trim()

  // Compute safe redirect URL for Supabase email confirmation
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  const redirectTo = new URL("/auth/callback", siteUrl).toString()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { field: "email", message: "A valid email is required." },
      { status: 400 }
    )
  }

  if (!password || password.length < 8) {
    return NextResponse.json(
      { field: "password", message: "Password must be at least 8 characters." },
      { status: 400 }
    )
  }
  
  try {
    // 1. Create user in Supabase Auth
    const { data, error: signUpError } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo, // where Supabase redirects after confirmation
        data: { first_name: firstName, last_name: lastName, phone, user_type: userType },
      },
    })

    if (signUpError) {
      console.error("Supabase signup error:", signUpError)
      return NextResponse.json(
        {
          field: "email",
          message: signUpError.message || "Signup failed. Please try again.",
          code: signUpError.code || "signup_error"
        },
        { status: 400 }
      )
    }

    if (!data?.user) {
      return NextResponse.json(
        { error: "Signup failed" },
        { status: 400 }
      )
    }

    // 2. Insert profile
    const profileData = {
      user_id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address,
      city,
      province,
      postal_code: postalCode,
      occupation,
      monthly_income: monthlyIncome,
      reference,
      company_name: companyName,
      business_number: businessNumber,
      property_count: propertyCount,
      experience,
      user_type: userType,
    }

    const { error: profileError } = await supabaseAdmin.from("profile").insert([profileData])

    if (profileError) {
      // rollback user if profile insert fails
      await supabaseAdmin.auth.admin.deleteUser(data.user.id)
      throw new Error(profileError.message)
    }

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (err: unknown) {
    const error = err as { message?: string; field?: string }
    console.error("Registration failed:", error.message)
    console.error("Raw body email:", body.email)
    console.error("Unexpected registration error:", err)
    return NextResponse.json(
      error.field
        ? { field: error.field, message: error.message }
        : { error: error.message || "Unexpected error during registration" },
      { status: 400 }
    )
  }
}