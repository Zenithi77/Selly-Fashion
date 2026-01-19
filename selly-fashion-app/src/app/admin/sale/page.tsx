'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api, Product } from '@/lib/supabase'

export default function AdminSalePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [saleProducts, setSaleProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await api.getProducts()
    if (data) {
      setProducts(data)
      setSaleProducts(data.filter(p => p.is_on_sale))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const toggleSale = async (product: Product) => {
    await api.updateProduct(product.id, { is_on_sale: !product.is_on_sale })
    fetchProducts()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateSalePrice = async (productId: string, originalPrice: number, salePrice: number) => {
    await api.updateProduct(productId, { 
      original_price: originalPrice,
      price: salePrice,
      is_on_sale: true
    })
    fetchProducts()
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-[104px] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-[104px] bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin"
              className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Хямдрал удирдах</h1>
              <p className="text-sm text-slate-500">{saleProducts.length} хямдралтай бүтээгдэхүүн</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-rose-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{saleProducts.length}</p>
                <p className="text-sm text-slate-500">Хямдралтай</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${saleProducts.reduce((sum, p) => sum + (p.original_price || p.price) - p.price, 0).toFixed(0)}
                </p>
                <p className="text-sm text-slate-500">Нийт хөнгөлөлт</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {saleProducts.length > 0 
                    ? Math.round(saleProducts.reduce((sum, p) => {
                        const discount = p.original_price ? (1 - p.price / p.original_price) * 100 : 0
                        return sum + discount
                      }, 0) / saleProducts.length)
                    : 0}%
                </p>
                <p className="text-sm text-slate-500">Дундаж хөнгөлөлт</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white">Бүх бүтээгдэхүүн</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Бүтээгдэхүүн</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Анхны үнэ</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Хямдралтай үнэ</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Хөнгөлөлт</th>
                  <th className="text-center px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Хямдрал</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.map((product) => {
                  const discount = product.original_price && product.original_price > product.price
                    ? Math.round((1 - product.price / product.original_price) * 100)
                    : 0
                  
                  return (
                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                            {product.image_url && (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        ${product.original_price || product.price}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-pink-500">${product.price}</span>
                      </td>
                      <td className="px-6 py-4">
                        {discount > 0 ? (
                          <span className="px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-sm font-semibold rounded-full">
                            -{discount}%
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => toggleSale(product)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              product.is_on_sale ? 'bg-pink-500' : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                              product.is_on_sale ? 'left-7' : 'left-1'
                            }`}></span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
