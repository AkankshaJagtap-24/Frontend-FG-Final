"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Droplets } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { AndroidLayout } from "@/components/android-layout"

export default function SplashScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const { user, isLoading } = useUser()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loading && !isLoading) {
      const redirectTimer = setTimeout(() => {
        if (user) {
          router.push("/dashboard")
        } else {
          router.push("/home")
        }
      }, 500)

      return () => clearTimeout(redirectTimer)
    }
  }, [loading, isLoading, user, router])

  return (
    <AndroidLayout hideNav>
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-black text-white">
        <div
          className={`transition-opacity duration-500 ${loading ? "opacity-100" : "opacity-0"} flex flex-col items-center`}
        >
          <div className="relative w-32 h-32 mb-6">
            <Droplets className="w-32 h-32 text-cyan-400 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-cyan-400">Flood Guard</h1>
          <p className="text-lg text-cyan-300">Stay Informed, Stay Safe</p>
        </div>
      </div>
    </AndroidLayout>
  )
}

