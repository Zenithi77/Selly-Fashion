'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api, Product, Brand, ClothingType, supabase } from '@/lib/supabase'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<ClothingType[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  // Brand/Category modal state
  const [showBrandModal, setShowBrandModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newBrandName, setNewBrandName] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [savingBrand, setSavingBrand] = useState(false)
  const [savingCategory, setSavingCategory] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    original_price: 0,
    image_url: '',
    brand_id: '',
    clothing_type_id: '',
    sizes: [] as string[],
    colors: [] as string[],
    is_featured: false,
    is_new_arrival: false,
    is_on_sale: false,
    stock_quantity: 0
  })

  const fetchData = async () => {
    setLoading(true)
    const [productsRes, brandsRes, categoriesRes] = await Promise.all([
      api.getProducts(),
      api.getBrands(),
      api.getCategories()
    ])
    
    if (productsRes.data) setProducts(productsRes.data)
    if (brandsRes.data) setBrands(brandsRes.data)
    if (categoriesRes.data) setCategories(categoriesRes.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingProduct) {
      await api.updateProduct(editingProduct.id, formData)
    } else {
      await api.createProduct(formData)
    }
    
    setShowModal(false)
    setEditingProduct(null)
    resetForm()
    fetchData()
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price,
      original_price: product.original_price || 0,
      image_url: product.image_url || '',
      brand_id: product.brand_id || '',
      clothing_type_id: product.clothing_type_id || '',
      sizes: product.sizes || [],
      colors: product.colors || [],
      is_featured: product.is_featured || false,
      is_new_arrival: product.is_new_arrival || false,
      is_on_sale: product.is_on_sale || false,
      stock_quantity: product.stock_quantity || 0
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Та устгахдаа итгэлтэй байна уу?')) {
      await api.deleteProduct(id)
      fetchData()
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: 0,
      original_price: 0,
      image_url: '',
      brand_id: '',
      clothing_type_id: '',
      sizes: [],
      colors: [],
      is_featured: false,
      is_new_arrival: false,
      is_on_sale: false,
      stock_quantity: 0
    })
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  // Add new brand
  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return
    setSavingBrand(true)
    try {
      const slug = generateSlug(newBrandName)
      const { data, error } = await supabase
        .from('brands')
        .insert({ name: newBrandName.trim(), slug })
        .select()
        .single()
      
      if (error) throw error
      
      // Refresh brands list and auto-select new brand
      const brandsResult = await api.getBrands()
      if (brandsResult.data) {
        setBrands(brandsResult.data)
      }
      if (data) {
        setFormData(prev => ({ ...prev, brand_id: data.id }))
      }
      setNewBrandName('')
      setShowBrandModal(false)
    } catch (error) {
      console.error('Error adding brand:', error)
      alert('Брэнд нэмэхэд алдаа гарлаа')
    } finally {
      setSavingBrand(false)
    }
  }

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return
    setSavingCategory(true)
    try {
      const slug = generateSlug(newCategoryName)
      const { data, error } = await supabase
        .from('clothing_types')
        .insert({ name: newCategoryName.trim(), slug })
        .select()
        .single()
      
      if (error) throw error
      
      // Refresh categories list and auto-select new category
      const categoriesResult = await api.getCategories()
      if (categoriesResult.data) {
        setCategories(categoriesResult.data)
      }
      if (data) {
        setFormData(prev => ({ ...prev, clothing_type_id: data.id }))
      }
      setNewCategoryName('')
      setShowCategoryModal(false)
    } catch (error) {
      console.error('Error adding category:', error)
      alert('Ангилал нэмэхэд алдаа гарлаа')
    } finally {
      setSavingCategory(false)
    }
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin"
              className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Бүтээгдэхүүн</h1>
              <p className="text-sm text-slate-500">{products.length} бүтээгдэхүүн</p>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setEditingProduct(null); setShowModal(true) }}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Нэмэх
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Бүтээгдэхүүн</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Үнэ</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Брэнд</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Нөөц</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Статус</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          {product.image_url && (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-500">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-pink-500">${product.price}</span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-slate-400 line-through ml-2">${product.original_price}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {product.brand?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${product.stock_quantity > 10 ? 'text-green-500' : product.stock_quantity > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {product.is_featured && (
                          <span className="px-2 py-1 bg-pink-100 text-pink-600 text-xs rounded-full">Онцлох</span>
                        )}
                        {product.is_new_arrival && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">Шинэ</span>
                        )}
                        {product.is_on_sale && (
                          <span className="px-2 py-1 bg-rose-100 text-rose-600 text-xs rounded-full">Хямдрал</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingProduct ? 'Бүтээгдэхүүн засах' : 'Шинэ бүтээгдэхүүн'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Нэр</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Тайлбар</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Үнэ</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Хуучин үнэ</label>
                    <input
                      type="number"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Нөөц</label>
                    <input
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Зургийн URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Брэнд</label>
                    <div className="flex gap-2">
                      <select
                        value={formData.brand_id}
                        onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      >
                        <option value="">Сонгох...</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowBrandModal(true)}
                        className="w-10 h-10 bg-pink-500 hover:bg-pink-600 text-white rounded-xl flex items-center justify-center font-bold text-xl transition-colors"
                        title="Шинэ брэнд нэмэх"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Категори</label>
                    <div className="flex gap-2">
                      <select
                        value={formData.clothing_type_id}
                        onChange={(e) => setFormData({ ...formData, clothing_type_id: e.target.value })}
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      >
                        <option value="">Сонгох...</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowCategoryModal(true)}
                        className="w-10 h-10 bg-pink-500 hover:bg-pink-600 text-white rounded-xl flex items-center justify-center font-bold text-xl transition-colors"
                        title="Шинэ категори нэмэх"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Хэмжээ (таслалаар)</label>
                    <input
                      type="text"
                      value={formData.sizes.join(', ')}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      placeholder="XS, S, M, L, XL"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Өнгө (таслалаар)</label>
                    <input
                      type="text"
                      value={formData.colors.join(', ')}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      placeholder="Pink, Black, White"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-pink-500 focus:ring-pink-500"
                    />
                    <span className="text-sm">Онцлох</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_new_arrival}
                      onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-pink-500 focus:ring-pink-500"
                    />
                    <span className="text-sm">Шинэ</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_on_sale}
                      onChange={(e) => setFormData({ ...formData, is_on_sale: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-pink-500 focus:ring-pink-500"
                    />
                    <span className="text-sm">Хямдрал</span>
                  </label>
                </div>

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
                    {editingProduct ? 'Хадгалах' : 'Нэмэх'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Brand Modal */}
        {showBrandModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Шинэ брэнд нэмэх</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Брэндийн нэр</label>
                  <input
                    type="text"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="Жишээ: Nike, Adidas..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBrandModal(false)
                      setNewBrandName('')
                    }}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Болих
                  </button>
                  <button
                    type="button"
                    onClick={handleAddBrand}
                    disabled={savingBrand || !newBrandName.trim()}
                    className="flex-1 py-2.5 bg-pink-500 text-white font-medium rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingBrand ? 'Нэмж байна...' : 'Нэмэх'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Шинэ категори нэмэх</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Категорийн нэр</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Жишээ: Цамц, Гутал..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryModal(false)
                      setNewCategoryName('')
                    }}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Болих
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={savingCategory || !newCategoryName.trim()}
                    className="flex-1 py-2.5 bg-pink-500 text-white font-medium rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingCategory ? 'Нэмж байна...' : 'Нэмэх'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
