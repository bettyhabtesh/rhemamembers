"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type Child = {
  name: string
  gender: string
  age: string
}

export default function AddMemberPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [children, setChildren] = useState<Child[]>([])

  const addChild = () => {
    setChildren([...children, { name: "", gender: "", age: "" }])
  }

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index))
  }

  const updateChild = (index: number, field: keyof Child, value: string) => {
    const updatedChildren = [...children]
    updatedChildren[index][field] = value
    setChildren(updatedChildren)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Generate registration number
      const registrationNumber = `REG-${Date.now()}`

      // Prepare member data
      const memberData = {
        registration_number: registrationNumber,
        full_name: formData.get("full_name") as string,
        age: formData.get("age") ? Number.parseInt(formData.get("age") as string) : null,
        sub_city: formData.get("sub_city") as string,
        woreda: formData.get("woreda") as string,
        kebele: formData.get("kebele") as string,
        house_number: formData.get("house_number") as string,
        mobile_number: formData.get("mobile_number") as string,
        home_phone: formData.get("home_phone") as string,
        email: formData.get("email") as string,
        education_level: formData.get("education_level") as string,
        employment_type: formData.get("employment_type") as string,
        workplace: formData.get("workplace") as string,
        year_accepted_lord: formData.get("year_accepted_lord")
          ? Number.parseInt(formData.get("year_accepted_lord") as string)
          : null,
        church_accepted_lord: formData.get("church_accepted_lord") as string,
        year_baptized: formData.get("year_baptized") ? Number.parseInt(formData.get("year_baptized") as string) : null,
        year_joined_church: formData.get("year_joined_church")
          ? Number.parseInt(formData.get("year_joined_church") as string)
          : null,
        marital_status: formData.get("marital_status") as string,
        spouse_full_name: formData.get("spouse_full_name") as string,
        date_completed: formData.get("date_completed") as string,
        form_filled_by: formData.get("form_filled_by") as string,
      }

      // Insert member
      const { data: member, error: memberError } = await supabase.from("members").insert(memberData).select().single()

      if (memberError) throw memberError

      // Insert children if any
      if (children.length > 0 && member) {
        const childrenData = children
          .filter((child) => child.name.trim() !== "")
          .map((child) => ({
            member_id: member.id,
            name: child.name,
            gender: child.gender,
            age: child.age ? Number.parseInt(child.age) : null,
          }))

        if (childrenData.length > 0) {
          const { error: childrenError } = await supabase.from("children").insert(childrenData)

          if (childrenError) throw childrenError
        }
      }

      router.push("/members")
    } catch (error) {
      console.error("Error adding member:", error)
      alert("Error adding member. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/members">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Members
          </Link>
        </Button>
        <h1 className="text-xl font-semibold text-[#2C3E50]">Add New Member</h1>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 bg-[#F4F6F9]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card className="bg-white border-l-4 border-l-[#2C3E50]">
            <CardHeader>
              <CardTitle className="text-[#2C3E50]">1. Personal Information</CardTitle>
              <CardDescription className="text-[#7F8C8D]">Basic member information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-[#2C3E50]">
                    Full Name *
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    required
                    className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-[#2C3E50]">
                    Age
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    min="0"
                    max="120"
                    className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sub_city" className="text-[#2C3E50]">
                    Sub-city
                  </Label>
                  <Input
                    id="sub_city"
                    name="sub_city"
                    className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="woreda" className="text-[#2C3E50]">
                    Woreda
                  </Label>
                  <Input
                    id="woreda"
                    name="woreda"
                    className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kebele" className="text-[#2C3E50]">
                    Kebele
                  </Label>
                  <Input
                    id="kebele"
                    name="kebele"
                    className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="house_number" className="text-[#2C3E50]">
                    House No.
                  </Label>
                  <Input
                    id="house_number"
                    name="house_number"
                    className="border-gray-300 bg-white  focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile_number" className="text-[#2C3E50]">
                    Mobile Number
                  </Label>
                  <Input
                    id="mobile_number"
                    name="mobile_number"
                    type="tel"
                    className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="home_phone" className="text-[#2C3E50]">
                    Home Phone
                  </Label>
                  <Input
                    id="home_phone"
                    name="home_phone"
                    type="tel"
                    className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#2C3E50]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education Level */}
          <Card className="bg-white border-l-4 border-l-[#1ABC9C]">
            <CardHeader>
              <CardTitle className="text-[#2C3E50]">2. Education Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="education_level" className="text-[#2C3E50]">
                  Education Level
                </Label>
                <Select name="education_level">
                  <SelectTrigger className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]  text-gray-700 hover:text-black hover:selection:to-black">
                    <SelectValue className="text-black" placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-700 hover:text-black hover:selection:to-black">
                    <SelectItem value="Not Educated">Not Educated</SelectItem>
                    <SelectItem value="Primary Level">Primary Level</SelectItem>
                    <SelectItem value="Secondary Level">Secondary Level</SelectItem>
                    <SelectItem value="Completed Grade 10">Completed Grade 10</SelectItem>
                    <SelectItem value="Completed Grade 12">Completed Grade 12</SelectItem>
                    <SelectItem value="Certificate Holder">Certificate Holder</SelectItem>
                    <SelectItem value="Diploma Holder">Diploma Holder</SelectItem>
                    <SelectItem value="Bachelor's Degree Holder">Bachelor's Degree Holder</SelectItem>
                    <SelectItem value="Master's Degree Holder">Master's Degree Holder</SelectItem>
                    <SelectItem value="Doctorate Holder">Doctorate Holder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Employment */}
          <Card className="bg-white border-l-4 border-l-[#27AE60]">
            <CardHeader>
              <CardTitle className="text-[#2C3E50]">3. Employment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employment_type" className="text-[#2C3E50]">
                  Employment Type
                </Label>
                <Select name="employment_type">
                  <SelectTrigger className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-700 hover:text-black hover:selection:to-black">
                    <SelectItem value="Merchant">Merchant</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                    <SelectItem value="Private Sector">Private Sector</SelectItem>
                    <SelectItem value="NGO">NGO</SelectItem>
                    <SelectItem value="Government Employee">Government Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workplace" className="text-[#2C3E50]">
                  Workplace
                </Label>
                <Input
                  id="workplace"
                  name="workplace"
                  className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Spiritual Status */}
          <Card className="bg-white border-l-4 border-l-[#1ABC9C]">
            <CardHeader>
              <CardTitle className="text-[#2C3E50]">4. Spiritual Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year_accepted_lord" className="text-[#2C3E50]">
                    Year Accepted the Lord
                  </Label>
                  <Input
                    id="year_accepted_lord"
                    name="year_accepted_lord"
                    type="number"
                    min="1900"
                    max="2024"
                    className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year_baptized" className="text-[#2C3E50]">
                    Year Baptized in Water
                  </Label>
                  <Input
                    id="year_baptized"
                    name="year_baptized"
                    type="number"
                    min="1900"
                    max="2024"
                    className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="church_accepted_lord" className="text-[#2C3E50]">
                    Church Where You Accepted the Lord
                  </Label>
                  <Input
                    id="church_accepted_lord"
                    name="church_accepted_lord"
                    className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year_joined_church" className="text-[#2C3E50]">
                    Year You Joined This Church
                  </Label>
                  <Input
                    id="year_joined_church"
                    name="year_joined_church"
                    type="number"
                    min="1900"
                    max="2024"
                    className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Marital Status */}
          <Card className="bg-white border-l-4 border-l-[#E74C3C]">
            <CardHeader>
              <CardTitle className="text-[#2C3E50]">5. Marital Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="marital_status" className="text-[#2C3E50]">
                  Marital Status
                </Label>
                <Select name="marital_status">
                  <SelectTrigger className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]">
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-700 hover:text-black hover:selection:to-black">
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Separated">Separated (without court decision)</SelectItem>
                    <SelectItem value="Divorced">Divorced (with court decision)</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="spouse_full_name" className="text-[#2C3E50]">
                  Spouse's Full Name
                </Label>
                <Input
                  id="spouse_full_name"
                  name="spouse_full_name"
                  className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Children Information */}
          <Card className="bg-white border-l-4 border-l-[#3E5870]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#2C3E50]">6. Children's Information</CardTitle>
                  <CardDescription className="text-[#7F8C8D]">Add information about children</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addChild}
                  className="border-[#1ABC9C] text-[#1ABC9C] hover:bg-[#1ABC9C] hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Child
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {children.length === 0 ? (
                <p className="text-[#7F8C8D] text-center py-4">No children added yet</p>
              ) : (
                <div className="space-y-4">
                  {children.map((child, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg bg-[#F4F6F9]"
                    >
                      <div className="space-y-2">
                        <Label className="text-[#2C3E50]">Name</Label>
                        <Input
                          value={child.name}
                          onChange={(e) => updateChild(index, "name", e.target.value)}
                          placeholder="Child's name"
                          className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[#2C3E50]">Gender</Label>
                        <Select value={child.gender} onValueChange={(value) => updateChild(index, "gender", value)}>
                          <SelectTrigger className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-gray-700 hover:text-black hover:selection:to-black" >
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[#2C3E50]">Age</Label>
                        <Input
                          type="number"
                          min="0"
                          max="30"
                          value={child.age}
                          onChange={(e) => updateChild(index, "age", e.target.value)}
                          placeholder="Age"
                          className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeChild(index)}
                          className="text-[#E74C3C] border-[#E74C3C] hover:bg-[#E74C3C] hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Completion */}
          <Card className="bg-white border-l-4 border-l-[#7F8C8D]">
            <CardHeader>
              <CardTitle className="text-[#2C3E50]">7. Form Completion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_completed" className="text-[#2C3E50]">
                    Date Completed
                  </Label>
                  <Input
                    id="date_completed"
                    name="date_completed"
                    type="date"
                    className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="form_filled_by" className="text-[#2C3E50]">
                    Name of Person Who Filled the Form
                  </Label>
                  <Input
                    id="form_filled_by"
                    name="form_filled_by"
                    className="border-gray-300 bg-white focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              asChild
              className="border-[#7F8C8D] text-[#7F8C8D] hover:bg-[#7F8C8D] hover:text-white"
            >
              <Link href="/members">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#2C3E50] hover:bg-[#3E5870] text-white">
              {isSubmitting ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Member
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </SidebarInset>
  )
}
