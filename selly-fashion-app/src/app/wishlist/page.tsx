'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Product } from '@/lib/supabase'
import { useCartStore, useWishlistStore } from '@/lib/store'

export default function WishlistPage() {
  const { items: wishlist, removeItem } = useWishlistStore()
  const { addItem } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddToCart = (product: Product) => {
    const size = product.sizes?.[0] || 'M'
    const color = product.colors?.[0] || 'Default'
    addItem(product, 1, size, color)
  }

  if (!mounted) {
    return (
      <main className="min-h-screen pt-[104px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[3/4] bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-[104px]">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Хадгалсан бараа
          </h1>
          {wishlist.length > 0 && (
            <span className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-medium">
              {wishlist.length} бараа
            </span>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
            <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-pink-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Хадгалсан бараа байхгүй</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Таалагдсан бараагаа зүрхэн дээр дарж хадгалаарай
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg shadow-pink-500/25">
              Дэлгүүр үзэх
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {wishlist.map((product) => (
              <div key={product.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={product.image_url || 'https://via.placeholder.com/400'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.is_on_sale && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        SALE
                      </span>
                    )}
                  </div>
                </Link>

                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button 
                    onClick={() => removeItem(product.id)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors"
                    title="Хасах"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg hover:bg-pink-600 transition-colors text-white"
                    title="Сагсанд нэмэх"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </button>
                </div>

                {/* Product info */}
                <div className="p-4">
                  {product.brand && (
                    <p className="text-xs text-pink-500 font-semibold mb-1 uppercase tracking-wide">
                      {product.brand.name}
                    </p>
                  )}
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-pink-500 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-gray-900">
                      {product.price.toLocaleString()}₮
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.original_price.toLocaleString()}₮
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
