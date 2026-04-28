'use client'

import { useState, useEffect, useMemo, Fragment } from 'react'
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
  const [expanded, setExpanded] = useState<string | null>(null)

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
      const filtered = data.filter(o => {
        const status = (o.delivery_status || o.status) as OrderStatus
        return DELIVERY_STATUSES.includes(status) || status === 'confirmed' || status === 'processing' || status === 'pending'
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

  async function quickUpdate(order: Order, newStatus: OrderStatus) {
    setUpdatingId(order.id)
    try {
      await api.updateDeliveryStatus(order.id, {
        delivery_status: newStatus,
        delivery_notes: order.delivery_notes || undefined,
        delivery_courier: order.delivery_courier || undefined,
      })
      await loadOrders()
    } catch (e) {
      alert('Алдаа гарлаа: ' + (e as Error).message)
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">Ачааллаж байна...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-900">← Админ</Link>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">🚚 Хүргэлт</h1>
          <p className="text-slate-600 text-sm">Хүргэлтийн ажилчдын хяналтын самбар</p>
        </div>

        {/* Search + refresh */}
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="🔍 Хайх (нэр, утас, хаяг)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <button onClick={loadOrders} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800">
            ⟳ Шинэчлэх
          </button>
        </div>

        {/* Status filter chips */}
        <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Бүгд ({orders.length})
          </button>
          {DELIVERY_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {ORDER_STATUS[s].label} ({counts[s] || 0})
            </button>
          ))}
        </div>

        {/* Desktop: Table */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr className="text-xs text-slate-600 uppercase">
                <th className="text-left p-3">№</th>
                <th className="text-left p-3">Захиалагч</th>
                <th className="text-left p-3">Утас</th>
                <th className="text-left p-3">Хаяг</th>
                <th className="text-right p-3">Дүн</th>
                <th className="text-center p-3">Статус</th>
                <th className="text-center p-3">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">Захиалга алга</td>
                </tr>
              ) : (
                visibleOrders.map((order, idx) => {
                  const currentStatus = (order.delivery_status || order.status) as OrderStatus
                  const info = ORDER_STATUS[currentStatus]
                  const isExpanded = expanded === order.id
                  return (
                    <Fragment key={order.id}>
                      <tr
                        className="border-b hover:bg-slate-50 cursor-pointer"
                        onClick={() => setExpanded(isExpanded ? null : order.id)}
                      >
                        <td className="p-3 text-sm">
                          <div className="font-medium">{idx + 1}</div>
                          <div className="text-[10px] text-slate-400">#{order.id.slice(0, 6)}</div>
                        </td>
                        <td className="p-3 text-sm font-medium">{order.shipping_name || '—'}</td>
                        <td className="p-3 text-sm">
                          <a href={`tel:${order.shipping_phone}`} onClick={e => e.stopPropagation()} className="text-blue-600 hover:underline">
                            {order.shipping_phone || '-'}
                          </a>
                        </td>
                        <td className="p-3 text-sm max-w-xs truncate">{order.shipping_address || '-'}</td>
                        <td className="p-3 text-sm text-right font-bold text-slate-900">
                          {order.total_amount?.toLocaleString()}₮
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${info?.badge || ''}`}>
                            {info?.label || currentStatus}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              setExpanded(isExpanded ? null : order.id)
                            }}
                            className="text-slate-700 text-sm font-medium hover:text-slate-900"
                          >
                            {isExpanded ? 'Хаах' : 'Үйлдэл ▼'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-50">
                          <td colSpan={7} className="p-4">
                            <div className="flex flex-wrap gap-2">
                              {COURIER_FLOW.filter(s => s !== currentStatus).map(s => (
                                <button
                                  key={s}
                                  disabled={updatingId === order.id}
                                  onClick={() => {
                                    if (confirm(`"${ORDER_STATUS[s].label}" болгох уу?`)) {
                                      quickUpdate(order, s)
                                    }
                                  }}
                                  className={`px-3 py-2 text-xs rounded-lg border ${ORDER_STATUS[s].button} disabled:opacity-50`}
                                >
                                  → {ORDER_STATUS[s].label}
                                </button>
                              ))}
                            </div>
                            {order.delivery_notes && (
                              <div className="mt-3 text-xs text-slate-600 italic">
                                📝 {order.delivery_notes}
                              </div>
                            )}
                            {order.delivery_courier && (
                              <div className="mt-1 text-xs text-slate-600">
                                🚴 {order.delivery_courier}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile: Card list */}
        <div className="md:hidden space-y-3">
          {visibleOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400">
              Захиалга алга
            </div>
          ) : (
            visibleOrders.map(order => {
              const currentStatus = (order.delivery_status || order.status) as OrderStatus
              const info = ORDER_STATUS[currentStatus]
              const isExpanded = expanded === order.id
              return (
                <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{order.shipping_name || '—'}</div>
                      <a
                        href={`tel:${order.shipping_phone}`}
                        className="text-sm text-blue-600 underline"
                      >
                        📞 {order.shipping_phone || '-'}
                      </a>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-semibold ${info?.badge || ''}`}>
                        {info?.label || currentStatus}
                      </span>
                      <div className="text-base font-bold text-slate-900 mt-1">
                        {order.total_amount?.toLocaleString()}₮
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 mb-2">📍 {order.shipping_address || '-'}</div>
                  <div className="text-[10px] text-slate-400 mb-2">
                    #{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleString('mn-MN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>

                  <button
                    onClick={() => setExpanded(isExpanded ? null : order.id)}
                    className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
                  >
                    {isExpanded ? '✕ Хаах' : '⚡ Статус солих'}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {COURIER_FLOW.filter(s => s !== currentStatus).map(s => (
                        <button
                          key={s}
                          disabled={updatingId === order.id}
                          onClick={() => {
                            if (confirm(`"${ORDER_STATUS[s].label}" болгох уу?`)) {
                              quickUpdate(order, s)
                            }
                          }}
                          className={`px-2 py-2 text-xs rounded-lg border ${ORDER_STATUS[s].button} disabled:opacity-50`}
                        >
                          → {ORDER_STATUS[s].label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
