import type React from "react"
import type { Metadata } from "next"
import { Crimson_Pro, Noto_Sans_Devanagari } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const copernicus = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-copernicus",
  display: "swap",
  weight: ["400", "600", "700"],
})

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Discover India - Your Personal Travel Guide",
  description:
    "AI-powered travel planning for exploring incredible India. Get personalized itineraries, budget planning, and local insights. Strictly for India travel only.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${copernicus.variable} ${devanagari.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
