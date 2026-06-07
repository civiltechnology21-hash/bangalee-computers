import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
      }
      inquiries: {
        Row: Inquiry
        Insert: Omit<Inquiry, 'id' | 'created_at'>
        Update: Partial<Omit<Inquiry, 'id' | 'created_at'>>
      }
    }
  }
}

export type Product = {
  id: string
  name: string
  name_bn?: string
  category: 'new' | 'used' | 'accessories' | 'services'
  specs?: string
  price?: string
  image_url?: string
  in_stock: boolean
  featured: boolean
  created_at: string
}

export type Inquiry = {
  id: string
  name: string
  phone: string
  category?: string
  message?: string
  seen: boolean
  created_at: string
}
