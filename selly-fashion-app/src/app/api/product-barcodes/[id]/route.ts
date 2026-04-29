import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    if (!id) return NextResponse.json({ error: 'id шаардлагатай' }, { status: 400 })

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        id, name, barcode, image_url,
        variants:product_variants(size, color, store_quantity, warehouse_quantity, barcode)
      `)
      .eq('id', id)
      .single()

    if (error || !product) {
      return NextResponse.json({ error: 'Бүтээгдэхүүн олдсонгүй' }, { status: 404 })
    }

    type Row = Record<string, string>
    const rows: Row[] = []

    // Эхний мөр: үндсэн бараа (зөвхөн нэр + барай)
    rows.push({
      'Нэр': product.name || '',
      'Баркод': product.barcode || '',
    })

    const variants = (product.variants || []) as Array<{
      size?: string | null
      color?: string | null
      barcode?: string | null
    }>

    for (const v of variants) {
      const parts = [v.size, v.color].filter(Boolean).join(' / ')
      rows.push({
        'Нэр': `${product.name || ''}${parts ? ', ' + parts : ''}`,
        'Баркод': v.barcode || '',
      })
    }

    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(rows)

    const headers = Object.keys(rows[0] || {})
    worksheet['!cols'] = headers.map((key) => {
      const maxLen = Math.max(key.length, ...rows.map((r) => String(r[key] ?? '').length))
      return { wch: Math.min(maxLen + 2, 50) }
    })

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Баркод')

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
    const safeName = (product.name || 'product').replace(/[^a-zA-Z0-9-_]+/g, '_').slice(0, 40)
    const filename = `barcodes-${safeName}-${Date.now()}.xlsx`

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (e) {
    console.error('product-barcodes error', e)
    return NextResponse.json({ error: 'Excel үүсгэхэд алдаа гарлаа' }, { status: 500 })
  }
}
