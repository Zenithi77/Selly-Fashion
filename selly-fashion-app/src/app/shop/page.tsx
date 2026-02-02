'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { api, Product, ClothingType, Subcategory } from '@/lib/supabase'
import { useCartStore, useWishlistStore } from '@/lib/store'

export default function ShopPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ClothingType[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('newest')
  
  const addToCart = useCartStore(state => state.addItem)
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore()

  // Update selected category when URL changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      const [productsRes, categoriesRes, subcatsRes] = await Promise.all([
        api.getProducts(),
        api.getClothingTypes(),
        api.getAllSubcategories()
      ])
      
      if (productsRes.data) setProducts(productsRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
      if (subcatsRes.data) setSubcategories(subcatsRes.data)
      
      setLoading(false)
    }
    
    fetchData()
  }, [])

  // Get subcategories for selected category
  const filteredSubcategories = selectedCategory
    ? subcategories.filter(sub => sub.clothing_type_id === selectedCategory)
    : []

  // Filter products
  let filteredProducts = [...products]
  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(p => p.clothing_type_id === selectedCategory)
  }
  if (selectedSubcategory) {
    filteredProducts = filteredProducts.filter(p => p.subcategory_id === selectedSubcategory)
  }

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'name':
        return a.name.localeCompare(b.name)
      default: // newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  const isInWishlist = (productId: string) => wishlistItems.some(item => item.id === productId)

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory(null) // Reset subcategory when category changes
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-[104px] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-[104px] bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50 to-pink-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link href="/" className="text-slate-500 hover:text-pink-500">Нүүр</Link>
            <span className="text-slate-300">/</span>
            <span className="text-pink-500 font-medium">Дэлгүүр</span>
          </nav>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Бүх бүтээгдэхүүн</h1>
          <p className="text-slate-600">Манай бүтээгдэхүүнүүдтэй танилцана уу</p>
          <p className="text-sm text-slate-500 mt-3">{sortedProducts.length} бүтээгдэхүүн</p>
        </div>
      </div>

      {/* Filters & Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm font-medium text-slate-700">Ангилал:</span>
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === null 
                  ? 'bg-pink-500 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Бүгд
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          {/* Subcategory Filter - shows when category is selected */}
          {filteredSubcategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
              <span className="text-sm font-medium text-slate-700">Дэд ангилал:</span>
              <button
                onClick={() => setSelectedSubcategory(null)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedSubcategory === null 
                    ? 'bg-pink-100 text-pink-600 font-medium' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Бүгд
              </button>
              {filteredSubcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.id)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    selectedSubcategory === sub.id 
                      ? 'bg-pink-100 text-pink-600 font-medium' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort */}
        <div className="flex justify-end mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
          >
            <option value="newest">Шинэ эхэнд</option>
            <option value="price-low">Үнэ: Багаас их</option>
            <option value="price-high">Үнэ: Ихээс бага</option>
            <option value="name">Нэрээр</option>
          </select>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
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
                    
                    {/* Tags */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.is_new_arrival && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">NEW</span>
                      )}
                      {product.is_on_sale && product.original_price && product.original_price > product.price && (
                        <span className="px-2 py-1 bg-rose-500 text-white text-xs font-medium rounded-full">
                          -{Math.round((1 - product.price / product.original_price) * 100)}%
                        </span>
                      )}
                    </div>
                    
                    {/* Wishlist button */}
                    <button
                      onClick={(e) => { e.preventDefault(); toggleWishlist(product) }}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth={2}
                        className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-rose-500' : 'text-slate-600'}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    </button>
                    
                    {/* Category & Subcategory tags */}
                    <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                      {product.clothing_type && (
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-slate-600 text-xs font-medium rounded-full">
                          {product.clothing_type.name}
                        </span>
                      )}
                      {product.subcategory && (
                        <span className="px-2 py-1 bg-pink-50/90 backdrop-blur-sm text-pink-600 text-xs font-medium rounded-full">
                          {product.subcategory.name}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                
                <div className="p-4">
                  {product.brand && (
                    <p className="text-xs text-slate-500 mb-1">{product.brand.name}</p>
                  )}
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-medium text-slate-900 line-clamp-2 group-hover:text-pink-500 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-pink-500">{product.price.toLocaleString()}₮</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-sm text-slate-400 line-through">{product.original_price.toLocaleString()}₮</span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => addToCart(product, 1, product.sizes?.[0] || '', product.colors?.[0] || '')}
                    className="w-full mt-3 py-2 bg-pink-500 text-white text-sm font-medium rounded-xl hover:bg-pink-600 transition-colors"
                  >
                    Сагсанд нэмэх
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 mx-auto text-slate-300 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Бүтээгдэхүүн байхгүй</h3>
            <p className="text-slate-500 mb-6">Сонгосон шүүлтүүрт тохирох бүтээгдэхүүн олдсонгүй</p>
            <button
              onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null) }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white font-medium rounded-xl hover:bg-pink-600 transition-colors"
            >
              Шүүлтүүр арилгах
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
