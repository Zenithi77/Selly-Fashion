'use client'

import { useCartStore } from '@/lib/store'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'

export default function FloatingCart() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore()
  const [mounted, setMounted] = useState(false)

  const initializeMount = useCallback(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    initializeMount()
  }, [initializeMount])

  if (!mounted) return null

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Cart Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-pink-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-pink-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Сагс</h2>
              <p className="text-sm text-slate-500">{totalItems} бараа</p>
            </div>
          </div>
          <button 
            onClick={closeCart}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-pink-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Сагс хоосон байна</h3>
              <p className="text-slate-500 mb-6">Та бүтээгдэхүүн нэмээгүй байна</p>
              <button
                onClick={closeCart}
                className="px-6 py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition-colors"
              >
                Дэлгүүр үзэх
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={item.product.image_url || 'https://via.placeholder.com/200'} 
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 truncate">{item.product.name}</h4>
                  <p className="text-sm text-slate-500 mb-1">
                    {item.size && <span>Хэмжээ: {item.size}</span>}
                    {item.color && <span className="ml-2">Өнгө: {item.color}</span>}
                  </p>
                  <p className="font-bold text-pink-500">${item.product.price}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:bg-pink-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                        </svg>
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:bg-pink-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-pink-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-600">Нийт дүн</span>
              <span className="text-2xl font-bold text-slate-900">${totalPrice.toFixed(2)}</span>
            </div>
            <Link 
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center py-4 rounded-xl font-bold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg shadow-pink-500/25"
            >
              Төлбөр төлөх
            </Link>
            <button 
              onClick={closeCart}
              className="block w-full text-center text-pink-500 font-medium mt-3 hover:text-pink-600"
            >
              Дэлгүүр үргэлжлүүлэх
            </button>
          </div>
        )}
      </div>
    </>
  )
}
