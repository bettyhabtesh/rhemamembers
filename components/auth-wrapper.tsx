"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loading } from "@/components/loading"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated")
      if (authStatus === "true") {
        setIsAuthenticated(true)
      } else if (pathname !== "/login") {
        router.push("/login")
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router, pathname])

  if (isLoading) {
    return <Loading message="Authenticating" />
  }

  if (!isAuthenticated && pathname !== "/login") {
    return <div className="min-h-screen bg-white"></div>
  }

  return <>{children}</>
}
