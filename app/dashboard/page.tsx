"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Bell, CloudRain, Droplets, MapPin, MessageSquare, Phone, Loader2 } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { getCurrentLocation, getNearbyAlerts, getWeatherData } from "@/lib/location-service"
import { AndroidLayout } from "@/components/android-layout"

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useUser()
  const [showSosConfirm, setShowSosConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [locationError, setLocationError] = useState("")
  const [alerts, setAlerts] = useState<any[]>([])
  const [weather, setWeather] = useState<any>(null)
  const [isSendingSos, setIsSendingSos] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/home")
      return
    }

    const loadData = async () => {
      setIsLoading(true)
      try {
        const location = await getCurrentLocation()

        if (location.error) {
          setLocationError(location.error)
        } else {
          // Get alerts and weather based on location
          const alertsData = getNearbyAlerts(location)
          const weatherData = getWeatherData(location)

          setAlerts(alertsData)
          setWeather(weatherData)
        }
      } catch (err) {
        console.error("Failed to load data:", err)
        setLocationError("Failed to get location data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user, router])

  const handleSendSos = async () => {
    setIsSendingSos(true)
    try {
      // Get current location
      const location = await getCurrentLocation()
      
      // Get JWT token from session storage
      const token = sessionStorage.getItem('token')
      const user = JSON.parse(sessionStorage.getItem('user') || '{}')

      if (!token) {
        throw new Error('Authentication token not found')
      }

      // Prepare the request body
      const sosData = {
        userId: user.id,
        location: "HOME",
        log: location.longitude || "",
        lat: location.latitude || "",
        city: location.city || "",
        description: "Emergency SOS alert"
      }

      // Send SOS request to the API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sos_hit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sosData)
      })

      const data = await response.json()

      if (data.success) {
        alert("SOS sent successfully! Emergency services have been notified of your location.")
      } else {
        throw new Error(data.message || 'Failed to send SOS')
      }
    } catch (err) {
      console.error("Failed to send SOS:", err)
      alert("Failed to send SOS. Please try again or call emergency services directly.")
    } finally {
      setIsSendingSos(false)
      setShowSosConfirm(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/home")
  }

  if (isLoading) {
    return (
      <AndroidLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-80px)]">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
          <p className="text-cyan-300">Loading dashboard...</p>
        </div>
      </AndroidLayout>
    )
  }

  return (
    <AndroidLayout>
      <div className="flex flex-col min-h-[calc(100dvh-80px)] bg-gray-950 text-white">
        <header className="p-4 flex items-center justify-between border-b border-cyan-900">
          <div className="flex items-center">
            <Droplets className="w-6 h-6 text-cyan-400 mr-2" />
            <h1 className="text-xl font-bold text-cyan-400">Flood Guard</h1>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-cyan-400">
                <Avatar className="h-8 w-8 bg-cyan-800">
                  <AvatarFallback className="text-cyan-100">
                    {user?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gray-900 text-white border-l border-cyan-900">
              <SheetHeader>
                <SheetTitle className="text-cyan-400">Menu</SheetTitle>
              </SheetHeader>
              <div className="py-6">
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-800">
                  <Avatar className="h-12 w-12 bg-cyan-800">
                    <AvatarFallback className="text-cyan-100">
                      {user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.mobile}</p>
                  </div>
                </div>

                <nav className="space-y-4">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400"
                  >
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400"
                  >
                    <span>Settings</span>
                  </Link>
                  <button
                    className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 w-full text-left"
                    onClick={handleLogout}
                  >
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4">
          {locationError && (
            <div className="mb-4 p-3 bg-amber-900/50 border border-amber-700 rounded-md text-amber-200 text-sm">
              <p className="font-medium">Location access issue</p>
              <p className="text-xs mt-1">{locationError}</p>
              <p className="text-xs mt-1">Some features may not work correctly without location access.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Link href="/dashboard/alerts">
              <Card className="bg-gray-900 border-cyan-900 hover:bg-gray-800 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Bell className="w-8 h-8 text-cyan-400 mb-2" />
                  <h3 className="text-sm font-medium text-gray-200">Alerts</h3>
                </CardContent>
              </Card>
            </Link>

            <Button
              className="bg-red-900 hover:bg-red-800 border border-red-700 h-auto py-4 flex flex-col items-center"
              onClick={() => setShowSosConfirm(true)}
            >
              <Phone className="w-8 h-8 text-red-400 mb-2" />
              <h3 className="text-sm font-medium text-gray-200">SOS</h3>
            </Button>

            <Link href="/dashboard/weather">
              <Card className="bg-gray-900 border-cyan-900 hover:bg-gray-800 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <CloudRain className="w-8 h-8 text-cyan-400 mb-2" />
                  <h3 className="text-sm font-medium text-gray-200">Weather</h3>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/forum">
              <Card className="bg-gray-900 border-cyan-900 hover:bg-gray-800 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <MessageSquare className="w-8 h-8 text-cyan-400 mb-2" />
                  <h3 className="text-sm font-medium text-gray-200">Forum</h3>
                </CardContent>
              </Card>
            </Link>
          </div>

          <Card className="bg-gray-900 border-cyan-900 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-cyan-400 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" /> Location Alerts
                </h3>
              </div>
              <div className="space-y-2">
                {alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                    <div
                      key={alert.id}
                      className={`p-3 ${
                        alert.severity === "high"
                          ? "bg-red-950 border border-red-900"
                          : alert.severity === "medium"
                            ? "bg-amber-950 border border-amber-900"
                            : "bg-cyan-950 border border-cyan-900"
                      } rounded-md flex items-start`}
                    >
                      <AlertTriangle
                        className={`w-5 h-5 ${
                          alert.severity === "high"
                            ? "text-red-500"
                            : alert.severity === "medium"
                              ? "text-amber-500"
                              : "text-cyan-500"
                        } mr-2 flex-shrink-0 mt-0.5`}
                      />
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            alert.severity === "high"
                              ? "text-red-400"
                              : alert.severity === "medium"
                                ? "text-amber-400"
                                : "text-cyan-400"
                          }`}
                        >
                          {alert.title}
                        </p>
                        <p
                          className={`text-xs ${
                            alert.severity === "high"
                              ? "text-red-300"
                              : alert.severity === "medium"
                                ? "text-amber-300"
                                : "text-cyan-300"
                          }`}
                        >
                          {alert.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No alerts in your area at this time.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {weather && (
            <Card className="bg-gray-900 border-cyan-900">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-cyan-400 flex items-center">
                    <CloudRain className="w-4 h-4 mr-1" /> Weather Update
                  </h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-white">{weather.current.temp}°C</p>
                    <p className="text-xs text-gray-300">{weather.current.condition}</p>
                  </div>
                  <CloudRain className="w-10 h-10 text-cyan-400" />
                </div>
                <div className="mt-2 pt-2 border-t border-gray-800 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="text-gray-400">Humidity</p>
                    <p className="text-gray-200">{weather.current.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Wind</p>
                    <p className="text-gray-200">{weather.current.wind} km/h</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Rainfall</p>
                    <p className="text-gray-200">{weather.current.rainfall} mm</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>

        {showSosConfirm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-sm bg-gray-900 border-red-700">
              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-4">
                  <AlertTriangle className="w-12 h-12 text-red-500 mb-2" />
                  <h2 className="text-xl font-bold text-red-400">Send SOS Alert?</h2>
                  <p className="text-sm text-gray-300 text-center mt-2">
                    This will send your current location to emergency services.
                  </p>
                </div>

                <div className="flex flex-col space-y-3">
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white h-12"
                    onClick={handleSendSos}
                    disabled={isSendingSos}
                  >
                    {isSendingSos ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending SOS...
                      </>
                    ) : (
                      "Send SOS"
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => setShowSosConfirm(false)}
                    disabled={isSendingSos}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AndroidLayout>
  )
}

