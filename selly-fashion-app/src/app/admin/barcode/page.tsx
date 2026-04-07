'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { api, Product } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'

const BarcodeScanner = dynamic(() => import('@/components/BarcodeScanner'), { ssr: false })

export default function AdminBarcodePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showScanner, setShowScanner] = useState(false)
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null)
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)
  const [apiLookup, setApiLookup] = useState<{
    loading: boolean
    found: boolean
    product?: {
      title: string; description: string; brand: string; images: string[]; category: string
      size?: string; color?: string; weight?: string; model?: string; price?: string; currency?: string
      material?: string; gender?: string; ean?: string; upc?: string; asin?: string; manufacturer?: string; mpn?: string
      stores?: { name: string; price: string; url: string; currency: string }[]
      ingredients?: string; nutrition?: string
    }
    source?: string
    message?: string
  } | null>(null)
  const [scanHistory, setScanHistory] = useState<{ barcode: string; product?: Product; apiProduct?: { title: string }; time: Date }[]>([])
  const { isAdmin } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin && !loading) {
      router.push('/login')
      return
    }

    const fetchProducts = async () => {
      const { data } = await api.getProducts()
      if (data) setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [isAdmin, router, loading])

  const handleScan = useCallback(async (barcode: string) => {
    setShowScanner(false)
    setScannedBarcode(barcode)
    setApiLookup(null)

    const found = products.find(p => p.barcode === barcode)
    setScannedProduct(found || null)

    if (!found) {
      // Not in local DB - try global barcode API
      setApiLookup({ loading: true, found: false })
      try {
        const res = await fetch(`/api/barcode-lookup?barcode=${encodeURIComponent(barcode)}`)
        const data = await res.json()
        
        if (data.found && data.product) {
          setApiLookup({ loading: false, found: true, product: data.product, source: data.source })
          setScanHistory(prev => [
            { barcode, apiProduct: data.product, time: new Date() },
            ...prev.slice(0, 19)
          ])
        } else {
          setApiLookup({ loading: false, found: false, message: data.message })
          setScanHistory(prev => [
            { barcode, time: new Date() },
            ...prev.slice(0, 19)
          ])
        }
      } catch {
        setApiLookup({ loading: false, found: false, message: 'API хайлт амжилтгүй' })
        setScanHistory(prev => [
          { barcode, time: new Date() },
          ...prev.slice(0, 19)
        ])
      }
    } else {
      setScanHistory(prev => [
        { barcode, product: found, time: new Date() },
        ...prev.slice(0, 19)
      ])
    }
  }, [products])

  if (loading) {
    return (
      <main className="min-h-screen pt-[104px] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-[104px] bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin"
              className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Баркод скан</h1>
              <p className="text-sm text-slate-500">Камераар баркод уншуулж барааг хайх</p>
            </div>
          </div>
        </div>

        {/* Scan Button */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-purple-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Баркод уншуулах</h2>
          <p className="text-slate-500 mb-6">Камераа ашиглан бүтээгдэхүүний баркодыг уншуулна уу</p>
          <button
            onClick={() => setShowScanner(true)}
            className="px-8 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors text-lg inline-flex items-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
            Камер нээх
          </button>
        </div>

        {/* Scanned Result */}
        {scannedBarcode && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Скан хийсэн үр дүн</h3>
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-slate-500">Баркод дугаар:</p>
              <p className="text-xl font-mono font-bold text-slate-900">{scannedBarcode}</p>
            </div>

            {scannedProduct ? (
              <div className="border border-green-200 bg-green-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span className="font-semibold text-green-800">Энэ бараа аль хэдийн нэмэгдсэн байна!</span>
                </div>
                <p className="text-xs text-green-600 mb-3 ml-7">Дотоод мэдээллийн санд бүртгэлтэй бараа.</p>
                <div className="flex items-center gap-4">
                  {scannedProduct.image_url && (
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img src={scannedProduct.image_url} alt={scannedProduct.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{scannedProduct.name}</h4>
                    <p className="text-sm text-slate-600">₮{scannedProduct.price?.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">Нөөц: {scannedProduct.stock_quantity}</p>
                    {scannedProduct.sizes && scannedProduct.sizes.length > 0 && (
                      <p className="text-xs text-slate-500">Хэмжээ: {scannedProduct.sizes.join(', ')}</p>
                    )}
                    {scannedProduct.colors && scannedProduct.colors.length > 0 && (
                      <p className="text-xs text-slate-500">Өнгө: {scannedProduct.colors.join(', ')}</p>
                    )}
                  </div>
                  <Link
                    href={`/admin/products`}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
                  >
                    Засах
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* API Lookup Loading */}
                {apiLookup?.loading && (
                  <div className="border border-blue-200 bg-blue-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-blue-700">Дэлхийн баркод мэдээллийн сангаас хайж байна...</span>
                    </div>
                  </div>
                )}

                {/* API Found */}
                {apiLookup && !apiLookup.loading && apiLookup.found && apiLookup.product && (
                  <div className="border border-blue-200 bg-blue-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                      </svg>
                      <span className="font-semibold text-blue-800">Дэлхийн мэдээллийн сангаас олдлоо!</span>
                      <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">{apiLookup.source}</span>
                    </div>

                    {/* Зурагнууд */}
                    {apiLookup.product.images && apiLookup.product.images.length > 0 && (
                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {apiLookup.product.images.slice(0, 6).map((img, idx) => (
                          <div key={idx} className="w-24 h-28 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-blue-100">
                            <img src={img} alt={`${apiLookup.product?.title} - ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Үндсэн мэдээлэл */}
                    <div className="space-y-2 mb-4">
                      <h4 className="font-bold text-lg text-slate-900">{apiLookup.product.title}</h4>
                      {apiLookup.product.description && (
                        <p className="text-sm text-slate-600">{apiLookup.product.description}</p>
                      )}
                    </div>

                    {/* Дэлгэрэнгүй мэдээлэл grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {apiLookup.product.brand && (
                        <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                          <p className="text-xs text-slate-400">Брэнд</p>
                          <p className="text-sm font-semibold text-slate-900">{apiLookup.product.brand}</p>
                        </div>
                      )}
                      {apiLookup.product.category && (
                        <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                          <p className="text-xs text-slate-400">Ангилал</p>
                          <p className="text-sm font-semibold text-slate-900">{apiLookup.product.category}</p>
                        </div>
                      )}
                      {apiLookup.product.price && (
                        <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                          <p className="text-xs text-slate-400">Үнэ</p>
                          <p className="text-sm font-bold text-green-700">{apiLookup.product.currency || '$'}{apiLookup.product.price}</p>
                        </div>
                      )}
                      {apiLookup.product.color && (
                        <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                          <p className="text-xs text-slate-400">Өнгө</p>
                          <p className="text-sm font-semibold text-slate-900">{apiLookup.product.color}</p>
                        </div>
                      )}
                      {apiLookup.product.size && (
                        <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                          <p className="text-xs text-slate-400">Хэмжээ</p>
                          <p className="text-sm font-semibold text-slate-900">{apiLookup.product.size}</p>
                        </div>
                      )}
                      {apiLookup.product.material && (
                        <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                          <p className="text-xs text-slate-400">Материал</p>
                          <p className="text-sm font-semibold text-slate-900">{apiLookup.product.material}</p>
                        </div>
                      )}
                      {apiLookup.product.gender && (
                        <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                          <p className="text-xs text-slate-400">Хүйс</p>
                          <p className="text-sm font-semibold text-slate-900">{apiLookup.product.gender}</p>
                        </div>
                      )}
                      {apiLookup.product.weight && (
                        <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                          <p className="text-xs text-slate-400">Жин</p>
                          <p className="text-sm font-semibold text-slate-900">{apiLookup.product.weight}</p>
                        </div>
                      )}
                      {apiLookup.product.model && (
                        <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                          <p className="text-xs text-slate-400">Загвар</p>
                          <p className="text-sm font-semibold text-slate-900">{apiLookup.product.model}</p>
                        </div>
                      )}
                      {apiLookup.product.manufacturer && apiLookup.product.manufacturer !== apiLookup.product.brand && (
                        <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                          <p className="text-xs text-slate-400">Үйлдвэрлэгч</p>
                          <p className="text-sm font-semibold text-slate-900">{apiLookup.product.manufacturer}</p>
                        </div>
                      )}
                      {(apiLookup.product.ean || apiLookup.product.upc) && (
                        <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                          <p className="text-xs text-slate-400">EAN/UPC</p>
                          <p className="text-sm font-mono font-semibold text-slate-900">{apiLookup.product.ean || apiLookup.product.upc}</p>
                        </div>
                      )}
                      {apiLookup.product.asin && (
                        <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                          <p className="text-xs text-slate-400">ASIN</p>
                          <p className="text-sm font-mono font-semibold text-slate-900">{apiLookup.product.asin}</p>
                        </div>
                      )}
                    </div>

                    {/* Дэлгүүрүүдийн үнэ */}
                    {apiLookup.product.stores && apiLookup.product.stores.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Дэлгүүрүүд дэх үнэ</p>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {apiLookup.product.stores.map((store, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-2 border border-blue-100 text-sm">
                              <span className="text-slate-700 font-medium">{store.name || 'Дэлгүүр'}</span>
                              <div className="flex items-center gap-2">
                                {store.price && <span className="font-bold text-green-700">{store.currency || '$'}{store.price}</span>}
                                {store.url && (
                                  <a href={store.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs">
                                    Линк →
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ingredients (хүнсний/гоо сайхны бүтээгдэхүүн) */}
                    {apiLookup.product.ingredients && (
                      <div className="bg-white rounded-lg p-2.5 border border-blue-100 mb-4">
                        <p className="text-xs text-slate-400 mb-1">Орц, найрлага</p>
                        <p className="text-sm text-slate-700 line-clamp-3">{apiLookup.product.ingredients}</p>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <Link
                        href={`/admin/products?barcode=${encodeURIComponent(scannedBarcode || '')}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Энэ мэдээллээр бүтээгдэхүүн нэмэх
                      </Link>
                    </div>
                  </div>
                )}

                {/* Not found anywhere */}
                {apiLookup && !apiLookup.loading && !apiLookup.found && (
                  <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                      </svg>
                      <span className="font-semibold text-amber-800">Хаанаас ч олдсонгүй</span>
                    </div>
                    <p className="text-sm text-amber-700 mb-1">Дотоод мэдээллийн сан болон дэлхийн баркод мэдээллийн сангаас олдсонгүй.</p>
                    <p className="text-xs text-amber-600 mb-3">{apiLookup.message}</p>
                    <Link
                      href={`/admin/products?barcode=${encodeURIComponent(scannedBarcode || '')}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Гараар бүтээгдэхүүн нэмэх
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Scan History */}
        {scanHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Скан түүх</h3>
            <div className="space-y-3">
              {scanHistory.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.product ? 'bg-green-100' : item.apiProduct ? 'bg-blue-100' : 'bg-amber-100'}`}>
                      {item.product ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      ) : item.apiProduct ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-amber-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-mono text-sm font-medium text-slate-900">{item.barcode}</p>
                      <p className="text-xs text-slate-500">
                        {item.product ? item.product.name : item.apiProduct ? `${item.apiProduct.title} (API)` : 'Олдсонгүй'} • {item.time.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Barcode Scanner Modal */}
        {showScanner && (
          <BarcodeScanner
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    </main>
  )
}
