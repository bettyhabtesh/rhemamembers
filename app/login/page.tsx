"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signIn } from "@/lib/auth"
import { LogIn, Church } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Check for hardcoded admin credentials
    if (email === "bettynuriye@gmail.com" && password === "bettyinrhemafaith") {
      // Simulate successful login
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userEmail", email)
      router.push("/dashboard")
      return
    }

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError("Invalid email or password")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6F9] p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50]/10 to-[#1ABC9C]/10"></div>
      <Card className="w-full max-w-md relative z-10 shadow-xl border-0 bg-white">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#2C3E50] to-[#1ABC9C] rounded-full flex items-center justify-center shadow-lg">
              <Church className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-[#2C3E50]">Rhema Faith Ministry</CardTitle>
          <CardDescription className="text-lg text-[#7F8C8D] mt-2">Member Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black font-medium bg-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border-gray-300 focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-black font-medium bg-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="border-gray-300 focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                required
              />
            </div>
            {error && (
              <Alert variant="destructive" className="border-[#E74C3C] bg-[#E74C3C]/10">
                <AlertDescription className="text-[#E74C3C]">{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-[#2C3E50] hover:bg-[#3E5870] text-white font-medium py-3 shadow-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
