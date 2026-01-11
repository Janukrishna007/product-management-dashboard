"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/lib/store"
import { ProductCard } from "@/components/product-card"
import { CartSidebar } from "@/components/cart-sidebar"
import { ProductForm } from "@/components/product-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, LogOut, Package, TrendingUp, BarChart3, Home, Search, SlidersHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error("Failed to fetch")
  return response.json()
}

export default function DashboardPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const cartCount = useAuthStore((state) => state.cart.length)

  const [cartOpen, setCartOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [showFilters, setShowFilters] = useState(false)

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetcher("https://dummyjson.com/products"),
  })

  const updateProductMutation = useMutation({
    mutationFn: async (product: any) => {
      const response = await fetch(`https://dummyjson.com/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
      return response.json()
    },
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: ["products"] })
      const previousProducts = queryClient.getQueryData(["products"])
      queryClient.setQueryData(["products"], (old: any) => ({
        ...old,
        products: old.products.map((p: any) =>
          p.id === newProduct.id ? { ...p, ...newProduct } : p
        ),
      }))
      return { previousProducts }
    },
    onError: (_err, _newProduct, context) => {
      queryClient.setQueryData(["products"], context?.previousProducts)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  const products = productsData?.products || []
  const categories = [...new Set(products.map((p: any) => p.category))] as string[]

  const filteredProducts = products.filter((product: any) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max
    return matchesCategory && matchesSearch && matchesPrice
  })

  if (!user) {
    router.push("/login")
    return null
  }

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard", active: true },
    { icon: Package, label: "Orders", path: "/orders", active: false },
    { icon: TrendingUp, label: "Analytics", path: "/analytics", active: false },
    { icon: BarChart3, label: "Reports", path: "/reports", active: false },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-xs text-gray-500">Product Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => item.path !== "#" && router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg shadow-slate-500/20"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200/50">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                logout()
                router.push("/login")
              }}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="pl-12 h-12 bg-white border-gray-200 focus:border-slate-600 focus:ring-slate-600/20 rounded-xl shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className="relative border-gray-200 hover:bg-purple-50 hover:border-purple-300 rounded-xl"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCartOpen(true)}
                className="relative border-gray-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-200/50 overflow-hidden"
              >
                <div className="px-8 py-4 flex items-center gap-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={!selectedCategory ? "default" : "outline"}
                      onClick={() => setSelectedCategory(null)}
                      className={!selectedCategory ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white" : ""}
                    >
                      All
                    </Button>
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        size="sm"
                        variant={selectedCategory === cat ? "default" : "outline"}
                        onClick={() => setSelectedCategory(cat)}
                        className={selectedCategory === cat ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white" : ""}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Products Grid */}
        <main className="flex-1 overflow-y-auto p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={setEditingProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Edit Product Modal */}
      <AnimatePresence>
        {editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setEditingProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <ProductForm
                initialData={editingProduct}
                onSubmit={(data) => {
                  updateProductMutation.mutate({ ...editingProduct, ...data })
                  setEditingProduct(null)
                }}
                onCancel={() => setEditingProduct(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
