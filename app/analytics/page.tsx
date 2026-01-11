"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, LogOut, Package, TrendingUp, BarChart3, Home, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useMemo } from "react"
import { formatUSDtoINR } from "@/lib/currency"

export default function AnalyticsPage() {
    const router = useRouter()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const orders = useAuthStore((state) => state.getOrders())
    const cartCount = useAuthStore((state) => state.cart.length)

    if (!user) {
        router.push("/login")
        return null
    }

    // Calculate analytics data from orders
    const analyticsData = useMemo(() => {
        // Revenue over time
        const revenueByDate = orders.reduce((acc: any, order) => {
            const date = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            const existing = acc.find((item: any) => item.date === date)
            if (existing) {
                existing.revenue += order.total
                existing.orders += 1
            } else {
                acc.push({ date, revenue: order.total, orders: 1 })
            }
            return acc
        }, [])

        // Product categories
        const categoryData = orders.reduce((acc: any, order) => {
            order.items.forEach(item => {
                const category = item.category || 'Other'
                const existing = acc.find((c: any) => c.name === category)
                if (existing) {
                    existing.value += item.quantity
                } else {
                    acc.push({ name: category, value: item.quantity })
                }
            })
            return acc
        }, [])

        // Order status distribution
        const statusData = orders.reduce((acc: any, order) => {
            const existing = acc.find((s: any) => s.name === order.status)
            if (existing) {
                existing.value += 1
            } else {
                acc.push({ name: order.status, value: 1 })
            }
            return acc
        }, [])

        // Calculate totals
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
        const totalOrders = orders.length
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
        const totalItems = orders.reduce((sum, order) =>
            sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
        )

        return {
            revenueByDate,
            categoryData,
            statusData,
            totalRevenue,
            totalOrders,
            avgOrderValue,
            totalItems
        }
    }, [orders])

    const COLORS = ['#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1']

    const navItems = [
        { icon: Home, label: "Dashboard", path: "/dashboard", active: false },
        { icon: Package, label: "Orders", path: "/orders", active: false },
        { icon: TrendingUp, label: "Analytics", path: "/analytics", active: true },
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
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push("/dashboard")}
                                className="hover:bg-slate-100"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
                                <p className="text-sm text-gray-500">Order and sales insights</p>
                            </div>
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
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                                    {formatUSDtoINR(analyticsData.totalRevenue)}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">From {analyticsData.totalOrders} orders</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{analyticsData.totalOrders}</div>
                                <p className="text-xs text-gray-500 mt-1">Completed purchases</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">Avg Order Value</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{formatUSDtoINR(analyticsData.avgOrderValue)}</div>
                                <p className="text-xs text-gray-500 mt-1">Per transaction</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">Total Items Sold</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{analyticsData.totalItems}</div>
                                <p className="text-xs text-gray-500 mt-1">Across all orders</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Revenue Chart */}
                        <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50">
                            <CardHeader>
                                <CardTitle>Revenue Over Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {analyticsData.revenueByDate.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={analyticsData.revenueByDate}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis dataKey="date" stroke="#64748b" />
                                            <YAxis stroke="#64748b" />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="revenue" stroke="#334155" strokeWidth={2} name="Revenue ($)" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-gray-400">
                                        No order data available
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Orders Chart */}
                        <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50">
                            <CardHeader>
                                <CardTitle>Orders Per Day</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {analyticsData.revenueByDate.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={analyticsData.revenueByDate}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis dataKey="date" stroke="#64748b" />
                                            <YAxis stroke="#64748b" />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="orders" fill="#475569" name="Orders" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-gray-400">
                                        No order data available
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Category Distribution */}
                        <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50">
                            <CardHeader>
                                <CardTitle>Products by Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {analyticsData.categoryData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={analyticsData.categoryData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(entry) => entry.name}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {analyticsData.categoryData.map((_: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-gray-400">
                                        No category data available
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Order Status */}
                        <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50">
                            <CardHeader>
                                <CardTitle>Order Status Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {analyticsData.statusData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={analyticsData.statusData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(entry) => entry.name}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {analyticsData.statusData.map((_: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-gray-400">
                                        No status data available
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
