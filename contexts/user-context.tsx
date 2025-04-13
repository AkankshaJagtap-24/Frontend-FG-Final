"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

interface User {
  id: string
  name: string
  email?: string
  mobile: string
  locationPermission: boolean
  smsPermission: boolean
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  login: (name: string, mobile: string) => Promise<boolean>
  register: (userData: Omit<User, "id">) => Promise<boolean>
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("floodGuardUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (name: string, mobile: string): Promise<boolean> => {
    // In a real app, this would validate credentials with a backend
    // For demo purposes, we'll simulate a successful login if fields are provided
    if (!name || !mobile) return false

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create mock user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      mobile,
      locationPermission: true,
      smsPermission: true,
    }

    setUser(newUser)
    localStorage.setItem("floodGuardUser", JSON.stringify(newUser))
    return true
  }

  const register = async (userData: Omit<User, "id">): Promise<boolean> => {
    // In a real app, this would send registration data to a backend
    // For demo purposes, we'll simulate a successful registration
    if (!userData.name || !userData.mobile) return false

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...userData,
    }

    setUser(newUser)
    localStorage.setItem("floodGuardUser", JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("floodGuardUser")
  }

  return <UserContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

