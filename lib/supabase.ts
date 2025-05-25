import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing or undefined!")
}

console.log("Supabase initialized with URL:", supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Member = {
  id: string
  registration_number: string | null
  photo_url: string | null
  full_name: string
  age: number | null
  sub_city: string | null
  woreda: string | null
  kebele: string | null
  house_number: string | null
  mobile_number: string | null
  home_phone: string | null
  email: string | null
  education_level: string | null
  employment_type: string | null
  workplace: string | null
  year_accepted_lord: number | null
  church_accepted_lord: string | null
  year_baptized: number | null
  year_joined_church: number | null
  marital_status: string | null
  spouse_full_name: string | null
  date_completed: string | null
  form_filled_by: string | null
  created_at: string
  updated_at: string
}

export type Child = {
  id: string
  member_id: string
  name: string | null
  gender: string | null
  age: number | null
  created_at: string
}
