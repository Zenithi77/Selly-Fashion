'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { api, Product, ProductVariant, StockMovement, StockPaymentMethod, StockReason, StockSource } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

const PAYMENT_METHODS: { value: StockPaymentMethod; label: string; icon: string; color: string }[] = [
  { value: 'cash', label: 'Бэлэн мөнгө', icon: '💵', color: 'green' },
  { value: 'bank', label: 'Дансаар', icon: '🏦', color: 'blue' },
  { value: 'personal_loan', label: 'Хувь зээл', icon: '🤝', color: 'amber' },
  { value: 'own_use', label: 'Өөрийн хэрэгцээ', icon: '🏠', color: 'purple' },
]

const REASONS: { value: StockReason; label: string; needsPayment: boolean }[] = [
  { value: 'sale', label: 'Борлуулалт', needsPayment: true },
  { value: 'personal_use', label: 'Өөрийн хэрэгцээнд', needsPayment: false },
  { value: 'damaged', label: 'Эвдэрсэн', needsPayment: false },
  { value: 'lost', label: 'Гээгдсэн', needsPayment: false },
  { value: 'return', label: 'Буцаалт', needsPayment: false },
  { value: 'adjustment', label: 'Тохируулга', needsPayment: false },
  { value: 'other', label: 'Бусад', needsPayment: false },
]

export default function AdminSalesPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [source, setSource] = useState<StockSource>('store')
  const [paymentMethod, setPaymentMethod] = useState<StockPaymentMethod>('cash')
  const [reason, setReason] = useState<StockReason>('sale')
  const [unitPrice, setUnitPrice] = useState<string>('')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login')
      return
    }
    loadData()
  }, [isAuthenticated, isAdmin, router])

  async function loadData() {
    setLoading(true)
    try {
      const [pData, mRes] = await Promise.all([
        api.getProducts(),
        api.getStockMovements(50),
      ])
      setProducts(pData || [])
      setMovements(mRes.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products.slice(0, 20)
    const q = search.toLowerCase()
    return products
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.barcode?.toLowerCase().includes(q) ||
        p.variants?.some(v => v.barcode?.toLowerCase().includes(q))
      )
      .slice(0, 50)
  }, [products, search])

  const reasonInfo = REASONS.find(r => r.value === reason)
  const needsPayment = reasonInfo?.needsPayment ?? false

  const totalAmount = useMemo(() => {
    const price = parseFloat(unitPrice) || (needsPayment ? selectedProduct?.price || 0 : 0)
    return price * quantity
  }, [unitPrice, quantity, selectedProduct, needsPayment])

  const availableStock = useMemo(() => {
    if (selectedVariant) {
      return source === 'warehouse'
        ? selectedVariant.warehouse_quantity || 0
        : selectedVariant.store_quantity || 0
    }
    if (selectedProduct) {
      return source === 'warehouse'
        ? selectedProduct.warehouse_quantity || 0
        : selectedProduct.store_quantity || selectedProduct.stock_quantity || 0
    }
    return 0
  }, [selectedProduct, selectedVariant, source])

  function resetForm() {
    setSelectedProduct(null)
    setSelectedVariant(null)
    setQuantity(1)
    setUnitPrice('')
    setNote('')
    setSource('store')
    setPaymentMethod('cash')
    setReason('sale')
    setSearch('')
  }

  async function handleSubmit() {
    if (!selectedProduct) {
      alert('Бүтээгдэхүүн сонгоно уу')
      return
    }
    if (quantity < 1) {
      alert('Тоо ширхэг буруу')
      return
    }
    if (quantity > availableStock) {
      if (!confirm(`Боломжит нөөц ${availableStock} ширхэг. Үргэлжлүүлэх үү?`)) return
    }

    setSubmitting(true)
    try {
      const price = parseFloat(unitPrice) || (needsPayment ? selectedProduct.price : 0)
      const { error } = await api.createStockMovement({
        product_id: selectedProduct.id,
        variant_id: selectedVariant?.id || null,
        quantity,
        source,
        reason,
        payment_method: needsPayment ? paymentMethod : null,
        unit_price: price,
        total_amount: needsPayment ? totalAmount : 0,
        note: note || null,
      } as Partial<StockMovement>)

      if (error) {
        alert('Алдаа: ' + error.message)
      } else {
        resetForm()
        loadData()
      }
    } catch (e) {
      alert('Алдаа: ' + (e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-emerald-500">Ачааллаж байна...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin" className="text-sm text-emerald-600 hover:underline">← Админ</Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">💰 Борлуулалт (POS)</h1>
          <p className="text-slate-600 text-sm">Бэлэн борлуулалт болон нөөцийн хасалт</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Шинэ борлуулалт / хасалт</h2>

            {/* Product search */}
            <div className="mb-4">
              <label className="text-xs text-slate-500 mb-1 block">Бүтээгдэхүүн / баркод хайх</label>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Нэр эсвэл баркод..."
                className="w-full px-4 py-3 border rounded-lg"
              />
              {!selectedProduct && search && (
                <div className="mt-2 max-h-60 overflow-y-auto border rounded-lg divide-y">
                  {filteredProducts.length === 0 ? (
                    <div className="p-3 text-sm text-slate-500">Олдсонгүй</div>
                  ) : (
                    filteredProducts.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedProduct(p)
                          setUnitPrice(String(p.price))
                          setSearch('')
                        }}
                        className="w-full p-3 text-left hover:bg-emerald-50 flex items-center gap-3"
                      >
                        <img src={p.image_url || '/placeholder-product.svg'} alt="" className="w-10 h-10 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{p.name}</div>
                          <div className="text-xs text-slate-500">
                            {p.price?.toLocaleString()}₮ · Нөөц: {p.stock_quantity || 0}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {selectedProduct && (
              <>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg mb-4 flex items-center gap-3">
                  <img src={selectedProduct.image_url || '/placeholder-product.svg'} alt="" className="w-12 h-12 rounded object-cover" />
                  <div className="flex-1">
                    <div className="font-bold">{selectedProduct.name}</div>
                    <div className="text-xs text-slate-600">
                      Дэлгүүр: {selectedProduct.store_quantity || 0} · Агуулах: {selectedProduct.warehouse_quantity || 0}
                    </div>
                  </div>
                  <button onClick={resetForm} className="text-slate-400 hover:text-red-500">×</button>
                </div>

                {/* Variants */}
                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <div className="mb-4">
                    <label className="text-xs text-slate-500 mb-1 block">Хэмжээ × Өнгө</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <button
                        onClick={() => setSelectedVariant(null)}
                        className={`p-2 text-xs rounded-lg border ${
                          !selectedVariant ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-slate-200'
                        }`}
                      >
                        Variant сонгохгүй
                      </button>
                      {selectedProduct.variants.map(v => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`p-2 text-xs rounded-lg border ${
                            selectedVariant?.id === v.id
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="font-medium">{v.size || '-'} / {v.color || '-'}</div>
                          <div className="text-[10px] opacity-75">
                            Д:{v.store_quantity || 0} А:{v.warehouse_quantity || 0}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source */}
                <div className="mb-4">
                  <label className="text-xs text-slate-500 mb-1 block">Хаанаас хасах</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['store', 'warehouse'] as StockSource[]).map(s => (
                      <button
                        key={s}
                        onClick={() => setSource(s)}
                        className={`p-3 rounded-lg border-2 ${
                          source === s ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'
                        }`}
                      >
                        {s === 'store' ? '🏪 Дэлгүүр' : '📦 Агуулах'}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Боломжит нөөц: <strong>{availableStock}</strong></div>
                </div>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="text-xs text-slate-500 mb-1 block">Тоо ширхэг</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border rounded-lg">−</button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 text-center text-xl font-bold border rounded-lg py-2"
                    />
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border rounded-lg">+</button>
                  </div>
                </div>

                {/* Reason */}
                <div className="mb-4">
                  <label className="text-xs text-slate-500 mb-1 block">Шалтгаан</label>
                  <select
                    value={reason}
                    onChange={e => setReason(e.target.value as StockReason)}
                    className="w-full p-3 border rounded-lg"
                  >
                    {REASONS.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                {/* Payment method (зөвхөн борлуулалтад) */}
                {needsPayment && (
                  <div className="mb-4">
                    <label className="text-xs text-slate-500 mb-1 block">Төлбөрийн хэлбэр</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PAYMENT_METHODS.map(pm => (
                        <button
                          key={pm.value}
                          onClick={() => setPaymentMethod(pm.value)}
                          className={`p-3 rounded-lg border-2 text-sm ${
                            paymentMethod === pm.value
                              ? `border-${pm.color}-500 bg-${pm.color}-50`
                              : 'border-slate-200'
                          }`}
                        >
                          <div>{pm.icon}</div>
                          <div className="font-medium">{pm.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unit price */}
                {needsPayment && (
                  <div className="mb-4">
                    <label className="text-xs text-slate-500 mb-1 block">Нэгжийн үнэ (₮)</label>
                    <input
                      type="number"
                      value={unitPrice}
                      onChange={e => setUnitPrice(e.target.value)}
                      placeholder={String(selectedProduct.price)}
                      className="w-full p-3 border rounded-lg text-lg"
                    />
                    <div className="text-sm text-slate-600 mt-1">
                      Нийт: <strong className="text-emerald-600 text-lg">{totalAmount.toLocaleString()}₮</strong>
                    </div>
                  </div>
                )}

                {/* Note */}
                <div className="mb-4">
                  <label className="text-xs text-slate-500 mb-1 block">Тэмдэглэл (заавал биш)</label>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    rows={2}
                    placeholder="Жш: Хэрэглэгчийн нэр..."
                    className="w-full p-3 border rounded-lg"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-lg disabled:opacity-50"
                >
                  {submitting ? 'Хадгалж байна...' : '✓ Баталгаажуулах'}
                </button>
              </>
            )}
          </div>

          {/* Right: Recent movements */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Сүүлийн хөдөлгөөн</h2>
            <div className="space-y-2 max-h-[700px] overflow-y-auto">
              {movements.length === 0 ? (
                <div className="text-center py-8 text-slate-500">Хөдөлгөөн алга</div>
              ) : (
                movements.map(m => {
                  const r = REASONS.find(x => x.value === m.reason)
                  const pm = PAYMENT_METHODS.find(x => x.value === m.payment_method)
                  return (
                    <div key={m.id} className="p-3 border rounded-lg flex items-start gap-3">
                      {m.product?.image_url && (
                        <img src={m.product.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{m.product?.name || '—'}</div>
                        <div className="text-xs text-slate-500">
                          {m.variant && <span>{m.variant.size || '-'}/{m.variant.color || '-'} · </span>}
                          {m.source === 'warehouse' ? '📦' : '🏪'} {r?.label || m.reason}
                          {pm && <span> · {pm.icon}{pm.label}</span>}
                        </div>
                        <div className="text-xs text-slate-400">
                          {new Date(m.created_at).toLocaleString('mn-MN')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-500">−{m.quantity}</div>
                        {m.total_amount > 0 && (
                          <div className="text-xs text-emerald-600">{m.total_amount.toLocaleString()}₮</div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
