"use client"

import { useSearchParams } from "next/navigation"

export default function DashboardPage() {
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