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

const REASONS: { value: StockReason; label: string; needsPayment: boolean; icon: string }[] = [
  { value: 'sale', label: 'Борлуулалт', needsPayment: true, icon: '💰' },
  { value: 'personal_use', label: 'Өөрийн хэрэгцээнд', needsPayment: false, icon: '🏠' },
  { value: 'damaged', label: 'Эвдэрсэн', needsPayment: false, icon: '💔' },
  { value: 'lost', label: 'Гээгдсэн', needsPayment: false, icon: '❓' },
  { value: 'return', label: 'Буцаалт', needsPayment: false, icon: '↩️' },
  { value: 'adjustment', label: 'Тохируулга', needsPayment: false, icon: '⚙️' },
  { value: 'other', label: 'Бусад', needsPayment: false, icon: '📝' },
]

interface CartLine {
  key: string
  product: Product
  variant: ProductVariant | null
  quantity: number
  source: StockSource
  unitPrice: number
}

export default function AdminSalesPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartLine[]>([])
  const [variantPicker, setVariantPicker] = useState<Product | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<StockPaymentMethod>('cash')
  const [reason, setReason] = useState<StockReason>('sale')
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
      const [pRes, mRes] = await Promise.all([
        api.getProducts(),
        api.getStockMovements(50),
      ])
      setProducts(pRes?.data || [])
      setMovements(mRes.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products.slice(0, 60)
    const q = search.toLowerCase()
    return products
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.barcode?.toLowerCase().includes(q) ||
        p.variants?.some(v => v.barcode?.toLowerCase().includes(q))
      )
      .slice(0, 100)
  }, [products, search])

  function addToCart(product: Product, variant: ProductVariant | null = null, source: StockSource = 'store') {
    const key = `${product.id}__${variant?.id || 'none'}__${source}`
    setCart(prev => {
      const existing = prev.find(c => c.key === key)
      if (existing) {
        return prev.map(c => (c.key === key ? { ...c, quantity: c.quantity + 1 } : c))
      }
      return [
        ...prev,
        { key, product, variant, quantity: 1, source, unitPrice: product.price },
      ]
    })
  }

  function handleProductClick(product: Product) {
    const hasVariants = product.variants && product.variants.length > 0
    if (hasVariants) {
      setVariantPicker(product)
    } else {
      addToCart(product, null, 'store')
    }
  }

  function updateQty(key: string, qty: number) {
    if (qty < 1) {
      setCart(prev => prev.filter(c => c.key !== key))
      return
    }
    setCart(prev => prev.map(c => (c.key === key ? { ...c, quantity: qty } : c)))
  }

  function updatePrice(key: string, price: number) {
    setCart(prev => prev.map(c => (c.key === key ? { ...c, unitPrice: price } : c)))
  }

  function updateSource(key: string, source: StockSource) {
    setCart(prev => prev.map(c => (c.key === key ? { ...c, source } : c)))
  }

  function removeLine(key: string) {
    setCart(prev => prev.filter(c => c.key !== key))
  }

  const cartTotal = useMemo(() => cart.reduce((s, c) => s + c.unitPrice * c.quantity, 0), [cart])
  const cartItems = useMemo(() => cart.reduce((s, c) => s + c.quantity, 0), [cart])
  const reasonInfo = REASONS.find(r => r.value === reason)
  const needsPayment = reasonInfo?.needsPayment ?? false

  function getStockOf(product: Product, variant: ProductVariant | null, source: StockSource): number {
    if (variant) {
      return source === 'warehouse' ? variant.warehouse_quantity || 0 : variant.store_quantity || 0
    }
    return source === 'warehouse'
      ? product.warehouse_quantity || 0
      : product.store_quantity || product.stock_quantity || 0
  }

  async function handleConfirm() {
    if (cart.length === 0) return
    setSubmitting(true)
    try {
      for (const line of cart) {
        await api.createStockMovement({
          product_id: line.product.id,
          variant_id: line.variant?.id || null,
          quantity: line.quantity,
          source: line.source,
          reason,
          payment_method: needsPayment ? paymentMethod : null,
          unit_price: needsPayment ? line.unitPrice : 0,
          total_amount: needsPayment ? line.unitPrice * line.quantity : 0,
          note: note || null,
        } as Partial<StockMovement>)
      }
      setCart([])
      setNote('')
      setReason('sale')
      setPaymentMethod('cash')
      setCheckoutOpen(false)
      await loadData()
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/admin" className="text-sm text-emerald-600 hover:underline">← Админ</Link>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">💰 Борлуулалт (POS)</h1>
          </div>
          <button onClick={loadData} className="px-3 py-2 bg-white border rounded-lg text-sm hover:bg-slate-50">
            ⟳ Шинэчлэх
          </button>
        </div>

        {/* Хайлтын мөр */}
        <div className="mb-4 sticky top-0 z-10 bg-white/90 backdrop-blur rounded-2xl p-3 shadow-sm border">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Бараа эсвэл баркод хайх..."
              autoFocus
              className="w-full px-5 py-3 pl-12 border-2 border-emerald-200 rounded-xl text-base focus:border-emerald-500 focus:outline-none"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</div>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Барааны grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12 text-slate-400">Бараа олдсонгүй</div>
              ) : (
                filteredProducts.map(p => {
                  const totalStock =
                    (p.store_quantity || 0) + (p.warehouse_quantity || 0) ||
                    p.stock_quantity || 0
                  const outOfStock = totalStock <= 0
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleProductClick(p)}
                      disabled={outOfStock}
                      className={`group bg-white rounded-xl overflow-hidden shadow-sm border-2 transition-all text-left ${
                        outOfStock
                          ? 'opacity-50 cursor-not-allowed border-slate-100'
                          : 'border-transparent hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="aspect-square bg-slate-100 relative">
                        <img
                          src={p.image_url || '/placeholder-product.svg'}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                        {outOfStock && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">ДУУССАН</span>
                          </div>
                        )}
                        {p.variants && p.variants.length > 0 && (
                          <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-purple-500 text-white text-[10px] rounded">
                            {p.variants.length} variant
                          </span>
                        )}
                      </div>
                      <div className="p-2">
                        <div className="text-xs font-medium text-slate-900 truncate">{p.name}</div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-bold text-emerald-600">
                            {p.price?.toLocaleString()}₮
                          </span>
                          <span className="text-[10px] text-slate-500">{totalStock} ш</span>
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Сагс */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border lg:sticky lg:top-24">
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg">🛒 Сагс</h2>
                  <p className="text-xs text-slate-500">{cartItems} ширхэг</p>
                </div>
                {cart.length > 0 && (
                  <button onClick={() => setCart([])} className="text-xs text-red-500 hover:underline">
                    Цэвэрлэх
                  </button>
                )}
              </div>

              <div className="max-h-[55vh] overflow-y-auto p-3 space-y-2">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm">
                    <div className="text-4xl mb-2">🛍️</div>
                    Бараа сонгоно уу
                  </div>
                ) : (
                  cart.map(line => (
                    <div key={line.key} className="p-2 bg-slate-50 rounded-lg">
                      <div className="flex gap-2">
                        <img
                          src={line.product.image_url || '/placeholder-product.svg'}
                          alt=""
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{line.product.name}</div>
                          <div className="text-xs text-slate-500">
                            {line.variant && (
                              <span>
                                {line.variant.size || '-'} / {line.variant.color || '-'}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeLine(line.key)}
                          className="text-slate-400 hover:text-red-500 text-lg leading-none"
                        >
                          ×
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2 gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQty(line.key, line.quantity - 1)}
                            className="w-7 h-7 border rounded bg-white text-sm"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={line.quantity}
                            onChange={e => updateQty(line.key, parseInt(e.target.value) || 1)}
                            className="w-12 text-center text-sm border rounded py-1"
                          />
                          <button
                            onClick={() => updateQty(line.key, line.quantity + 1)}
                            className="w-7 h-7 border rounded bg-white text-sm"
                          >
                            +
                          </button>
                        </div>
                        <input
                          type="number"
                          value={line.unitPrice}
                          onChange={e => updatePrice(line.key, parseFloat(e.target.value) || 0)}
                          className="w-24 text-right text-sm border rounded py-1 px-2"
                        />
                      </div>

                      <div className="flex items-center justify-between mt-1.5 gap-1">
                        <select
                          value={line.source}
                          onChange={e => updateSource(line.key, e.target.value as StockSource)}
                          className="text-[11px] border rounded px-1 py-0.5 flex-1"
                        >
                          <option value="store">🏪 Дэлгүүр ({getStockOf(line.product, line.variant, 'store')})</option>
                          <option value="warehouse">📦 Агуулах ({getStockOf(line.product, line.variant, 'warehouse')})</option>
                        </select>
                        <div className="text-sm font-bold text-emerald-600">
                          {(line.unitPrice * line.quantity).toLocaleString()}₮
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t bg-emerald-50 rounded-b-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-600">Нийт дүн:</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {cartTotal.toLocaleString()}₮
                  </span>
                </div>
                <button
                  onClick={() => setCheckoutOpen(true)}
                  disabled={cart.length === 0}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-bold"
                >
                  Үргэлжлүүлэх →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Сүүлийн хөдөлгөөнүүд */}
        <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold mb-3">📊 Сүүлийн хөдөлгөөнүүд</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
            {movements.length === 0 ? (
              <div className="col-span-full text-center py-6 text-slate-400 text-sm">
                Хөдөлгөөн алга
              </div>
            ) : (
              movements.map(m => {
                const r = REASONS.find(x => x.value === m.reason)
                const pm = PAYMENT_METHODS.find(x => x.value === m.payment_method)
                return (
                  <div key={m.id} className="p-2 border rounded-lg flex items-center gap-2 text-xs">
                    {m.product?.image_url && (
                      <img src={m.product.image_url} alt="" className="w-8 h-8 rounded object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{m.product?.name || '—'}</div>
                      <div className="text-slate-500 text-[10px]">
                        {r?.icon} {r?.label}
                        {pm && <span> · {pm.icon}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-500">−{m.quantity}</div>
                      {!!m.total_amount && m.total_amount > 0 && (
                        <div className="text-emerald-600 text-[10px]">
                          {m.total_amount.toLocaleString()}₮
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Variant picker modal */}
      {variantPicker && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setVariantPicker(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-1">{variantPicker.name}</h3>
            <p className="text-xs text-slate-500 mb-4">Хэмжээ × Өнгө сонгоно уу</p>
            <div className="grid grid-cols-2 gap-2">
              {variantPicker.variants?.map(v => {
                const storeQty = v.store_quantity || 0
                const wareQty = v.warehouse_quantity || 0
                const total = storeQty + wareQty
                return (
                  <div key={v.id} className="p-3 border-2 rounded-lg">
                    <div className="font-bold text-sm">
                      {v.size || '-'} / {v.color || '-'}
                    </div>
                    <div className="text-[10px] text-slate-500 mb-2">
                      Дэлгүүр: {storeQty} · Агуулах: {wareQty}
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        disabled={storeQty <= 0}
                        onClick={() => {
                          addToCart(variantPicker, v, 'store')
                          setVariantPicker(null)
                        }}
                        className="px-2 py-1.5 text-xs bg-emerald-50 border border-emerald-200 rounded text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-100"
                      >
                        🏪 Дэлгүүр
                      </button>
                      <button
                        disabled={wareQty <= 0}
                        onClick={() => {
                          addToCart(variantPicker, v, 'warehouse')
                          setVariantPicker(null)
                        }}
                        className="px-2 py-1.5 text-xs bg-blue-50 border border-blue-200 rounded text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-100"
                      >
                        📦 Агуулах
                      </button>
                    </div>
                    {total <= 0 && (
                      <div className="text-[10px] text-red-500 text-center mt-1">Дууссан</div>
                    )}
                  </div>
                )
              })}
            </div>
            <button
              onClick={() => setVariantPicker(null)}
              className="w-full mt-4 py-2 bg-slate-100 rounded-lg text-sm"
            >
              Болих
            </button>
          </div>
        </div>
      )}

      {/* Checkout modal */}
      {checkoutOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => !submitting && setCheckoutOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-bold text-xl mb-1">Баталгаажуулалт</h3>
            <p className="text-xs text-slate-500 mb-4">
              {cartItems} ширхэг бараа · {cartTotal.toLocaleString()}₮
            </p>

            {/* Шалтгаан */}
            <div className="mb-4">
              <label className="text-xs text-slate-500 mb-1 block">Шалтгаан</label>
              <div className="grid grid-cols-2 gap-2">
                {REASONS.map(r => (
                  <button
                    key={r.value}
                    onClick={() => setReason(r.value)}
                    className={`p-3 rounded-lg border-2 text-sm transition ${
                      reason === r.value
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xl">{r.icon}</div>
                    <div className="font-medium text-xs">{r.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Төлбөрийн хэлбэр */}
            {needsPayment && (
              <div className="mb-4">
                <label className="text-xs text-slate-500 mb-1 block">Төлбөрийн хэлбэр</label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map(pm => (
                    <button
                      key={pm.value}
                      onClick={() => setPaymentMethod(pm.value)}
                      className={`p-3 rounded-lg border-2 text-sm transition ${
                        paymentMethod === pm.value
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xl">{pm.icon}</div>
                      <div className="font-medium text-xs">{pm.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Тэмдэглэл */}
            <div className="mb-4">
              <label className="text-xs text-slate-500 mb-1 block">Тэмдэглэл (заавал биш)</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={2}
                placeholder="Жш: Хэрэглэгчийн нэр..."
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCheckoutOpen(false)}
                disabled={submitting}
                className="flex-1 py-3 bg-slate-100 rounded-lg text-sm"
              >
                Буцах
              </button>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold disabled:opacity-50"
              >
                {submitting ? 'Хадгалж байна...' : '✓ Баталгаажуулах'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
