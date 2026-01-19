'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { api, Product } from '@/lib/supabase'
import { useCartStore } from '@/lib/store'

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const { addItem } = useCartStore()

  // For now, using localStorage for wishlist
  useEffect(() => {
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      const ids = JSON.parse(saved) as string[]
      // Fetch products by ids
      const fetchProducts = async () => {
        const { data } = await api.getProducts()
        if (data) {
          setWishlist(data.filter(p => ids.includes(p.id)))
        }
      }
      fetchProducts()
    }
  }, [])

  const removeFromWishlist = (productId: string) => {
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      const ids = JSON.parse(saved) as string[]
      const newIds = ids.filter(id => id !== productId)
      localStorage.setItem('wishlist', JSON.stringify(newIds))
      setWishlist(wishlist.filter(p => p.id !== productId))
    }
  }

  return (
    <main className="min-h-screen pt-[104px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Хадгалсан бараа</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-pink-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Хадгалсан бараа байхгүй</h2>
            <p className="text-slate-500 mb-6">Таалагдсан бараагаа зүрхэн дээр дарж хадгалаарай</p>
            <Link href="/shop" className="px-6 py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition-colors">
              Дэлгүүр үзэх
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {wishlist.map((product) => (
              <div key={product.id} className="group relative">
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4">
                    <img
                      src={product.image_url || 'https://via.placeholder.com/400'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-pink-500 font-semibold mb-1">{product.brand?.name}</p>
                    <h3 className="font-bold mb-2 group-hover:text-pink-500 transition-colors">{product.name}</h3>
                    <span className="font-bold">${product.price}</span>
                  </div>
                </Link>
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => {
                      if (product.sizes?.[0] && product.colors?.[0]) {
                        addItem(product, 1, product.sizes[0], product.colors[0])
                      }
                    }}
                    className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg hover:bg-pink-600 transition-colors text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
