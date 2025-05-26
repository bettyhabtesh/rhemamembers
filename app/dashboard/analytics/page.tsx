"use client"

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  UserPlus,
  Calendar,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Heart,
  Baby,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Loading } from "@/components/loading"

const COLORS = ["#2C3E50", "#1ABC9C", "#27AE60", "#E74C3C", "#3E5870", "#7F8C8D"]

type AnalyticsData = {
  totalMembers: number
  newMembersThisMonth: number
  newMembersThisYear: number
  totalChildren: number
  ageGroups: Record<string, number>
  educationStats: Record<string, number>
  employmentStats: Record<string, number>
  maritalStats: Record<string, number>
  locationStats: Record<string, number>
  contactStats: {
    withMobile: number
    withEmail: number
    withHomePhone: number
    withCompleteAddress: number
  }
  spiritualStats: {
    withAcceptanceYear: number
    withBaptismYear: number
    withJoinYear: number
    avgYearsSinceAcceptance: number
  }
  growthRate: number
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalMembers: 0,
    newMembersThisMonth: 0,
    newMembersThisYear: 0,
    totalChildren: 0,
    ageGroups: {},
    educationStats: {},
    employmentStats: {},
    maritalStats: {},
    locationStats: {},
    contactStats: { withMobile: 0, withEmail: 0, withHomePhone: 0, withCompleteAddress: 0 },
    spiritualStats: { withAcceptanceYear: 0, withBaptismYear: 0, withJoinYear: 0, avgYearsSinceAcceptance: 0 },
    growthRate: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      // Get all members
      const { data: members, error } = await supabase.from("members").select("*")
      if (error) throw error

      // Get all children
      const { data: children } = await supabase.from("children").select("*")

      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth()
      const startOfMonth = new Date(currentYear, currentMonth, 1)
      const startOfYear = new Date(currentYear, 0, 1)

      // Calculate various statistics
      const totalMembers = members?.length || 0
      const newMembersThisMonth = members?.filter((m) => new Date(m.created_at) >= startOfMonth).length || 0
      const newMembersThisYear = members?.filter((m) => new Date(m.created_at) >= startOfYear).length || 0
      const totalChildren = children?.length || 0

      // Age distribution
      const ageGroups = {
        "0-17": 0,
        "18-30": 0,
        "31-50": 0,
        "51-70": 0,
        "70+": 0,
      }

      members?.forEach((member) => {
        if (member.age) {
          if (member.age <= 17) ageGroups["0-17"]++
          else if (member.age <= 30) ageGroups["18-30"]++
          else if (member.age <= 50) ageGroups["31-50"]++
          else if (member.age <= 70) ageGroups["51-70"]++
          else ageGroups["70+"]++
        }
      })

      // Education distribution
      const educationStats =
        members?.reduce((acc: Record<string, number>, member) => {
          const education = member.education_level || "Not Specified"
          acc[education] = (acc[education] || 0) + 1
          return acc
        }, {}) || {}

      // Employment distribution
      const employmentStats =
        members?.reduce((acc: Record<string, number>, member) => {
          const employment = member.employment_type || "Not Specified"
          acc[employment] = (acc[employment] || 0) + 1
          return acc
        }, {}) || {}

      // Marital status distribution
      const maritalStats =
        members?.reduce((acc: Record<string, number>, member) => {
          const status = member.marital_status || "Not Specified"
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {}) || {}

      // Location distribution (Sub-cities)
      const locationStats =
        members?.reduce((acc: Record<string, number>, member) => {
          const location = member.sub_city || "Not Specified"
          acc[location] = (acc[location] || 0) + 1
          return acc
        }, {}) || {}

      // Contact information completeness
      const contactStats = {
        withMobile: members?.filter((m) => m.mobile_number).length || 0,
        withEmail: members?.filter((m) => m.email).length || 0,
        withHomePhone: members?.filter((m) => m.home_phone).length || 0,
        withCompleteAddress: members?.filter((m) => m.sub_city && m.woreda && m.kebele).length || 0,
      }

      // Spiritual journey statistics
      const spiritualStats = {
        withAcceptanceYear: members?.filter((m) => m.year_accepted_lord).length || 0,
        withBaptismYear: members?.filter((m) => m.year_baptized).length || 0,
        withJoinYear: members?.filter((m) => m.year_joined_church).length || 0,
        avgYearsSinceAcceptance: 0,
      }

      // Calculate average years since acceptance
      const membersWithAcceptance = members?.filter((m) => m.year_accepted_lord) || []
      if (membersWithAcceptance.length > 0) {
        const totalYears = membersWithAcceptance.reduce(
          (sum, m) => sum + (currentYear - (m.year_accepted_lord || 0)),
          0,
        )
        spiritualStats.avgYearsSinceAcceptance = Math.round(totalYears / membersWithAcceptance.length)
      }

      setAnalytics({
        totalMembers,
        newMembersThisMonth,
        newMembersThisYear,
        totalChildren,
        ageGroups,
        educationStats,
        employmentStats,
        maritalStats,
        locationStats,
        contactStats,
        spiritualStats,
        growthRate: totalMembers > 0 ? Math.round((newMembersThisMonth / totalMembers) * 100) : 0,
      })
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Prepare data for charts
  const maritalPieData = Object.entries(analytics.maritalStats).map(([name, value]) => ({ name, value }))
  const agePieData = Object.entries(analytics.ageGroups).map(([name, value]) => ({ name, value }))
  const educationBarData = Object.entries(analytics.educationStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, value]) => ({ name: name.length > 15 ? name.substring(0, 15) + "..." : name, value }))

  const employmentBarData = Object.entries(analytics.employmentStats).map(([name, value]) => ({ name, value }))

  if (isLoading) {
    return <Loading message="Loading analytics" />
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold text-[#2C3E50]">Analytics Dashboard</h1>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 bg-[#F4F6F9]">
        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-[#2C3E50] hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2C3E50]">Total Members</CardTitle>
              <Users className="h-5 w-5 text-[#1ABC9C]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#2C3E50]">{analytics.totalMembers}</div>
              <p className="text-xs text-[#7F8C8D]">Active church members</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#1ABC9C] hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2C3E50]">New This Month</CardTitle>
              <UserPlus className="h-5 w-5 text-[#27AE60]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1ABC9C]">{analytics.newMembersThisMonth}</div>
              <p className="text-xs text-[#7F8C8D]">Members added this month</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#27AE60] hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2C3E50]">Children</CardTitle>
              <Baby className="h-5 w-5 text-[#1ABC9C]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#27AE60]">{analytics.totalChildren}</div>
              <p className="text-xs text-[#7F8C8D]">Total children registered</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#E74C3C] hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2C3E50]">Growth Rate</CardTitle>
              <TrendingUp className="h-5 w-5 text-[#E74C3C]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#E74C3C]">{analytics.growthRate}%</div>
              <p className="text-xs text-[#7F8C8D]">Monthly growth rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Marital Status Pie Chart */}
          <Card className="hover:shadow-lg transition-shadow bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2C3E50]">
                <Heart className="w-5 h-5 text-[#E74C3C]" />
                Marital Status Distribution
              </CardTitle>
              <CardDescription className="text-[#7F8C8D]">Family status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={maritalPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {maritalPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Age Distribution Pie Chart */}
          <Card className="hover:shadow-lg transition-shadow bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2C3E50]">
                <Calendar className="w-5 h-5 text-[#1ABC9C]" />
                Age Distribution
              </CardTitle>
              <CardDescription className="text-[#7F8C8D]">Member age groups breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={agePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {agePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Education Level Bar Chart */}
          <Card className="hover:shadow-lg transition-shadow bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2C3E50]">
                <GraduationCap className="w-5 h-5 text-[#27AE60]" />
                Education Levels
              </CardTitle>
              <CardDescription className="text-[#7F8C8D]">Educational background distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={educationBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#27AE60" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Employment Type Bar Chart */}
          <Card className="hover:shadow-lg transition-shadow bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2C3E50]">
                <Briefcase className="w-5 h-5 text-[#1ABC9C]" />
                Employment Types
              </CardTitle>
              <CardDescription className="text-[#7F8C8D]">Professional background distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={employmentBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1ABC9C" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Contact & Location Analytics */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Information Completeness */}
          <Card className="hover:shadow-lg transition-shadow bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2C3E50]">
                <Phone className="w-5 h-5 text-[#1ABC9C]" />
                Contact Information
              </CardTitle>
              <CardDescription className="text-[#7F8C8D]">Data completeness analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#1ABC9C]" />
                  <span className="text-sm text-[#2C3E50]">Mobile Numbers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#1ABC9C]">{analytics.contactStats.withMobile}</span>
                  <Progress
                    value={
                      analytics.totalMembers > 0
                        ? (analytics.contactStats.withMobile / analytics.totalMembers) * 100
                        : 0
                    }
                    className="w-20 h-2"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#27AE60]" />
                  <span className="text-sm text-[#2C3E50]">Email Addresses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#27AE60]">{analytics.contactStats.withEmail}</span>
                  <Progress
                    value={
                      analytics.totalMembers > 0 ? (analytics.contactStats.withEmail / analytics.totalMembers) * 100 : 0
                    }
                    className="w-20 h-2"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#E74C3C]" />
                  <span className="text-sm text-[#2C3E50]">Complete Address</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#E74C3C]">
                    {analytics.contactStats.withCompleteAddress}
                  </span>
                  <Progress
                    value={
                      analytics.totalMembers > 0
                        ? (analytics.contactStats.withCompleteAddress / analytics.totalMembers) * 100
                        : 0
                    }
                    className="w-20 h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Distribution */}
          <Card className="hover:shadow-lg transition-shadow bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2C3E50]">
                <MapPin className="w-5 h-5 text-[#E74C3C]" />
                Location Distribution
              </CardTitle>
              <CardDescription className="text-[#7F8C8D]">Members by sub-city</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(analytics.locationStats)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([location, count], index) => (
                  <div key={location} className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate flex-1 text-[#2C3E50]">{location}</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          index === 0
                            ? "border-[#27AE60] text-[#27AE60]"
                            : index === 1
                              ? "border-[#1ABC9C] text-[#1ABC9C]"
                              : index === 2
                                ? "border-[#2C3E50] text-[#2C3E50]"
                                : "border-[#7F8C8D] text-[#7F8C8D]"
                        }`}
                      >
                        {count}
                      </Badge>
                      <Progress
                        value={analytics.totalMembers > 0 ? (count / analytics.totalMembers) * 100 : 0}
                        className="w-16 h-2"
                      />
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Spiritual Journey Analytics */}
        <Card className="hover:shadow-lg transition-shadow bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#2C3E50]">
              <Calendar className="w-5 h-5 text-[#1ABC9C]" />
              Spiritual Journey Analytics
            </CardTitle>
            <CardDescription className="text-[#7F8C8D]">Faith journey and church involvement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 bg-[#2C3E50]/5 rounded-lg border border-[#2C3E50]/10">
                <div className="text-2xl font-bold text-[#2C3E50]">{analytics.spiritualStats.withAcceptanceYear}</div>
                <p className="text-sm text-[#7F8C8D]">Have Acceptance Year</p>
              </div>
              <div className="text-center p-4 bg-[#1ABC9C]/5 rounded-lg border border-[#1ABC9C]/10">
                <div className="text-2xl font-bold text-[#1ABC9C]">{analytics.spiritualStats.withBaptismYear}</div>
                <p className="text-sm text-[#7F8C8D]">Have Baptism Year</p>
              </div>
              <div className="text-center p-4 bg-[#27AE60]/5 rounded-lg border border-[#27AE60]/10">
                <div className="text-2xl font-bold text-[#27AE60]">{analytics.spiritualStats.withJoinYear}</div>
                <p className="text-sm text-[#7F8C8D]">Have Join Year</p>
              </div>
              <div className="text-center p-4 bg-[#E74C3C]/5 rounded-lg border border-[#E74C3C]/10">
                <div className="text-2xl font-bold text-[#E74C3C]">
                  {analytics.spiritualStats.avgYearsSinceAcceptance}
                </div>
                <p className="text-sm text-[#7F8C8D]">Avg Years in Faith</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
