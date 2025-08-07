import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { AccessibilityProvider } from "@/components/accessibility-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NeuroConnect - Empowering Neurodivergent Professionals",
  description:
    "A comprehensive platform designed for neurodivergent individuals to find employment, connect with communities, and access supportive resources.",
  keywords: "neurodivergent, autism, ADHD, employment, community, accessibility, support",
  authors: [{ name: "NeuroConnect Team" }],
  openGraph: {
    title: "NeuroConnect - Empowering Neurodivergent Professionals",
    description:
      "Find employment, connect with communities, and access supportive resources designed for neurodivergent individuals.",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AccessibilityProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
