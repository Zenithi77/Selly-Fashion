'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore, useAuthStore } from '@/lib/store'
import { api } from '@/lib/supabase'
import { 
  BANK_ACCOUNTS, 
  SHIPPING_COST, 
  FREE_SHIPPING_THRESHOLD,
  generatePaymentRef, 
  formatPrice, 
  copyToClipboard 
} from '@/lib/constants'

// Confetti component with pre-generated values
const confettiData = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: (i * 2) % 100,
  delay: (i * 0.06) % 3,
  colorIndex: i % 6
}))

const confettiColors = ['#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4']

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiData.map((item) => (
        <div
          key={item.id}
          className="absolute animate-confetti"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
            backgroundColor: confettiColors[item.colorIndex]
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          width: 10px;
          height: 10px;
          animation: confetti 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  )
}

// Payment Modal Component
interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  paymentRef: string
  totalAmount: number
  onPaymentSuccess: () => void
}

function PaymentModal({ isOpen, onClose, orderId, paymentRef, totalAmount, onPaymentSuccess }: PaymentModalProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<string>('Pending')
  const [showConfetti, setShowConfetti] = useState(false)

  // Poll for payment status
  useEffect(() => {
    if (!isOpen || !orderId) return

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status/${orderId}`, {
          cache: 'no-store'
        })
        const data = await res.json()
        
        if (data.success && data.paymentStatus) {
          setPaymentStatus(data.paymentStatus)
          
          if (data.paymentStatus === 'Paid') {
            setShowConfetti(true)
            clearInterval(pollInterval)
            
            // Wait for animation, then callback
            setTimeout(() => {
              onPaymentSuccess()
            }, 3000)
          }
        }
      } catch (error) {
        console.error('Payment status check failed:', error)
      }
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(pollInterval)
  }, [isOpen, orderId, onPaymentSuccess])

  const handleCopy = async (text: string, type: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  if (!isOpen) return null

  const bank = BANK_ACCOUNTS.khan

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {showConfetti && <Confetti />}
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={paymentStatus === 'Paid' ? undefined : onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {paymentStatus === 'Paid' ? (
          // Success State
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Төлбөр амжилттай!
            </h2>
            <p className="text-slate-500 mb-6">
              Таны захиалга баталгаажлаа. Бид таны захиалгыг бэлтгэж эхэлнэ.
            </p>
            <div className="animate-pulse text-sm text-slate-400">
              Хуудас автоматаар шилжих болно...
            </div>
          </div>
        ) : (
          // Waiting for Payment State
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Банкны шилжүүлэг</h2>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-center">
                <p className="text-white/80 text-sm mb-1">Төлөх дүн</p>
                <p className="text-4xl font-bold">{formatPrice(totalAmount)}</p>
              </div>
            </div>

            {/* Bank Details */}
            <div className="p-6 space-y-4">
              {/* Bank Name */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Банк</p>
                <p className="font-semibold text-lg">{bank.bankLogo} {bank.bankName}</p>
              </div>

              {/* Account Number */}
              <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Дансны дугаар</p>
                  <p className="font-mono font-bold text-lg tracking-wider">{bank.accountNumber}</p>
                </div>
                <button
                  onClick={() => handleCopy(bank.accountNumber, 'account')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    copied === 'account' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                  }`}
                >
                  {copied === 'account' ? '✓ Хуулсан' : 'Хуулах'}
                </button>
              </div>

              {/* Account Name */}
              <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Дансны нэр</p>
                  <p className="font-semibold">{bank.accountName}</p>
                </div>
                <button
                  onClick={() => handleCopy(bank.accountName, 'name')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    copied === 'name' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                  }`}
                >
                  {copied === 'name' ? '✓ Хуулсан' : 'Хуулах'}
                </button>
              </div>

              {/* Payment Reference - IMPORTANT */}
              <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-pink-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                  <p className="text-sm font-semibold text-pink-600">Гүйлгээний утга (ЗААВАЛ)</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-mono font-bold text-2xl text-pink-600 tracking-widest">{paymentRef}</p>
                  <button
                    onClick={() => handleCopy(paymentRef, 'ref')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      copied === 'ref' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-pink-500 text-white hover:bg-pink-600'
                    }`}
                  >
                    {copied === 'ref' ? '✓ Хуулсан' : 'Хуулах'}
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Мөнгөн дүн</p>
                  <p className="font-bold text-lg">{formatPrice(totalAmount)}</p>
                </div>
                <button
                  onClick={() => handleCopy(totalAmount.toString(), 'amount')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    copied === 'amount' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                  }`}
                >
                  {copied === 'amount' ? '✓ Хуулсан' : 'Хуулах'}
                </button>
              </div>

              {/* Waiting Indicator */}
              <div className="flex items-center justify-center gap-3 py-4 text-slate-500">
                <div className="relative">
                  <div className="w-6 h-6 border-2 border-pink-200 rounded-full"></div>
                  <div className="absolute inset-0 w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <span className="text-sm">Төлбөр хүлээж байна...</span>
              </div>

              <p className="text-xs text-center text-slate-400">
                Шилжүүлэг хийсний дараа автоматаар баталгаажна
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [paymentRef, setPaymentRef] = useState('')
  const [orderTotal, setOrderTotal] = useState(0)
  
  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    phone: user?.phone || '',
    city: '',
    address: '',
    notes: ''
  })

  const subtotal = getTotalPrice()
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const grandTotal = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate unique payment reference
      const newPaymentRef = generatePaymentRef()
      
      const orderData = {
        user_id: user?.id,
        status: 'pending' as const,
        payment_status: 'Pending' as const,
        payment_ref: newPaymentRef,
        payment_method: 'bank_transfer',
        total_amount: grandTotal,
        shipping_name: formData.name,
        shipping_phone: formData.phone,
        shipping_city: formData.city,
        shipping_address: formData.address,
        notes: formData.notes
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

      // Store order info and show payment modal
      setOrderId(data?.id || '')
      setPaymentRef(newPaymentRef)
      setOrderTotal(grandTotal)
      setShowPaymentModal(true)

    } catch (error) {
      console.error('Order error:', error)
      alert('Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = useCallback(() => {
    clearCart()
    router.push(`/order-success?id=${orderId}`)
  }, [clearCart, router, orderId])

  if (items.length === 0 && !showPaymentModal) {
    return (
      <main className="min-h-screen pt-[104px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-pink-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Сагс хоосон байна</h1>
          <p className="text-slate-500 mb-6">Захиалга хийхийн тулд эхлээд бараа нэмнэ үү</p>
          <Link href="/shop" className="px-6 py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition-colors">
            Дэлгүүр үзэх
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-[104px] bg-slate-50">
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderId={orderId}
        paymentRef={paymentRef}
        totalAmount={orderTotal}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/shop"
            className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Төлбөр төлөх</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h2 className="font-bold text-lg mb-6">Холбоо барих мэдээлэл</h2>
              
              {!isAuthenticated && (
                <div className="bg-pink-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-pink-600">
                    <Link href="/login" className="font-semibold underline">Нэвтэрч</Link> ороход таны мэдээлэл автоматаар бөглөгдөнө
                  </p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Нэр</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Утасны дугаар</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h2 className="font-bold text-lg mb-6">Хүргэлтийн хаяг</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Хот/Аймаг</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Дэлгэрэнгүй хаяг</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    placeholder="Дүүрэг, хороо, байр, тоот..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Нэмэлт тайлбар</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Хүргэлтийн талаар нэмэлт мэдээлэл..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method - Bank Transfer Only */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h2 className="font-bold text-lg mb-6">Төлбөрийн хэлбэр</h2>
              
              <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-slate-900">Банкны шилжүүлэг</p>
                    <p className="text-sm text-slate-500">Хаан банкны дансруу шилжүүлэг хийнэ</p>
                  </div>
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-pink-200">
                  <p className="text-sm text-slate-600">
                    Захиалга баталгаажуулсны дараа банкны данс болон гүйлгээний утга харагдана. 
                    Төлбөр хийсний дараа автоматаар баталгаажна.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 sticky top-28">
              <h2 className="font-bold text-lg mb-6">Захиалгын дүн</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img src={item.product.image_url || ''} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-slate-500">{item.size} • {item.color} • x{item.quantity}</p>
                      <p className="font-semibold text-pink-500 mt-1">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Дүн</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Хүргэлт</span>
                  <span className={shipping === 0 ? 'text-green-500' : ''}>
                    {shipping === 0 ? 'Үнэгүй' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-slate-400">
                    {formatPrice(FREE_SHIPPING_THRESHOLD)}-аас дээш захиалгад үнэгүй хүргэлт
                  </p>
                )}
                <div className="flex justify-between font-bold text-lg border-t border-slate-100 pt-3">
                  <span>Нийт</span>
                  <span className="text-pink-500">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg shadow-pink-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Түр хүлээнэ үү...
                  </>
                ) : (
                  'Захиалга баталгаажуулах'
                )}
              </button>

              <p className="text-xs text-slate-500 text-center mt-4">
                Захиалга өгснөөр та манай <Link href="/about" className="text-pink-500">үйлчилгээний нөхцөл</Link>-ийг зөвшөөрсөнд тооцно
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
