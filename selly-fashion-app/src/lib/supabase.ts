import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Brand {
  id: string
  name: string
  slug: string
  description: string
  logo_text: string
  style: string
  created_at: string
}

export interface ClothingType {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  image_url: string
  subcategories: string[]
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image_url: string
  brand_id: string
  clothing_type_id: string
  is_featured: boolean
  is_new_arrival: boolean
  created_at: string
}
