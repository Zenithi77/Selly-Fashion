'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { api, Product, Brand } from '@/lib/supabase'
import { useCartStore, useWishlistStore } from '@/lib/store'

export default function BrandPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [brand, setBrand] = useState<Brand | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  const addToCart = useCartStore(state => state.addItem)
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      // Get brand by slug
      const brandRes = await api.getBrandBySlug(slug)
      
      if (brandRes.data) {
        setBrand(brandRes.data)
        
        // Get products for this brand
        const productsRes = await api.getProducts({ brand: brandRes.data.id })
        if (productsRes.data) {
          setProducts(productsRes.data)
        }
      }
      
      setLoading(false)
    }
    
    fetchData()
  }, [slug])

  const isInWishlist = (productId: string) => wishlistItems.some(item => item.id === productId)

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-[104px] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    )
  }

  if (!brand) {
    return (
      <main className="min-h-screen pt-[104px] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Брэнд олдсонгүй</h1>
          <Link href="/shop" className="text-pink-500 hover:underline">
            Дэлгүүр рүү буцах
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-[104px] bg-slate-50">
      {/* Hero */}
      <header className="py-16 px-4 bg-gradient-to-r from-pink-100 to-transparent">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-slate-500 hover:text-pink-500">Нүүр</Link>
            <span className="text-slate-300">/</span>
            <Link href="/brands-types" className="text-slate-500 hover:text-pink-500">Брэндүүд</Link>
            <span className="text-slate-300">/</span>
            <span className="text-pink-500 font-medium">{brand.name}</span>
          </nav>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-4xl font-bold tracking-widest text-pink-500/30 block mb-4">
                {brand.logo_text || brand.name}
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">{brand.name}</h1>
              {brand.tagline && (
                <p className="text-pink-500 font-semibold mb-6">{brand.tagline}</p>
              )}
              {brand.description && (
                <p className="text-lg text-slate-600 mb-8">{brand.description}</p>
              )}
              <p className="text-sm text-slate-500">{products.length} бүтээгдэхүүн</p>
            </div>
            
            {brand.image_url && (
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={brand.image_url} 
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-10">{brand.name} бүтээгдэхүүнүүд</h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.is_new_arrival && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">NEW</span>
                      )}
                      {product.is_on_sale && product.original_price && product.original_price > product.price && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                          -{Math.round((1 - product.price / product.original_price) * 100)}%
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => { e.preventDefault(); toggleWishlist(product) }}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill={isInWishlist(product.id) ? "currentColor" : "none"} 
                        viewBox="0 0 24 24" 
                        strokeWidth={2} 
                        stroke="currentColor" 
                        className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-pink-500' : 'text-slate-400'}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    </button>
                  </div>
                </Link>
                
                <div className="p-4">
                  <p className="text-xs text-pink-500 font-semibold mb-1">{brand.name}</p>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 hover:text-pink-500 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-pink-500">{product.price.toLocaleString()}₮</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-sm text-slate-400 line-through">{product.original_price.toLocaleString()}₮</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-slate-300 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Бүтээгдэхүүн байхгүй</h3>
            <p className="text-slate-500 mb-6">Энэ брэндэд бүтээгдэхүүн одоогоор байхгүй байна</p>
            <Link 
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white font-medium rounded-xl hover:bg-pink-600 transition-colors"
            >
              Дэлгүүр үзэх
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}

