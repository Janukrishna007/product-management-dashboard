"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/store"
import { ShoppingCart, Star, Edit } from "lucide-react"
import { useState } from "react"
import { formatUSDtoINR } from "@/lib/currency"
import { EditProductDialog } from "@/components/edit-product-dialog"

interface ProductCardProps {
  product: any
  onEdit?: (product: any) => void
}

export function ProductCard({ product, onEdit }: ProductCardProps) {
  const addToCart = useAuthStore((state) => state.addToCart)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(product)
    setTimeout(() => setIsAdding(false), 600)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-gray-200/50 group relative">
        <EditProductDialog product={product} />
        <div className="relative w-full h-48 bg-gradient-to-br from-slate-100 via-blue-100/50 to-teal-100/60 overflow-hidden">
          <img
            src={product.thumbnail || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.discountPercentage > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
            >
              -{product.discountPercentage}%
            </motion.div>
          )}
        </div>
        <CardContent className="pt-4 flex flex-col flex-grow">
          <h3 className="font-semibold line-clamp-2 mb-2 text-foreground">{product.title}</h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              {formatUSDtoINR(product.price)}
            </span>
            <span className="text-xs line-through text-muted-foreground">
              {formatUSDtoINR(product.price / (1 - product.discountPercentage / 100))}
            </span>
          </div>
          <div className="flex items-center gap-1 mb-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground ml-1">({product.rating})</span>
          </div>
          <div className="flex gap-2 mt-auto">
            <motion.div className="flex-1" whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full gap-2 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              >
                <motion.div
                  animate={isAdding ? { rotate: 360, scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <ShoppingCart className="w-4 h-4" />
                </motion.div>
                {isAdding ? "Added!" : "Add to Cart"}
              </Button>
            </motion.div>
            {onEdit && (
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(product)}
                  className="border-gray-200 bg-white/50 hover:bg-white backdrop-blur-sm"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
