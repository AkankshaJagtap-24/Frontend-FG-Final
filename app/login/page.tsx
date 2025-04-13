"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Droplets, Loader2 } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/contexts/user-context"
import { AndroidLayout } from "@/components/android-layout"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useUser()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!email || !password) {
      setError("Please enter your email and password")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      // Check if login was successful
      console.log(data)
      if (data.success) {
        // Store data in session storage
        sessionStorage.setItem('token', data.token)
        sessionStorage.setItem('user', JSON.stringify(data.user))

        // Update user context
        const success = await login(data.user.name, data.user.email)

        if (success) {
          router.push("/dashboard")
        } else {
          setError("Login failed. Please try again.")
        }
      } else {
        console.log(data)
        setError("Invalid email or password.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AndroidLayout hideNav>
      <div className="flex flex-col min-h-[calc(100dvh-32px)] bg-gray-950 text-white">
        <header className="p-4 flex items-center border-b border-cyan-900">
          <Link href="/home" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-cyan-400" />
          </Link>
          <div className="flex items-center">
            <Droplets className="w-6 h-6 text-cyan-400 mr-2" />
            <h1 className="text-xl font-bold text-cyan-400">Login</h1>
          </div>
        </header>

        <main className="flex-1 p-6 flex flex-col items-center justify-center">
          <Card className="w-full max-w-md bg-gray-900 border-cyan-700 shadow-lg shadow-cyan-900/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Account Login</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 focus:border-cyan-500 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 focus:border-cyan-500 text-white"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700 text-white h-12 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </AndroidLayout>
  )
}

