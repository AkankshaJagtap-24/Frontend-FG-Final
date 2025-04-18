import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/contexts/user-context"
import { AndroidLayout } from "@/components/android-layout"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flood Guard - Stay Informed, Stay Safe",
  description: "Real-time flood alerts and emergency information",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return ( 
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <UserProvider>{children}</UserProvider>
        </ThemeProvider>
      </body>
    </html> 
  )
}



import './globals.css'