'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api, Product } from '@/lib/supabase'
import { useCartStore } from '@/lib/store'

export default function SalePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCartStore()

  useEffect(() => {
    const fetchSaleProducts = async () => {
      setLoading(true)
      const { data } = await api.getProducts({ onSale: true })
      if (data) setProducts(data)
      setLoading(false)
    }
    fetchSaleProducts()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen pt-[104px] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-[104px]">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-4 animate-pulse">
            🔥 ХЯМДРАЛ 🔥
          </span>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-4">
            50% ХҮРТЭЛ ХЯМДРАЛ
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Шилдэг брэндүүдийн бүтээгдэхүүнийг хямд үнээр аваарай. 
            Хязгаарлагдмал хугацаанд!
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-pink-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Хямдралтай бараа байхгүй байна</h2>
            <p className="text-slate-500 mb-6">Тун удахгүй шинэ хямдрал ирнэ!</p>
            <Link href="/shop" className="px-6 py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition-colors">
              Дэлгүүр үзэх
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => {
              const discount = product.original_price 
                ? Math.round((1 - product.price / product.original_price) * 100) 
                : 0

              return (
                <Link href={`/product/${product.slug}`} key={product.id} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4">
                    <img
                      src={product.image_url || 'https://via.placeholder.com/400'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Discount Badge */}
                    <span className="absolute top-4 left-4 px-3 py-1 bg-rose-500 text-white text-sm font-bold rounded-full shadow-lg">
                      -{discount}%
                    </span>
                    {/* Quick Add Button */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        if (product.sizes?.[0] && product.colors?.[0]) {
                          addItem(product, 1, product.sizes[0], product.colors[0])
                        }
                      }}
                      className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-pink-500 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <p className="text-xs text-pink-500 font-semibold mb-1">{product.brand?.name}</p>
                    <h3 className="font-bold mb-2 group-hover:text-pink-500 transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-500">${product.price}</span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-slate-400 line-through">${product.original_price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Sale Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 lg:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 max-w-xl">
            <span className="inline-block px-4 py-1 bg-pink-500 text-white text-sm font-semibold rounded-full mb-4">
              Онцгой санал
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Бүх захиалгад үнэгүй хүргэлт
            </h2>
            <p className="text-slate-400 mb-6">
              $100-с дээш захиалгад үнэгүй хүргэлт хийж байна. 
              Та одоо захиалгаа өгөөд хямдралын давуу талыг ашиглаарай!
            </p>
            <Link 
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition-colors"
            >
              Дэлгүүр үзэх
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
