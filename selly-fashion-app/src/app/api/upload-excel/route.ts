import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'

// Create supabase client with service key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

// Placeholder image for products without images
const PLACEHOLDER_IMAGE = '/placeholder-product.svg'

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-а-яөү]/gi, '')
}

// Parse sizes from string (comma separated)
function parseSizes(sizes: string | undefined): string[] {
  if (!sizes) return []
  return sizes.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
}

// Parse colors from string (comma separated)
function parseColors(colors: string | undefined): string[] {
  if (!colors) return []
  return colors.split(',').map(c => c.trim()).filter(Boolean)
}

// Parse boolean values
function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    return ['true', 'yes', 'тийм', '1'].includes(value.toLowerCase())
  }
  if (typeof value === 'number') return value === 1
  return false
}

// Parse number values
function parseNumber(value: unknown, defaultValue: number = 0): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[,\s]/g, ''))
    return isNaN(parsed) ? defaultValue : parsed
  }
  return defaultValue
}

interface ExcelProduct {
  name: string
  description?: string
  price: number
  original_price?: number
  brand_name?: string
  category_name?: string
  subcategory_name?: string
  sizes?: string
  colors?: string
  is_featured?: boolean
  is_new_arrival?: boolean
  is_on_sale?: boolean
  stock_quantity?: number
  image_url?: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Файл оруулна уу' }, { status: 400 })
    }

    // Check file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ]
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      return NextResponse.json({ error: 'Зөвхөн Excel (.xlsx, .xls) эсвэл CSV файл оруулна уу' }, { status: 400 })
    }

    // Read file content
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'buffer' })
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet)
    
    if (!rawData || rawData.length === 0) {
      return NextResponse.json({ error: 'Файлд мэдээлэл олдсонгүй' }, { status: 400 })
    }

    // Get existing brands and categories for matching
    const [brandsResult, categoriesResult, subcategoriesResult] = await Promise.all([
      supabase.from('brands').select('id, name'),
      supabase.from('clothing_types').select('id, name'),
      supabase.from('subcategories').select('id, name, clothing_type_id')
    ])

    const brands = brandsResult.data || []
    const categories = categoriesResult.data || []
    const subcategories = subcategoriesResult.data || []

    // Create maps for quick lookup (case-insensitive)
    const brandMap = new Map(brands.map(b => [b.name.toLowerCase(), b.id]))
    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]))
    const subcategoryMap = new Map(subcategories.map(s => [s.name.toLowerCase(), s.id]))

    // Process products
    const productsToInsert = []
    const errors: string[] = []
    let successCount = 0

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i]
      const rowNum = i + 2 // Excel rows start at 1, header is row 1
      
      // Map column names (support both Mongolian and English)
      const productData: ExcelProduct = {
        name: (row['name'] || row['нэр'] || row['Нэр'] || row['Name'] || '') as string,
        description: (row['description'] || row['тайлбар'] || row['Тайлбар'] || row['Description'] || '') as string,
        price: parseNumber(row['price'] || row['үнэ'] || row['Үнэ'] || row['Price']),
        original_price: row['original_price'] || row['хуучин_үнэ'] || row['Хуучин үнэ'] 
          ? parseNumber(row['original_price'] || row['хуучин_үнэ'] || row['Хуучин үнэ']) 
          : undefined,
        brand_name: (row['brand'] || row['брэнд'] || row['Брэнд'] || row['Brand'] || '') as string,
        category_name: (row['category'] || row['ангилал'] || row['Ангилал'] || row['Category'] || '') as string,
        subcategory_name: (row['subcategory'] || row['дэд_ангилал'] || row['Дэд ангилал'] || row['Subcategory'] || '') as string,
        sizes: (row['sizes'] || row['хэмжээ'] || row['Хэмжээ'] || row['Sizes'] || '') as string,
        colors: (row['colors'] || row['өнгө'] || row['Өнгө'] || row['Colors'] || '') as string,
        is_featured: parseBoolean(row['is_featured'] || row['онцлох'] || row['Онцлох']),
        is_new_arrival: parseBoolean(row['is_new_arrival'] || row['шинэ'] || row['Шинэ']),
        is_on_sale: parseBoolean(row['is_on_sale'] || row['хямдрал'] || row['Хямдрал']),
        stock_quantity: parseNumber(row['stock'] || row['stock_quantity'] || row['нөөц'] || row['Нөөц'], 0),
        image_url: (row['image_url'] || row['зураг'] || row['Зураг'] || '') as string,
      }

      // Validate required fields
      if (!productData.name || productData.name.trim() === '') {
        errors.push(`Мөр ${rowNum}: Нэр заавал шаардлагатай`)
        continue
      }

      if (!productData.price || productData.price <= 0) {
        errors.push(`Мөр ${rowNum}: Үнэ заавал шаардлагатай (${productData.name})`)
        continue
      }

      // Find brand ID by name
      let brand_id: string | undefined
      if (productData.brand_name) {
        brand_id = brandMap.get(productData.brand_name.toLowerCase())
        if (!brand_id) {
          errors.push(`Мөр ${rowNum}: "${productData.brand_name}" брэнд олдсонгүй (${productData.name})`)
        }
      }

      // Find category ID by name
      let clothing_type_id: string | undefined
      if (productData.category_name) {
        clothing_type_id = categoryMap.get(productData.category_name.toLowerCase())
        if (!clothing_type_id) {
          errors.push(`Мөр ${rowNum}: "${productData.category_name}" ангилал олдсонгүй (${productData.name})`)
        }
      }

      // Find subcategory ID by name
      let subcategory_id: string | undefined
      if (productData.subcategory_name) {
        subcategory_id = subcategoryMap.get(productData.subcategory_name.toLowerCase())
        if (!subcategory_id) {
          errors.push(`Мөр ${rowNum}: "${productData.subcategory_name}" дэд ангилал олдсонгүй (${productData.name})`)
        }
      }

      // Prepare product for insert
      const product = {
        name: productData.name.trim(),
        slug: generateSlug(productData.name),
        description: productData.description?.trim() || '',
        price: productData.price,
        original_price: productData.original_price,
        image_url: productData.image_url?.trim() || PLACEHOLDER_IMAGE,
        brand_id: brand_id || null,
        clothing_type_id: clothing_type_id || null,
        subcategory_id: subcategory_id || null,
        sizes: parseSizes(productData.sizes),
        colors: parseColors(productData.colors),
        is_featured: productData.is_featured || false,
        is_new_arrival: productData.is_new_arrival || false,
        is_on_sale: productData.is_on_sale || false,
        stock_quantity: productData.stock_quantity || 0,
      }

      productsToInsert.push(product)
    }

    // Insert products to database
    if (productsToInsert.length > 0) {
      const { data, error } = await supabase
        .from('products')
        .insert(productsToInsert)
        .select()

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json({ 
          error: 'Бүтээгдэхүүн нэмэхэд алдаа гарлаа',
          details: error.message 
        }, { status: 500 })
      }

      successCount = data?.length || 0
    }

    return NextResponse.json({
      success: true,
      message: `${successCount} бүтээгдэхүүн амжилттай нэмэгдлээ`,
      successCount,
      totalRows: rawData.length,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Excel upload error:', error)
    return NextResponse.json({ 
      error: 'Файл боловсруулахад алдаа гарлаа',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
