"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function DashboardContent() {
  const searchParams = useSearchParams()
  const greeting = searchParams.get("greeting") || "Hello"
  const name = searchParams.get("name") || "User"

  return (
    <div className="p-4">
      <div className="text-left text-xl font-semibold">
        {greeting}, {name}!
      </div>
      {/* Add your dashboard content here */}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}