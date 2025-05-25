import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Users, UserPlus, Calendar, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabaseServer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function getDashboardStats() {
  try {
    // Get total members
    const { count: totalMembers } = await supabase.from("members").select("*", { count: "exact", head: true })

    // Get members added this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: newMembersThisMonth } = await supabase
      .from("members")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString())

    // Get members by marital status
    const { data: maritalStatusData } = await supabase
      .from("members")
      .select("marital_status")
      .not("marital_status", "is", null)

    // Get members by education level
    const { data: educationData } = await supabase
      .from("members")
      .select("education_level")
      .not("education_level", "is", null)

    return {
      totalMembers: totalMembers || 0,
      newMembersThisMonth: newMembersThisMonth || 0,
      maritalStatusData: maritalStatusData || [],
      educationData: educationData || [],
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalMembers: 0,
      newMembersThisMonth: 0,
      maritalStatusData: [],
      educationData: [],
    }
  }
}

export default async function Dashboard() {
  const stats = await getDashboardStats()

  const maritalStatusCounts = stats.maritalStatusData.reduce((acc: Record<string, number>, member) => {
    const status = member.marital_status || "Unknown"
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const educationCounts = stats.educationData.reduce((acc: Record<string, number>, member) => {
    const education = member.education_level || "Unknown"
    acc[education] = (acc[education] || 0) + 1
    return acc
  }, {})

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold text-[#2C3E50]">Dashboard</h1>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 bg-[#F4F6F9]">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-[#2C3E50] hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2C3E50]">Total Members</CardTitle>
              <Users className="h-5 w-5 text-[#1ABC9C]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#2C3E50]">{stats.totalMembers}</div>
              <p className="text-xs text-[#7F8C8D]">Active church members</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#1ABC9C] hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2C3E50]">New This Month</CardTitle>
              <UserPlus className="h-5 w-5 text-[#27AE60]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1ABC9C]">{stats.newMembersThisMonth}</div>
              <p className="text-xs text-[#7F8C8D]">Members added this month</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#27AE60] hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2C3E50]">Married Members</CardTitle>
              <Calendar className="h-5 w-5 text-[#1ABC9C]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#27AE60]">{maritalStatusCounts["Married"] || 0}</div>
              <p className="text-xs text-[#7F8C8D]">Currently married</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#E74C3C] hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2C3E50]">Growth Rate</CardTitle>
              <TrendingUp className="h-5 w-5 text-[#E74C3C]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#E74C3C]">
                {stats.totalMembers > 0 ? Math.round((stats.newMembersThisMonth / stats.totalMembers) * 100) : 0}%
              </div>
              <p className="text-xs text-[#7F8C8D]">Monthly growth rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Snippets */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-[#2C3E50] hover:shadow-lg transition-shadow bg-white">
            <CardHeader>
              <CardTitle className="text-[#2C3E50]">Marital Status Distribution</CardTitle>
              <CardDescription className="text-[#7F8C8D]">Breakdown of members by marital status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(maritalStatusCounts)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 4)
                  .map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#2C3E50]">{status}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#1ABC9C]">{count}</span>
                        <div className="w-20 bg-[#F4F6F9] rounded-full h-3">
                          <div
                            className="bg-[#1ABC9C] h-3 rounded-full transition-all duration-500"
                            style={{ width: `${stats.totalMembers > 0 ? (count / stats.totalMembers) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#1ABC9C] hover:shadow-lg transition-shadow bg-white">
            <CardHeader>
              <CardTitle className="text-[#2C3E50]">Education Level Distribution</CardTitle>
              <CardDescription className="text-[#7F8C8D]">Breakdown of members by education level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(educationCounts)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 4)
                  .map(([education, count]) => (
                    <div key={education} className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate flex-1 mr-3 text-[#2C3E50]">{education}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#27AE60]">{count}</span>
                        <div className="w-20 bg-[#F4F6F9] rounded-full h-3">
                          <div
                            className="bg-[#27AE60] h-3 rounded-full transition-all duration-500"
                            style={{ width: `${stats.totalMembers > 0 ? (count / stats.totalMembers) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-l-4 border-l-[#27AE60] hover:shadow-lg transition-shadow bg-white">
          <CardHeader>
            <CardTitle className="text-[#2C3E50]">Quick Actions</CardTitle>
            <CardDescription className="text-[#7F8C8D]">Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button asChild className="bg-[#2C3E50] hover:bg-[#3E5870] text-white">
                <Link href="/members/add">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Member
                </Link>
              </Button>
              <Button asChild className="bg-[#1ABC9C] hover:bg-[#16A085] text-white">
                <Link href="/members">
                  <Users className="w-4 h-4 mr-2" />
                  View All Members
                </Link>
              </Button>
              <Button asChild className="bg-[#27AE60] hover:bg-[#229954] text-white">
                <Link href="/analytics">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
