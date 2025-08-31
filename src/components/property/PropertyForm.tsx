"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { propertySchema } from "@/lib/validations/property"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import type { z } from "zod"

export function PropertyForm() {
  const [isLoading, setIsLoading] = useState(false)
  type PropertyFormValues = z.infer<typeof propertySchema>
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      bedrooms: 1,
      bathrooms: 1,
      // ... other defaults
    },
  })
  const onSubmit = async (data: PropertyFormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        // Handle success
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Title</FormLabel>
              <FormControl>
                <Input placeholder="Beautiful 2BR apartment in downtown..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Add more form fields */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Property"}
        </Button>
      </form>
    </Form>
  )
}