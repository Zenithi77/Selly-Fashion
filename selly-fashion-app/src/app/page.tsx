import Link from 'next/link'

export default function Home() {
  return (
    <main className="pt-[104px] min-h-screen">
      {/* Hero Section - Premium Brand Showcase */}
      <section className="relative min-h-[90vh] lg:min-h-[85vh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-pink-950">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-pink-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center py-16 lg:py-20">
          {/* Top Badge */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-pink-300 text-xs tracking-[0.25em] uppercase">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
              Premium Collections 2026
            </span>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter mb-6">
              <span className="block">DISCOVER</span>
              <span className="block bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">LUXURY</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Curated collections from the world's most exclusive fashion houses
            </p>
          </div>

          {/* Brand Grid - 4 Featured Brands */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto w-full">
            {/* LUMINA - Elegant */}
            <Link href="/brand/lumina" className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80"
                alt="LUMINA Collection"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-white">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="block text-[10px] tracking-[0.3em] text-pink-300 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">HAUTE COUTURE</span>
                  <h3 className="text-2xl lg:text-3xl font-bold tracking-[0.15em] italic mb-1">LUMINA</h3>
                  <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500 mx-auto"></div>
                </div>
                <span className="mt-4 text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 flex items-center gap-2 text-pink-200">
                  EXPLORE
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* VELVET - Soft Luxury */}
            <Link href="/brand/velvet" className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
                alt="VELVET Collection"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-white">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="block text-[10px] tracking-[0.3em] text-pink-300 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">SOFT LUXURY</span>
                  <h3 className="text-2xl lg:text-3xl font-bold tracking-[0.15em] mb-1">VELVET</h3>
                  <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500 mx-auto"></div>
                </div>
                <span className="mt-4 text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 flex items-center gap-2 text-pink-200">
                  EXPLORE
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* AURA - Minimalist */}
            <Link href="/brand/aura" className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80"
                alt="AURA Collection"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-white">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="block text-[10px] tracking-[0.3em] text-pink-300 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">MODERN MINIMAL</span>
                  <h3 className="text-2xl lg:text-3xl font-bold tracking-[0.15em] underline decoration-pink-500 decoration-2 underline-offset-4 mb-1">AURA</h3>
                  <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500 mx-auto"></div>
                </div>
                <span className="mt-4 text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 flex items-center gap-2 text-pink-200">
                  EXPLORE
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* NOVA - Limited Edition */}
            <Link href="/brand/nova" className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80"
                alt="NOVA Collection"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900 via-pink-900/50 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>
              {/* Special "Limited" Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-pink-500 text-white text-[10px] tracking-widest rounded-full font-semibold">
                LIMITED
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-white">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="block text-[10px] tracking-[0.3em] text-pink-200 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">EXCLUSIVE DROP</span>
                  <h3 className="text-2xl lg:text-3xl font-bold tracking-[0.15em] italic mb-1">NOVA</h3>
                  <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-white to-pink-200 transition-all duration-500 mx-auto"></div>
                </div>
                <span className="mt-4 text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 flex items-center gap-2 text-pink-100">
                  EXPLORE
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <Link href="/brands-types" className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-semibold tracking-wide hover:bg-white/20 hover:border-pink-500/50 transition-all group">
              VIEW ALL BRANDS
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent"></div>
      </section>

      {/* Category Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-sm mb-4 uppercase tracking-widest">Categories</span>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">SHOP BY CATEGORY</h2>
            <p className="text-slate-600 dark:text-slate-400">Find your perfect style</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Dresses */}
            <Link href="/category/dresses" className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-white dark:bg-slate-900/40 border border-pink-50 dark:border-pink-900/10 hover:border-pink-500/30 transition-all">
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80"
                alt="Dresses"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-colors"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold tracking-wide">DRESSES</h3>
                <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-pink-300">Shop the collection →</p>
              </div>
            </Link>

            {/* Tops */}
            <Link href="/category/tops" className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-white dark:bg-slate-900/40 border border-pink-50 dark:border-pink-900/10 hover:border-pink-500/30 transition-all">
              <img
                src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80"
                alt="Tops"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-colors"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold tracking-wide">TOPS</h3>
                <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-pink-300">Shop the collection →</p>
              </div>
            </Link>

            {/* Outerwear */}
            <Link href="/category/outerwear" className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-white dark:bg-slate-900/40 border border-pink-50 dark:border-pink-900/10 hover:border-pink-500/30 transition-all">
              <img
                src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"
                alt="Outerwear"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-colors"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold tracking-wide">OUTERWEAR</h3>
                <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-pink-300">Shop the collection →</p>
              </div>
            </Link>

            {/* Accessories */}
            <Link href="/category/accessories" className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-white dark:bg-slate-900/40 border border-pink-50 dark:border-pink-900/10 hover:border-pink-500/30 transition-all">
              <img
                src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80"
                alt="Accessories"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-colors"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold tracking-wide">ACCESSORIES</h3>
                <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-pink-300">Shop the collection →</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white/50 dark:bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-sm mb-4 uppercase tracking-widest">New In</span>
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">NEW ARRIVALS</h2>
              <p className="text-slate-600 dark:text-slate-400">The latest additions to our collection</p>
            </div>
            <Link href="/new-arrivals" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-pink-500 hover:text-pink-600 hover:underline">
              VIEW ALL
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
            {/* Product 1 */}
            <Link href="/product/1" className="group bg-white dark:bg-slate-900/40 rounded-2xl border border-pink-50 dark:border-pink-900/10 hover:border-pink-500/30 transition-all overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-pink-500 uppercase tracking-wide mb-1">LUMINA</p>
                <h3 className="font-medium mb-1 text-slate-900 dark:text-white">Silk Midi Dress</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">$289.00</p>
              </div>
            </Link>

            {/* Product 2 */}
            <Link href="/product/2" className="group bg-white dark:bg-slate-900/40 rounded-2xl border border-pink-50 dark:border-pink-900/10 hover:border-pink-500/30 transition-all overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden mb-4 relative">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
              </div>
              <div className="p-4">
                <p className="text-xs text-pink-500 uppercase tracking-wide mb-1">AURA</p>
                <h3 className="font-medium mb-1 text-slate-900 dark:text-white">Oversized Blazer</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">$425.00</p>
              </div>
            </Link>

            {/* Product 3 */}
            <Link href="/product/3" className="group bg-white dark:bg-slate-900/40 rounded-2xl border border-pink-50 dark:border-pink-900/10 hover:border-pink-500/30 transition-all overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-pink-500 uppercase tracking-wide mb-1">VELVET</p>
                <h3 className="font-medium mb-1 text-slate-900 dark:text-white">Cashmere Sweater</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">$195.00</p>
              </div>
            </Link>

            {/* Product 4 */}
            <Link href="/product/4" className="group bg-white dark:bg-slate-900/40 rounded-2xl border border-pink-50 dark:border-pink-900/10 hover:border-pink-500/30 transition-all overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden mb-4 relative">
                <img
                  src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500&q=80"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">SALE</span>
              </div>
              <div className="p-4">
                <p className="text-xs text-pink-500 uppercase tracking-wide mb-1">NOVA</p>
                <h3 className="font-medium mb-1 text-slate-900 dark:text-white">Leather Crossbody Bag</h3>
                <p className="text-sm">
                  <span className="text-pink-500 font-semibold">$159.00</span>
                  <span className="text-slate-400 line-through ml-2">$249.00</span>
                </p>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12 sm:hidden">
            <Link href="/new-arrivals" className="inline-flex items-center gap-2 text-sm font-semibold text-pink-500 hover:text-pink-600 hover:underline">
              VIEW ALL NEW ARRIVALS
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-sm mb-4 uppercase tracking-widest">Partners</span>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">OUR BRANDS</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Partnering with the finest designers to bring you exclusive collections
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Lumina */}
            <Link href="/brand/lumina" className="group p-8 lg:p-12 bg-white dark:bg-slate-800 rounded-2xl border border-pink-100 dark:border-pink-900/30 hover:border-pink-500 hover:shadow-lg transition-all text-center">
              <h3 className="text-2xl font-bold tracking-[0.2em] mb-2 text-slate-900 dark:text-white group-hover:text-pink-500 transition-colors italic">LUMINA</h3>
              <p className="text-sm text-slate-500">Elegance Redefined</p>
            </Link>

            {/* Velvet */}
            <Link href="/brand/velvet" className="group p-8 lg:p-12 bg-white dark:bg-slate-800 rounded-2xl border border-pink-100 dark:border-pink-900/30 hover:border-pink-500 hover:shadow-lg transition-all text-center">
              <h3 className="text-2xl font-bold tracking-[0.2em] mb-2 text-slate-900 dark:text-white group-hover:text-pink-500 transition-colors">VELVET</h3>
              <p className="text-sm text-slate-500">Soft Luxury</p>
            </Link>

            {/* Aura */}
            <Link href="/brand/aura" className="group p-8 lg:p-12 bg-white dark:bg-slate-800 rounded-2xl border border-pink-100 dark:border-pink-900/30 hover:border-pink-500 hover:shadow-lg transition-all text-center">
              <h3 className="text-2xl font-bold tracking-[0.2em] mb-2 text-slate-900 dark:text-white group-hover:text-pink-500 transition-colors underline decoration-pink-500">AURA</h3>
              <p className="text-sm text-slate-500">Modern Minimalism</p>
            </Link>

            {/* Nova */}
            <Link href="/brand/nova" className="group p-8 lg:p-12 bg-pink-500 dark:bg-pink-600 rounded-2xl text-white text-center hover:bg-pink-600 dark:hover:bg-pink-500 hover:shadow-lg transition-all">
              <h3 className="text-2xl font-bold tracking-[0.2em] mb-2 italic">NOVA</h3>
              <p className="text-sm opacity-80">Limited Edition</p>
            </Link>
          </div>
        </div>
      </section>

      {/* VIP Banner */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/80 to-pink-600/60"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center text-white">
          <p className="text-sm font-medium tracking-[0.3em] uppercase mb-4 opacity-90">VIP ACCESS</p>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-display">GET 20% OFF YOUR FIRST ORDER</h2>
          <p className="text-lg opacity-90 mb-8 max-w-md mx-auto">
            Join our exclusive club and enjoy member benefits, early access, and more.
          </p>
          <Link href="/register" className="inline-block bg-white text-pink-500 px-8 py-4 rounded-lg font-semibold hover:bg-pink-50 transition-colors">
            JOIN NOW
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-pink-100 dark:border-pink-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-12 h-12 mx-auto mb-4 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">FREE SHIPPING</h3>
              <p className="text-sm text-slate-500">On orders over $100</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-4 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">EASY RETURNS</h3>
              <p className="text-sm text-slate-500">30-day return policy</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-4 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">SECURE PAYMENT</h3>
              <p className="text-sm text-slate-500">100% secure checkout</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-4 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">24/7 SUPPORT</h3>
              <p className="text-sm text-slate-500">Dedicated customer service</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
