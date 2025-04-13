"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CloudRain, Droplets, Umbrella, Wind, Loader2 } from "lucide-react"
import Link from "next/link"
import { getCurrentLocation, getWeatherData } from "@/lib/location-service"
import { AndroidLayout } from "@/components/android-layout"

export default function WeatherPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [weather, setWeather] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadWeather = async () => {
      setIsLoading(true)
      try {
        const location = await getCurrentLocation()

        if (location.error) {
          setError(location.error)
        } else {
          // Get weather data based on location
          const weatherData = getWeatherData(location)
          setWeather(weatherData)
        }
      } catch (err) {
        console.error("Failed to load weather:", err)
        setError("Failed to load weather data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadWeather()
  }, [])

  return (
    <AndroidLayout>
      <div className="flex flex-col min-h-[calc(100dvh-80px)] bg-gray-950 text-white">
        <header className="p-4 flex items-center border-b border-cyan-900">
          <Link href="/dashboard" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-cyan-400" />
          </Link>
          <div className="flex items-center">
            <CloudRain className="w-6 h-6 text-cyan-400 mr-2" />
            <h1 className="text-xl font-bold text-cyan-400">Weather</h1>
          </div>
        </header>

        <main className="flex-1 p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
              <p className="text-cyan-300">Loading weather data...</p>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
              <p className="font-medium">Error loading weather data</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          ) : weather ? (
            <>
              <Card className="bg-gray-900 border-cyan-900 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-medium text-cyan-400">Current Weather</h2>
                      <p className="text-sm text-gray-300">Downtown Area</p>
                    </div>
                    <p className="text-sm text-gray-300">Updated 10 min ago</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold text-white">{weather.current.temp}°C</p>
                      <p className="text-sm text-gray-300">Feels like {weather.current.feelsLike}°C</p>
                      <p className="text-sm mt-1 text-white">{weather.current.condition}</p>
                    </div>
                    <CloudRain className="w-16 h-16 text-cyan-400" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-gray-800">
                    <div className="flex flex-col items-center">
                      <Umbrella className="w-5 h-5 text-cyan-400 mb-1" />
                      <p className="text-xs text-gray-300">Precipitation</p>
                      <p className="text-sm text-white">{weather.current.precipitation}%</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Wind className="w-5 h-5 text-cyan-400 mb-1" />
                      <p className="text-xs text-gray-300">Wind</p>
                      <p className="text-sm text-white">{weather.current.wind} km/h</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Droplets className="w-5 h-5 text-cyan-400 mb-1" />
                      <p className="text-xs text-gray-300">Rainfall</p>
                      <p className="text-sm text-white">{weather.current.rainfall} mm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-lg font-medium text-cyan-400 mb-3">Hourly Forecast</h3>
              <div className="overflow-x-auto pb-2">
                <div className="flex space-x-3 min-w-max">
                  {weather.hourly.map((item: any, index: number) => (
                    <Card key={index} className="bg-gray-900 border-cyan-900 flex-shrink-0 w-20">
                      <CardContent className="p-3 flex flex-col items-center">
                        <p className="text-xs text-gray-300">{item.time}</p>
                        <CloudRain className="w-8 h-8 text-cyan-400 my-2" />
                        <p className="text-sm font-medium text-white">{item.temp}°</p>
                        <p className="text-xs text-cyan-400">{item.precip}%</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <h3 className="text-lg font-medium text-cyan-400 mt-4 mb-3">5-Day Forecast</h3>
              <Card className="bg-gray-900 border-cyan-900">
                <CardContent className="p-0">
                  {weather.daily.map((item: any, index: number, array: any[]) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 ${
                        index !== array.length - 1 ? "border-b border-gray-800" : ""
                      }`}
                    >
                      <p className="text-sm font-medium w-16 text-white">{item.day}</p>
                      <CloudRain className="w-6 h-6 text-cyan-400" />
                      <p className="text-xs text-cyan-400 w-12 text-center">{item.precip}%</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-white">{item.high}°</p>
                        <p className="text-sm text-gray-500">{item.low}°</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : null}
        </main>
      </div>
    </AndroidLayout>
  )
}

