"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, AlertTriangle, Loader2, MapPin } from "lucide-react"
import Link from "next/link"
import { getCurrentLocation, type LocationData } from "@/lib/location-service"
import { AndroidLayout } from "@/components/android-layout"

export default function EmergencyPage() {
  const router = useRouter()
  const [mobile, setMobile] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isLocating, setIsLocating] = useState(true)

  useEffect(() => {
    const getLocation = async () => {
      try {
        setIsLocating(true)
        const locationData = await getCurrentLocation()
        setLocation(locationData)
        if (locationData.error) {
          setError(`Location error: ${locationData.error}. Please enter your location manually.`)
        }
      } catch (err) {
        console.error("Failed to get location:", err)
        setError("Failed to get your location. Please enter your location manually.")
      } finally {
        setIsLocating(false)
      }
    }

    getLocation()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!mobile) {
      setError("Please enter your mobile number")
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would send the emergency data to a backend
      // For demo purposes, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Navigate to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("Failed to process emergency request. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AndroidLayout hideNav>
      <div className="flex flex-col min-h-[calc(100dvh-32px)] bg-gray-950 text-white">
        <header className="p-4 flex items-center border-b border-red-900 bg-red-950">
          <Link href="/home" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-red-400" />
          </Link>
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-400 mr-2" />
            <h1 className="text-xl font-bold text-red-400">Emergency Access</h1>
          </div>
        </header>

        <main className="flex-1 p-6 flex flex-col items-center justify-center">
          <Card className="w-full max-w-md bg-gray-900 border-red-700 shadow-lg shadow-red-900/20">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Emergency Dashboard Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
                  {error}
                </div>
              )}

              {location && !location.error && (
                <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-md text-green-200 text-sm flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Location detected</p>
                    <p className="text-xs mt-1">
                      Lat: {location.latitude?.toFixed(6)}, Lng: {location.longitude?.toFixed(6)}
                      {location.accuracy && ` (Accuracy: ±${Math.round(location.accuracy)}m)`}
                    </p>
                  </div>
                </div>
              )}

              {isLocating && (
                <div className="mb-4 p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-300 text-sm flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Detecting your location...
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-gray-200">
                    Mobile Number for Alerts
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 focus:border-red-500 text-white"
                  />
                </div>

                <p className="text-sm text-gray-300">
                  Enter your mobile number to receive emergency alerts and access the dashboard.
                </p>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white h-12 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Access Emergency Dashboard"
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

