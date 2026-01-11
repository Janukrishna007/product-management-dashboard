"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, LogOut, Package, TrendingUp, BarChart3, Home, ArrowLeft, Download, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { useMemo, useEffect } from "react"
import { formatUSDtoINR, convertToINR } from "@/lib/currency"

export default function ReportsPage() {
    const router = useRouter()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const orders = useAuthStore((state) => state.getOrders())
    const cartCount = useAuthStore((state) => state.cart.length)

    useEffect(() => {
        if (!user) {
            router.push("/login")
        }
    }, [user, router])

    if (!user) return null

    // Generate report data
    const reportData = useMemo(() => {
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
        const totalOrders = orders.length
        const totalItems = orders.reduce((sum, order) =>
            sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
        )

        // Top products
        const productSales: any = {}
        orders.forEach(order => {
            order.items.forEach(item => {
                if (productSales[item.title]) {
                    productSales[item.title].quantity += item.quantity
                    productSales[item.title].revenue += item.price * item.quantity
                } else {
                    productSales[item.title] = {
                        name: item.title,
                        quantity: item.quantity,
                        revenue: item.price * item.quantity
                    }
                }
            })
        })

        const topProducts = Object.values(productSales)
            .sort((a: any, b: any) => b.revenue - a.revenue)
            .slice(0, 10)

        // Recent orders
        const recentOrders = [...orders]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10)

        // Status breakdown
        const statusBreakdown = orders.reduce((acc: any, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1
            return acc
        }, {})

        return {
            totalRevenue,
            totalOrders,
            totalItems,
            topProducts,
            recentOrders,
            statusBreakdown
        }
    }, [orders])

    const navItems = [
        { icon: Home, label: "Dashboard", path: "/dashboard", active: false },
        { icon: Package, label: "Orders", path: "/orders", active: false },
        { icon: TrendingUp, label: "Analytics", path: "/analytics", active: false },
        { icon: BarChart3, label: "Reports", path: "/reports", active: true },
    ]

    const downloadReport = () => {
        const reportContent = `
SALES REPORT
Generated: ${new Date().toLocaleString()}

SUMMARY
-------
Total Revenue: ₹${convertToINR(reportData.totalRevenue).toFixed(2)}
Total Orders: ${reportData.totalOrders}
Total Items Sold: ${reportData.totalItems}

ORDER STATUS
------------
${Object.entries(reportData.statusBreakdown).map(([status, count]) => `${status}: ${count}`).join('\n')}

TOP PRODUCTS
------------
${reportData.topProducts.map((p: any, i: number) => `${i + 1}. ${p.name} - ${p.quantity} units - ₹${convertToINR(p.revenue).toFixed(2)}`).join('\n')}

RECENT ORDERS
-------------
${reportData.recentOrders.map((order: any) => `Order #${order.id} - ${new Date(order.createdAt).toLocaleDateString()} - ₹${convertToINR(order.total).toFixed(2)} - ${order.status}`).join('\n')}
    `.trim()

        const blob = new Blob([reportContent], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `sales-report-${new Date().toISOString().split('T')[0]}.txt`
        a.click()
        URL.revokeObjectURL(url)
    }

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
                                <h2 className="text-2xl font-bold text-gray-900">Sales Reports</h2>
                                <p className="text-sm text-gray-500">Comprehensive business insights</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                onClick={downloadReport}
                                className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download Report
                            </Button>
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
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Report Period
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">All Time</div>
                                <p className="text-xs text-gray-500 mt-1">{reportData.totalOrders} total orders</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                                    {formatUSDtoINR(reportData.totalRevenue)}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{reportData.totalItems} items sold</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">Order Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    {Object.entries(reportData.statusBreakdown).map(([status, count]) => (
                                        <div key={status} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{status}:</span>
                                            <span className="font-semibold">{count as number}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top Products */}
                    <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50 mb-8">
                        <CardHeader>
                            <CardTitle>Top Selling Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Rank</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Product</th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Units Sold</th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.topProducts.length > 0 ? (
                                            reportData.topProducts.map((product: any, index: number) => (
                                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">#{index + 1}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-900">{product.name}</td>
                                                    <td className="py-3 px-4 text-sm text-right text-gray-600">{product.quantity}</td>
                                                    <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                                                        {formatUSDtoINR(product.revenue)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="py-8 text-center text-gray-400">
                                                    No product data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Orders */}
                    <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50">
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Items</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.recentOrders.length > 0 ? (
                                            reportData.recentOrders.map((order: any) => (
                                                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">#{order.id}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{order.items.length} items</td>
                                                    <td className="py-3 px-4 text-sm">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                                                        {formatUSDtoINR(order.total)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-gray-400">
                                                    No orders available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}
