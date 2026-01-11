"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { formatUSDtoINR } from "@/lib/currency"

export default function CheckoutPage() {
    const router = useRouter()
    const user = useAuthStore((state) => state.user)
    const cart = useAuthStore((state) => state.cart)
    const createOrder = useAuthStore((state) => state.createOrder)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [orderComplete, setOrderComplete] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        zipCode: "",
    })

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    useEffect(() => {
        if (!user) {
            router.push("/login")
        }
        if (cart.length === 0 && !orderComplete) {
            router.push("/dashboard")
        }
    }, [user, cart, orderComplete, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        createOrder(formData)
        setOrderComplete(true)
        setIsSubmitting(false)
    }

    if (!user) return null

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <Card className="bg-white border-gray-200 shadow-xl text-center">
                        <CardContent className="pt-12 pb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                            >
                                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                            </motion.div>
                            <h2 className="text-2xl font-bold mb-2 text-gray-900">Order Placed Successfully!</h2>
                            <p className="text-gray-600 mb-6">
                                Thank you for your order. We'll send you a confirmation email shortly.
                            </p>
                            <div className="flex gap-3">
                                <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
                                    <Button
                                        onClick={() => router.push("/orders")}
                                        className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white font-semibold shadow-lg"
                                    >
                                        View Orders
                                    </Button>
                                </motion.div>
                                <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
                                    <Button
                                        onClick={() => router.push("/dashboard")}
                                        variant="outline"
                                        className="w-full border-gray-300 bg-white hover:bg-gray-50 text-gray-900"
                                    >
                                        Continue Shopping
                                    </Button>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30">
            <header className="border-b border-gray-200 sticky top-0 z-30 bg-white/90 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/dashboard")}
                        className="gap-2 hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-12">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-8 text-gray-900"
                >
                    Checkout
                </motion.h1>

                <div className="grid md:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-2"
                    >
                        <Card className="bg-white border-gray-200 shadow-lg">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-gray-900">Shipping Information</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 block mb-1">Full Name</label>
                                        <Input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="bg-white border-gray-300 text-gray-900"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 block mb-1">Email</label>
                                        <Input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="bg-white border-gray-300 text-gray-900"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 block mb-1">Address</label>
                                        <Input
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="bg-white border-gray-300 text-gray-900"
                                            placeholder="123 Main St"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-1">City</label>
                                            <Input
                                                required
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="bg-white border-gray-300 text-gray-900"
                                                placeholder="New York"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-1">ZIP Code</label>
                                            <Input
                                                required
                                                value={formData.zipCode}
                                                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                                className="bg-white border-gray-300 text-gray-900"
                                                placeholder="10001"
                                            />
                                        </div>
                                    </div>

                                    <motion.div whileTap={{ scale: 0.98 }}>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white font-bold h-12 shadow-lg hover:shadow-xl transition-all duration-200"
                                        >
                                            {isSubmitting ? "Processing..." : `Place Order - ${formatUSDtoINR(total)}`}
                                        </Button>
                                    </motion.div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card className="bg-white border-gray-200 shadow-lg sticky top-24">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-gray-900">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="space-y-3">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <img
                                                src={item.thumbnail}
                                                alt={item.title}
                                                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium line-clamp-1 text-gray-900">{item.title}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                <p className="text-sm font-semibold text-slate-700">
                                                    {formatUSDtoINR(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-700">
                                        <span>Subtotal</span>
                                        <span>{formatUSDtoINR(total)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-700">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-semibold">FREE</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 text-gray-900">
                                        <span>Total</span>
                                        <span className="text-slate-700">{formatUSDtoINR(total)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}
