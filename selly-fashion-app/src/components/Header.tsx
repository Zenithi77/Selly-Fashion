'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isDark, setIsDark] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu)
  }

  const closeMenu = () => {
    setIsMobileMenuOpen(false)
    setOpenSubmenu(null)
  }

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
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
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-800 dark:text-white"
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
                <button className="text-sm font-semibold tracking-wide py-4 hover:text-pink-500 transition-colors text-gray-800 dark:text-white">
                  WOMEN
                </button>
                <div className="absolute top-full left-0 w-48 bg-white dark:bg-gray-900 shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 dark:border-gray-800">
                  <Link href="/category/dresses" className="block px-4 py-2 text-sm hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500">Dresses</Link>
                  <Link href="/category/tops" className="block px-4 py-2 text-sm hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500">Tops & Blouses</Link>
                  <Link href="/category/outerwear" className="block px-4 py-2 text-sm hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500">Jackets & Coats</Link>
                  <Link href="/category/pants" className="block px-4 py-2 text-sm hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500">Pants & Jeans</Link>
                </div>
              </div>

              <div className="relative group">
                <button className="text-sm font-semibold tracking-wide py-4 hover:text-pink-500 transition-colors text-gray-800 dark:text-white">
                  MEN
                </button>
                <div className="absolute top-full left-0 w-48 bg-white dark:bg-gray-900 shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 dark:border-gray-800">
                  <Link href="/category/shirts" className="block px-4 py-2 text-sm hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500">Shirts</Link>
                  <Link href="/category/pants" className="block px-4 py-2 text-sm hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500">Pants</Link>
                  <Link href="/category/outerwear" className="block px-4 py-2 text-sm hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500">Outerwear</Link>
                </div>
              </div>

              <Link href="/new-arrivals" className="text-sm font-semibold tracking-wide hover:text-pink-500 transition-colors text-gray-800 dark:text-white">
                NEW ARRIVALS
              </Link>

              <div className="relative group">
                <button className="text-sm font-semibold tracking-wide py-4 hover:text-pink-500 transition-colors text-gray-800 dark:text-white">
                  BRANDS
                </button>
                <div className="absolute top-full left-0 w-48 bg-white dark:bg-gray-900 shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 dark:border-gray-800">
                  <Link href="/brand/lumina" className="block px-4 py-2 text-sm hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500">Lumina</Link>
                  <Link href="/brand/velvet" className="block px-4 py-2 text-sm hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500">Velvet & Co</Link>
                  <Link href="/brand/aura" className="block px-4 py-2 text-sm hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500">Aura Studio</Link>
                  <Link href="/brands-types" className="block px-4 py-2 text-sm font-medium text-pink-500 border-t border-gray-100 dark:border-gray-800 mt-1 pt-2">View All →</Link>
                </div>
              </div>

              <Link href="/shop?sale=true" className="text-sm font-semibold tracking-wide text-pink-500 hover:text-pink-600 transition-colors">
                SALE
              </Link>
            </div>

            {/* Center Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-wider text-gray-900 dark:text-white">
                SELLY <span className="text-pink-500">FASHION</span>
              </h1>
            </Link>

            {/* Right Side - Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Account */}
              <Link href="/account" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </Link>

              {/* Theme Toggle - Always visible */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-white"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[calc(100vh-8rem)]' : 'max-h-0'}`}>
          <div className="bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800">
            <div className="px-4 py-2 max-h-[60vh] overflow-y-auto">
              
              {/* WOMEN with submenu */}
              <div className="border-b border-gray-100 dark:border-gray-800">
                <button 
                  onClick={() => toggleSubmenu('women')}
                  className="flex items-center justify-between w-full py-4 text-sm font-semibold tracking-wide"
                >
                  WOMEN
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${openSubmenu === 'women' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${openSubmenu === 'women' ? 'max-h-48 pb-2' : 'max-h-0'}`}>
                  <Link href="/category/dresses" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500">Dresses</Link>
                  <Link href="/category/tops" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500">Tops & Blouses</Link>
                  <Link href="/category/outerwear" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500">Jackets & Coats</Link>
                  <Link href="/category/pants" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500">Pants & Jeans</Link>
                </div>
              </div>

              {/* MEN with submenu */}
              <div className="border-b border-gray-100 dark:border-gray-800">
                <button 
                  onClick={() => toggleSubmenu('men')}
                  className="flex items-center justify-between w-full py-4 text-sm font-semibold tracking-wide"
                >
                  MEN
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${openSubmenu === 'men' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${openSubmenu === 'men' ? 'max-h-48 pb-2' : 'max-h-0'}`}>
                  <Link href="/category/shirts" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500">Shirts</Link>
                  <Link href="/category/pants" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500">Pants</Link>
                  <Link href="/category/outerwear" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500">Outerwear</Link>
                </div>
              </div>

              {/* NEW ARRIVALS */}
              <Link href="/new-arrivals" onClick={closeMenu} className="flex items-center justify-between py-4 text-sm font-semibold tracking-wide border-b border-gray-100 dark:border-gray-800 hover:text-pink-500">
                NEW ARRIVALS
              </Link>

              {/* BRANDS with submenu */}
              <div className="border-b border-gray-100 dark:border-gray-800">
                <button 
                  onClick={() => toggleSubmenu('brands')}
                  className="flex items-center justify-between w-full py-4 text-sm font-semibold tracking-wide"
                >
                  BRANDS
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${openSubmenu === 'brands' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${openSubmenu === 'brands' ? 'max-h-48 pb-2' : 'max-h-0'}`}>
                  <Link href="/brand/lumina" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500">Lumina</Link>
                  <Link href="/brand/velvet" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500">Velvet & Co</Link>
                  <Link href="/brand/aura" onClick={closeMenu} className="block py-2 pl-4 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500">Aura Studio</Link>
                  <Link href="/brands-types" onClick={closeMenu} className="block py-2 pl-4 text-sm text-pink-500 font-medium">View All Brands →</Link>
                </div>
              </div>

              {/* SALE */}
              <Link href="/shop?sale=true" onClick={closeMenu} className="flex items-center justify-between py-4 text-sm font-semibold tracking-wide text-pink-500 border-b border-gray-100 dark:border-gray-800">
                SALE
                <span className="bg-pink-500 text-white text-[10px] px-2 py-0.5 rounded-full">HOT</span>
              </Link>

              {/* Account Links */}
              <div className="pt-4 space-y-2">
                <Link href="/account" onClick={closeMenu} className="flex items-center gap-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  My Account
                </Link>
                <Link href="/wishlist" onClick={closeMenu} className="flex items-center gap-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                  Wishlist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Cart Button - Bottom Right */}
      <Link 
        href="/cart" 
        className="fixed bottom-6 right-6 z-50 bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-pink-500 text-xs font-bold rounded-full flex items-center justify-center shadow">
            0
          </span>
        </div>
      </Link>

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
