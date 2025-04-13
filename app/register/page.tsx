"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Droplets, Loader2 } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useUser } from "@/contexts/user-context"
import { getCurrentLocation } from "@/lib/location-service"
import { AndroidLayout } from "@/components/android-layout"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useUser()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [locationPermission, setLocationPermission] = useState(false)
  const [smsPermission, setSmsPermission] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!name || !mobile || !locationPermission || !smsPermission) {
      setError("Please fill all required fields and accept the permissions")
      return
    }

    setIsLoading(true)

    try {
      // Request location permission if checked
      if (locationPermission) {
        const location = await getCurrentLocation()
        if (location.error) {
          console.log("Location permission error:", location.error)
          // We'll continue anyway for demo purposes
        }
      }

      // Register user
      const success = await register({
        name,
        email,
        mobile,
        locationPermission,
        smsPermission,
      })

      if (success) {
        setShowSuccess(true)
      } else {
        setError("Registration failed. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    router.push("/dashboard")
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
            <h1 className="text-xl font-bold text-cyan-400">Register</h1>
          </div>
        </header>

        <main className="flex-1 p-6 flex flex-col items-center justify-center">
          <Card className="w-full max-w-md bg-gray-900 border-cyan-700 shadow-lg shadow-cyan-900/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Create Account</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-200">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 focus:border-cyan-500 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">
                    Email Address (Optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border-gray-700 focus:border-cyan-500 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-gray-200">
                    Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 focus:border-cyan-500 text-white"
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="location"
                      checked={locationPermission}
                      onCheckedChange={(checked) => setLocationPermission(checked as boolean)}
                      className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <Label htmlFor="location" className="text-sm text-gray-200">
                      Allow location access for emergency alerts
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms"
                      checked={smsPermission}
                      onCheckedChange={(checked) => setSmsPermission(checked as boolean)}
                      className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <Label htmlFor="sms" className="text-sm text-gray-200">
                      Allow SMS access for emergency notifications
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700 text-white h-12 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>

        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="bg-gray-900 text-white border border-cyan-700">
            <DialogHeader>
              <DialogTitle className="text-cyan-400">Success!</DialogTitle>
              <DialogDescription className="text-gray-300">
                Your account has been successfully created.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleSuccessClose} className="bg-cyan-600 hover:bg-cyan-700">
                Continue to Dashboard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AndroidLayout>
  )
}

