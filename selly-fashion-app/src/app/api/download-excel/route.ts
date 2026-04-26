import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    // Fetch all products with related brand, category, subcategory, variants
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(name),
        clothing_type:clothing_types(name),
        subcategory:subcategories(name),
        variants:product_variants(size, color, store_quantity, warehouse_quantity, barcode)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Бүтээгдэхүүн татахад алдаа гарлаа' }, { status: 500 })
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'Бүтээгдэхүүн олдсонгүй' }, { status: 404 })
    }

    // Map products to Excel-friendly rows
    // Хэрэв product дээр variant байвал variant тус бүрийг тусдаа мөрөөр гаргана.
    type ExcelRow = Record<string, string | number>
    const excelData: ExcelRow[] = []
    for (const product of products) {
      const baseRow = {
        'Id': product.id,
        'Нэр (name)': product.name || '',
        'Тайлбар (description)': product.description || '',
        'Үнэ (price)': product.price || 0,
        'Хуучин үнэ (original_price)': product.original_price || '',
        'Өртөг үнэ (cost_price)': product.cost_price || '',
        'Багц бага тоо (bulk_min_quantity)': product.bulk_min_quantity || '',
        'Багцын үнэ (bulk_price)': product.bulk_price || '',
        'Брэнд (brand)': product.brand?.name || '',
        'Ангилал (category)': product.clothing_type?.name || '',
        'Дэд ангилал (subcategory)': product.subcategory?.name || '',
        'Улс (country)': product.country || '',
        'Баркод (barcode)': product.barcode || '',
        'Онцлох (is_featured)': product.is_featured ? 'true' : 'false',
        'Шинэ (is_new_arrival)': product.is_new_arrival ? 'true' : 'false',
        'Хямдрал (is_on_sale)': product.is_on_sale ? 'true' : 'false',
        'Зураг (image_url)': product.image_url || '',
        'Slug': product.slug || '',
      }

      const variants = (product.variants || []) as Array<{
        size?: string | null
        color?: string | null
        store_quantity?: number
        warehouse_quantity?: number
        barcode?: string | null
      }>

      if (variants.length === 0) {
        // Нэг мөрөөр product дээрх ерөнхий нөөцийг бичнэ
        excelData.push({
          ...baseRow,
          'Хэмжээ (sizes)': Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || ''),
          'Өнгө (colors)': Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || ''),
          'Дэлгүүр (store_quantity)': product.store_quantity ?? 0,
          'Агуулах (warehouse_quantity)': product.warehouse_quantity ?? 0,
          'Нийт нөөц (stock)': product.stock_quantity || 0,
        })
      } else {
        // Variant тус бүрийг тусдаа мөрөөр
        for (const v of variants) {
          excelData.push({
            ...baseRow,
            'Хэмжээ (sizes)': v.size || '',
            'Өнгө (colors)': v.color || '',
            'Дэлгүүр (store_quantity)': v.store_quantity ?? 0,
            'Агуулах (warehouse_quantity)': v.warehouse_quantity ?? 0,
            'Нийт нөөц (stock)': (v.store_quantity ?? 0) + (v.warehouse_quantity ?? 0),
            'Variant баркод': v.barcode || '',
          })
        }
      }
    }

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(excelData)

    // Auto-size columns
    const headers = excelData.length > 0 ? Object.keys(excelData[0]) : []
    const colWidths = headers.map((key) => {
      const maxLen = Math.max(
        key.length,
        ...excelData.map((row) => String(row[key] ?? '').length)
      )
      return { wch: Math.min(maxLen + 2, 50) }
    })
    worksheet['!cols'] = colWidths

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Бүтээгдэхүүн')

    // Write to buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // Return as downloadable file
    const today = new Date().toISOString().split('T')[0]
    const filename = `products-${today}.xlsx`

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Excel download error:', error)
    return NextResponse.json(
      { error: 'Excel файл үүсгэхэд алдаа гарлаа' },
      { status: 500 }
    )
  }
}
