'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { api, Product } from '@/lib/supabase'

// Sample products for demo
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Butterfly Silk Dress',
    slug: 'butterfly-silk-dress',
    description: 'Elegant silk dress featuring delicate butterfly patterns. Perfect for special occasions and evening events. Made from 100% pure mulberry silk with intricate hand-painted butterfly motifs. The flowing silhouette flatters all body types while providing exceptional comfort.',
    price: 189,
    original_price: 249,
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
    ],
    brand_id: '1',
    clothing_type_id: '1',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Pink', 'Black', 'White'],
    is_featured: true,
    is_new_arrival: true,
    is_on_sale: true,
    stock_quantity: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: {
      id: '1',
      name: 'Lumina Collective',
      slug: 'lumina',
      description: 'High-end evening wear',
      logo_text: 'LUMINA',
      tagline: 'High-End Silhouettes',
      style: 'italic',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }
]

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCartStore()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      const { data, error } = await api.getProductBySlug(slug)
      
      if (data) {
        setProduct(data)
        if (data.sizes?.length) setSelectedSize(data.sizes[0])
        if (data.colors?.length) setSelectedColor(data.colors[0])
      } else if (error || !data) {
        // Use sample product for demo
        const sample = sampleProducts[0]
        setProduct(sample)
        setSelectedSize(sample.sizes[0])
        setSelectedColor(sample.colors[0])
      }
      setLoading(false)
    }

    fetchProduct()
  }, [slug])

  const handleAddToCart = () => {
    if (product && selectedSize && selectedColor) {
      addItem(product, quantity, selectedSize, selectedColor)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-[104px] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen pt-[104px] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Бүтээгдэхүүн олдсонгүй</h1>
          <Link href="/shop" className="text-pink-500 hover:text-pink-600">
            Дэлгүүр рүү буцах
          </Link>
        </div>
      </main>
    )
  }

  const images = product.images?.length ? product.images : [product.image_url]
  const discount = product.original_price 
    ? Math.round((1 - product.price / product.original_price) * 100) 
    : 0

  return (
    <main className="min-h-screen pt-[104px]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-pink-500">Нүүр</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-pink-500">Дэлгүүр</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.is_on_sale && discount > 0 && (
                <span className="absolute top-4 left-4 px-4 py-2 bg-rose-500 text-white text-sm font-bold rounded-full">
                  -{discount}%
                </span>
              )}
              {product.is_new_arrival && (
                <span className="absolute top-4 right-4 px-4 py-2 bg-pink-500 text-white text-sm font-bold rounded-full">
                  ШИНЭ
                </span>
              )}
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute bottom-4 right-4 w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-6 h-6 ${isWishlisted ? 'text-pink-500' : 'text-slate-400'}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx 
                        ? 'border-pink-500 ring-2 ring-pink-500/30' 
                        : 'border-transparent hover:border-pink-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            {product.brand && (
              <Link 
                href={`/brand/${product.brand.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 dark:bg-pink-900/20 rounded-full text-pink-500 text-sm font-semibold hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
              >
                {product.brand.logo_text}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            )}

            {/* Title & Price */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-pink-500">${product.price}</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-xl text-slate-400 line-through">${product.original_price}</span>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-yellow-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                ))}
              </div>
              <span className="text-slate-600 dark:text-slate-400">(128 үнэлгээ)</span>
            </div>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {product.description}
            </p>

            {/* Divider */}
            <div className="border-t border-pink-100 dark:border-pink-900/30"></div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="font-semibold text-slate-900 dark:text-white">Хэмжээ</label>
                  <button className="text-sm text-pink-500 hover:text-pink-600">Хэмжээний заавар</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] px-4 py-3 rounded-xl font-semibold transition-all ${
                        selectedSize === size
                          ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-pink-100 dark:hover:bg-pink-900/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="font-semibold text-slate-900 dark:text-white block mb-3">
                  Өнгө: <span className="text-pink-500">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        selectedColor === color
                          ? 'bg-pink-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-pink-100'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="font-semibold text-slate-900 dark:text-white block mb-3">Тоо ширхэг</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-l-xl transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                    </svg>
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-r-xl transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
                <span className="text-sm text-slate-500">
                  {product.stock_quantity > 0 ? `${product.stock_quantity} ширхэг үлдсэн` : 'Дууссан'}
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor || product.stock_quantity === 0}
                className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                Сагсанд нэмэх
              </button>
              <button className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-slate-600 dark:text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                </svg>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-pink-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <div>
                  <p className="font-semibold text-sm">Үнэгүй хүргэлт</p>
                  <p className="text-xs text-slate-500">$100-с дээш</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-pink-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <div>
                  <p className="font-semibold text-sm">Буцаалт</p>
                  <p className="text-xs text-slate-500">30 хоногийн дотор</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
