"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2, User } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { AndroidLayout } from "@/components/android-layout"
import { useEffect } from "react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useUser()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [pincode, setPincode] = useState("")
  const [locationPermission, setLocationPermission] = useState(false)
  const [smsPermission, setSmsPermission] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")


  const token = sessionStorage.getItem('token')
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/profile', {
          headers: {
            'Authorization': `Bearer `+token
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const { success, profile } = await response.json();
        if (success && profile) {
          setName(profile.name || "");
          setEmail(profile.email || "");
          setMobile(profile.phone || "");
          setCity(profile.city || "");
          setState(profile.state || "");
          setPincode(profile.pincode || "");
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        router.push("/home")
        return null
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [user]);

  // if (!user) {
  //   router.push("/home")
  //   return null
  // }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess("")

    // Validation
    if (!name.trim() || !mobile.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setSuccess("All fields except email are required")
      setIsLoading(false)
      return
    }

    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setSuccess("Pincode must be 6 digits")
      setIsLoading(false)
      return
    }

    if (!/^\d{10}$/.test(mobile.replace(/[^0-9]/g, ''))) {
      setSuccess("Please enter a valid 10-digit mobile number")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:5001/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email: user?.email, // Keep existing email
          city,
          pincode,
          state,
          phone: mobile
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(data.message);
        // scroll to top
        window.scrollTo(0, 0)
        // Update session storage with new profile data
        // const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
        // ('user', JSON.stringify({
        //   ...currentUser,
        //   ...data.profile
        // }));
        sessionStorage.setItem('userLocation',data.profile.city??"");
        sessionStorage.setItem('userPincode',data.profile.pincode??"");
        sessionStorage.setItem('userState',data.profile.state??"");
      } else {
        setSuccess(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Failed to update profile:", err)
      setSuccess("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/home")
  }

  return (
    <AndroidLayout>
      <div className="flex flex-col min-h-[calc(100dvh-80px)] bg-gray-950 text-white">
        <header className="p-4 flex items-center border-b border-cyan-900">
          <Link href="/dashboard" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-cyan-400" />
          </Link>
          <div className="flex items-center">
            <User className="w-6 h-6 text-cyan-400 mr-2" />
            <h1 className="text-xl font-bold text-cyan-400">Profile</h1>
          </div>
        </header>

        <main className="flex-1 p-4">
          <Card className="bg-gray-900 border-cyan-900 mb-4">
            <CardHeader>
              <CardTitle className="text-cyan-400">Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-md text-green-200 text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
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
                    Email Address
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

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-200">
                    City
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 focus:border-cyan-500 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-gray-200">
                    State
                  </Label>
                  <Input
                    id="state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 focus:border-cyan-500 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-gray-200">
                    Pincode
                  </Label>
                  <Input
                    id="pincode"
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
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
                  className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700 text-white"
                  disabled={isLoading}
                > 
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-red-900">
            <CardContent className="p-4">
              <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white">
                Logout
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </AndroidLayout>
  )
}

