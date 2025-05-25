// lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Server Supabase env variables are missing.")
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey)
