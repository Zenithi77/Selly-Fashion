import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a chainable mock for build time
const createChainableMock = () => {
  const mock: Record<string, unknown> = {
    data: [],
    error: null,
    count: 0,
  }
  
  const chainable = (): Record<string, unknown> => {
    const chain: Record<string, unknown> = {
      select: () => chainable(),
      insert: () => chainable(),
      update: () => chainable(),
      delete: () => chainable(),
      upsert: () => chainable(),
      eq: () => chainable(),
      neq: () => chainable(),
      gt: () => chainable(),
      lt: () => chainable(),
      gte: () => chainable(),
      lte: () => chainable(),
      like: () => chainable(),
      ilike: () => chainable(),
      is: () => chainable(),
      in: () => chainable(),
      contains: () => chainable(),
      order: () => chainable(),
      limit: () => chainable(),
      range: () => chainable(),
      single: () => Promise.resolve({ data: null, error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      then: (resolve: (value: { data: unknown[]; error: null; count: number }) => void) => resolve(mock as { data: unknown[]; error: null; count: number }),
      ...mock,
    }
    return chain
  }
  
  return chainable()
}

// Create a dummy client for build time, real client for runtime
const createSupabaseClient = (): SupabaseClient => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client during build time
    return {
      from: () => createChainableMock(),
      auth: {
        signUp: () => Promise.resolve({ data: null, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: null }),
        signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
    } as unknown as SupabaseClient
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()

// Database types
export interface Brand {
  id: string
  name: string
  slug: string
  description: string
  logo_text: string
  tagline: string
  style: string
  created_at: string
  updated_at: string
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
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  original_price?: number
  image_url: string
  images?: string[]
  brand_id: string
  clothing_type_id: string
  sizes: string[]
  colors: string[]
  is_featured: boolean
  is_new_arrival: boolean
  is_on_sale: boolean
  stock_quantity: number
  created_at: string
  updated_at: string
  brand?: Brand
  clothing_type?: ClothingType
}

export interface UserProfile {
  id: string
  email?: string
  full_name: string
  avatar_url: string
  phone: string
  address: string
  city: string
  is_vip: boolean
  is_admin: boolean
  role?: 'admin' | 'customer'
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  size: string
  color: string
  created_at: string
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_address: string
  shipping_city: string
  shipping_phone: string
  shipping_name: string
  payment_method: string
  notes: string
  created_at: string
  updated_at: string
  user?: UserProfile
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  size: string
  color: string
  product?: Product
}

// API Functions
export const api = {
  // Products
  async getProducts(options?: { 
    limit?: number; 
    category?: string; 
    brand?: string; 
    featured?: boolean;
    newArrivals?: boolean;
    onSale?: boolean;
  }) {
    let query = supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        clothing_type:clothing_types(*)
      `)
      .order('created_at', { ascending: false })

    if (options?.limit) query = query.limit(options.limit)
    if (options?.featured) query = query.eq('is_featured', true)
    if (options?.newArrivals) query = query.eq('is_new_arrival', true)
    if (options?.onSale) query = query.eq('is_on_sale', true)
    if (options?.category) query = query.eq('clothing_type_id', options.category)
    if (options?.brand) query = query.eq('brand_id', options.brand)

    const { data, error } = await query
    return { data: data as Product[], error }
  },

  async getProductBySlug(slug: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        clothing_type:clothing_types(*)
      `)
      .eq('slug', slug)
      .single()
    return { data: data as Product, error }
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        clothing_type:clothing_types(*)
      `)
      .eq('id', id)
      .single()
    return { data: data as Product, error }
  },

  // Brands
  async getBrands() {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name')
    return { data: data as Brand[], error }
  },

  async getBrandBySlug(slug: string) {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', slug)
      .single()
    return { data: data as Brand, error }
  },

  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('clothing_types')
      .select('*')
      .order('name')
    return { data: data as ClothingType[], error }
  },

  async getCategoryBySlug(slug: string) {
    const { data, error } = await supabase
      .from('clothing_types')
      .select('*')
      .eq('slug', slug)
      .single()
    return { data: data as ClothingType, error }
  },

  // Orders
  async getOrders(userId?: string) {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        )
      `)
      .order('created_at', { ascending: false })

    if (userId) query = query.eq('user_id', userId)

    const { data, error } = await query
    return { data: data as Order[], error }
  },

  async getOrderById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', id)
      .single()
    return { data: data as Order, error }
  },

  async createOrder(order: Partial<Order>, items: Partial<OrderItem>[]) {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()

    if (orderError) return { data: null, error: orderError }

    const orderItems = items.map(item => ({
      ...item,
      order_id: orderData.id
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    return { data: orderData, error: itemsError }
  },

  async updateOrderStatus(id: string, status: Order['status']) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  // Users
  async getUsers() {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
    return { data: data as UserProfile[], error }
  },

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data: data as UserProfile, error }
  },

  async updateUserProfile(userId: string, profile: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ id: userId, ...profile, updated_at: new Date().toISOString() })
      .select()
      .single()
    return { data, error }
  },

  // Admin - Products
  async createProduct(product: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()
    return { data, error }
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...product, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Admin - Brands
  async createBrand(brand: Partial<Brand>) {
    const { data, error } = await supabase
      .from('brands')
      .insert(brand)
      .select()
      .single()
    return { data, error }
  },

  async updateBrand(id: string, brand: Partial<Brand>) {
    const { data, error } = await supabase
      .from('brands')
      .update({ ...brand, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async deleteBrand(id: string) {
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Admin - Categories
  async createCategory(category: Partial<ClothingType>) {
    const { data, error } = await supabase
      .from('clothing_types')
      .insert(category)
      .select()
      .single()
    return { data, error }
  },

  async updateCategory(id: string, category: Partial<ClothingType>) {
    const { data, error } = await supabase
      .from('clothing_types')
      .update({ ...category, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('clothing_types')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Dashboard Stats
  async getDashboardStats() {
    const [products, orders, users] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact' }),
      supabase.from('orders').select('id, total_amount, status'),
      supabase.from('user_profiles').select('id', { count: 'exact' })
    ])

    const ordersData = orders.data || []
    const totalRevenue = ordersData
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0)

    const pendingOrders = ordersData.filter(o => o.status === 'pending').length

    return {
      totalProducts: products.count || 0,
      totalOrders: ordersData.length,
      totalUsers: users.count || 0,
      totalRevenue,
      pendingOrders
    }
  }
}
