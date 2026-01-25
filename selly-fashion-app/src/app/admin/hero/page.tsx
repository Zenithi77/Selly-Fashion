'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { api, Brand, ClothingType } from '@/lib/supabase'

export default function AdminHeroPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<ClothingType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'brands' | 'categories'>('brands')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Brand | ClothingType | null>(null)
  const [editType, setEditType] = useState<'brand' | 'category'>('brand')
  const [uploading, setUploading] = useState(false)
  const [imageInputType, setImageInputType] = useState<'url' | 'upload'>('url')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [brandForm, setBrandForm] = useState({
    name: '',
    slug: '',
    logo_text: '',
    tagline: '',
    style: 'normal',
    image_url: '',
    is_featured: true,
    featured_order: 1
  })

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    icon: '',
    image_url: '',
    is_featured: true,
    featured_order: 1
  })

  const fetchData = async () => {
    setLoading(true)
    const [brandsRes, categoriesRes] = await Promise.all([
      api.getBrands(),
      api.getClothingTypes()
    ])
    if (brandsRes.data) setBrands(brandsRes.data)
    if (categoriesRes.data) setCategories(categoriesRes.data)
    setLoading(false)
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const [brandsRes, categoriesRes] = await Promise.all([
        api.getBrands(),
        api.getClothingTypes()
      ])
      if (brandsRes.data) setBrands(brandsRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
      setLoading(false)
    }
    loadData()
  }, [])

  const featuredBrands = brands.filter(b => b.is_featured).sort((a, b) => a.featured_order - b.featured_order)
  const featuredCategories = categories.filter(c => c.is_featured).sort((a, b) => a.featured_order - b.featured_order)

  const handleEditBrand = (brand: Brand) => {
    setEditingItem(brand)
    setEditType('brand')
    setBrandForm({
      name: brand.name,
      slug: brand.slug,
      logo_text: brand.logo_text || '',
      tagline: brand.tagline || '',
      style: brand.style || 'normal',
      image_url: brand.image_url || '',
      is_featured: brand.is_featured || false,
      featured_order: brand.featured_order || 0
    })
    setShowModal(true)
  }

  const handleEditCategory = (category: ClothingType) => {
    setEditingItem(category)
    setEditType('category')
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      icon: category.icon || '',
      image_url: category.image_url || '',
      is_featured: category.is_featured || false,
      featured_order: category.featured_order || 0
    })
    setShowModal(true)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'brand' | 'category') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', type === 'brand' ? 'brands' : 'categories')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (data.success && data.url) {
        if (type === 'brand') {
          setBrandForm({ ...brandForm, image_url: data.url })
        } else {
          setCategoryForm({ ...categoryForm, image_url: data.url })
        }
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
      // Clear file input
      if (e.target) e.target.value = ''
    }
  }

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingItem) {
      const updateData = {
        name: brandForm.name,
        slug: brandForm.slug,
        logo_text: brandForm.logo_text,
        tagline: brandForm.tagline,
        style: brandForm.style,
        image_url: brandForm.image_url,
        is_featured: Boolean(brandForm.is_featured),
        featured_order: Number(brandForm.featured_order) || 0
      }
      const result = await api.updateBrand(editingItem.id, updateData)
      if (result.error) {
        console.error('Update error:', result.error)
        alert('Хадгалахад алдаа гарлаа: ' + result.error.message)
        return
      }
    }
    setShowModal(false)
    setEditingItem(null)
    fetchData()
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingItem) {
      const updateData = {
        name: categoryForm.name,
        slug: categoryForm.slug,
        icon: categoryForm.icon,
        image_url: categoryForm.image_url,
        is_featured: Boolean(categoryForm.is_featured),
        featured_order: Number(categoryForm.featured_order) || 0
      }
      const result = await api.updateClothingType(editingItem.id, updateData)
      if (result.error) {
        console.error('Update error:', result.error)
        alert('Хадгалахад алдаа гарлаа: ' + result.error.message)
        return
      }
    }
    setShowModal(false)
    setEditingItem(null)
    fetchData()
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/admin"
            className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Нүүр хуудас удирдах</h1>
            <p className="text-sm text-slate-500">Hero section болон Shop by Category</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 mb-8 border border-pink-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Зургийн хэмжээ</h3>
              <p className="text-sm text-slate-600">
                Hero section-д гарах зургийн хэмжээ: <span className="font-bold text-pink-500">600 x 800 px</span> (3:4 харьцаа)
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Shop by Category зургийн хэмжээ: <span className="font-bold text-pink-500">400 x 500 px</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'brands'
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Hero Brands ({featuredBrands.length}/5)
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'categories'
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Shop by Category ({featuredCategories.length})
          </button>
        </div>

        {/* Brands Tab */}
        {activeTab === 'brands' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500 mb-4">
              Нүүр хуудасны Hero section-д 5 брэнд харагдана. Featured дарааллаар эрэмбэлэгдэнэ.
            </p>
            
            {/* Featured Brands Preview */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 mb-6">
              <h3 className="font-bold mb-4 text-slate-900">Hero Section Preview</h3>
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((order) => {
                  const brand = featuredBrands.find(b => b.featured_order === order)
                  return (
                    <div
                      key={order}
                      className={`aspect-[3/4] rounded-xl overflow-hidden relative ${
                        brand ? 'cursor-pointer group' : 'bg-slate-100 border-2 border-dashed border-slate-300'
                      }`}
                      onClick={() => brand && handleEditBrand(brand)}
                    >
                      {brand ? (
                        <>
                          <img
                            src={brand.image_url || 'https://via.placeholder.com/300x400?text=No+Image'}
                            alt={brand.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center justify-end p-3">
                            <span className="text-[10px] text-pink-300 tracking-wider">{brand.tagline}</span>
                            <span className="text-white font-bold text-sm">{brand.logo_text || brand.name}</span>
                          </div>
                          <div className="absolute top-2 left-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {order}
                          </div>
                          <div className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-pink-500">Засах</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                          <span className="text-2xl font-bold">{order}</span>
                          <span className="text-xs">Хоосон</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* All Brands List */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Бүх брэндүүд</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {brands.map((brand) => (
                  <div key={brand.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      {brand.image_url ? (
                        <img src={brand.image_url} alt={brand.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No img</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900">{brand.name}</h4>
                      <p className="text-sm text-slate-500">{brand.tagline || 'Tagline байхгүй'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {brand.is_featured && (
                        <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-medium">
                          #{brand.featured_order}
                        </span>
                      )}
                      <button
                        onClick={() => handleEditBrand(brand)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                      >
                        Засах
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500 mb-4">
              Нүүр хуудасны Shop by Category хэсэгт харагдах категориуд.
            </p>

            {/* Featured Categories Preview */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 mb-6">
              <h3 className="font-bold mb-4 text-slate-900">Shop by Category Preview</h3>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((order) => {
                  const category = featuredCategories.find(c => c.featured_order === order)
                  return (
                    <div
                      key={order}
                      className={`aspect-[3/4] rounded-xl overflow-hidden relative ${
                        category ? 'cursor-pointer group' : 'bg-slate-100 border-2 border-dashed border-slate-300'
                      }`}
                      onClick={() => category && handleEditCategory(category)}
                    >
                      {category ? (
                        <>
                          <img
                            src={category.image_url || 'https://via.placeholder.com/400x500?text=No+Image'}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center justify-end p-3">
                            <span className="text-white font-bold text-sm">{category.name}</span>
                          </div>
                          <div className="absolute top-2 left-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {order}
                          </div>
                          <div className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-pink-500">Засах</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                          <span className="text-2xl font-bold">{order}</span>
                          <span className="text-xs">Хоосон</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* All Categories List */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Бүх категориуд</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {categories.map((category) => (
                  <div key={category.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      {category.image_url ? (
                        <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">{category.icon}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900">{category.name}</h4>
                      <p className="text-sm text-slate-500">{category.slug}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {category.is_featured && (
                        <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-medium">
                          #{category.featured_order}
                        </span>
                      )}
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                      >
                        Засах
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-slate-900">
                  {editType === 'brand' ? 'Брэнд засах' : 'Категори засах'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {editType === 'brand' ? (
                <form onSubmit={handleSaveBrand} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Нэр</label>
                    <input
                      type="text"
                      value={brandForm.name}
                      onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value, slug: generateSlug(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Logo текст</label>
                      <input
                        type="text"
                        value={brandForm.logo_text}
                        onChange={(e) => setBrandForm({ ...brandForm, logo_text: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={brandForm.tagline}
                        onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
                        placeholder="HAUTE COUTURE"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Зураг <span className="text-pink-500">(600x800px)</span>
                    </label>
                    
                    {/* URL / Upload toggle */}
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setImageInputType('url')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                          imageInputType === 'url'
                            ? 'bg-pink-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        🔗 URL оруулах
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputType('upload')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                          imageInputType === 'upload'
                            ? 'bg-pink-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        📤 Зураг upload
                      </button>
                    </div>

                    {imageInputType === 'url' ? (
                      <input
                        type="url"
                        value={brandForm.image_url}
                        onChange={(e) => setBrandForm({ ...brandForm, image_url: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                    ) : (
                      <div className="space-y-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={(e) => handleFileUpload(e, 'brand')}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="w-full py-3 px-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-pink-400 transition-colors flex items-center justify-center gap-2 text-slate-600 disabled:opacity-50"
                        >
                          {uploading ? (
                            <>
                              <span className="animate-spin">⏳</span>
                              Upload хийж байна...
                            </>
                          ) : (
                            <>
                              <span>📁</span>
                              Зураг сонгох (max 5MB)
                            </>
                          )}
                        </button>
                        <p className="text-xs text-slate-500 text-center">JPEG, PNG, WebP, GIF</p>
                      </div>
                    )}

                    {brandForm.image_url && (
                      <div className="mt-3 relative w-full aspect-[3/4] max-w-[200px] rounded-lg overflow-hidden bg-slate-100">
                        <img src={brandForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setBrandForm({ ...brandForm, image_url: '' })}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Hero-д харуулах</label>
                      <p className="text-xs text-slate-500">Нүүр хуудасны Hero хэсэгт гарах эсэх</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBrandForm({ ...brandForm, is_featured: !brandForm.is_featured })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${brandForm.is_featured ? 'bg-pink-500' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${brandForm.is_featured ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {brandForm.is_featured && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Дараалал (1-5)</label>
                      <select
                        value={brandForm.featured_order}
                        onChange={(e) => setBrandForm({ ...brandForm, featured_order: parseInt(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      >
                        {[1, 2, 3, 4, 5].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      Болих
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-pink-500 text-white font-medium rounded-xl hover:bg-pink-600 transition-colors"
                    >
                      Хадгалах
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Нэр</label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value, slug: generateSlug(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Зураг <span className="text-pink-500">(400x500px)</span>
                    </label>
                    
                    {/* URL / Upload toggle */}
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setImageInputType('url')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                          imageInputType === 'url'
                            ? 'bg-pink-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        🔗 URL оруулах
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputType('upload')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                          imageInputType === 'upload'
                            ? 'bg-pink-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        📤 Зураг upload
                      </button>
                    </div>

                    {imageInputType === 'url' ? (
                      <input
                        type="url"
                        value={categoryForm.image_url}
                        onChange={(e) => setCategoryForm({ ...categoryForm, image_url: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                    ) : (
                      <div className="space-y-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={(e) => handleFileUpload(e, 'category')}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="w-full py-3 px-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-pink-400 transition-colors flex items-center justify-center gap-2 text-slate-600 disabled:opacity-50"
                        >
                          {uploading ? (
                            <>
                              <span className="animate-spin">⏳</span>
                              Upload хийж байна...
                            </>
                          ) : (
                            <>
                              <span>📁</span>
                              Зураг сонгох (max 5MB)
                            </>
                          )}
                        </button>
                        <p className="text-xs text-slate-500 text-center">JPEG, PNG, WebP, GIF</p>
                      </div>
                    )}

                    {categoryForm.image_url && (
                      <div className="mt-3 relative w-full aspect-[4/5] max-w-[160px] rounded-lg overflow-hidden bg-slate-100">
                        <img src={categoryForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setCategoryForm({ ...categoryForm, image_url: '' })}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Онцлох</label>
                      <p className="text-xs text-slate-500">Shop by Category хэсэгт гарах эсэх</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCategoryForm({ ...categoryForm, is_featured: !categoryForm.is_featured })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${categoryForm.is_featured ? 'bg-pink-500' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${categoryForm.is_featured ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {categoryForm.is_featured && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Дараалал</label>
                      <select
                        value={categoryForm.featured_order}
                        onChange={(e) => setCategoryForm({ ...categoryForm, featured_order: parseInt(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      Болих
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-pink-500 text-white font-medium rounded-xl hover:bg-pink-600 transition-colors"
                    >
                      Хадгалах
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
