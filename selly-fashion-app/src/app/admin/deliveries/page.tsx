'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { api, Order, OrderStatus } from '@/lib/supabase'
import { ORDER_STATUS, COURIER_FLOW, DELIVERY_STATUSES } from '@/lib/order-status'
import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

export default function AdminDeliveriesPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | OrderStatus>('all')
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Order | null>(null)
  const [noteInput, setNoteInput] = useState('')
  const [courierInput, setCourierInput] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login')
      return
    }
    loadOrders()
  }, [isAuthenticated, isAdmin, router])

  async function loadOrders() {
    setLoading(true)
    try {
      const res = await api.getOrders()
      const data = res?.data || []
      // зөвхөн хүргэлтэнд хамаарах статустай захиалгууд
      const filtered = data.filter(o => {
        const status = (o.delivery_status || o.status) as OrderStatus
        return DELIVERY_STATUSES.includes(status) || status === 'confirmed' || status === 'processing'
      })
      setOrders(filtered)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const visibleOrders = useMemo(() => {
    let list = orders
    if (filter !== 'all') {
      list = list.filter(o => (o.delivery_status || o.status) === filter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(o =>
        o.shipping_name?.toLowerCase().includes(q) ||
        o.shipping_phone?.toLowerCase().includes(q) ||
        o.shipping_address?.toLowerCase().includes(q) ||
        o.id?.toLowerCase().includes(q)
      )
    }
    return list
  }, [orders, filter, search])

  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const o of orders) {
      const s = (o.delivery_status || o.status) as string
      map[s] = (map[s] || 0) + 1
    }
    return map
  }, [orders])

  async function updateStatus(order: Order, newStatus: OrderStatus) {
    setUpdatingId(order.id)
    try {
      await api.updateDeliveryStatus(order.id, {
        delivery_status: newStatus,
        delivery_notes: noteInput || order.delivery_notes || undefined,
        delivery_courier: courierInput || order.delivery_courier || undefined,
      })
      await loadOrders()
      setSelected(null)
      setNoteInput('')
      setCourierInput('')
    } catch (e) {
      alert('Алдаа гарлаа: ' + (e as Error).message)
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-pink-500">Ачааллаж байна...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/admin" className="text-sm text-cyan-600 hover:underline">← Админ</Link>
            <h1 className="text-3xl font-bold text-slate-900 mt-1">🚚 Хүргэлт</h1>
            <p className="text-slate-600 text-sm">Хүргэлтийн ажилчдад зориулсан хяналтын самбар</p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Хайх (нэр, утас, хаяг, ID)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm w-64"
            />
            <button onClick={loadOrders} className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm hover:bg-cyan-600">
              ⟳ Шинэчлэх
            </button>
          </div>
        </div>

        {/* Status filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Бүгд ({orders.length})
          </button>
          {DELIVERY_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === s
                  ? `bg-${ORDER_STATUS[s].color}-500 text-white`
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {ORDER_STATUS[s].label} ({counts[s] || 0})
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="grid gap-4">
          {visibleOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-500">
              Захиалга алга
            </div>
          ) : (
            visibleOrders.map(order => {
              const currentStatus = (order.delivery_status || order.status) as OrderStatus
              const info = ORDER_STATUS[currentStatus]
              return (
                <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${info?.color}-100 text-${info?.color}-700`}>
                          {info?.label || currentStatus}
                        </span>
                        <span className="text-xs text-slate-400">#{order.id.slice(0, 8)}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(order.created_at).toLocaleString('mn-MN')}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mt-2">{order.shipping_name || 'Тодорхойгүй'}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-pink-500">
                        {order.total_amount?.toLocaleString()}₮
                      </div>
                      <div className="text-xs text-slate-500">
                        {order.payment_method === 'cash' ? '💵 Бэлнээр' : '💳 Картаар'}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3 text-sm mb-3">
                    <div>
                      <div className="text-xs text-slate-400">📞 Утас</div>
                      <a href={`tel:${order.shipping_phone}`} className="font-medium text-blue-600 hover:underline">
                        {order.shipping_phone || '-'}
                      </a>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-xs text-slate-400">📍 Хаяг</div>
                      <div className="font-medium">{order.shipping_address || '-'}</div>
                    </div>
                  </div>

                  {order.delivery_courier && (
                    <div className="text-xs text-slate-500 mb-2">
                      🚴 Курьер: <strong>{order.delivery_courier}</strong>
                    </div>
                  )}
                  {order.delivery_notes && (
                    <div className="text-xs text-slate-500 mb-2 italic">📝 {order.delivery_notes}</div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
                    {COURIER_FLOW.map(s => {
                      if (s === currentStatus) return null
                      return (
                        <button
                          key={s}
                          disabled={updatingId === order.id}
                          onClick={() => {
                            setSelected(order)
                            setNoteInput(order.delivery_notes || '')
                            setCourierInput(order.delivery_courier || '')
                            // нэн даруй биш — модал дээрээс баталгаажуулна
                            setTimeout(() => {
                              const ok = confirm(`"${ORDER_STATUS[s].label}" статус руу шилжүүлэх үү?`)
                              if (ok) updateStatus(order, s)
                            }, 0)
                          }}
                          className={`px-3 py-1.5 text-xs rounded-lg border bg-${ORDER_STATUS[s].color}-50 border-${ORDER_STATUS[s].color}-200 text-${ORDER_STATUS[s].color}-700 hover:bg-${ORDER_STATUS[s].color}-100`}
                        >
                          → {ORDER_STATUS[s].label}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => {
                        setSelected(order)
                        setNoteInput(order.delivery_notes || '')
                        setCourierInput(order.delivery_courier || '')
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 ml-auto"
                    >
                      ✏️ Тэмдэглэл/курьер
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Edit modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4">Захиалга #{selected.id.slice(0, 8)}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500">Курьерийн нэр</label>
                  <input
                    type="text"
                    value={courierInput}
                    onChange={e => setCourierInput(e.target.value)}
                    placeholder="Жш: Болд"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Тэмдэглэл</label>
                  <textarea
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => updateStatus(selected, (selected.delivery_status || selected.status) as OrderStatus)}
                    className="flex-1 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-cyan-600"
                  >
                    Хадгалах
                  </button>
                  <button onClick={() => setSelected(null)} className="px-4 py-2 bg-slate-100 rounded-lg text-sm">
                    Болих
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
