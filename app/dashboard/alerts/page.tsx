"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, ArrowLeft, Bell, Loader2 } from "lucide-react"
import Link from "next/link"
import { getCurrentLocation, getNearbyAlerts } from "@/lib/location-service"
import { AndroidLayout } from "@/components/android-layout"

export default function AlertsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [alerts, setAlerts] = useState<any[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    const loadAlerts = async () => {
      setIsLoading(true)
      try {
        const location = await getCurrentLocation()

        if (location.error) {
          setError(location.error)
        } else {
          // Get alerts based on location
          const alertsData = getNearbyAlerts(location)
          setAlerts(alertsData)
        }
      } catch (err) {
        console.error("Failed to load alerts:", err)
        setError("Failed to load alerts. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadAlerts()
  }, [])

  return (
    <AndroidLayout>
      <div className="flex flex-col min-h-[calc(100dvh-80px)] bg-gray-950 text-white">
        <header className="p-4 flex items-center border-b border-cyan-900">
          <Link href="/dashboard" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-cyan-400" />
          </Link>
          <div className="flex items-center">
            <Bell className="w-6 h-6 text-cyan-400 mr-2" />
            <h1 className="text-xl font-bold text-cyan-400">Alerts</h1>
          </div>
        </header>

        <main className="flex-1 p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
              <p className="text-cyan-300">Loading alerts...</p>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
              <p className="font-medium">Error loading alerts</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          ) : (
            <Tabs defaultValue="new" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900">
                <TabsTrigger value="new" className="data-[state=active]:bg-cyan-900 data-[state=active]:text-cyan-100">
                  New Alerts
                </TabsTrigger>
                <TabsTrigger value="past" className="data-[state=active]:bg-cyan-900 data-[state=active]:text-cyan-100">
                  Past Alerts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="new" className="mt-4 space-y-4">
                {alerts.map((alert) => (
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
                      <div className="flex justify-between">
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
                        <p className="text-xs text-gray-400">{alert.time}</p>
                      </div>
                      <p
                        className={`text-xs mt-1 ${
                          alert.severity === "high"
                            ? "text-red-300"
                            : alert.severity === "medium"
                              ? "text-amber-300"
                              : "text-cyan-300"
                        }`}
                      >
                        {alert.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">{alert.location}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`h-7 text-xs ${
                            alert.severity === "high"
                              ? "border-red-700 text-red-400 hover:bg-red-900 hover:text-red-300"
                              : alert.severity === "medium"
                                ? "border-amber-700 text-amber-400 hover:bg-amber-900 hover:text-amber-300"
                                : "border-cyan-700 text-cyan-400 hover:bg-cyan-900 hover:text-cyan-300"
                          }`}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="past" className="mt-4 space-y-4">
                <div className="p-3 bg-gray-900 border border-gray-800 rounded-md flex items-start opacity-80">
                  <Bell className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-400">Road Closure</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Main Street Bridge - Closed due to flooding. Use alternate routes.
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">1.8 km away</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-7 text-xs border-gray-700 text-gray-400 hover:bg-gray-800"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-900 border border-gray-800 rounded-md flex items-start opacity-80">
                  <Bell className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-400">Weather Advisory</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      City-wide - Heavy rain expected over the weekend. Prepare accordingly.
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">Your area</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-7 text-xs border-gray-700 text-gray-400 hover:bg-gray-800"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </AndroidLayout>
  )
}

