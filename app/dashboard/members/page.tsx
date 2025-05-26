"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search, Plus, Phone, Mail, Users, Trash2, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { supabase } from '@/lib/supabaseClient' 
import type { Member } from '@/lib/types'
import { Loading } from "@/components/loading"

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  useEffect(() => {
    filterMembers()
  }, [searchTerm, members])

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterMembers = () => {
    if (!searchTerm.trim()) {
      setFilteredMembers(members)
      return
    }

    const filtered = members.filter(
      (member) =>
        member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.mobile_number && member.mobile_number.includes(searchTerm)) ||
        (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (member.registration_number && member.registration_number.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredMembers(filtered)
  }

  const handleDeleteMember = async (memberId: string) => {
    setDeletingMemberId(memberId)
    try {
      // First delete children records
      const { error: childrenError } = await supabase.from("children").delete().eq("member_id", memberId)

      if (childrenError) throw childrenError

      // Then delete the member
      const { error: memberError } = await supabase.from("members").delete().eq("id", memberId)

      if (memberError) throw memberError

      // Update local state
      setMembers(members.filter((member) => member.id !== memberId))
      setFilteredMembers(filteredMembers.filter((member) => member.id !== memberId))
    } catch (error) {
      console.error("Error deleting member:", error)
      alert("Error deleting member. Please try again.")
    } finally {
      setDeletingMemberId(null)
    }
  }

  if (isLoading) {
    return <Loading message="Loading members" />
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold text-[#2C3E50]">Members</h1>
        <div className="ml-auto">
          <Button asChild className="bg-[#2C3E50] hover:bg-[#3E5870] text-white">
            <Link href="/dashboard/members/add">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 bg-[#F4F6F9]">
        {/* Search and Filters */}
        <Card className="border-l-4 border-l-[#1ABC9C] hover:shadow-lg transition-shadow bg-white">
          <CardContent className="pt-6">
            <div className="flex gap-4 bg-white">
              <div className="relative flex-1 bg-white ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1ABC9C] bg-white w-4 h-4" />
               <Input
  placeholder="Search members by name, phone, email, or registration number..."
  className="pl-10 bg-white border-gray-300 focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

              </div>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                  className="border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white"
                >
                  Clear
                </Button>
              )}
            </div>
            {searchTerm && (
              <p className="text-sm text-[#7F8C8D] mt-2">
                Found {filteredMembers.length} member(s) matching "{searchTerm}"
              </p>
            )}
          </CardContent>
        </Card>

        {/* Members Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-[#2C3E50] bg-white"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-[#2C3E50]">{member.full_name}</CardTitle>
                    <CardDescription>
                      {member.registration_number && (
                        <span className="text-xs bg-[#1ABC9C]/10 text-[#1ABC9C] px-2 py-1 rounded border border-[#1ABC9C]/20">
                          Reg: {member.registration_number}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.age && (
                      <Badge variant="secondary" className="bg-[#3E5870]/10 text-[#3E5870] border border-[#3E5870]/20">
                        {member.age} years
                      </Badge>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4 text-[#7F8C8D]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border border-gray-200">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-[#E74C3C] focus:text-[#E74C3C] focus:bg-[#E74C3C]/10 cursor-pointer"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Member
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-[#2C3E50]">Delete Member</AlertDialogTitle>
                              <AlertDialogDescription className="text-[#7F8C8D]">
                                Are you sure you want to delete <strong>{member.full_name}</strong>? This action cannot
                                be undone and will also delete all associated children records.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-300 text-[#7F8C8D] hover:bg-gray-50">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteMember(member.id)}
                                disabled={deletingMemberId === member.id}
                                className="bg-[#E74C3C] hover:bg-[#C0392B] text-white"
                              >
                                {deletingMemberId === member.id ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {member.mobile_number && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-[#1ABC9C]" />
                      <span className="text-[#2C3E50]">{member.mobile_number}</span>
                    </div>
                  )}
                  {member.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-[#27AE60]" />
                      <span className="truncate text-[#2C3E50]">{member.email}</span>
                    </div>
                  )}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {member.marital_status && (
                      <Badge variant="outline" className="text-xs border-[#1ABC9C]/30 text-[#1ABC9C]">
                        {member.marital_status}
                      </Badge>
                    )}
                    {member.education_level && (
                      <Badge variant="outline" className="text-xs border-[#27AE60]/30 text-[#27AE60]">
                        {member.education_level}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-[#7F8C8D] mt-3 pt-3 border-t border-gray-100">
                    Joined: {new Date(member.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && !isLoading && (
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-[#7F8C8D] mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2 text-[#2C3E50]">
                  {searchTerm ? "No members found" : "No members yet"}
                </h3>
                <p className="text-[#7F8C8D] mb-4">
                  {searchTerm
                    ? `No members match your search for "${searchTerm}"`
                    : "Get started by adding your first member."}
                </p>
                {!searchTerm && (
                  <Button asChild className="bg-[#2C3E50] hover:bg-[#3E5870] text-white">
                    <Link href="/members/add">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Member
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </SidebarInset>
  )
}
