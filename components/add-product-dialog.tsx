"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { productSchema, type ProductFormData } from "@/lib/validations/product"
import { formatUSDtoINR } from "@/lib/currency"

export function AddProductDialog() {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
            discountPercentage: 0,
            stock: 0,
            brand: "",
            category: "",
            thumbnail: "",
        },
    })

    const addProductMutation = useMutation({
        mutationFn: async (data: ProductFormData) => {
            const response = await fetch("https://dummyjson.com/products/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!response.ok) throw new Error("Failed to add product")
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
            setOpen(false)
            reset()
        },
    })

    const onSubmit = (data: ProductFormData) => {
        addProductMutation.mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="title">Product Title *</Label>
                            <Input
                                id="title"
                                {...register("title")}
                                placeholder="Enter product title"
                                className="mt-1"
                            />
                            {errors.title && (
                                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                {...register("description")}
                                placeholder="Enter product description"
                                className="mt-1"
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="price">Price (INR) *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                {...register("price")}
                                placeholder="0.00"
                                className="mt-1"
                            />
                            {errors.price && (
                                <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="discountPercentage">Discount % *</Label>
                            <Input
                                id="discountPercentage"
                                type="number"
                                step="0.01"
                                {...register("discountPercentage")}
                                placeholder="0"
                                className="mt-1"
                            />
                            {errors.discountPercentage && (
                                <p className="text-sm text-red-600 mt-1">{errors.discountPercentage.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="stock">Stock *</Label>
                            <Input
                                id="stock"
                                type="number"
                                {...register("stock")}
                                placeholder="0"
                                className="mt-1"
                            />
                            {errors.stock && (
                                <p className="text-sm text-red-600 mt-1">{errors.stock.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="brand">Brand *</Label>
                            <Input
                                id="brand"
                                {...register("brand")}
                                placeholder="Enter brand name"
                                className="mt-1"
                            />
                            {errors.brand && (
                                <p className="text-sm text-red-600 mt-1">{errors.brand.message}</p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <Label htmlFor="category">Category *</Label>
                            <Input
                                id="category"
                                {...register("category")}
                                placeholder="Enter category"
                                className="mt-1"
                            />
                            {errors.category && (
                                <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <Label htmlFor="thumbnail">Thumbnail URL</Label>
                            <Input
                                id="thumbnail"
                                {...register("thumbnail")}
                                placeholder="https://example.com/image.jpg"
                                className="mt-1"
                            />
                            {errors.thumbnail && (
                                <p className="text-sm text-red-600 mt-1">{errors.thumbnail.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={addProductMutation.isPending}
                            className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white"
                        >
                            {addProductMutation.isPending ? "Adding..." : "Add Product"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
