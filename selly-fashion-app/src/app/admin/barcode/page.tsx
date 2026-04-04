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
  const [scanHistory, setScanHistory] = useState<{ barcode: string; product?: Product; time: Date }[]>([])
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

  const handleScan = useCallback((barcode: string) => {
    setShowScanner(false)
    setScannedBarcode(barcode)

    const found = products.find(p => p.barcode === barcode)
    setScannedProduct(found || null)

    setScanHistory(prev => [
      { barcode, product: found, time: new Date() },
      ...prev.slice(0, 19) // Keep last 20 scans
    ])
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
                <div className="flex items-center gap-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span className="font-semibold text-green-800">Бүтээгдэхүүн олдлоо!</span>
                </div>
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
              <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                  <span className="font-semibold text-amber-800">Бүтээгдэхүүн олдсонгүй</span>
                </div>
                <p className="text-sm text-amber-700 mb-3">Энэ баркодтой бүтээгдэхүүн бүртгэлд байхгүй байна.</p>
                <Link
                  href={`/admin/products`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Шинэ бүтээгдэхүүн нэмэх
                </Link>
              </div>
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
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.product ? 'bg-green-100' : 'bg-amber-100'}`}>
                      {item.product ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
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
                        {item.product ? item.product.name : 'Олдсонгүй'} • {item.time.toLocaleTimeString()}
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
