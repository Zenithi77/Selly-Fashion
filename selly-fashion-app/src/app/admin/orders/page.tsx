'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api, Order } from '@/lib/supabase'

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Хүлээгдэж буй', color: 'yellow' },
  confirmed: { label: 'Баталгаажсан', color: 'blue' },
  processing: { label: 'Бэлдэж буй', color: 'indigo' },
  shipped: { label: 'Хүргэлтэнд', color: 'purple' },
  delivered: { label: 'Хүргэгдсэн', color: 'green' },
  cancelled: { label: 'Цуцлагдсан', color: 'red' }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filter, setFilter] = useState('all')

  const fetchOrders = async () => {
    setLoading(true)
    const { data } = await api.getOrders()
    if (data) setOrders(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    await api.updateOrderStatus(orderId, newStatus)
    fetchOrders()
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter)

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
              <h1 className="text-2xl font-bold text-slate-900">Захиалга</h1>
              <p className="text-sm text-slate-500">{orders.length} захиалга</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === 'all' ? 'bg-pink-500 text-white' : 'bg-white text-slate-600'}`}
            >
              Бүгд
            </button>
            {Object.entries(statusLabels).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === key ? 'bg-pink-500 text-white' : 'bg-white text-slate-600'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-slate-300 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <p className="text-slate-500">Захиалга олдсонгүй</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${
                    selectedOrder?.id === order.id 
                      ? 'border-pink-500 shadow-lg' 
                      : 'border-transparent hover:border-pink-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-slate-500">Захиалга #{order.id.slice(0, 8)}</p>
                      <p className="font-semibold text-slate-900 mt-1">
                        {order.user?.full_name || order.shipping_name || 'Unknown'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${statusLabels[order.status]?.color}-100${statusLabels[order.status]?.color}-900/30 text-${statusLabels[order.status]?.color}-600${statusLabels[order.status]?.color}-400`}>
                      {statusLabels[order.status]?.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-slate-500">
                      <span>{order.order_items?.length || 0} бараа</span>
                      <span>{new Date(order.created_at).toLocaleDateString('mn-MN')}</span>
                    </div>
                    <span className="font-bold text-pink-500">${order.total_amount}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white rounded-2xl p-6 sticky top-28 border border-slate-100">
                <h2 className="font-bold text-lg mb-6">Захиалгын дэлгэрэнгүй</h2>
                
                {/* Order ID & Date */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Захиалгын ID</span>
                    <span className="font-mono text-xs">{selectedOrder.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Огноо</span>
                    <span>{new Date(selectedOrder.created_at).toLocaleString('mn-MN')}</span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="border-t border-slate-100 pt-4 mb-6">
                  <h3 className="font-semibold mb-3">Хэрэглэгчийн мэдээлэл</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-slate-500">Нэр:</span> {selectedOrder.user?.full_name || selectedOrder.shipping_name}</p>
                    <p><span className="text-slate-500">Утас:</span> {selectedOrder.shipping_phone || selectedOrder.user?.phone}</p>
                    <p><span className="text-slate-500">Хаяг:</span> {selectedOrder.shipping_address}</p>
                    {selectedOrder.shipping_city && (
                      <p><span className="text-slate-500">Хот:</span> {selectedOrder.shipping_city}</p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-slate-100 pt-4 mb-6">
                  <h3 className="font-semibold mb-3">Бүтээгдэхүүн</h3>
                  <div className="space-y-3">
                    {selectedOrder.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-14 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product?.image_url && (
                            <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.product?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500">
                            {item.size && `${item.size}`} {item.color && `• ${item.color}`} • x{item.quantity}
                          </p>
                        </div>
                        <span className="font-semibold">${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-slate-100 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Нийт</span>
                    <span className="text-2xl font-bold text-pink-500">${selectedOrder.total_amount}</span>
                  </div>
                </div>

                {/* Status Change */}
                <div className="border-t border-slate-100 pt-4">
                  <h3 className="font-semibold mb-3">Төлөв өөрчлөх</h3>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as Order['status'])}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                  >
                    {Object.entries(statusLabels).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center sticky top-28">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-slate-300 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <p className="text-slate-500">Захиалга сонгоно уу</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
