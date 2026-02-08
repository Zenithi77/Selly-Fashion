'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { api, Product, Brand, ClothingType, Subcategory, supabase } from '@/lib/supabase'

// Predefined sizes and colors for quick selection
const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL']
const COMMON_COLORS = [
  { name: 'Хар', value: 'Black', hex: '#000000' },
  { name: 'Цагаан', value: 'White', hex: '#FFFFFF' },
  { name: 'Ягаан', value: 'Pink', hex: '#EC4899' },
  { name: 'Улаан', value: 'Red', hex: '#EF4444' },
  { name: 'Цэнхэр', value: 'Blue', hex: '#3B82F6' },
  { name: 'Ногоон', value: 'Green', hex: '#22C55E' },
  { name: 'Шар', value: 'Yellow', hex: '#EAB308' },
  { name: 'Саарал', value: 'Gray', hex: '#6B7280' },
  { name: 'Хүрэн', value: 'Brown', hex: '#92400E' },
  { name: 'Бор', value: 'Beige', hex: '#D4B896' },
]

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<ClothingType[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  // Brand/Category modal state
  const [showBrandModal, setShowBrandModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newBrandName, setNewBrandName] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [savingBrand, setSavingBrand] = useState(false)
  const [savingCategory, setSavingCategory] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Custom size/color input
  const [customSize, setCustomSize] = useState('')
  const [customColor, setCustomColor] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Excel upload state
  const [showExcelModal, setShowExcelModal] = useState(false)
  const [excelUploading, setExcelUploading] = useState(false)
  const [excelResult, setExcelResult] = useState<{
    success?: boolean
    message?: string
    successCount?: number
    totalRows?: number
    errors?: string[]
  } | null>(null)
  const excelInputRef = useRef<HTMLInputElement>(null)
  
  // Form state with string values for better UX (no leading zeros issue)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    original_price: '',
    image_url: '',
    brand_id: '',
    clothing_type_id: '',
    subcategory_id: '',
    sizes: [] as string[],
    colors: [] as string[],
    is_featured: false,
    is_new_arrival: false,
    is_on_sale: false,
    stock_quantity: ''
  })

  const fetchData = async () => {
    setLoading(true)
    const [productsRes, brandsRes, categoriesRes, subcategoriesRes] = await Promise.all([
      api.getProducts(),
      api.getBrands(),
      api.getCategories(),
      api.getAllSubcategories()
    ])
    
    if (productsRes.data) setProducts(productsRes.data)
    if (brandsRes.data) setBrands(brandsRes.data)
    if (categoriesRes.data) setCategories(categoriesRes.data)
    if (subcategoriesRes.data) setSubcategories(subcategoriesRes.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Бүтээгдэхүүний нэр оруулна уу')
      return
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Үнэ оруулна уу')
      return
    }

    setSaving(true)
    
    try {
      // Generate unique slug with timestamp for new products
      const isNewProduct = !editingProduct
      const slugValue = formData.slug.trim() || generateSlug(formData.name, isNewProduct)
      
      const submitData = {
        name: formData.name.trim(),
        slug: slugValue,
        description: formData.description.trim(),
        price: parseFloat(formData.price) || 0,
        original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
        image_url: formData.image_url.trim(),
        brand_id: formData.brand_id || undefined,
        clothing_type_id: formData.clothing_type_id || undefined,
        subcategory_id: formData.subcategory_id || undefined,
        sizes: formData.sizes,
        colors: formData.colors,
        is_featured: formData.is_featured,
        is_new_arrival: formData.is_new_arrival,
        is_on_sale: formData.is_on_sale,
        stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : 0
      }

      if (editingProduct) {
        const result = await api.updateProduct(editingProduct.id, submitData)
        if (result.error) throw result.error
      } else {
        const result = await api.createProduct(submitData)
        if (result.error) throw result.error
      }
      
      setShowModal(false)
      setEditingProduct(null)
      resetForm()
      fetchData()
    } catch (error) {
      console.error('Save error:', error)
      alert('Хадгалахад алдаа гарлаа')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      original_price: product.original_price?.toString() || '',
      image_url: product.image_url || '',
      brand_id: product.brand_id || '',
      clothing_type_id: product.clothing_type_id || '',
      subcategory_id: product.subcategory_id || '',
      sizes: product.sizes || [],
      colors: product.colors || [],
      is_featured: product.is_featured || false,
      is_new_arrival: product.is_new_arrival || false,
      is_on_sale: product.is_on_sale || false,
      stock_quantity: product.stock_quantity?.toString() || ''
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
      price: '',
      original_price: '',
      image_url: '',
      brand_id: '',
      clothing_type_id: '',
      subcategory_id: '',
      sizes: [],
      colors: [],
      is_featured: false,
      is_new_arrival: false,
      is_on_sale: false,
      stock_quantity: ''
    })
    setCustomSize('')
    setCustomColor('')
  }

  const generateSlug = (name: string, addTimestamp: boolean = false) => {
    const baseSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-а-яөү]/gi, '')
    if (addTimestamp) {
      return `${baseSlug}-${Date.now()}`
    }
    return baseSlug
  }

  // Toggle size selection
  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  // Add custom size
  const addCustomSize = () => {
    if (customSize.trim() && !formData.sizes.includes(customSize.trim().toUpperCase())) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, customSize.trim().toUpperCase()]
      }))
      setCustomSize('')
    }
  }

  // Toggle color selection
  const toggleColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }))
  }

  // Add custom color
  const addCustomColor = () => {
    if (customColor.trim() && !formData.colors.includes(customColor.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, customColor.trim()]
      }))
      setCustomColor('')
    }
  }

  // Зураг upload хийх
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Зургийн хэмжээ 10MB-аас бага байх ёстой')
      return
    }

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'products')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      setFormData(prev => ({ ...prev, image_url: result.url }))
    } catch (error) {
      console.error('Upload error:', error)
      alert('Зураг оруулахад алдаа гарлаа')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
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

  // Handle Excel file upload
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setExcelUploading(true)
    setExcelResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-excel', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        setExcelResult({ success: false, message: result.error || 'Алдаа гарлаа', errors: result.details ? [result.details] : undefined })
      } else {
        setExcelResult(result)
        if (result.success) {
          fetchData() // Refresh products list
        }
      }
    } catch (error) {
      console.error('Excel upload error:', error)
      setExcelResult({ success: false, message: 'Файл оруулахад алдаа гарлаа' })
    } finally {
      setExcelUploading(false)
      if (excelInputRef.current) {
        excelInputRef.current.value = ''
      }
    }
  }

  // Download Excel template
  const downloadExcelTemplate = () => {
    // Create template headers - Mongolian labels for better understanding
    const headers = [
      'Нэр (name)',
      'Тайлбар (description)', 
      'Үнэ (price)',
      'Хуучин үнэ (original_price)',
      'Брэнд (brand)',
      'Ангилал (category)',
      'Дэд ангилал (subcategory)',
      'Хэмжээ (sizes)',
      'Өнгө (colors)',
      'Нөөц (stock)',
      'Онцлох (is_featured)',
      'Шинэ (is_new_arrival)',
      'Хямдрал (is_on_sale)'
    ]
    
    // Example rows
    const exampleRow1 = [
      'Загварлаг цамц',
      'Өндөр чанартай материалаар хийгдсэн',
      '89000',
      '120000',
      'Nike',
      'Цамц',
      'Эрэгтэй цамц',
      'S,M,L,XL',
      'Black,White',
      '50',
      'false',
      'true',
      'true'
    ]
    
    const exampleRow2 = [
      'Спорт өмд',
      'Тав тухтай спорт өмд',
      '65000',
      '',
      'Adidas',
      'Өмд',
      '',
      'M,L,XL',
      'Gray,Black',
      '30',
      'false',
      'false',
      'false'
    ]

    // Properly escape CSV values (wrap in quotes if contains comma)
    const escapeCSV = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }

    // Create CSV content with proper escaping
    const csvContent = [
      headers.map(escapeCSV).join(','),
      exampleRow1.map(escapeCSV).join(','),
      exampleRow2.map(escapeCSV).join(',')
    ].join('\n')

    // Download as CSV with UTF-8 BOM for Excel compatibility
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'products-template.csv'
    link.click()
    URL.revokeObjectURL(url)
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExcelModal(true)}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              Excel оруулах
            </button>
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
                          <img 
                            src={product.image_url || '/placeholder-product.svg'} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-500">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-pink-500">{product.price.toLocaleString()}₮</span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-slate-400 line-through ml-2">{product.original_price.toLocaleString()}₮</span>
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Үнэ (₮) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.price}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '')
                        setFormData({ ...formData, price: value })
                      }}
                      placeholder="0"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Хуучин үнэ (₮) <span className="text-xs text-slate-400">(хямдрал)</span></label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.original_price}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '')
                        setFormData({ ...formData, original_price: value })
                      }}
                      placeholder="Хоосон үлдээх"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Нөөц (ш)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.stock_quantity}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '')
                        setFormData({ ...formData, stock_quantity: value })
                      }}
                      placeholder="0"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Зураг</label>
                  <div className="space-y-3">
                    {/* Preview */}
                    {formData.image_url && (
                      <div className="relative w-32 h-40 rounded-xl overflow-hidden bg-slate-100">
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image_url: '' })}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {/* Upload button */}
                    <div className="flex gap-2">
                      <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-pink-50 border-2 border-dashed border-pink-300 rounded-xl cursor-pointer hover:bg-pink-100 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-pink-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                        <span className="text-sm font-medium text-pink-600">
                          {uploading ? 'Оруулж байна...' : 'Зураг сонгох'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {/* URL input */}
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="Эсвэл URL оруулах..."
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                      />
                    </div>
                  </div>
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ангилал</label>
                    <div className="flex gap-2">
                      <select
                        value={formData.clothing_type_id}
                        onChange={(e) => setFormData({ ...formData, clothing_type_id: e.target.value, subcategory_id: '' })}
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
                        title="Шинэ ангилал нэмэх"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subcategory - shows only when category is selected */}
                {formData.clothing_type_id && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Дэд ангилал</label>
                    <div className="flex gap-2">
                      <select
                        value={formData.subcategory_id}
                        onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      >
                        <option value="">Сонгох (заавал биш)...</option>
                        {subcategories
                          .filter(sub => sub.clothing_type_id === formData.clothing_type_id)
                          .map((sub) => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                          ))}
                      </select>
                      <Link
                        href="/admin/subcategories"
                        className="w-10 h-10 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-xl flex items-center justify-center font-bold text-xl transition-colors"
                        title="Дэд ангилал удирдах"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                        </svg>
                      </Link>
                    </div>
                    {subcategories.filter(sub => sub.clothing_type_id === formData.clothing_type_id).length === 0 && (
                      <p className="text-xs text-slate-400 mt-1">
                        Энэ ангилалд дэд ангилал байхгүй. <Link href="/admin/subcategories" className="text-pink-500 hover:underline">Нэмэх</Link>
                      </p>
                    )}
                  </div>
                )}

                {/* Sizes - Tag based */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Хэмжээ</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {COMMON_SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          formData.sizes.includes(size)
                            ? 'bg-pink-500 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {/* Custom sizes */}
                  {formData.sizes.filter(s => !COMMON_SIZES.includes(s)).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.sizes.filter(s => !COMMON_SIZES.includes(s)).map((size) => (
                        <span
                          key={size}
                          className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs flex items-center gap-1"
                        >
                          {size}
                          <button type="button" onClick={() => toggleSize(size)} className="hover:text-pink-800">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSize())}
                      placeholder="Өөр хэмжээ..."
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                    <button type="button" onClick={addCustomSize} className="px-3 py-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 text-sm">Нэмэх</button>
                  </div>
                </div>

                {/* Colors - Tag based */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Өнгө</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {COMMON_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => toggleColor(color.value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          formData.colors.includes(color.value)
                            ? 'bg-pink-500 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: color.hex }}></span>
                        {color.name}
                      </button>
                    ))}
                  </div>
                  {/* Custom colors */}
                  {formData.colors.filter(c => !COMMON_COLORS.map(cc => cc.value).includes(c)).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.colors.filter(c => !COMMON_COLORS.map(cc => cc.value).includes(c)).map((color) => (
                        <span
                          key={color}
                          className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs flex items-center gap-1"
                        >
                          {color}
                          <button type="button" onClick={() => toggleColor(color)} className="hover:text-pink-800">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomColor())}
                      placeholder="Өөр өнгө..."
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                    <button type="button" onClick={addCustomColor} className="px-3 py-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 text-sm">Нэмэх</button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-xl">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-pink-500 focus:ring-pink-500"
                    />
                    <div>
                      <span className="text-sm font-medium">Онцлох</span>
                      <p className="text-xs text-slate-500">Нүүр хуудсанд</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_new_arrival}
                      onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-pink-500 focus:ring-pink-500"
                    />
                    <div>
                      <span className="text-sm font-medium">Шинэ</span>
                      <p className="text-xs text-slate-500">NEW tag</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_on_sale}
                      onChange={(e) => setFormData({ ...formData, is_on_sale: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-pink-500 focus:ring-pink-500"
                    />
                    <div>
                      <span className="text-sm font-medium">Хямдрал</span>
                      <p className="text-xs text-slate-500">Sale хуудсанд</p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => !saving && setShowModal(false)}
                    disabled={saving}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    Болих
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-pink-500 text-white font-medium rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving && (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
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

        {/* Excel Upload Modal */}
        {showExcelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Excel-ээр бараа оруулах</h3>
                <button 
                  onClick={() => { setShowExcelModal(false); setExcelResult(null) }}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Заавар:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Excel (.xlsx, .xls) эсвэл CSV файл оруулна уу</li>
                    <li>• Доорх загвар файлыг татаж харна уу</li>
                    <li>• Зургийг дараа нь бараа тус бүрт засварлаж оруулна</li>
                    <li>• Брэнд, ангилал нь урьдчилан бүртгэгдсэн байх шаардлагатай</li>
                  </ul>
                </div>

                {/* Template download */}
                <button
                  onClick={downloadExcelTemplate}
                  className="w-full py-3 border-2 border-dashed border-emerald-300 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Загвар файл татах (CSV)
                </button>

                {/* File upload */}
                <div className="relative">
                  <input
                    ref={excelInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleExcelUpload}
                    className="hidden"
                    id="excel-upload"
                  />
                  <label
                    htmlFor="excel-upload"
                    className={`w-full py-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                      excelUploading 
                        ? 'border-slate-300 bg-slate-50' 
                        : 'border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    {excelUploading ? (
                      <>
                        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-slate-600">Файл боловсруулж байна...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-pink-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                        <span className="text-slate-600 font-medium">Excel файл сонгох</span>
                        <span className="text-sm text-slate-400">.xlsx, .xls, .csv</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Result */}
                {excelResult && (
                  <div className={`rounded-xl p-4 ${excelResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-start gap-3">
                      {excelResult.success ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-green-500 flex-shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-red-500 flex-shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      )}
                      <div className="flex-1">
                        <p className={`font-semibold ${excelResult.success ? 'text-green-700' : 'text-red-700'}`}>
                          {excelResult.message}
                        </p>
                        {excelResult.success && excelResult.totalRows && (
                          <p className="text-sm text-green-600 mt-1">
                            Нийт {excelResult.totalRows} мөрөөс {excelResult.successCount} бараа амжилттай нэмэгдлээ
                          </p>
                        )}
                        {excelResult.errors && excelResult.errors.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-amber-700">Анхааруулга:</p>
                            <ul className="text-sm text-amber-600 mt-1 max-h-32 overflow-y-auto">
                              {excelResult.errors.slice(0, 10).map((err, i) => (
                                <li key={i}>• {err}</li>
                              ))}
                              {excelResult.errors.length > 10 && (
                                <li>... + {excelResult.errors.length - 10} бусад</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
