'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore, useAuthStore } from '@/lib/store'
import { api } from '@/lib/supabase'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    phone: user?.phone || '',
    city: '',
    address: '',
    notes: '',
    paymentMethod: 'card'
  })

  const total = getTotalPrice()
  const shipping = total >= 100 ? 0 : 10
  const grandTotal = total + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        user_id: user?.id,
        status: 'pending' as const,
        total_amount: grandTotal,
        shipping_name: formData.name,
        shipping_phone: formData.phone,
        shipping_city: formData.city,
        shipping_address: formData.address,
        notes: formData.notes,
        payment_method: formData.paymentMethod
      }

      const orderItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size,
        color: item.color
      }))

      const { data, error } = await api.createOrder(orderData, orderItems)
      
      if (error) throw error

      clearCart()
      router.push(`/order-success?id=${data?.id}`)
    } catch (error) {
      console.error('Order error:', error)
      alert('Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-[104px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-pink-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Сагс хоосон байна</h1>
          <p className="text-slate-500 mb-6">Захиалга хийхийн тулд эхлээд бараа нэмнэ үү</p>
          <Link href="/shop" className="px-6 py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition-colors">
            Дэлгүүр үзэх
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-[104px] bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/shop"
            className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Төлбөр төлөх</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-lg mb-6">Холбоо барих мэдээлэл</h2>
              
              {!isAuthenticated && (
                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4 mb-6">
                  <p className="text-sm text-pink-600 dark:text-pink-400">
                    <Link href="/login" className="font-semibold underline">Нэвтэрч</Link> ороход таны мэдээлэл автоматаар бөглөгдөнө
                  </p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Нэр</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Утасны дугаар</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-lg mb-6">Хүргэлтийн хаяг</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Хот/Аймаг</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    required
                  >
                    <option value="">Сонгох...</option>
                    <option value="ulaanbaatar">Улаанбаатар</option>
                    <option value="darkhan">Дархан</option>
                    <option value="erdenet">Эрдэнэт</option>
                    <option value="other">Бусад</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Дэлгэрэнгүй хаяг</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    placeholder="Дүүрэг, хороо, байр, тоот..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Нэмэлт тайлбар</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Хүргэлтийн талаар нэмэлт мэдээлэл..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-lg mb-6">Төлбөрийн хэлбэр</h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-pointer border-2 border-transparent has-[:checked]:border-pink-500">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-5 h-5 text-pink-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Карт</p>
                    <p className="text-sm text-slate-500">Visa, MasterCard</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                    <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                  </div>
                </label>
                
                <label className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-pointer border-2 border-transparent has-[:checked]:border-pink-500">
                  <input
                    type="radio"
                    name="payment"
                    value="qpay"
                    checked={formData.paymentMethod === 'qpay'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-5 h-5 text-pink-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium">QPay</p>
                    <p className="text-sm text-slate-500">Банкны аппаар төлөх</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-pointer border-2 border-transparent has-[:checked]:border-pink-500">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-5 h-5 text-pink-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Бэлнээр</p>
                    <p className="text-sm text-slate-500">Хүргэлтийн үед төлөх</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 sticky top-28">
              <h2 className="font-bold text-lg mb-6">Захиалгын дүн</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                      <img src={item.product.image_url || ''} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-slate-500">{item.size} • {item.color} • x{item.quantity}</p>
                      <p className="font-semibold text-pink-500 mt-1">${item.product.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Дүн</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Хүргэлт</span>
                  <span className={shipping === 0 ? 'text-green-500' : ''}>
                    {shipping === 0 ? 'Үнэгүй' : `$${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span>Нийт</span>
                  <span className="text-pink-500">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg shadow-pink-500/25 disabled:opacity-50"
              >
                {loading ? 'Түр хүлээнэ үү...' : 'Захиалга баталгаажуулах'}
              </button>

              <p className="text-xs text-slate-500 text-center mt-4">
                Захиалга өгснөөр та манай <Link href="/terms" className="text-pink-500">үйлчилгээний нөхцөл</Link>-ийг зөвшөөрсөнд тооцно
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
