'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api, Brand, ClothingType, Product, supabase } from '@/lib/supabase'

export default function Home() {
  const [featuredBrands, setFeaturedBrands] = useState<Brand[]>([])
  const [featuredCategories, setFeaturedCategories] = useState<ClothingType[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [brandsRes, categoriesRes] = await Promise.all([
        api.getFeaturedBrands(5),
        api.getFeaturedCategories(4)
      ])
      if (brandsRes.data) setFeaturedBrands(brandsRes.data)
      if (categoriesRes.data) setFeaturedCategories(categoriesRes.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      // Шинээр ирсэн эсвэл онцлох барааг өгөгдлийн сангаас татах
      const { data } = await supabase
        .from('products')
        .select(`*, brand:brands(*), clothing_type:clothing_types(*)`)
        .or('is_new_arrival.eq.true,is_featured.eq.true')
        .order('created_at', { ascending: false })
        .limit(8)

      if (data && data.length > 0) {
        setFeaturedProducts(data as Product[])
      } else {
        // Fallback: хамгийн сүүлд нэмэгдсэн 8 бараа
        const { data: latest } = await supabase
          .from('products')
          .select(`*, brand:brands(*), clothing_type:clothing_types(*)`)
          .order('created_at', { ascending: false })
          .limit(8)
        if (latest) setFeaturedProducts(latest as Product[])
      }
      setProductsLoading(false)
    }
    fetchProducts()
  }, [])

  // Default brands if none from database
  const defaultBrands = [
    { id: '1', slug: 'lumina', name: 'LUMINA', logo_text: 'LUMINA', tagline: 'HAUTE COUTURE', style: 'italic', image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80' },
    { id: '2', slug: 'velvet', name: 'VELVET', logo_text: 'VELVET', tagline: 'SOFT LUXURY', style: 'normal', image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80' },
    { id: '3', slug: 'aura', name: 'AURA', logo_text: 'AURA', tagline: 'MODERN MINIMAL', style: 'underline', image_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80' },
    { id: '4', slug: 'nova', name: 'NOVA', logo_text: 'NOVA', tagline: 'EXCLUSIVE DROP', style: 'italic', image_url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80' },
    { id: '5', slug: 'eclipse', name: 'ECLIPSE', logo_text: 'ECLIPSE', tagline: 'AVANT-GARDE', style: 'normal', image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80' },
  ]

  const defaultCategories = [
    { id: '1', slug: 'dresses', name: 'DRESSES', image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80' },
    { id: '2', slug: 'tops', name: 'TOPS', image_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80' },
    { id: '3', slug: 'outerwear', name: 'OUTERWEAR', image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80' },
    { id: '4', slug: 'accessories', name: 'ACCESSORIES', image_url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80' },
  ]

  const brands = featuredBrands.length > 0 ? featuredBrands : defaultBrands as unknown as Brand[]
  const categories = featuredCategories.length > 0 ? featuredCategories : defaultCategories as unknown as ClothingType[]

  return (
    <main className="pt-[104px] min-h-screen">
      {/* Hero Section - Premium Brand Showcase */}
      <section className="relative min-h-[90vh] lg:min-h-[85vh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-pink-950">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-pink-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center py-16 lg:py-20">
          {/* Top Badge */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-pink-300 text-xs tracking-[0.25em] uppercase">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
              Premium Collections 2026
            </span>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter mb-6">
              <span className="block">DISCOVER</span>
              <span className="block bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">LUXURY</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Curated collections from the world&apos;s most exclusive fashion houses
            </p>
          </div>

          {/* Brand Grid - 5 Featured Brands from Database */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 max-w-6xl mx-auto w-full">
            {loading ? (
              // Loading skeleton
              Array(5).fill(0).map((_, idx) => (
                <div key={idx} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse"></div>
              ))
            ) : (
              brands.slice(0, 5).map((brand) => {
                // "Other Brands" тусгай карт: онцлох биш бусад бүх брэндийн бараа руу шилжүүлнэ
                const isOther = (brand.slug === 'other-brands' || brand.slug === 'other' ||
                                 (brand.name || '').toLowerCase().trim() === 'other brands')
                const href = isOther
                  ? `/shop?brand=other`
                  : (brand.slug ? `/brand/${brand.slug}` : `/shop?brand=${brand.id}`)
                return (
                <Link 
                  key={brand.id} 
                  href={href} 
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={brand.image_url || `https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80`}
                    alt={`${brand.name} Collection`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-4 lg:p-6 text-white">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="block text-[10px] tracking-[0.3em] text-pink-300 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {brand.tagline || 'EXCLUSIVE'}
                      </span>
                      <h3 className={`text-xl lg:text-2xl font-bold tracking-[0.15em] mb-1 ${brand.style === 'italic' ? 'italic' : ''} ${brand.style === 'underline' ? 'underline decoration-pink-500 decoration-2 underline-offset-4' : ''}`}>
                        {brand.logo_text || brand.name}
                      </h3>
                      <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500 mx-auto"></div>
                    </div>
                    <span className="mt-4 text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 flex items-center gap-2 text-pink-200">
                      EXPLORE
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
                )
              })
            )}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <Link href="/brands-types" className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-semibold tracking-wide hover:bg-white/20 hover:border-pink-500/50 transition-all group">
              VIEW ALL BRANDS
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      {/* Category Grid */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-sm mb-4 uppercase tracking-widest">Categories</span>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-slate-900">SHOP BY CATEGORY</h2>
            <p className="text-slate-600">Find your perfect style</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 max-w-5xl mx-auto">
            {loading ? (
              // Loading skeleton
              Array(4).fill(0).map((_, idx) => (
                <div key={idx} className="aspect-[3/4] rounded-2xl bg-slate-200 animate-pulse"></div>
              ))
            ) : (
              categories.slice(0, 4).map((category) => (
                <Link 
                  key={category.id} 
                  href={category.slug ? `/category/${category.slug}` : `/shop?category=${category.id}`} 
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={category.image_url || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80'}
                    alt={category.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-4 lg:p-6 text-white">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-xl lg:text-2xl font-bold tracking-[0.15em] mb-1 text-center">
                        {category.name.toUpperCase()}
                      </h3>
                      <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500 mx-auto"></div>
                    </div>
                    <span className="mt-4 text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 flex items-center gap-2 text-pink-200">
                      SHOP NOW
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-sm mb-4 uppercase tracking-widest">New In</span>
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">NEW ARRIVALS</h2>
              <p className="text-slate-600">The latest additions to our collection</p>
            </div>
            <Link href="/new-arrivals" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-pink-500 hover:text-pink-600 hover:underline">
              VIEW ALL
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
            {productsLoading ? (
              Array(4).fill(0).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-pink-50 overflow-hidden">
                  <div className="aspect-[3/4] bg-slate-200 animate-pulse"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-slate-200 rounded animate-pulse w-1/3"></div>
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3"></div>
                    <div className="h-3 bg-slate-200 rounded animate-pulse w-1/4"></div>
                  </div>
                </div>
              ))
            ) : featuredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-500">
                Одоогоор бараа байхгүй байна.
              </div>
            ) : (
              featuredProducts.map((product) => {
                const imgSrc = (product.images && product.images[0]) || product.image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80'
                const showSale = product.is_on_sale && product.original_price && product.original_price > product.price
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug || product.id}`}
                    className="group bg-white rounded-2xl border border-pink-50 hover:border-pink-500/30 transition-all overflow-hidden"
                  >
                    <div className="aspect-[3/4] overflow-hidden mb-4 relative">
                      <img
                        src={imgSrc}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {showSale ? (
                        <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">SALE</span>
                      ) : product.is_new_arrival ? (
                        <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                      ) : product.is_featured ? (
                        <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">HOT</span>
                      ) : null}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-pink-500 uppercase tracking-wide mb-1">
                        {product.brand?.name || ''}
                      </p>
                      <h3 className="font-medium mb-1 text-slate-900 line-clamp-1">{product.name}</h3>
                      <p className="text-sm">
                        {showSale ? (
                          <>
                            <span className="text-pink-500 font-semibold">{product.price.toLocaleString()}₮</span>
                            <span className="text-slate-400 line-through ml-2">{product.original_price!.toLocaleString()}₮</span>
                          </>
                        ) : (
                          <span className="text-slate-600">{product.price.toLocaleString()}₮</span>
                        )}
                      </p>
                    </div>
                  </Link>
                )
              })
            )}
          </div>

          <div className="text-center mt-12 sm:hidden">
            <Link href="/new-arrivals" className="inline-flex items-center gap-2 text-sm font-semibold text-pink-500 hover:text-pink-600 hover:underline">
              VIEW ALL NEW ARRIVALS
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
