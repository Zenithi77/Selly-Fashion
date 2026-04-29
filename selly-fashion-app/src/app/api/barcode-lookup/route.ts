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
  // ╨¥╤ì╨╝╤ì╨╗╤é ╨╝╤ì╨┤╤ì╤ì╨╗╨╗╥»╥»╨┤
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
    return NextResponse.json({ error: '╨æ╨░╤Ç╨║╨╛╨┤ ╨┤╤â╨│╨░╨░╤Ç ╤ê╨░╨░╤Ç╨┤╨╗╨░╨│╨░╤é╨░╨╣' }, { status: 400 })
  }

  // Sanitize barcode - only allow alphanumeric
  const sanitized = barcode.replace(/[^a-zA-Z0-9]/g, '')
  if (!sanitized || sanitized.length < 4) {
    return NextResponse.json({ error: '╨æ╤â╤Ç╤â╤â ╨▒╨░╤Ç╨║╨╛╨┤ ╨┤╤â╨│╨░╨░╤Ç' }, { status: 400 })
  }

  const errors: string[] = []

  try {
    // 1. Barcode Lookup API (barcodelookup.com) - ╤à╨░╨╝╨│╨╕╨╣╨╜ ╨╕╤à ╨╝╤ì╨┤╤ì╤ì╨╗╤ì╨╗╤é╤ì╨╣, ╤à╤â╨▓╤å╨░╤ü╨╜╤ï ╨╝╤ì╨┤╤ì╤ì╨╗╤ì╨╗ ╤ü╨░╨╣╨╜
    const barcodeLookupKey = process.env.BARCODE_LOOKUP_API_KEY
    if (barcodeLookupKey) {
      const blResult = await lookupBarcodeLookup(sanitized, barcodeLookupKey)
      if (blResult) {
        return NextResponse.json({ found: true, product: blResult, source: 'BarcodeLookup' })
      }
    }

    // 2. Go-UPC API - ╤ü╨░╨╣╨╜ ╨╡╤Ç╙⌐╨╜╤à╨╕╨╣ ╨▒╥»╤é╤ì╤ì╨│╨┤╤ì╤à╥»╥»╨╜╨╕╨╣ ╨╝╤ì╨┤╤ì╤ì╨╗╤ì╨╗
    const goUpcKey = process.env.GO_UPC_API_KEY
    if (goUpcKey) {
      const goResult = await lookupGoUPC(sanitized, goUpcKey)
      if (goResult) {
        return NextResponse.json({ found: true, product: goResult, source: 'Go-UPC' })
      }
    }

    // 3. UPCitemdb.com API (API key ╨▒╨░╨╣╨▓╨░╨╗ paid, ╥»╨│╥»╨╣ ╨▒╨╛╨╗ trial)
    const upcApiKey = process.env.UPCITEMDB_API_KEY
    const upcResult = await lookupUPCitemdb(sanitized, upcApiKey)
    if (upcResult.product) {
      return NextResponse.json({ found: true, product: upcResult.product, source: 'UPCitemdb' })
    }
    if (upcResult.error) errors.push(`UPCitemdb: ${upcResult.error}`)

    // 4. Barcode Monster (free, no limit)
    const monsterResult = await lookupBarcodeMonster(sanitized)
    if (monsterResult.product) {
      return NextResponse.json({ found: true, product: monsterResult.product, source: 'BarcodeMonster' })
    }
    if (monsterResult.error) errors.push(`BarcodeMonster: ${monsterResult.error}`)

    // 5. Open Food Facts (free, unlimited)
    const offResult = await lookupOpenFoodFacts(sanitized)
    if (offResult) {
      return NextResponse.json({ found: true, product: offResult, source: 'OpenFoodFacts' })
    }

    // 6. Open Beauty Facts (╨│╨╛╨╛ ╤ü╨░╨╣╤à╨╜╤ï ╨▒╥»╤é╤ì╤ì╨│╨┤╤ì╤à╥»╥»╨╜)
    const obfResult = await lookupOpenBeautyFacts(sanitized)
    if (obfResult) {
      return NextResponse.json({ found: true, product: obfResult, source: 'OpenBeautyFacts' })
    }

    // 7. EAN-Search.org API (free: 20 lookups/day)
    const eanSearchKey = process.env.EAN_SEARCH_API_KEY
    if (eanSearchKey) {
      const eanResult = await lookupEanSearch(sanitized, eanSearchKey)
      if (eanResult) {
        return NextResponse.json({ found: true, product: eanResult, source: 'EAN-Search' })
      }
    }

    // 8. Barcode Spider (free, no key needed)
    const spiderResult = await lookupBarcodeSpider(sanitized)
    if (spiderResult) {
      return NextResponse.json({ found: true, product: spiderResult, source: 'BarcodeSpider' })
    }

    // 9. Open Product Data (free, community database)
    const opdResult = await lookupOpenProductData(sanitized)
    if (opdResult) {
      return NextResponse.json({ found: true, product: opdResult, source: 'OpenProductData' })
    }

    const message = errors.length > 0
      ? `╨₧╨╗╨┤╤ü╨╛╨╜╨│╥»╨╣. ${errors.join('; ')}. API key ╤é╨╛╤à╨╕╤Ç╤â╤â╨╗╤ü╨╜╨░╨░╤Ç ╨╕╨╗╥»╥» ╨╛╨╗╨╛╨╜ ╨▒╨░╤Ç╨░╨░ ╨╛╨╗╨┤╨╛╤à ╨▒╨╛╨╗╨╛╨╝╨╢╤é╨╛╨╣.`
      : '╨¡╨╜╤ì ╨▒╨░╤Ç╨║╨╛╨┤ ╨┤╤ì╨╗╤à╨╕╨╣╨╜ ╨╝╤ì╨┤╤ì╤ì╨╗╨╗╨╕╨╣╨╜ ╤ü╨░╨╜╨┤ ╨╛╨╗╨┤╤ü╨╛╨╜╨│╥»╨╣. API key ╤é╨╛╤à╨╕╤Ç╤â╤â╨╗╤ü╨╜╨░╨░╤Ç ╨╕╨╗╥»╥» ╨╛╨╗╨╛╨╜ ╨▒╨░╤Ç╨░╨░ ╨╛╨╗╨┤╨╛╤à ╨▒╨╛╨╗╨╛╨╝╨╢╤é╨╛╨╣.'

    return NextResponse.json({ found: false, message })
  } catch (error) {
    console.error('Barcode lookup error:', error)
    return NextResponse.json({ found: false, message: `API ╤à╨░╨╣╨╗╤é ╨░╨╝╨╢╨╕╨╗╤é╨│╥»╨╣. ${errors.length > 0 ? errors.join('; ') : ''}` })
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
// ╨æ╥»╤Ç╤é╨│╥»╥»╨╗╤ì╤à: https://www.barcodelookup.com/api
// ╨í╨░╤Ç╤ï╨╜ 50 ╤à╥»╤ü╤ì╨╗╤é ╥»╨╜╤ì╨│╥»╨╣, ╨┤╨░╤Ç╨░╨░ ╨╜╤î ╤é╙⌐╨╗╨▒╙⌐╤Ç╤é╤ì╨╣
// ╨Ñ╤â╨▓╤å╨░╤ü, ╤ì╨╗╨╡╨║╤é╤Ç╨╛╨╜╨╕╨║, ╨│╨╛╨╛ ╤ü╨░╨╣╤à╨░╨╜ ╨│.╨╝. ╨▒╥»╤à ╤é╙⌐╤Ç╨╗╨╕╨╣╨╜ ╨▒╨░╤Ç╨░╨░
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
// ╨æ╥»╤Ç╤é╨│╥»╥»╨╗╤ì╤à: https://go-upc.com/api
// ╨í╨░╤Ç╤ï╨╜ 100 ╤à╥»╤ü╤ì╨╗╤é ╥»╨╜╤ì╨│╥»╨╣
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
// Trial: https://api.upcitemdb.com/prod/trial/lookup (╙⌐╨┤╙⌐╤Ç╤é 100)
// Paid: API key-╤é╤ì╨╣ ╨▒╨╛╨╗ ╨╕╨╗╥»╥» ╨╛╨╗╨╛╨╜ ╤à╥»╤ü╤ì╨╗╤é
// ==========================================
async function lookupUPCitemdb(barcode: string, apiKey?: string): Promise<{ product?: BarcodeProduct; error?: string }> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

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

    const response = await fetch(url, { headers, signal: controller.signal })
    clearTimeout(timeout)

    if (response.status === 429) {
      return { error: apiKey ? 'Rate limit ╤à╤ì╤é╤ì╤Ç╤ü╤ì╨╜' : '╙¿╨┤╤Ç╨╕╨╣╨╜ ╨╗╨╕╨╝╨╕╤é (100) ╨┤╤â╤â╤ü╤ü╨░╨╜. ╨£╨░╤Ç╨│╨░╨░╤ê ╨┤╨░╤à╨╕╨╜ ╨╛╤Ç╨╛╨╗╨┤╨╛╨╜╨╛ ╤â╤â' }
    }
    if (!response.ok) {
      return { error: `HTTP ${response.status}` }
    }

    const data = await response.json()

    if (data.code === 'EXCEED_LIMIT') {
      return { error: apiKey ? 'Rate limit ╤à╤ì╤é╤ì╤Ç╤ü╤ì╨╜' : '╙¿╨┤╤Ç╨╕╨╣╨╜ ╨╗╨╕╨╝╨╕╤é (100) ╨┤╤â╤â╤ü╤ü╨░╨╜. ╨£╨░╤Ç╨│╨░╨░╤ê ╨┤╨░╤à╨╕╨╜ ╨╛╤Ç╨╛╨╗╨┤╨╛╨╜╨╛ ╤â╤â' }
    }

    if (data.code === 'OK' && data.items && data.items.length > 0) {
      const item = data.items[0]
      const images: string[] = item.images || []

      // offers-╤ü ╥»╨╜╤ì, ╨┤╤ì╨╗╨│╥»╥»╤Ç╨╕╨╣╨╜ ╨╝╤ì╨┤╤ì╤ì╨╗╤ì╨╗ ╨░╨▓╨░╤à
      const stores = (item.offers || []).map((o: { merchant?: string; price?: string | number; link?: string; currency?: string }) => ({
        name: o.merchant || '',
        price: o.price ? String(o.price) : '',
        url: o.link || '',
        currency: o.currency || 'USD',
      }))

      return {
        product: {
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
    }
    return {}
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { error: '╨Ñ╤â╨│╨░╤å╨░╨░ ╤à╤ì╤é╤ì╤Ç╤ü╤ì╨╜ (timeout)' }
    }
    return { error: '╨Ñ╨╛╨╗╨▒╨╛╨╗╤é ╨░╨╝╨╢╨╕╨╗╤é╨│╥»╨╣' }
  }
}

// ==========================================
// 4. Barcode Monster (free, no limit)
// ==========================================
async function lookupBarcodeMonster(barcode: string): Promise<{ product?: BarcodeProduct; error?: string }> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(
      `https://barcode.monster/api/${encodeURIComponent(barcode)}`,
      {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      }
    )

    clearTimeout(timeout)

    if (!response.ok) {
      return { error: `HTTP ${response.status}` }
    }

    const data = await response.json()

    if (data.description || data.company) {
      return {
        product: {
          ...emptyProduct(),
          title: data.description || '',
          description: data.description || '',
          brand: data.company || '',
          images: data.image_url ? [data.image_url] : [],
          category: data.category || '',
          size: data.size || '',
          ean: barcode,
        }
      }
    }
    return {}
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { error: '╨Ñ╤â╨│╨░╤å╨░╨░ ╤à╤ì╤é╤ì╤Ç╤ü╤ì╨╜ (timeout)' }
    }
    return { error: '╨Ñ╨╛╨╗╨▒╨╛╨╗╤é ╨░╨╝╨╢╨╕╨╗╤é╨│╥»╨╣' }
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
      // selected_images-╤ü ╨▒╥»╤à ╨╖╤â╤Ç╨│╨╕╨╣╨│ ╨╜╤ì╨╝╤ì╤à
      if (p.selected_images) {
        const si = p.selected_images
        for (const key of Object.keys(si)) {
          if (si[key]?.display?.en) images.push(si[key].display.en)
          if (si[key]?.display?.fr) images.push(si[key].display.fr)
        }
      }
      // ╨┤╨░╨▓╤à╨░╤Ç╨┤╨░╨╗ ╨░╤Ç╨╕╨╗╨│╨░╤à
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
// 5. Open Beauty Facts (╨│╨╛╨╛ ╤ü╨░╨╣╤à╨╜╤ï ╨▒╥»╤é╤ì╤ì╨│╨┤╤ì╤à╥»╥»╨╜)
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

// ==========================================
// 7. EAN-Search.org API
// ╨æ╥»╤Ç╤é╨│╥»╥»╨╗╤ì╤à: https://www.ean-search.org/ean-database-api.html
// ╥«╨╜╤ì╨│╥»╨╣: ╙¿╨┤╙⌐╤Ç╤é 20 ╤à╥»╤ü╤ì╨╗╤é
// ╨Ñ╤â╨▓╤å╨░╤ü, ╤ì╨╗╨╡╨║╤é╤Ç╨╛╨╜╨╕╨║ ╨╖╤ì╤Ç╤ì╨│ ╨▒╥»╤à╨╕╨╣ ╨╗ ╨▒╨░╤Ç╨░╨░
// ==========================================
async function lookupEanSearch(barcode: string, apiKey: string): Promise<BarcodeProduct | null> {
  try {
    const response = await fetch(
      `https://api.ean-search.org/api?token=${apiKey}&op=barcode-lookup&ean=${encodeURIComponent(barcode)}&format=json`,
      { headers: { 'Accept': 'application/json' } }
    )

    if (!response.ok) return null
    const data = await response.json()

    // EAN-Search returns array or object
    const item = Array.isArray(data) ? data[0] : data
    if (!item || item.error || !item.name) return null

    return {
      ...emptyProduct(),
      title: item.name || '',
      category: item.categoryName || item.category || '',
      ean: item.ean || barcode,
      brand: item.brand || '',
    }
  } catch {
    return null
  }
}

// ==========================================
// 8. Barcode Spider
// API: https://api.barcodespider.com/v1/lookup?token=KEY&upc=BARCODE
// token ╨╜╤î query parameter ╨┤╤ì╤ì╤Ç ╤Å╨▓╨╜╨░
// ==========================================
async function lookupBarcodeSpider(barcode: string): Promise<BarcodeProduct | null> {
  try {
    const apiToken = process.env.BARCODE_SPIDER_API_KEY
    if (!apiToken) return null

    const response = await fetch(
      `https://api.barcodespider.com/v1/lookup?token=${apiToken}&upc=${encodeURIComponent(barcode)}`,
      { headers: { 'Accept': 'application/json' } }
    )

    if (!response.ok) return null
    const data = await response.json()

    if (data.item_response?.code === 200 && data.item_attributes) {
      const item = data.item_attributes
      const images: string[] = []
      if (item.image) images.push(item.image)

      return {
        ...emptyProduct(),
        title: item.title || '',
        description: item.description || '',
        brand: item.brand || item.manufacturer || '',
        images,
        category: item.category || '',
        ean: item.ean || barcode,
        upc: item.upc || barcode,
        manufacturer: item.manufacturer || '',
        model: item.model || '',
        color: item.color || '',
        size: item.size || '',
        weight: item.weight || '',
      }
    }
    return null
  } catch {
    return null
  }
}

// ==========================================
// 9. Open Product Data (community, free)
// https://product-open-data.com
// ==========================================
async function lookupOpenProductData(barcode: string): Promise<BarcodeProduct | null> {
  try {
    const response = await fetch(
      `https://product-open-data.com/api/v0/product/${encodeURIComponent(barcode)}.json`,
      { headers: { 'Accept': 'application/json' } }
    )

    if (!response.ok) return null
    const data = await response.json()

    if (data.status === 'success' && data.product) {
      const p = data.product
      const images: string[] = []
      if (p.image_url) images.push(p.image_url)

      return {
        ...emptyProduct(),
        title: p.name || p.product_name || '',
        description: p.description || '',
        brand: p.brand || '',
        images,
        category: p.category || '',
        ean: barcode,
      }
    }
    return null
  } catch {
    return null
  }
}
