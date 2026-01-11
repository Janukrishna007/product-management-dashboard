"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, LogOut, Package, TrendingUp, BarChart3, Home, Calendar, DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { formatUSDtoINR } from "@/lib/currency"

export default function OrdersPage() {
    const router = useRouter()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const orders = useAuthStore((state) => state.orders)
    const cartCount = useAuthStore((state) => state.cart.length)

    useEffect(() => {
        if (!user) {
            router.push("/login")
        }
    }, [user, router])

    if (!user) return null

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-500/20 text-green-500 border-green-500/30"
            case "processing":
                return "bg-blue-500/20 text-blue-500 border-blue-500/30"
            case "pending":
                return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
            case "cancelled":
                return "bg-red-500/20 text-red-500 border-red-500/30"
            default:
                return "bg-gray-500/20 text-gray-500 border-gray-500/30"
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const navItems = [
        { icon: Home, label: "Dashboard", path: "/dashboard", active: false },
        { icon: Package, label: "Orders", path: "/orders", active: true },
        { icon: TrendingUp, label: "Analytics", path: "/analytics", active: false },
        { icon: BarChart3, label: "Reports", path: "/reports", active: false },
    ]

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40">
            {/* Sidebar */}
            <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl flex flex-col">
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

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => router.push(item.path)}
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
                <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
                    <div className="px-8 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                            <p className="text-sm text-gray-500">View all your past orders</p>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.push("/dashboard")}
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
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    {orders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                            <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
                            <p className="text-gray-500 mb-6">
                                Start shopping to see your orders here
                            </p>
                            <motion.div whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={() => router.push("/dashboard")}
                                    className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white font-semibold shadow-lg"
                                >
                                    Browse Products
                                </Button>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order, index) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50 overflow-hidden">
                                        <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200/50">
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div>
                                                    <CardTitle className="text-lg mb-1">Order #{order.id}</CardTitle>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(order.createdAt)}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge className={getStatusColor(order.status)}>
                                                        {order.status.toUpperCase()}
                                                    </Badge>
                                                    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                                        <DollarSign className="w-5 h-5" />
                                                        {formatUSDtoINR(order.total)}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-6">
                                            {order.shippingInfo && (
                                                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                    <h4 className="font-semibold mb-2 text-sm">Shipping Information</h4>
                                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                                        <div>
                                                            <span className="font-medium text-gray-900">Name:</span> {order.shippingInfo.name}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-900">Email:</span> {order.shippingInfo.email}
                                                        </div>
                                                        <div className="col-span-2">
                                                            <span className="font-medium text-gray-900">Address:</span>{" "}
                                                            {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                                                            {order.shippingInfo.zipCode}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <h4 className="font-semibold mb-3 text-sm">Order Items</h4>
                                            <div className="space-y-3">
                                                {order.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
                                                    >
                                                        <img
                                                            src={item.thumbnail}
                                                            alt={item.title}
                                                            className="w-20 h-20 object-cover rounded-lg"
                                                        />
                                                        <div className="flex-1">
                                                            <h5 className="font-medium mb-1">{item.title}</h5>
                                                            <p className="text-sm text-gray-600">
                                                                Quantity: {item.quantity}
                                                            </p>
                                                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                                                {formatUSDtoINR(item.price * item.quantity)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
