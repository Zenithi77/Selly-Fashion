import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'

// Create supabase client with service key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

// Placeholder image for products without images
const PLACEHOLDER_IMAGE = '/placeholder-product.svg'

// Safely coerce any value to a trimmed string
function toStr(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  try {
    return String(value)
  } catch {
    return ''
  }
}

// Generate slug from name
function generateSlug(name: unknown): string {
  return toStr(name)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-а-яөү]/gi, '')
}

// Parse sizes from string (comma separated)
function parseSizes(sizes: unknown): string[] {
  const str = toStr(sizes)
  if (!str) return []
  return str.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
}

// Parse colors from string (comma separated)
function parseColors(colors: unknown): string[] {
  const str = toStr(colors)
  if (!str) return []
  return str.split(',').map(c => c.trim()).filter(Boolean)
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
  cost_price?: number
  bulk_min_quantity?: number
  bulk_price?: number
  brand_name?: string
  category_name?: string
  subcategory_name?: string
  country?: string
  barcode?: string
  sizes?: string
  colors?: string
  is_featured?: boolean
  is_new_arrival?: boolean
  is_on_sale?: boolean
  store_quantity?: number
  warehouse_quantity?: number
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
      
      // Helper function to find value by multiple possible column names
      const findValue = (...keys: string[]): unknown => {
        for (const key of keys) {
          // Check exact match
          if (row[key] !== undefined) return row[key]
          // Check if any column contains this key (for combined headers like "Нэр (name)")
          for (const colName of Object.keys(row)) {
            if (colName.toLowerCase().includes(key.toLowerCase())) {
              return row[colName]
            }
          }
        }
        return ''
      }
      
      // Map column names (support both Mongolian and English, and combined headers)
      const productData: ExcelProduct = {
        name: toStr(findValue('name', 'нэр', 'Нэр', 'Name')),
        description: toStr(findValue('description', 'тайлбар', 'Тайлбар', 'Description')),
        price: parseNumber(findValue('price', 'үнэ', 'Үнэ', 'Price')),
        original_price: findValue('original_price', 'хуучин_үнэ', 'Хуучин үнэ', 'Хуучин')
          ? parseNumber(findValue('original_price', 'хуучин_үнэ', 'Хуучин үнэ', 'Хуучин'))
          : undefined,
        cost_price: findValue('cost_price', 'өртөг', 'Өртөг', 'Өртөг үнэ', 'urtug', 'cost')
          ? parseNumber(findValue('cost_price', 'өртөг', 'Өртөг', 'Өртөг үнэ', 'urtug', 'cost'))
          : undefined,
        bulk_min_quantity: findValue('bulk_min_quantity', 'багц_бага', 'багц бага', 'min_quantity', 'bulk min')
          ? parseNumber(findValue('bulk_min_quantity', 'багц_бага', 'багц бага', 'min_quantity', 'bulk min'))
          : undefined,
        bulk_price: findValue('bulk_price', 'багцын_үнэ', 'багцын үнэ', 'бууни үнэ')
          ? parseNumber(findValue('bulk_price', 'багцын_үнэ', 'багцын үнэ', 'бууни үнэ'))
          : undefined,
        brand_name: toStr(findValue('brand', 'брэнд', 'Брэнд', 'Brand')),
        category_name: toStr(findValue('category', 'ангилал', 'Ангилал', 'Category')),
        subcategory_name: toStr(findValue('subcategory', 'дэд_ангилал', 'Дэд ангилал', 'Subcategory', 'Дэд')),
        country: toStr(findValue('country', 'улс', 'Улс', 'Country', 'Origin', 'Гарал')),
        barcode: toStr(findValue('barcode', 'баркод', 'Баркод', 'Barcode', 'EAN', 'UPC')),
        sizes: toStr(findValue('sizes', 'хэмжээ', 'Хэмжээ', 'Sizes')),
        colors: toStr(findValue('colors', 'өнгө', 'Өнгө', 'Colors')),
        is_featured: parseBoolean(findValue('is_featured', 'онцлох', 'Онцлох', 'featured')),
        is_new_arrival: parseBoolean(findValue('is_new_arrival', 'шинэ', 'Шинэ', 'new')),
        is_on_sale: parseBoolean(findValue('is_on_sale', 'хямдрал', 'Хямдрал', 'sale')),
        store_quantity: findValue('store_quantity', 'дэлгүүр', 'Дэлгүүр', 'store')
          ? parseNumber(findValue('store_quantity', 'дэлгүүр', 'Дэлгүүр', 'store'), 0)
          : undefined,
        warehouse_quantity: findValue('warehouse_quantity', 'агуулах', 'Агуулах', 'warehouse')
          ? parseNumber(findValue('warehouse_quantity', 'агуулах', 'Агуулах', 'warehouse'), 0)
          : undefined,
        stock_quantity: parseNumber(findValue('stock', 'stock_quantity', 'нөөц', 'Нөөц'), 0),
        image_url: toStr(findValue('image_url', 'зураг', 'Зураг', 'image')),
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
      const storeQty = productData.store_quantity ?? 0
      const warehouseQty = productData.warehouse_quantity ?? 0
      // Хэрэв store/warehouse бичигдсэн байвал тэднийг ашиглана, үгүй бол stock_quantity-ыг store-руу өгнө.
      const finalStore = (productData.store_quantity !== undefined) ? storeQty : (productData.stock_quantity || 0)
      const finalWarehouse = warehouseQty
      const totalStock = finalStore + finalWarehouse

      const product = {
        name: productData.name.trim(),
        slug: generateSlug(productData.name),
        description: productData.description?.trim() || '',
        price: productData.price,
        original_price: productData.original_price,
        cost_price: productData.cost_price,
        bulk_min_quantity: productData.bulk_min_quantity ?? null,
        bulk_price: productData.bulk_price ?? null,
        image_url: productData.image_url?.trim() || PLACEHOLDER_IMAGE,
        barcode: productData.barcode?.trim() || undefined,
        country: productData.country?.trim() || undefined,
        brand_id: brand_id || null,
        clothing_type_id: clothing_type_id || null,
        subcategory_id: subcategory_id || null,
        sizes: parseSizes(productData.sizes),
        colors: parseColors(productData.colors),
        is_featured: productData.is_featured || false,
        is_new_arrival: productData.is_new_arrival || false,
        is_on_sale: productData.is_on_sale || false,
        store_quantity: finalStore,
        warehouse_quantity: finalWarehouse,
        stock_quantity: totalStock,
      }

      productsToInsert.push(product)
    }

    // ========================================
    // Smart Variant Detection
    // Ижил нэр, брэнд, үнэ, тайлбартай бараанууд → нэг бүтээгдэхүүн болгож нэгтгэнэ
    // Зөвхөн өнгө, хэмжээ, нөөц ялгаатай бол variant гэж тооцно
    // ========================================
    const mergedProducts: typeof productsToInsert = []
    const variantMap = new Map<string, number>() // key -> index in mergedProducts
    // Variant rows: тус бүтээгдэхүүний өвөрмөц (size, color, store, warehouse) хослолууд
    const variantRows = new Map<number, Array<{ size: string; color: string; store_quantity: number; warehouse_quantity: number }>>()

    for (const product of productsToInsert) {
      // Create a unique key based on: name + brand + price + description + category + subcategory + country
      const variantKey = [
        product.name.toLowerCase().trim(),
        product.brand_id || '',
        product.price,
        (product.description || '').toLowerCase().trim(),
        product.clothing_type_id || '',
        product.subcategory_id || '',
        product.country || '',
      ].join('|||')

      // Тухайн мөрөөс size/color гарган авна
      const rowSize = product.sizes[0] || ''
      const rowColor = product.colors[0] || ''

      const existingIdx = variantMap.get(variantKey)

      if (existingIdx !== undefined) {
        // Merge sizes and colors into existing product
        const existing = mergedProducts[existingIdx]

        // Merge sizes (no duplicates)
        const allSizes = new Set([...existing.sizes, ...product.sizes])
        existing.sizes = Array.from(allSizes)

        // Merge colors (no duplicates)
        const allColors = new Set([...existing.colors, ...product.colors])
        existing.colors = Array.from(allColors)

        // Sum stock quantities
        existing.stock_quantity = (existing.stock_quantity || 0) + (product.stock_quantity || 0)
        existing.store_quantity = (existing.store_quantity || 0) + (product.store_quantity || 0)
        existing.warehouse_quantity = (existing.warehouse_quantity || 0) + (product.warehouse_quantity || 0)

        // Take barcode if the existing one doesn't have one
        if (!existing.barcode && product.barcode) {
          existing.barcode = product.barcode
        }

        // Take image if existing doesn't have a real one
        if ((!existing.image_url || existing.image_url === PLACEHOLDER_IMAGE) && product.image_url && product.image_url !== PLACEHOLDER_IMAGE) {
          existing.image_url = product.image_url
        }

        // Variant мөр нэмэх
        if (rowSize || rowColor) {
          const list = variantRows.get(existingIdx) || []
          list.push({
            size: rowSize,
            color: rowColor,
            store_quantity: product.store_quantity || 0,
            warehouse_quantity: product.warehouse_quantity || 0,
          })
          variantRows.set(existingIdx, list)
        }
      } else {
        // New unique product
        const newIdx = mergedProducts.length
        variantMap.set(variantKey, newIdx)
        mergedProducts.push({ ...product })
        if (rowSize || rowColor) {
          variantRows.set(newIdx, [{
            size: rowSize,
            color: rowColor,
            store_quantity: product.store_quantity || 0,
            warehouse_quantity: product.warehouse_quantity || 0,
          }])
        }
      }
    }

    const mergedCount = productsToInsert.length - mergedProducts.length

    // ========================================
    // Check against existing DB products for updates
    // If a product with same name+brand already exists → update sizes/colors  
    // ========================================
    const toInsert: typeof mergedProducts = []
    const toUpdate: { id: string; sizes: string[]; colors: string[]; stock_quantity: number; store_quantity?: number; warehouse_quantity?: number; barcode?: string; country?: string }[] = []
    // toInsert индекс → mergedProducts (variant rows холбоход хэрэгтэй)
    const insertIdxToMergedIdx = new Map<number, number>()
    // toUpdate-д тохирох product_id → variant rows
    const updateVariants = new Map<string, Array<{ size: string; color: string; store_quantity: number; warehouse_quantity: number }>>()

    // Fetch existing products for comparison
    const { data: existingProducts } = await supabase
      .from('products')
      .select('id, name, brand_id, price, sizes, colors, stock_quantity, barcode, country')

    const existingMap = new Map<string, typeof existingProducts extends (infer T)[] | null ? T : never>()
    if (existingProducts) {
      for (const ep of existingProducts) {
        const key = [
          ep.name.toLowerCase().trim(),
          ep.brand_id || '',
          ep.price,
        ].join('|||')
        existingMap.set(key, ep)
      }
    }

    for (let mIdx = 0; mIdx < mergedProducts.length; mIdx++) {
      const product = mergedProducts[mIdx]
      const lookupKey = [
        product.name.toLowerCase().trim(),
        product.brand_id || '',
        product.price,
      ].join('|||')

      const existing = existingMap.get(lookupKey)

      if (existing) {
        // Product exists in DB → merge sizes/colors and update
        const existingSizes = Array.isArray(existing.sizes) ? existing.sizes : []
        const existingColors = Array.isArray(existing.colors) ? existing.colors : []
        
        const allSizes = Array.from(new Set([...existingSizes, ...product.sizes]))
        const allColors = Array.from(new Set([...existingColors, ...product.colors]))
        
        const hasNewSizes = allSizes.length > existingSizes.length
        const hasNewColors = allColors.length > existingColors.length
        const hasNewBarcode = !existing.barcode && product.barcode
        const hasNewCountry = !existing.country && product.country

        if (hasNewSizes || hasNewColors || hasNewBarcode || hasNewCountry) {
          toUpdate.push({
            id: existing.id,
            sizes: allSizes,
            colors: allColors,
            stock_quantity: (existing.stock_quantity || 0) + (product.stock_quantity || 0),
            store_quantity: product.store_quantity,
            warehouse_quantity: product.warehouse_quantity,
            barcode: product.barcode || existing.barcode || undefined,
            country: product.country || existing.country || undefined,
          })
        }
        // Variant rows-г одоо байгаа product_id дээр хадгална
        const rows = variantRows.get(mIdx)
        if (rows && rows.length > 0) {
          updateVariants.set(existing.id, rows)
        }
      } else {
        // Ensure unique slug
        product.slug = `${product.slug}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
        insertIdxToMergedIdx.set(toInsert.length, mIdx)
        toInsert.push(product)
      }
    }

    // Execute inserts
    let insertedProducts: Array<{ id: string }> = []
    if (toInsert.length > 0) {
      const { data, error } = await supabase
        .from('products')
        .insert(toInsert)
        .select()

      if (error) {
        console.error('Database insert error:', error)
        return NextResponse.json({ 
          error: 'Бүтээгдэхүүн нэмэхэд алдаа гарлаа',
          details: error.message 
        }, { status: 500 })
      }

      successCount = data?.length || 0
      insertedProducts = data || []
    }

    // Execute updates
    let updatedCount = 0
    for (const upd of toUpdate) {
      const updatePayload: Record<string, unknown> = {
        sizes: upd.sizes,
        colors: upd.colors,
        stock_quantity: upd.stock_quantity,
        barcode: upd.barcode,
        country: upd.country,
      }
      if (upd.store_quantity !== undefined) updatePayload.store_quantity = upd.store_quantity
      if (upd.warehouse_quantity !== undefined) updatePayload.warehouse_quantity = upd.warehouse_quantity

      const { error } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', upd.id)

      if (!error) updatedCount++
    }

    // ========================================
    // Variants хадгалах: шинээр insert хийгдсэн болон upsert хийсэн
    // бүтээгдэхүүн бүрд size+color бүрийн store/warehouse-г product_variants хүснэгтэд бичнэ
    // ========================================
    let variantCount = 0
    // Insert хийгдсэн product-уудын variants
    for (let i = 0; i < insertedProducts.length; i++) {
      const productRecord = insertedProducts[i]
      const mergedIdx = insertIdxToMergedIdx.get(i)
      if (mergedIdx === undefined) continue
      const rows = variantRows.get(mergedIdx)
      if (!rows || rows.length === 0) continue

      // Ижил size+color combination-уудыг нэгтгэх
      const map = new Map<string, { size: string; color: string; store_quantity: number; warehouse_quantity: number }>()
      for (const r of rows) {
        const k = `${r.size}|||${r.color}`
        const existing = map.get(k)
        if (existing) {
          existing.store_quantity += r.store_quantity
          existing.warehouse_quantity += r.warehouse_quantity
        } else {
          map.set(k, { ...r })
        }
      }
      const variantPayload = Array.from(map.values()).map(v => ({
        product_id: productRecord.id,
        size: v.size || null,
        color: v.color || null,
        store_quantity: v.store_quantity,
        warehouse_quantity: v.warehouse_quantity,
      }))
      if (variantPayload.length > 0) {
        const { error: vErr } = await supabase.from('product_variants').insert(variantPayload)
        if (!vErr) variantCount += variantPayload.length
      }
    }
    // Update хийгдсэн product-уудын variants (хуучныг устгаж шинээр оруулна)
    for (const [productId, rows] of updateVariants.entries()) {
      const map = new Map<string, { size: string; color: string; store_quantity: number; warehouse_quantity: number }>()
      for (const r of rows) {
        const k = `${r.size}|||${r.color}`
        const existing = map.get(k)
        if (existing) {
          existing.store_quantity += r.store_quantity
          existing.warehouse_quantity += r.warehouse_quantity
        } else {
          map.set(k, { ...r })
        }
      }
      const variantPayload = Array.from(map.values()).map(v => ({
        product_id: productId,
        size: v.size || null,
        color: v.color || null,
        store_quantity: v.store_quantity,
        warehouse_quantity: v.warehouse_quantity,
      }))
      if (variantPayload.length > 0) {
        // upsert: нэг бүтээгдэхүүний доорх (size, color) давхцахгүй гэсэн UNIQUE constraint
        const { error: vErr } = await supabase
          .from('product_variants')
          .upsert(variantPayload, { onConflict: 'product_id,size,color' })
        if (!vErr) variantCount += variantPayload.length
      }
    }

    // Build detailed result message
    const parts: string[] = []
    if (successCount > 0) parts.push(`${successCount} шинэ бүтээгдэхүүн нэмэгдлээ`)
    if (updatedCount > 0) parts.push(`${updatedCount} бүтээгдэхүүн шинэчлэгдлээ (өнгө/размер нэмэгдсэн)`)
    if (mergedCount > 0) parts.push(`${mergedCount} мөр variant болгож нэгтгэгдсэн`)
    if (variantCount > 0) parts.push(`${variantCount} variant (size×өнгө) хадгалагдсан`)

    return NextResponse.json({
      success: true,
      message: parts.length > 0 ? parts.join('. ') : 'Бүх бүтээгдэхүүн аль хэдийн бүртгэгдсэн байна',
      successCount,
      updatedCount,
      mergedCount,
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
