"use client"

import { type ReactNode, useEffect, useState } from "react"
import { Home, Bell, MessageSquare, CloudRain, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface AndroidLayoutProps {
  children: ReactNode
  hideNav?: boolean
}

export function AndroidLayout({ children, hideNav = false }: AndroidLayoutProps) {
  const pathname = usePathname()
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  const navItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: Bell, label: "Alerts", href: "/dashboard/alerts" },
    { icon: CloudRain, label: "Weather", href: "/dashboard/weather" },
    { icon: MessageSquare, label: "Forum", href: "/dashboard/forum" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
  ]

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto overflow-hidden bg-gray-950 relative">
      {/* Android status bar */}
      <div className="bg-black text-white px-4 py-1 flex justify-between items-center text-xs z-10">
        <span>{currentTime}</span>
        <div className="flex items-center gap-2">
          <span className="i-lucide-signal text-white"></span>
          <span className="i-lucide-wifi text-white"></span>
          <span>{batteryLevel}%</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">{children}</div>

      {/* Bottom navigation */}
      {!hideNav && (
        <div className="bg-gray-900 border-t border-gray-800 flex justify-around py-2 px-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center px-2 py-1 rounded-md",
                  isActive ? "text-cyan-400" : "text-gray-400",
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

