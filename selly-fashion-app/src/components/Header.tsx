'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCartStore, useAuthStore, useWishlistStore } from '@/lib/store'

function WishlistButton() {
  const { items } = useWishlistStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const count = mounted ? items.length : 0

  return (
    <Link href="/wishlist" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const { items, toggleCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu)
  }

  const closeMenu = () => {
    setIsMobileMenuOpen(false)
    setOpenSubmenu(null)
  }

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        {/* Top Banner */}
        <div className="bg-pink-500 text-white text-center py-1.5 text-[10px] sm:text-xs font-medium tracking-wide">
          <span className="hidden sm:inline">FREE SHIPPING ON ORDERS OVER $100 | NEW ARRIVALS WEEKLY</span>
          <span className="sm:hidden">FREE SHIPPING OVER $100 ✨</span>
        </div>

        {/* Main Navigation */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Left - Hamburger (Mobile) */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-800"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>

            {/* Left Navigation - Desktop */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="text-sm font-semibold tracking-wide py-4 hover:text-pink-500 transition-colors text-gray-800">
                  WOMEN
                </button>
                <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                  <Link href="/category/dresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500">Dresses</Link>
                  <Link href="/category/tops" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500">Tops & Blouses</Link>
                  <Link href="/category/outerwear" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500">Jackets & Coats</Link>
                  <Link href="/category/pants" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500">Pants & Jeans</Link>
                </div>
              </div>

              <div className="relative group">
                <button className="text-sm font-semibold tracking-wide py-4 hover:text-pink-500 transition-colors text-gray-800">
                  MEN
                </button>
                <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                  <Link href="/category/shirts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500">Shirts</Link>
                  <Link href="/category/pants" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500">Pants</Link>
                  <Link href="/category/outerwear" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500">Outerwear</Link>
                </div>
              </div>

              <Link href="/new-arrivals" className="text-sm font-semibold tracking-wide hover:text-pink-500 transition-colors text-gray-800">
                NEW ARRIVALS
              </Link>

              <div className="relative group">
                <button className="text-sm font-semibold tracking-wide py-4 hover:text-pink-500 transition-colors text-gray-800">
                  BRANDS
                </button>
                <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                  <Link href="/brand/lumina" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500">Lumina</Link>
                  <Link href="/brand/velvet" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500">Velvet & Co</Link>
                  <Link href="/brand/aura" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500">Aura Studio</Link>
                  <Link href="/brands-types" className="block px-4 py-2 text-sm font-medium text-pink-500 border-t border-gray-100 mt-1 pt-2">View All →</Link>
                </div>
              </div>

              <Link href="/sale" className="text-sm font-semibold tracking-wide text-pink-500 hover:text-pink-600 transition-colors">
                SALE
              </Link>
            </div>

            {/* Center Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-wider text-gray-900">
                SELLY <span className="text-pink-500">FASHION</span>
              </h1>
            </Link>

            {/* Right Side - Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Account / Login */}
              {isAuthenticated ? (
                <Link href="/account" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </Link>
              ) : (
                <Link href="/login" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </Link>
              )}

              {/* Wishlist */}
              <WishlistButton />
            </div>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[calc(100vh-8rem)]' : 'max-h-0'}`}>
          <div className="bg-white border-t border-gray-100">
            <div className="px-4 py-2 max-h-[60vh] overflow-y-auto">
              
              {/* WOMEN with submenu */}
              <div className="border-b border-gray-100">
                <button 
                  onClick={() => toggleSubmenu('women')}
                  className="flex items-center justify-between w-full py-4 text-sm font-semibold tracking-wide text-gray-800"
                >
                  WOMEN
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${openSubmenu === 'women' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${openSubmenu === 'women' ? 'max-h-48 pb-2' : 'max-h-0'}`}>
                  <Link href="/category/dresses" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 hover:text-pink-500">Dresses</Link>
                  <Link href="/category/tops" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 hover:text-pink-500">Tops & Blouses</Link>
                  <Link href="/category/outerwear" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 hover:text-pink-500">Jackets & Coats</Link>
                  <Link href="/category/pants" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 hover:text-pink-500">Pants & Jeans</Link>
                </div>
              </div>

              {/* MEN with submenu */}
              <div className="border-b border-gray-100">
                <button 
                  onClick={() => toggleSubmenu('men')}
                  className="flex items-center justify-between w-full py-4 text-sm font-semibold tracking-wide text-gray-800"
                >
                  MEN
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${openSubmenu === 'men' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${openSubmenu === 'men' ? 'max-h-48 pb-2' : 'max-h-0'}`}>
                  <Link href="/category/shirts" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 hover:text-pink-500">Shirts</Link>
                  <Link href="/category/pants" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 hover:text-pink-500">Pants</Link>
                  <Link href="/category/outerwear" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 hover:text-pink-500">Outerwear</Link>
                </div>
              </div>

              {/* NEW ARRIVALS */}
              <Link href="/new-arrivals" onClick={closeMenu} className="flex items-center justify-between py-4 text-sm font-semibold tracking-wide border-b border-gray-100 text-gray-800 hover:text-pink-500">
                NEW ARRIVALS
              </Link>

              {/* BRANDS with submenu */}
              <div className="border-b border-gray-100">
                <button 
                  onClick={() => toggleSubmenu('brands')}
                  className="flex items-center justify-between w-full py-4 text-sm font-semibold tracking-wide text-gray-800"
                >
                  BRANDS
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${openSubmenu === 'brands' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${openSubmenu === 'brands' ? 'max-h-48 pb-2' : 'max-h-0'}`}>
                  <Link href="/brand/lumina" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 hover:text-pink-500">Lumina</Link>
                  <Link href="/brand/velvet" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 hover:text-pink-500">Velvet & Co</Link>
                  <Link href="/brand/aura" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 hover:text-pink-500">Aura Studio</Link>
                  <Link href="/brands-types" onClick={closeMenu} className="block py-2 pl-4 text-sm text-pink-500 font-medium">View All Brands →</Link>
                </div>
              </div>

              {/* SALE */}
              <Link href="/shop?sale=true" onClick={closeMenu} className="flex items-center justify-between py-4 text-sm font-semibold tracking-wide text-pink-500 border-b border-gray-100">
                SALE
                <span className="bg-pink-500 text-white text-[10px] px-2 py-0.5 rounded-full">HOT</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Cart Button - Bottom Right */}
      <button 
        onClick={() => toggleCart()}
        className="fixed bottom-6 right-6 z-40 bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-pink-500 text-xs font-bold rounded-full flex items-center justify-center shadow">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </div>
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/30 z-40 top-[calc(3.5rem+1.5rem)]"
          onClick={closeMenu}
        />
      )}
    </>
  )
}
