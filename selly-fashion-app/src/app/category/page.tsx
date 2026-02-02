'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api, ClothingType } from '@/lib/supabase'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ClothingType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await api.getCategories()
      if (result.data) setCategories(result.data)
      setLoading(false)
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen pt-[104px] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-[104px] bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-100 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-sm mb-4 uppercase tracking-widest">
            Бүх ангилал
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Ангилалаар хайх</h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Манай бүх бүтээгдэхүүний ангилалуудыг үзнэ үү
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/category/${category.slug}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={category.image_url || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80'}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-white">
                  <h3 className="text-xl lg:text-2xl font-bold tracking-wider mb-2 text-center">
                    {category.name.toUpperCase()}
                  </h3>
                  <div className="h-0.5 w-0 group-hover:w-16 bg-pink-500 transition-all duration-500"></div>
                  <span className="mt-3 text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 text-pink-200">
                    Үзэх
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">Одоогоор ангилал байхгүй байна</p>
              <Link href="/shop" className="mt-4 inline-block text-pink-500 font-semibold hover:underline">
                Дэлгүүр үзэх →
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
