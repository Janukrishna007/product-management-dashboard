import { z } from "zod"

export const productSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.coerce.number().min(0.01, "Price must be greater than 0"),
    discountPercentage: z.coerce.number().min(0, "Discount must be 0 or greater").max(100, "Discount cannot exceed 100%"),
    stock: z.coerce.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
    brand: z.string().min(1, "Brand is required"),
    category: z.string().min(1, "Category is required"),
    thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

export type ProductFormData = z.infer<typeof productSchema>
