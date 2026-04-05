import { NextResponse } from 'next/server'

export interface BarcodeProduct {
  title: string
  description: string
  brand: string
  images: string[]
  category: string
  size: string
  color: string
  weight: string
  dimension: string
  model: string
  // Нэмэлт мэдээллүүд
  price: string
  currency: string
  material: string
  gender: string
  ean: string
  upc: string
  asin: string
  stores: { name: string; price: string; url: string; currency: string }[]
  ingredients: string
  nutrition: string
  manufacturer: string
  mpn: string
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
    // 1. Barcode Lookup API (barcodelookup.com) - хамгийн их мэдээлэлтэй, хувцасны мэдээлэл сайн
    const barcodeLookupKey = process.env.BARCODE_LOOKUP_API_KEY
    if (barcodeLookupKey) {
      const blResult = await lookupBarcodeLookup(sanitized, barcodeLookupKey)
      if (blResult) {
        return NextResponse.json({ found: true, product: blResult, source: 'BarcodeLookup' })
      }
    }

    // 2. Go-UPC API - сайн ерөнхий бүтээгдэхүүний мэдээлэл
    const goUpcKey = process.env.GO_UPC_API_KEY
    if (goUpcKey) {
      const goResult = await lookupGoUPC(sanitized, goUpcKey)
      if (goResult) {
        return NextResponse.json({ found: true, product: goResult, source: 'Go-UPC' })
      }
    }

    // 3. UPCitemdb.com API (API key байвал paid, үгүй бол trial)
    const upcApiKey = process.env.UPCITEMDB_API_KEY
    const upcResult = await lookupUPCitemdb(sanitized, upcApiKey)
    if (upcResult) {
      return NextResponse.json({ found: true, product: upcResult, source: 'UPCitemdb' })
    }

    // 4. Open Food Facts (free, unlimited)
    const offResult = await lookupOpenFoodFacts(sanitized)
    if (offResult) {
      return NextResponse.json({ found: true, product: offResult, source: 'OpenFoodFacts' })
    }

    // 5. Open Beauty Facts (гоо сайхны бүтээгдэхүүн)
    const obfResult = await lookupOpenBeautyFacts(sanitized)
    if (obfResult) {
      return NextResponse.json({ found: true, product: obfResult, source: 'OpenBeautyFacts' })
    }

    return NextResponse.json({ found: false, message: 'Энэ баркод дэлхийн мэдээллийн санд олдсонгүй. API key тохируулснаар илүү олон бараа олдох боломжтой.' })
  } catch (error) {
    console.error('Barcode lookup error:', error)
    return NextResponse.json({ found: false, message: 'API хайлт амжилтгүй боллоо' })
  }
}

function emptyProduct(): BarcodeProduct {
  return {
    title: '', description: '', brand: '', images: [], category: '',
    size: '', color: '', weight: '', dimension: '', model: '',
    price: '', currency: '', material: '', gender: '', ean: '', upc: '',
    asin: '', stores: [], ingredients: '', nutrition: '', manufacturer: '', mpn: '',
  }
}

// ==========================================
// 1. Barcode Lookup API (barcodelookup.com)
// Бүртгүүлэх: https://www.barcodelookup.com/api
// Сарын 50 хүсэлт үнэгүй, дараа нь төлбөртэй
// Хувцас, электроник, гоо сайхан г.м. бүх төрлийн бараа
// ==========================================
async function lookupBarcodeLookup(barcode: string, apiKey: string): Promise<BarcodeProduct | null> {
  try {
    const response = await fetch(
      `https://api.barcodelookup.com/v3/products?barcode=${encodeURIComponent(barcode)}&formatted=y&key=${apiKey}`,
      { headers: { 'Accept': 'application/json' } }
    )

    if (!response.ok) return null
    const data = await response.json()

    if (data.products && data.products.length > 0) {
      const item = data.products[0]
      const images: string[] = []
      if (item.images && Array.isArray(item.images)) {
        item.images.forEach((img: string) => { if (img) images.push(img) })
      }

      const stores = (item.stores || []).map((s: { store_name?: string; store_price?: string; product_url?: string; currency_code?: string }) => ({
        name: s.store_name || '',
        price: s.store_price || '',
        url: s.product_url || '',
        currency: s.currency_code || '',
      }))

      return {
        ...emptyProduct(),
        title: item.title || item.product_name || '',
        description: item.description || '',
        brand: item.brand || item.manufacturer || '',
        images,
        category: item.category || '',
        size: item.size || '',
        color: item.color || '',
        weight: item.weight || '',
        dimension: item.dimension || item.length ? `${item.length || ''}x${item.width || ''}x${item.height || ''}` : '',
        model: item.model || '',
        price: stores[0]?.price || '',
        currency: stores[0]?.currency || 'USD',
        material: item.material || '',
        gender: item.gender || '',
        ean: item.barcode_number || barcode,
        upc: item.barcode_number || barcode,
        asin: item.asin || '',
        stores,
        manufacturer: item.manufacturer || '',
        mpn: item.mpn || '',
      }
    }
    return null
  } catch (err) {
    console.error('BarcodeLookup API error:', err)
    return null
  }
}

// ==========================================
// 2. Go-UPC API (go-upc.com)
// Бүртгүүлэх: https://go-upc.com/api
// Сарын 100 хүсэлт үнэгүй
// ==========================================
async function lookupGoUPC(barcode: string, apiKey: string): Promise<BarcodeProduct | null> {
  try {
    const response = await fetch(
      `https://go-upc.com/api/v1/code/${encodeURIComponent(barcode)}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    )

    if (!response.ok) return null
    const data = await response.json()

    if (data.product) {
      const p = data.product
      const images: string[] = []
      if (p.imageUrl) images.push(p.imageUrl)
      if (p.additionalImages && Array.isArray(p.additionalImages)) {
        p.additionalImages.forEach((img: string) => { if (img) images.push(img) })
      }

      return {
        ...emptyProduct(),
        title: p.name || '',
        description: p.description || '',
        brand: p.brand || '',
        images,
        category: p.category || '',
        size: p.size || '',
        color: p.color || '',
        weight: p.weight || '',
        ean: data.codeType === 'EAN' ? barcode : '',
        upc: data.codeType === 'UPC' ? barcode : '',
        manufacturer: p.manufacturer || '',
      }
    }
    return null
  } catch (err) {
    console.error('Go-UPC API error:', err)
    return null
  }
}

// ==========================================
// 3. UPCitemdb.com
// Trial: https://api.upcitemdb.com/prod/trial/lookup (өдөрт 100)
// Paid: API key-тэй бол илүү олон хүсэлт
// ==========================================
async function lookupUPCitemdb(barcode: string, apiKey?: string): Promise<BarcodeProduct | null> {
  try {
    const url = apiKey
      ? `https://api.upcitemdb.com/prod/v1/lookup?upc=${encodeURIComponent(barcode)}`
      : `https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(barcode)}`

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
    if (apiKey) {
      headers['user_key'] = apiKey
      headers['key_type'] = '3scale'
    }

    const response = await fetch(url, { headers })
    if (!response.ok) return null

    const data = await response.json()

    if (data.code === 'OK' && data.items && data.items.length > 0) {
      const item = data.items[0]
      const images: string[] = item.images || []

      // offers-с үнэ, дэлгүүрийн мэдээлэл авах
      const stores = (item.offers || []).map((o: { merchant?: string; price?: string | number; link?: string; currency?: string }) => ({
        name: o.merchant || '',
        price: o.price ? String(o.price) : '',
        url: o.link || '',
        currency: o.currency || 'USD',
      }))

      return {
        ...emptyProduct(),
        title: item.title || '',
        description: item.description || '',
        brand: item.brand || '',
        images,
        category: item.category || '',
        size: item.size || '',
        color: item.color || '',
        weight: item.weight || '',
        dimension: item.dimension || '',
        model: item.model || '',
        ean: item.ean || '',
        upc: item.upc || barcode,
        asin: item.asin || '',
        stores,
        price: stores[0]?.price || '',
        currency: stores[0]?.currency || '',
        manufacturer: item.brand || '',
        mpn: item.mpn || '',
      }
    }
    return null
  } catch {
    return null
  }
}

// ==========================================
// 4. Open Food Facts (free, unlimited)
// ==========================================
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
      if (p.image_front_url && p.image_front_url !== p.image_url) images.push(p.image_front_url)
      if (p.image_front_small_url) images.push(p.image_front_small_url)
      if (p.image_ingredients_url) images.push(p.image_ingredients_url)
      if (p.image_nutrition_url) images.push(p.image_nutrition_url)
      // selected_images-с бүх зургийг нэмэх
      if (p.selected_images) {
        const si = p.selected_images
        for (const key of Object.keys(si)) {
          if (si[key]?.display?.en) images.push(si[key].display.en)
          if (si[key]?.display?.fr) images.push(si[key].display.fr)
        }
      }
      // давхардал арилгах
      const uniqueImages = [...new Set(images)]

      return {
        ...emptyProduct(),
        title: p.product_name || p.product_name_en || '',
        description: p.generic_name || p.generic_name_en || '',
        brand: p.brands || '',
        images: uniqueImages,
        category: p.categories || p.categories_tags?.join(', ') || '',
        size: p.quantity || '',
        weight: p.quantity || '',
        ingredients: p.ingredients_text || p.ingredients_text_en || '',
        nutrition: p.nutriscore_grade ? `Nutri-Score: ${p.nutriscore_grade.toUpperCase()}` : '',
        manufacturer: p.manufacturing_places || '',
        ean: barcode,
      }
    }
    return null
  } catch {
    return null
  }
}

// ==========================================
// 5. Open Beauty Facts (гоо сайхны бүтээгдэхүүн)
// ==========================================
async function lookupOpenBeautyFacts(barcode: string): Promise<BarcodeProduct | null> {
  try {
    const response = await fetch(
      `https://world.openbeautyfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`,
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
      if (p.image_front_url && p.image_front_url !== p.image_url) images.push(p.image_front_url)
      if (p.image_small_url) images.push(p.image_small_url)

      return {
        ...emptyProduct(),
        title: p.product_name || p.product_name_en || '',
        description: p.generic_name || '',
        brand: p.brands || '',
        images: [...new Set(images)],
        category: p.categories || '',
        size: p.quantity || '',
        weight: p.quantity || '',
        ingredients: p.ingredients_text || '',
        manufacturer: p.manufacturing_places || '',
        ean: barcode,
      }
    }
    return null
  } catch {
    return null
  }
}
