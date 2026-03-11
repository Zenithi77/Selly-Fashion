import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    // Fetch all products with related brand, category, subcategory
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(name),
        clothing_type:clothing_types(name),
        subcategory:subcategories(name)
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
    const excelData = products.map((product) => ({
      'Нэр (name)': product.name || '',
      'Тайлбар (description)': product.description || '',
      'Үнэ (price)': product.price || 0,
      'Хуучин үнэ (original_price)': product.original_price || '',
      'Брэнд (brand)': product.brand?.name || '',
      'Ангилал (category)': product.clothing_type?.name || '',
      'Дэд ангилал (subcategory)': product.subcategory?.name || '',
      'Хэмжээ (sizes)': Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || ''),
      'Өнгө (colors)': Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || ''),
      'Нөөц (stock)': product.stock_quantity || 0,
      'Онцлох (is_featured)': product.is_featured ? 'true' : 'false',
      'Шинэ (is_new_arrival)': product.is_new_arrival ? 'true' : 'false',
      'Хямдрал (is_on_sale)': product.is_on_sale ? 'true' : 'false',
      'Зураг (image_url)': product.image_url || '',
      'Slug': product.slug || '',
      'Үүсгэсэн огноо': product.created_at ? new Date(product.created_at).toLocaleDateString('mn-MN') : '',
    }))

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(excelData)

    // Auto-size columns
    const colWidths = Object.keys(excelData[0]).map((key) => {
      const maxLen = Math.max(
        key.length,
        ...excelData.map((row) => String(row[key as keyof typeof row] ?? '').length)
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
