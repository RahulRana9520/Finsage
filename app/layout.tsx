import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "FinSage — Autonomous Multi-Agent Financial & Tax Advisory",
  description: "Personal finance management and Indian tax optimization powered by autonomous multi-agent intelligence.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_20%_20%,rgba(124,58,237,0.25),transparent),radial-gradient(50%_30%_at_80%_10%,rgba(34,211,238,0.18),transparent),radial-gradient(70%_50%_at_50%_100%,rgba(124,58,237,0.18),transparent)]" />
          </div>
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
