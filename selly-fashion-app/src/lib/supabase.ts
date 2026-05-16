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
  image_url: string
  is_featured: boolean
  featured_order: number
  country?: string | null
  created_at: string
  updated_at: string
}

export interface ClothingType {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  subcategories: string[]
  is_featured: boolean
  featured_order: number
  created_at: string
  updated_at: string
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  clothing_type_id: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
  clothing_type?: ClothingType
}

export interface ProductVariant {
  id: string
  product_id: string
  size: string | null
  color: string | null
  barcode?: string | null
  store_quantity: number
  warehouse_quantity: number
  created_at?: string
  updated_at?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  original_price?: number
  cost_price?: number
  // Багцын үнэ: хэрэв хэрэглэгч bulk_min_quantity ширхэгээс илүү авбал bulk_price үйлчилнэ
  bulk_min_quantity?: number | null
  bulk_price?: number | null
  image_url: string
  images?: string[]
  barcode?: string
  country?: string
  brand_id: string
  clothing_type_id: string
  subcategory_id?: string
  sizes: string[]
  colors: string[]
  is_featured: boolean
  is_new_arrival: boolean
  is_on_sale: boolean
  // Хуучин нийт нөөц (backward-compat). Шинэ систем: store + warehouse
  stock_quantity: number
  store_quantity?: number
  warehouse_quantity?: number
  created_at: string
  updated_at: string
  brand?: Brand
  clothing_type?: ClothingType
  subcategory?: Subcategory
  variants?: ProductVariant[]
}

export type StockPaymentMethod = 'cash' | 'bank' | 'personal_loan' | 'own_use'
export type StockReason = 'sale' | 'personal_use' | 'damaged' | 'lost' | 'return' | 'adjustment' | 'other'
export type StockSource = 'store' | 'warehouse'

export interface StockMovement {
  id: string
  product_id: string | null
  variant_id: string | null
  quantity: number
  source: StockSource
  payment_method: StockPaymentMethod | null
  reason: StockReason
  unit_price?: number | null
  total_amount?: number | null
  note?: string | null
  created_by?: string | null
  created_at: string
  product?: Product
  variant?: ProductVariant
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

// Захиалгын ерөнхий статус
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready_for_pickup'
  | 'assigned_to_courier'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed_delivery'
  | 'returned'
  | 'cancelled'
  // backward-compat
  | 'shipped'

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  payment_status: 'Pending' | 'Paid' | 'Failed' | 'Refunded'
  payment_method: string
  payment_ref: string
  paid_amount: number
  payment_note: string
  total_amount: number
  shipping_address: string
  shipping_city: string
  shipping_phone: string
  shipping_name: string
  notes: string
  // Хүргэлтийн нэмэлт мэдээлэл
  delivery_status?: string | null
  delivery_notes?: string | null
  delivery_courier?: string | null
  delivery_updated_at?: string | null
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

// Авто-баркод үүсгэгч: YYMMNNNNN (он 2 орон + сар 2 орон + тухайн сарын дараалал 5 орон)
// Унших боломжтой, тоон шинжтэй: эхний 4 орон нь огноо, сүүлийн 5 орон нь дугаар
async function generateNextBarcode(): Promise<string> {
  const now = new Date()
  const yy = String(now.getFullYear() % 100).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const prefix = `${yy}${mm}`

  // Тухайн сард үүсгэгдсэн хамгийн сүүлийн баркодыг олж дараагийнхыг өгөх
  const { data } = await supabase
    .from('products')
    .select('barcode')
    .like('barcode', `${prefix}%`)
    .order('barcode', { ascending: false })
    .limit(1)

  let next = 1
  if (data && data.length > 0 && data[0].barcode) {
    const lastSeq = parseInt(String(data[0].barcode).slice(4), 10)
    if (!isNaN(lastSeq)) next = lastSeq + 1
  }
  return `${prefix}${String(next).padStart(5, '0')}`
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
    subcategory?: string;
  }) {
    let query = supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        clothing_type:clothing_types(*),
        variants:product_variants(*)
      `)
      .order('created_at', { ascending: false })

    if (options?.limit) query = query.limit(options.limit)
    if (options?.featured) query = query.eq('is_featured', true)
    if (options?.newArrivals) query = query.eq('is_new_arrival', true)
    if (options?.onSale) query = query.eq('is_on_sale', true)
    if (options?.category) query = query.eq('clothing_type_id', options.category)
    if (options?.brand) query = query.eq('brand_id', options.brand)
    if (options?.subcategory) query = query.eq('subcategory_id', options.subcategory)

    const { data, error } = await query
    return { data: data as Product[], error }
  },

  async getProductBySlug(slug: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        clothing_type:clothing_types(*),
        variants:product_variants(*)
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
        clothing_type:clothing_types(*),
        variants:product_variants(*)
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

  async getFeaturedBrands(limit: number = 5) {
    // First try to get featured brands
    let { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_featured', true)
      .order('featured_order', { ascending: true })
      .limit(limit)
    
    // If no featured brands, get any brands
    if (!data || data.length === 0) {
      const result = await supabase
        .from('brands')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)
      data = result.data
      error = result.error
    }
    
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

  async getClothingTypes() {
    const { data, error } = await supabase
      .from('clothing_types')
      .select('*')
      .order('name')
    return { data: data as ClothingType[], error }
  },

  async getFeaturedCategories(limit: number = 4) {
    // First try to get featured categories
    let { data, error } = await supabase
      .from('clothing_types')
      .select('*')
      .eq('is_featured', true)
      .order('featured_order', { ascending: true })
      .limit(limit)
    
    // If no featured categories, get any categories
    if (!data || data.length === 0) {
      const result = await supabase
        .from('clothing_types')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)
      data = result.data
      error = result.error
    }
    
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

  async updateClothingType(id: string, category: Partial<ClothingType>) {
    const { data, error } = await supabase
      .from('clothing_types')
      .update({ ...category, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  // Subcategories
  async getSubcategories(clothingTypeId?: string) {
    let query = supabase
      .from('subcategories')
      .select('*, clothing_type:clothing_types(*)')
      .order('display_order', { ascending: true })

    if (clothingTypeId) {
      query = query.eq('clothing_type_id', clothingTypeId)
    }

    const { data, error } = await query
    return { data: (data || []) as Subcategory[], error }
  },

  async getAllSubcategories() {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*, clothing_type:clothing_types(*)')
      .order('display_order', { ascending: true })
    return { data: (data || []) as Subcategory[], error }
  },

  async getSubcategoryBySlug(slug: string) {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*, clothing_type:clothing_types(*)')
      .eq('slug', slug)
      .single()
    return { data: data as Subcategory | null, error }
  },

  async createSubcategory(subcategory: Partial<Subcategory>) {
    const { data, error } = await supabase
      .from('subcategories')
      .insert(subcategory)
      .select()
      .single()
    return { data: data as Subcategory | null, error }
  },

  async updateSubcategory(id: string, subcategory: Partial<Subcategory>) {
    const { data, error } = await supabase
      .from('subcategories')
      .update({ ...subcategory, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    return { data: data as Subcategory | null, error }
  },

  async deleteSubcategory(id: string) {
    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', id)
    return { error }
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

  // Хүргэлтийн статус болон тэмдэглэл шинэчлэх
  async updateDeliveryStatus(
    id: string,
    payload: { status?: Order['status']; delivery_status?: string; delivery_notes?: string; delivery_courier?: string }
  ) {
    const update: Record<string, unknown> = {
      ...payload,
      delivery_updated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('orders')
      .update(update)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  // ===== Product Variants =====
  async getVariantsByProduct(productId: string) {
    const { data, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .order('size', { ascending: true })
    return { data: (data || []) as ProductVariant[], error }
  },

  async upsertVariants(productId: string, variants: Partial<ProductVariant>[]) {
    // Эхлээд тухайн бүтээгдэхүүний бүх variant-ыг устгана, дараа нь шинээр оруулна.
    // Энэ нь хамгийн энгийн бөгөөд найдвартай арга.
    const { error: delError } = await supabase
      .from('product_variants')
      .delete()
      .eq('product_id', productId)
    if (delError) return { data: null, error: delError }

    // Бүтээгдэхүүний барай авах — variant-уудын авто-баркодын prefix болгож ашиглана.
    // Хэрэв бүтээгдэхүүн барайгүй бол энд автоматаар үүсгэж өгнө (variant барай null үлдэхээс сэргийлнэ).
    let productBarcode: string | null = null
    {
      const { data: prod } = await supabase
        .from('products')
        .select('barcode')
        .eq('id', productId)
        .single()
      productBarcode = prod?.barcode?.trim() || null
      if (!productBarcode) {
        const newProductBarcode = await generateNextBarcode()
        const { data: updatedProd, error: updErr } = await supabase
          .from('products')
          .update({ barcode: newProductBarcode, updated_at: new Date().toISOString() })
          .eq('id', productId)
          .select('barcode')
          .single()
        if (!updErr) {
          productBarcode = (updatedProd?.barcode as string | null) || newProductBarcode
        } else {
          // Хэрэв update амжилтгүй бол fallback болгож үүсгэсэн утгыг ашиглана
          productBarcode = newProductBarcode
        }
      }
    }

    const filtered = variants.filter((v) => (v.size || v.color))
    if (filtered.length === 0) return { data: [], error: null }

    // Variant барай ухаалаг үүсгэх:
    //  - Хэрэв variant өөрөө барайтай (lookup-аас, эсвэл ашиглагч өгсөн) бол түүнийг үлдээнэ
    //  - Үгүй бол: бүтээгдэхүүний барай (9 орон) + 2 оронт variant index = 11 оронт код
    //  - productBarcode энд заавал утгатай (дээр баталгаажсан)
    const cleaned = filtered.map((v, idx) => {
      let variantBarcode: string | null = v.barcode?.trim() || null
      if (!variantBarcode && productBarcode) {
        const suffix = String(idx + 1).padStart(2, '0')
        variantBarcode = `${productBarcode}${suffix}`
      }
      return {
        product_id: productId,
        size: v.size || null,
        color: v.color || null,
        barcode: variantBarcode,
        store_quantity: v.store_quantity ?? 0,
        warehouse_quantity: v.warehouse_quantity ?? 0,
      }
    })

    const { data, error } = await supabase
      .from('product_variants')
      .insert(cleaned)
      .select()
    return { data: (data || []) as ProductVariant[], error }
  },

  // ===== Stock Movements (POS борлуулалт) =====
  async createStockMovement(movement: Partial<StockMovement>) {
    const { data, error } = await supabase
      .from('stock_movements')
      .insert(movement)
      .select()
      .single()
    if (error) return { data: null, error }

    // Variant эсвэл product дээрх нөөцийг хасна
    const qty = movement.quantity || 0
    const source = movement.source || 'store'
    const field = source === 'warehouse' ? 'warehouse_quantity' : 'store_quantity'

    if (movement.variant_id) {
      const { data: variant } = await supabase
        .from('product_variants')
        .select(`${field}`)
        .eq('id', movement.variant_id)
        .single()
      const current = (variant as Record<string, number> | null)?.[field] ?? 0
      await supabase
        .from('product_variants')
        .update({ [field]: Math.max(0, current - qty) })
        .eq('id', movement.variant_id)
    } else if (movement.product_id) {
      const { data: product } = await supabase
        .from('products')
        .select(`${field}, stock_quantity`)
        .eq('id', movement.product_id)
        .single()
      const productData = product as Record<string, number> | null
      const current = productData?.[field] ?? 0
      const totalCurrent = productData?.stock_quantity ?? 0
      await supabase
        .from('products')
        .update({
          [field]: Math.max(0, current - qty),
          stock_quantity: Math.max(0, totalCurrent - qty),
        })
        .eq('id', movement.product_id)
    }

    return { data: data as StockMovement, error: null }
  },

  async getStockMovements(limit: number = 100) {
    const { data, error } = await supabase
      .from('stock_movements')
      .select(`
        *,
        product:products(id, name, image_url, price),
        variant:product_variants(id, size, color)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data: (data || []) as StockMovement[], error }
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
    // Авто-баркод үүсгэх: YYMMNNNNN форматтай (он 2 орон + сар 2 орон + тухайн сарын дараалал 5 орон)
    // Жишээ: 2026 оны 4 сарын 7 дахь бараа => "260400007"
    const productToInsert: Partial<Product> = { ...product }
    if (!productToInsert.barcode || !productToInsert.barcode.trim()) {
      productToInsert.barcode = await generateNextBarcode()
    }

    // Slug давхардвал -2, -3, ... залгаж ретрай хийнэ
    const baseSlug = (productToInsert.slug || '').trim()
    let attempt = 0
    let lastError: unknown = null
    while (attempt < 50) {
      const trySlug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`
      const payload = baseSlug ? { ...productToInsert, slug: trySlug } : productToInsert
      const { data, error } = await supabase
        .from('products')
        .insert(payload)
        .select()
        .single()
      if (!error) return { data, error: null }
      lastError = error
      // 23505 = unique_violation. Бусад алдаа бол шууд буцаана
      const code = (error as { code?: string }).code
      if (code !== '23505' || !baseSlug) return { data: null, error }
      attempt += 1
    }
    return { data: null, error: lastError as Error }
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
    // Холбоотой өгөгдлийг эхлээд устгах
    await supabase.from('cart_items').delete().eq('product_id', id)
    await supabase.from('wishlist').delete().eq('product_id', id)

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
