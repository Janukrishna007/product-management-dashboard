"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"
import { motion } from "framer-motion"
import { useState } from "react"

const productSchema = z.object({
  title: z.string().min(1, "Title required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  description: z.string().min(1, "Description required"),
  category: z.string().min(1, "Category required"),
  stock: z.coerce.number().min(0, "Stock must be non-negative"),
  image: z.string().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: any
  onSubmit: (data: ProductFormData) => void
  onCancel: () => void
}

export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string>(initialData?.thumbnail || "")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {},
  })

  const onFormSubmit = (data: ProductFormData) => {
    onSubmit({ ...data, image: imagePreview })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="glass border-border/30 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-secondary to-secondary/50 border-b border-border/30">
          <CardTitle className="text-primary">{initialData ? "Edit Product" : "Add New Product"}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-foreground">Product Image</label>
              <div className="mt-2">
                <ImageUpload
                  value={imagePreview}
                  onChange={(value) => {
                    setImagePreview(value)
                    setValue("image", value)
                  }}
                  onRemove={() => {
                    setImagePreview("")
                    setValue("image", "")
                  }}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground">Product Title</label>
              <Input {...register("title")} className="mt-2 glass border-border/30" placeholder="Enter product title" />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground">Price</label>
                <Input
                  {...register("price")}
                  type="number"
                  step="0.01"
                  className="mt-2 glass border-border/30"
                  placeholder="0.00"
                />
                {errors.price && <p className="text-xs text-destructive mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">Stock</label>
                <Input {...register("stock")} type="number" className="mt-2 glass border-border/30" placeholder="0" />
                {errors.stock && <p className="text-xs text-destructive mt-1">{errors.stock.message}</p>}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground">Category</label>
              <Input
                {...register("category")}
                className="mt-2 glass border-border/30"
                placeholder="e.g., Electronics"
              />
              {errors.category && <p className="text-xs text-destructive mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground">Description</label>
              <textarea
                {...register("description")}
                className="w-full min-h-28 mt-2 p-3 border border-border/30 rounded-lg glass bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Detailed product description..."
              />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
            </div>

            <div className="flex gap-3 pt-4">
              <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-100 hover:to-gray-300 font-semibold h-11 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {initialData ? "Update Product" : "Create Product"}
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-8"
                >
                  Cancel
                </Button>
              </motion.div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
