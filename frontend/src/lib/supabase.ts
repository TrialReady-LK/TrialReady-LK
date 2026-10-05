import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://mjtlinqmoeyikmbkfnkr.supabase.co'

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qdGxpbnFtb2V5aWttYmtmbmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwOTkyMDAsImV4cCI6MjAzODY3NTIwMH0.demo_anon_key'

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
)