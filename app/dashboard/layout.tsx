import type React from "react"
import "../globals.css"
import { Inter } from "next/font/google"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthWrapper } from "@/components/auth-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Rhema Faith Ministry - Member Management",
  description: "Church member management system",
    generator: 'Bethelhem Habtamu'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <AuthWrapper>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1">{children}</main>
          </SidebarProvider>
        </AuthWrapper>
  )
}
