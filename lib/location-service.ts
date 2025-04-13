"use client"

export interface LocationData {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  timestamp: number | null
  error?: string
}

export async function getCurrentLocation(): Promise<LocationData> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        latitude: null,
        longitude: null,
        accuracy: null,
        timestamp: null,
        error: "Geolocation is not supported by your browser",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        })
      },
      (error) => {
        let errorMessage = "Unknown error occurred"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for geolocation"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out"
            break
        }

        resolve({
          latitude: null,
          longitude: null,
          accuracy: null,
          timestamp: null,
          error: errorMessage,
        })
      },
    )
  })
}

// Mock function to get nearby flood alerts based on location
export function getNearbyAlerts(location: LocationData) {
  // In a real app, this would call an API with the location data
  // For demo purposes, we'll return mock data
  return [
    {
      id: "alert-1",
      type: "evacuation",
      severity: "high",
      title: "Evacuation Notice",
      description: "Riverside community - Water levels rising rapidly. Immediate evacuation recommended.",
      location: "2.5 km away",
      time: "10 min ago",
    },
    {
      id: "alert-2",
      type: "warning",
      severity: "medium",
      title: "Flood Warning",
      description: "Downtown area - Heavy rainfall expected to continue for the next 6 hours. Avoid low-lying areas.",
      location: "1.2 km away",
      time: "25 min ago",
    },
    {
      id: "alert-3",
      type: "info",
      severity: "low",
      title: "Weather Alert",
      description: "City-wide - Thunderstorms expected tonight with potential for flash flooding in low-lying areas.",
      location: "Your area",
      time: "1 hour ago",
    },
  ]
}

// Mock function to get weather data based on location
export function getWeatherData(location: LocationData) {
  // In a real app, this would call a weather API with the location data
  return {
    current: {
      temp: 23,
      feelsLike: 25,
      condition: "Heavy Rain",
      humidity: 85,
      wind: 18,
      rainfall: 32,
      precipitation: 85,
    },
    hourly: [
      { time: "Now", temp: 23, icon: "CloudRain", precip: 85 },
      { time: "1 PM", temp: 22, icon: "CloudRain", precip: 90 },
      { time: "2 PM", temp: 22, icon: "CloudRain", precip: 80 },
      { time: "3 PM", temp: 21, icon: "CloudRain", precip: 75 },
      { time: "4 PM", temp: 21, icon: "CloudRain", precip: 65 },
      { time: "5 PM", temp: 20, icon: "CloudRain", precip: 60 },
      { time: "6 PM", temp: 19, icon: "CloudRain", precip: 50 },
      { time: "7 PM", temp: 19, icon: "CloudRain", precip: 40 },
    ],
    daily: [
      { day: "Today", high: 23, low: 19, icon: "CloudRain", precip: 85 },
      { day: "Thu", high: 22, low: 18, icon: "CloudRain", precip: 70 },
      { day: "Fri", high: 24, low: 19, icon: "CloudRain", precip: 60 },
      { day: "Sat", high: 25, low: 20, icon: "CloudRain", precip: 40 },
      { day: "Sun", high: 26, low: 21, icon: "CloudRain", precip: 20 },
    ],
  }
}

