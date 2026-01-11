"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/lib/store"
import { X, ShoppingCart, Trash2 } from "lucide-react"
import { formatUSDtoINR } from "@/lib/currency"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const cart = useAuthStore((state) => state.cart)
  const removeFromCart = useAuthStore((state) => state.removeFromCart)
  const updateQuantity = useAuthStore((state) => state.updateQuantity)
  const clearCart = useAuthStore((state) => state.clearCart)

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white border-l border-gray-200 z-50 flex flex-col shadow-2xl"
          >
            <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <ShoppingCart className="w-5 h-5" />
                  Cart ({cart.length})
                </CardTitle>
                <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-12 flex flex-col items-center gap-2">
                  <ShoppingCart className="w-8 h-8 opacity-50" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-slate-300 transition"
                  >
                    <img
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-1 text-sm text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-900 font-semibold">{formatUSDtoINR(item.price * item.quantity)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                          className="w-12 h-8 bg-white border-gray-300"
                        />
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 hover:bg-destructive/20 text-destructive rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>

            <div className="border-t border-gray-200 bg-white p-4 space-y-3">
              <div className="flex justify-between items-center font-bold text-lg">
                <span className="text-gray-900">Total:</span>
                <span className="text-2xl text-gray-900">
                  {formatUSDtoINR(total)}
                </span>
              </div>
              <motion.div whileTap={{ scale: cart.length > 0 ? 0.98 : 1 }}>
                <Button
                  onClick={() => {
                    if (cart.length > 0) {
                      onClose()
                      window.location.href = "/checkout"
                    }
                  }}
                  disabled={cart.length === 0}
                  className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white font-bold text-base h-12 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                </Button>
              </motion.div>
              {cart.length > 0 && (
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 bg-white hover:bg-gray-50 text-gray-900"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
