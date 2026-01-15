'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Butterfly Silk Dress',
      price: 189,
      brand: 'Lumina',
      size: 'M',
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDa6Pco0Eua9_egjCcWcUyz3dUmmzFPeik_Nq55kxlNAJ746KOu-9saiZMWY9OEnqLTBcTS1h7gOi06YVaN4469ZKlhQDKUorWTxGWqfRm1burTqTob4wnTawZcl4MxAzmeSMyKzVDQ3mrRIqDntZkYm9LqHLGVayk0lziEofP97zZHoxJP_vPmj0CDMxPOxtww6DhOEkE28ofRrKSGfJneXq6c2S8Zb4rd1h-cx6AvMjwRjjVxaGsdM2JAqSafgB-5PkVw1etBzst',
    },
    {
      id: 2,
      name: 'Patriotic Denim Jacket',
      price: 249,
      brand: 'Nova',
      size: 'S',
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyhHnJubprKsL9AYscrPvsuJWOWXjGTrw5XIOsT5Fq5v9CzmpSW5ni052ur3Rezbcm_BG5lEei3SkXCGdTiVZvslbdZ-TkTGfGit_pXrAQY76rCONlAGhg9c64CCOY2M9Id66_XIeOIdB8ug3k0-9CbjOuImeo-Y6-XJrU-nZ-GIgjary9XfMuex-4qZmGQrfT3Ks2VsrdwvzXUtqKoPTfsQuEo-_ctMEk6kkkrTtRoOivbaAFUHu-NBgoDTGSQqpKlz8bp8nxnCKt',
    },
  ])

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const total = subtotal + shipping

  return (
    <main className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl font-bold mb-10">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-6">shopping_bag</span>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-slate-500 mb-8">Looks like you haven&apos;t added any items yet.</p>
            <Link href="/shop" className="bg-primary hover:bg-pink-600 text-white px-8 py-4 rounded-full font-bold transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-pink-100 dark:border-pink-900/30">
                  <div className="w-32 h-40 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-primary font-semibold mb-1">{item.brand}</p>
                    <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">Size: {item.size}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full border border-pink-200 flex items-center justify-center hover:bg-pink-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full border border-pink-200 flex items-center justify-center hover:bg-pink-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                      <p className="font-bold text-lg">${item.price * item.quantity}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors self-start"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-pink-100 dark:border-pink-900/30 p-8 sticky top-28">
                <h2 className="font-bold text-xl mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t border-pink-100 dark:border-pink-900/30 pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
                <button className="w-full bg-primary hover:bg-pink-600 text-white py-4 rounded-xl font-bold transition-colors mb-4">
                  Proceed to Checkout
                </button>
                <Link href="/shop" className="block text-center text-primary font-medium hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
