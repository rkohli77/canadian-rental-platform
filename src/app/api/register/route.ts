import { NextRequest, NextResponse } from 'next/server'
import { da } from 'zod/v4/locales'
import { supabaseAdmin } from '@/lib/auth'

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

  } catch (err: any) {
    console.error("Registration failed:", err.message)
    console.error("Raw body email:", body.email)
    console.error("Unexpected registration error:", err)
    return NextResponse.json(
      err.field
        ? { field: err.field, message: err.message }
        : { error: err.message || "Unexpected error during registration" },
      { status: 400 }
    )
  }
}

// export async function POST(req: NextRequest) {
//   const body = await req.json()
//   const {
//     user_id, // Expect user_id from frontend or set it after Auth
//     firstName,
//     lastName,
//     phone,
//     address,
//     city,
//     province,
//     postalCode,
//     occupation,
//     monthlyIncome,
//     reference,
//     companyName,
//     businessNumber,
//     propertyCount,
//     experience,
//     userType
//   } = body

// const { email, password, ...profile } = body

//   // Create user in Supabase Auth
// const { data, error: signUpError } = await supabaseAdmin.auth.signUp({
//   email: body.email,
//   password: body.password,
//   options: {
//     emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`, // where Supabase redirects after confirmation
//     data: {
//       first_name: firstName,
//       last_name: lastName,
//       phone,
//       user_type: userType,
//     },
//   },
// })
  
//     if (signUpError || !data?.user) {
//     return NextResponse.json({ error: signUpError?.message }, { status: 400 })
//   }

//   // after creating the user with signUp
// const profileData = {
//   user_id: data.user.id,
//   first_name: body.firstName,
//   last_name: body.lastName,
//   email: body.email,
//   phone: body.phone,
//   address: body.address,
//   city: body.city,
//   province: body.province,
//   postal_code: body.postalCode,
//   occupation: body.occupation,
//   monthly_income: body.monthlyIncome,
//   reference: body.references,        // ⚡ singular in DB
//   company_name: body.companyName,
//   business_number: body.businessNumber,
//   property_count: body.propertyCount,
//   experience: body.experience,
//   user_type: body.userType,
// }

// const { error } = await supabaseAdmin.from('profile').insert([profileData])

// if (error) {
//   console.error("Profile insert error:", error)
//   return NextResponse.json({ error: error.message }, { status: 400 })
// }
//   return NextResponse.json({ success: true }, { status: 200 })
// }
