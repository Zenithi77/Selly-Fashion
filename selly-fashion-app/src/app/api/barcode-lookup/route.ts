import { NextResponse } from 'next/server'

export interface BarcodeProduct {
  title: string
  description: string
  brand: string
  images: string[]
  category: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const barcode = searchParams.get('barcode')

  if (!barcode) {
    return NextResponse.json({ error: 'Баркод дугаар шаардлагатай' }, { status: 400 })
  }

  // Sanitize barcode - only allow alphanumeric
  const sanitized = barcode.replace(/[^a-zA-Z0-9]/g, '')
  if (!sanitized || sanitized.length < 4) {
    return NextResponse.json({ error: 'Буруу баркод дугаар' }, { status: 400 })
  }

  try {
    // Try UPCitemdb.com free API (100 requests/day)
    const upcResult = await lookupUPCitemdb(sanitized)
    if (upcResult) {
      return NextResponse.json({ found: true, product: upcResult, source: 'UPCitemdb' })
    }

    // Try Open Food Facts (free, unlimited, mainly food products)
    const offResult = await lookupOpenFoodFacts(sanitized)
    if (offResult) {
      return NextResponse.json({ found: true, product: offResult, source: 'OpenFoodFacts' })
    }

    return NextResponse.json({ found: false, message: 'Энэ баркод дэлхийн мэдээллийн санд олдсонгүй' })
  } catch (error) {
    console.error('Barcode lookup error:', error)
    return NextResponse.json({ found: false, message: 'API хайлт амжилтгүй боллоо' })
  }
}

async function lookupUPCitemdb(barcode: string): Promise<BarcodeProduct | null> {
  try {
    const response = await fetch(
      `https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(barcode)}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) return null

    const data = await response.json()

    if (data.code === 'OK' && data.items && data.items.length > 0) {
      const item = data.items[0]
      return {
        title: item.title || '',
        description: item.description || '',
        brand: item.brand || '',
        images: item.images || [],
        category: item.category || '',
      }
    }
    return null
  } catch {
    return null
  }
}

async function lookupOpenFoodFacts(barcode: string): Promise<BarcodeProduct | null> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`,
      {
        headers: { 'Accept': 'application/json' },
      }
    )

    if (!response.ok) return null

    const data = await response.json()

    if (data.status === 1 && data.product) {
      const p = data.product
      const images: string[] = []
      if (p.image_url) images.push(p.image_url)
      if (p.image_front_url) images.push(p.image_front_url)

      return {
        title: p.product_name || p.product_name_en || '',
        description: p.generic_name || '',
        brand: p.brands || '',
        images,
        category: p.categories || '',
      }
    }
    return null
  } catch {
    return null
  }
}
