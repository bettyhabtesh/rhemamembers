"use client"

import { Users, BarChart3, UserPlus, Home, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Members",
    url: "/members",
    icon: Users,
  },
  {
    title: "Add Member",
    url: "/members/add",
    icon: UserPlus,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
]

export function AppSidebar() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    router.push("/login")
  }

  return (
    <Sidebar className="border-r border-gray-200 bg-[#34495E]">
      <SidebarHeader className="p-6 bg-[#2C3E50]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1ABC9C] to-[#27AE60] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <h2 className="font-bold text-xl text-white">Rhema Faith</h2>
            <p className="text-sm text-[#7F8C8D]">Member Management</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-[#34495E]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#7F8C8D] font-semibold">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-[#1ABC9C] hover:text-white transition-all duration-200"
                    >
                      <item.icon className="w-5 h-5 text-[#1ABC9C] group-hover:text-white transition-colors" />
                      <span className="font-medium group-hover:text-white">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 bg-[#2C3E50]">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full text-[#E74C3C] border-[#E74C3C] bg-white hover:bg-[#E74C3C] hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
