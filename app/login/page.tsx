"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Package, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const [username, setUsername] = useState("emilys")
  const [password, setPassword] = useState("emilyspass")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) throw new Error("Invalid credentials")

      const data = await response.json()
      setUser({
        id: data.id,
        username: data.username,
        token: data.accessToken,
      })

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
                <Package className="w-11 h-11 text-black" />
              </div>
            </div>

            <h1 className="text-5xl font-bold text-white mb-4">
              Product Dashboard
            </h1>
            <p className="text-xl text-gray-400 mb-12">
              Streamline your inventory management
            </p>

            {/* Feature list */}
            <div className="space-y-4 text-left max-w-md mx-auto">
              {[
                "Real-time inventory tracking",
                "Advanced analytics & reporting",
                "Order management system",
                "Multi-user collaboration"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo for mobile */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
              <Package className="w-9 h-9 text-white" />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black mb-2">Welcome back</h2>
            <p className="text-gray-600">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="h-12 border-gray-300 focus:border-black focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-12 border-gray-300 focus:border-black focus:ring-black"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-black hover:bg-gray-900 text-white font-medium text-base group"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign in
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-2">Demo Account</p>
            <div className="flex gap-3 text-xs">
              <code className="px-3 py-1.5 bg-white rounded border border-gray-300 font-mono">
                emilys
              </code>
              <code className="px-3 py-1.5 bg-white rounded border border-gray-300 font-mono">
                emilyspass
              </code>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
