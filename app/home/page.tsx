"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Droplets } from "lucide-react"
import Link from "next/link"
import { AndroidLayout } from "@/components/android-layout"

export default function HomePage() {
  return (
    <AndroidLayout hideNav>
      <div className="flex flex-col min-h-[calc(100dvh-32px)] bg-gray-950 text-white">
        <header className="p-4 flex items-center justify-center border-b border-cyan-900">
          <div className="flex items-center">
            <Droplets className="w-8 h-8 text-cyan-400 mr-2" />
            <h1 className="text-2xl font-bold text-cyan-400">Flood Guard</h1>
          </div>
        </header>

        <main className="flex-1 p-6 flex flex-col items-center justify-center">
          <Card className="w-full max-w-md bg-gray-900 border-cyan-700 shadow-lg shadow-cyan-900/20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-8">
                <Droplets className="w-20 h-20 text-cyan-400 mb-4" />
                <h2 className="text-2xl font-bold text-cyan-400 mb-1">Welcome to Flood Guard</h2>
                <p className="text-gray-300 text-center">Real-time flood alerts and emergency information</p>
              </div>

              <div className="space-y-4">
                <Link href="/register" className="w-full">
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-lg py-6">
                    Register
                  </Button>
                </Link>

                <Link href="/login" className="w-full">
                  <Button className="w-full bg-gray-800 hover:bg-gray-700 border border-cyan-700 text-cyan-400 font-medium text-lg py-6">
                    Login
                  </Button>
                </Link>

                <Link href="/emergency" className="w-full">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium text-lg py-6">
                    Emergency
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>

        <footer className="p-4 text-center text-gray-400 text-sm border-t border-gray-900">
          <p>© {new Date().getFullYear()} Flood Guard. All rights reserved.</p>
        </footer>
      </div>
    </AndroidLayout>
  )
}

