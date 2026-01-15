'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isDark, setIsDark] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 glass-effect border-b border-pink-100 dark:border-pink-900/30`}>
      {/* Top Banner - Hidden on very small screens */}
      <div className="bg-pink-500 text-white text-center py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium tracking-wide px-2">
        <span className="hidden sm:inline">FREE SHIPPING ON ORDERS OVER $100 | NEW ARRIVALS WEEKLY</span>
        <span className="sm:hidden">FREE SHIPPING OVER $100 ✨</span>
      </div>

      {/* Main Navigation */}
      <nav className="border-b border-pink-100 dark:border-pink-900/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Mobile Menu Button - LEFT side on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="nav-link lg:hidden p-2 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-full transition-colors order-first"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
            
            {/* Left Navigation - Desktop */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <Link href="/shop" className="nav-link text-sm font-semibold tracking-wide transition-colors py-6">
                  WOMEN
                </Link>
                <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 shadow-xl border border-pink-50 dark:border-pink-900/30 rounded-2xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/category/dresses" className="block px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500 transition-colors">Dresses</Link>
                  <Link href="/category/tops" className="block px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500 transition-colors">Tops & Blouses</Link>
                  <Link href="/category/outerwear" className="block px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500 transition-colors">Jackets & Coats</Link>
                  <Link href="/category/pants" className="block px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500 transition-colors">Pants & Jeans</Link>
                  <Link href="/category/accessories" className="block px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500 transition-colors">Accessories</Link>
                </div>
              </div>

              <div className="relative group">
                <Link href="/shop" className="nav-link text-sm font-semibold tracking-wide transition-colors py-6">
                  MEN
                </Link>
                <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 shadow-xl border border-pink-50 dark:border-pink-900/30 rounded-2xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/category/shirts" className="block px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500 transition-colors">Shirts</Link>
                  <Link href="/category/pants" className="block px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500 transition-colors">Pants</Link>
                  <Link href="/category/outerwear" className="block px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500 transition-colors">Outerwear</Link>
                  <Link href="/category/accessories" className="block px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500 transition-colors">Accessories</Link>
                </div>
              </div>

              <Link href="/new-arrivals" className="nav-link text-sm font-semibold tracking-wide transition-colors">
                NEW ARRIVALS
              </Link>

              <div className="relative group">
                <button className="nav-link text-sm font-semibold tracking-wide transition-colors py-6">
                  BRANDS
                </button>
                <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 shadow-xl border border-pink-50 dark:border-pink-900/30 rounded-2xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/brand/lumina" className="block px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500 transition-colors">Lumina</Link>
                  <Link href="/brand/velvet" className="block px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500 transition-colors">Velvet & Co</Link>
                  <Link href="/brand/aura" className="block px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500 transition-colors">Aura Studio</Link>
                  <Link href="/brand/nova" className="block px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500 transition-colors">Nova</Link>
                  <div className="border-t border-pink-100 dark:border-pink-900/30 mt-2 pt-2">
                    <Link href="/brands-types" className="block px-6 py-2.5 text-sm font-medium text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors">View All Brands →</Link>
                  </div>
                </div>
              </div>

              <Link href="/shop?sale=true" className="text-sm font-semibold tracking-wide text-pink-500 hover:text-pink-600 transition-colors">
                SALE
              </Link>
            </div>

            {/* Center Logo */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="nav-link text-base sm:text-xl lg:text-2xl font-bold tracking-[0.05em] sm:tracking-[0.1em] font-display whitespace-nowrap">
                SELLY <span className="text-pink-500">FASHION</span>
              </h1>
            </Link>

            {/* Right Side - Icons */}
            <div className="flex items-center gap-0.5 sm:gap-2">
              {/* Search */}
              <button className="nav-link p-2 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>

              {/* Account - Hidden on mobile */}
              <Link href="/account" className="nav-link p-2 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-full transition-colors hidden md:block">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </Link>

              {/* Wishlist - Hidden on mobile */}
              <Link href="/wishlist" className="nav-link p-2 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-full transition-colors hidden md:block">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="nav-link p-2 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-full transition-colors relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>

              {/* Theme Toggle - Hidden on mobile */}
              <button
                onClick={toggleTheme}
                className="nav-link p-2 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-full transition-colors hidden md:block"
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
        </div>
      </nav>

      {/* Mobile Menu - Full screen overlay */}
      <div className={`lg:hidden fixed inset-0 top-[calc(3.5rem+1.75rem)] sm:top-[calc(4rem+2rem)] bg-white dark:bg-black z-40 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full overflow-y-auto pb-20">
          <div className="px-6 py-4 space-y-1">
            {/* Main Links */}
            <Link 
              href="/shop" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-4 text-base font-semibold tracking-wide border-b border-gray-100 dark:border-gray-800 hover:text-pink-500 transition-colors"
            >
              WOMEN
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
            
            <Link 
              href="/shop" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-4 text-base font-semibold tracking-wide border-b border-gray-100 dark:border-gray-800 hover:text-pink-500 transition-colors"
            >
              MEN
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
            
            <Link 
              href="/new-arrivals" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-4 text-base font-semibold tracking-wide border-b border-gray-100 dark:border-gray-800 hover:text-pink-500 transition-colors"
            >
              NEW ARRIVALS
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
            
            <Link 
              href="/brands-types" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-4 text-base font-semibold tracking-wide border-b border-gray-100 dark:border-gray-800 hover:text-pink-500 transition-colors"
            >
              BRANDS
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
            
            <Link 
              href="/shop?sale=true" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-4 text-base font-semibold tracking-wide text-pink-500 border-b border-gray-100 dark:border-gray-800"
            >
              SALE
              <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">HOT</span>
            </Link>

            {/* Secondary Links for Mobile */}
            <div className="pt-6 space-y-1">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Account</p>
              <Link 
                href="/account" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                My Account
              </Link>
              <Link 
                href="/wishlist" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                Wishlist
              </Link>
              
              {/* Theme Toggle in Mobile Menu */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors w-full"
              >
                {isDark ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                    </svg>
                    Light Mode
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                    </svg>
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  )
}
