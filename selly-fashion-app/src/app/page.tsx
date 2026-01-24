'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api, Brand, ClothingType } from '@/lib/supabase'

export default function Home() {
  const [featuredBrands, setFeaturedBrands] = useState<Brand[]>([])
  const [featuredCategories, setFeaturedCategories] = useState<ClothingType[]>([])
  const [loading, setLoading] = useState(true)

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
              brands.slice(0, 5).map((brand, index) => (
                <Link 
                  key={brand.id} 
                  href={`/brand/${brand.slug}`} 
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={brand.image_url || `https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80`}
                    alt={`${brand.name} Collection`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${index === brands.length - 1 ? 'from-pink-900 via-pink-900/50' : 'from-black via-black/40'} to-transparent opacity-70 group-hover:opacity-90 transition-opacity`}></div>
                  
                  {/* Special Badge for last brand */}
                  {index === brands.length - 1 && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-pink-500 text-white text-[10px] tracking-widest rounded-full font-semibold">
                      LIMITED
                    </div>
                  )}
                  
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
              ))
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-sm mb-4 uppercase tracking-widest">Categories</span>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-slate-900">SHOP BY CATEGORY</h2>
            <p className="text-slate-600">Find your perfect style</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {loading ? (
              // Loading skeleton
              Array(4).fill(0).map((_, idx) => (
                <div key={idx} className="aspect-[3/4] rounded-2xl bg-slate-200 animate-pulse"></div>
              ))
            ) : (
              categories.slice(0, 4).map((category) => (
                <Link 
                  key={category.id} 
                  href={`/category/${category.slug}`} 
                  className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-white border border-pink-50 hover:border-pink-500/30 transition-all"
                >
                  <img
                    src={category.image_url || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80'}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-colors"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold tracking-wide">{category.name.toUpperCase()}</h3>
                    <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-pink-300">Shop the collection →</p>
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
            {/* Product 1 */}
            <Link href="/product/1" className="group bg-white rounded-2xl border border-pink-50 hover:border-pink-500/30 transition-all overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-pink-500 uppercase tracking-wide mb-1">LUMINA</p>
                <h3 className="font-medium mb-1 text-slate-900">Silk Midi Dress</h3>
                <p className="text-sm text-slate-600">$289.00</p>
              </div>
            </Link>

            {/* Product 2 */}
            <Link href="/product/2" className="group bg-white rounded-2xl border border-pink-50 hover:border-pink-500/30 transition-all overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden mb-4 relative">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
              </div>
              <div className="p-4">
                <p className="text-xs text-pink-500 uppercase tracking-wide mb-1">AURA</p>
                <h3 className="font-medium mb-1 text-slate-900">Oversized Blazer</h3>
                <p className="text-sm text-slate-600">$425.00</p>
              </div>
            </Link>

            {/* Product 3 */}
            <Link href="/product/3" className="group bg-white rounded-2xl border border-pink-50 hover:border-pink-500/30 transition-all overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-pink-500 uppercase tracking-wide mb-1">VELVET</p>
                <h3 className="font-medium mb-1 text-slate-900">Cashmere Sweater</h3>
                <p className="text-sm text-slate-600">$195.00</p>
              </div>
            </Link>

            {/* Product 4 */}
            <Link href="/product/4" className="group bg-white rounded-2xl border border-pink-50 hover:border-pink-500/30 transition-all overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden mb-4 relative">
                <img
                  src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500&q=80"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">SALE</span>
              </div>
              <div className="p-4">
                <p className="text-xs text-pink-500 uppercase tracking-wide mb-1">NOVA</p>
                <h3 className="font-medium mb-1 text-slate-900">Leather Crossbody Bag</h3>
                <p className="text-sm">
                  <span className="text-pink-500 font-semibold">$159.00</span>
                  <span className="text-slate-400 line-through ml-2">$249.00</span>
                </p>
              </div>
            </Link>
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

      {/* Featured Brands Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-sm mb-4 uppercase tracking-widest">Partners</span>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-slate-900">OUR BRANDS</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Partnering with the finest designers to bring you exclusive collections
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            {brands.slice(0, 5).map((brand, index) => (
              <Link 
                key={brand.id} 
                href={`/brand/${brand.slug}`} 
                className={`group p-6 lg:p-8 rounded-2xl border text-center transition-all ${
                  index === brands.length - 1 
                    ? 'bg-pink-500 text-white hover:bg-pink-600 border-transparent hover:shadow-lg' 
                    : 'bg-white border-pink-100 hover:border-pink-500 hover:shadow-lg'
                }`}
              >
                <h3 className={`text-xl lg:text-2xl font-bold tracking-[0.2em] mb-2 transition-colors ${
                  index === brands.length - 1 
                    ? '' 
                    : 'text-slate-900 group-hover:text-pink-500'
                } ${brand.style === 'italic' ? 'italic' : ''} ${brand.style === 'underline' ? 'underline decoration-pink-500' : ''}`}>
                  {brand.logo_text || brand.name}
                </h3>
                <p className={`text-sm ${index === brands.length - 1 ? 'opacity-80' : 'text-slate-500'}`}>
                  {brand.tagline || 'Exclusive Collection'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VIP Banner */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/80 to-pink-600/60"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center text-white">
          <p className="text-sm font-medium tracking-[0.3em] uppercase mb-4 opacity-90">VIP ACCESS</p>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-display">GET 20% OFF YOUR FIRST ORDER</h2>
          <p className="text-lg opacity-90 mb-8 max-w-md mx-auto">
            Join our exclusive club and enjoy member benefits, early access, and more.
          </p>
          <Link href="/login" className="inline-block bg-white text-pink-500 px-8 py-4 rounded-lg font-semibold hover:bg-pink-50 transition-colors">
            JOIN NOW
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-12 h-12 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-slate-900">FREE SHIPPING</h3>
              <p className="text-sm text-slate-500">On orders over $100</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-slate-900">EASY RETURNS</h3>
              <p className="text-sm text-slate-500">30-day return policy</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-slate-900">SECURE PAYMENT</h3>
              <p className="text-sm text-slate-500">100% secure checkout</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-slate-900">24/7 SUPPORT</h3>
              <p className="text-sm text-slate-500">Dedicated customer service</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
