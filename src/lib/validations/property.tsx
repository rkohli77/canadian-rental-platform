import { z } from "zod"
export const propertySchema = z.object({
title: z.string().min(5, "Title must be at least 5 characters").max(100),
description: z.string().min(20, "Description must be at least 20 characters"),
price: z.number().min(0).max(50000), // Max $500/month
bedrooms: z.number().min(0).max(10),
bathrooms: z.number().min(0).max(10),
street: z.string().min(5),
city: z.string().min(2),
province: z.enum(["AB", "BC", "MB", "NB", "NL", "NT", "NS", "NU", "ON", "PE", "QC", "SK", "YT"]),
postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "Invalid Canadian postal code"),
})