import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { QueryProvider } from "@/components/query-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Product Dashboard",
  description: "Manage your product inventory",
  generator: "v0.app",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <QueryProvider>
          {children}
          <Analytics />
        </QueryProvider>
      </body>
    </html>
  )
}

