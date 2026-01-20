import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white/50 dark:bg-black/20 border-t border-pink-100 dark:border-pink-900/30 text-slate-800 dark:text-slate-100">
      {/* Newsletter Section */}
      <div className="border-b border-pink-100 dark:border-pink-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-bold tracking-tight mb-4 text-pink-500">JOIN THE SELLY CLUB</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm">
              Be the first to know about new arrivals, exclusive offers, and member-only events.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/50 dark:bg-slate-800/50 border border-pink-200 dark:border-pink-900/50 px-4 py-3 text-sm focus:outline-none focus:border-pink-500 focus:ring-pink-500 transition-colors rounded-full"
              />
              <button
                type="submit"
                className="bg-pink-500 text-white px-8 py-3 text-sm font-semibold hover:bg-pink-600 transition-colors rounded-full"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <Link href="/" className="text-2xl font-bold tracking-[0.15em] mb-6 block text-pink-500 font-display">
              SELLY
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Premium fashion for the modern individual. Quality meets style.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-pink-200 dark:border-pink-900/50 flex items-center justify-center hover:border-pink-500 hover:text-pink-500 transition-colors rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 border border-pink-200 dark:border-pink-900/50 flex items-center justify-center hover:border-pink-500 hover:text-pink-500 transition-colors rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 border border-pink-200 dark:border-pink-900/50 flex items-center justify-center hover:border-pink-500 hover:text-pink-500 transition-colors rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-sm tracking-wide mb-4 text-pink-500">SHOP</h4>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-sm">
              <li><Link href="/shop" className="hover:text-pink-500 transition-colors">All Products</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-pink-500 transition-colors">New Arrivals</Link></li>
              <li><Link href="/category/dresses" className="hover:text-pink-500 transition-colors">Dresses</Link></li>
              <li><Link href="/category/tops" className="hover:text-pink-500 transition-colors">Tops</Link></li>
              <li><Link href="/category/outerwear" className="hover:text-pink-500 transition-colors">Outerwear</Link></li>
              <li><Link href="/shop?sale=true" className="hover:text-pink-500 transition-colors text-pink-400">Sale</Link></li>
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h4 className="font-semibold text-sm tracking-wide mb-4 text-pink-500">BRANDS</h4>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-sm">
              <li><Link href="/brand/lumina" className="hover:text-pink-500 transition-colors">Lumina</Link></li>
              <li><Link href="/brand/velvet" className="hover:text-pink-500 transition-colors">Velvet & Co</Link></li>
              <li><Link href="/brand/aura" className="hover:text-pink-500 transition-colors">Aura Studio</Link></li>
              <li><Link href="/brand/nova" className="hover:text-pink-500 transition-colors">Nova</Link></li>
              <li><Link href="/brands-types" className="hover:text-pink-500 transition-colors">All Brands</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-sm tracking-wide mb-4 text-pink-500">HELP</h4>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-sm">
              <li><Link href="/about" className="hover:text-pink-500 transition-colors">Contact Us</Link></li>
              <li><Link href="/about" className="hover:text-pink-500 transition-colors">FAQ</Link></li>
              <li><Link href="/about" className="hover:text-pink-500 transition-colors">Shipping</Link></li>
              <li><Link href="/about" className="hover:text-pink-500 transition-colors">Returns</Link></li>
              <li><Link href="/about" className="hover:text-pink-500 transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm tracking-wide mb-4 text-pink-500">COMPANY</h4>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-sm">
              <li><Link href="/about" className="hover:text-pink-500 transition-colors">About Us</Link></li>
              <li><Link href="/about" className="hover:text-pink-500 transition-colors">Careers</Link></li>
              <li><Link href="/about" className="hover:text-pink-500 transition-colors">Sustainability</Link></li>
              <li><Link href="/about" className="hover:text-pink-500 transition-colors">Press</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-pink-100 dark:border-pink-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© 2026 SELLY. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/about" className="hover:text-pink-500 transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-pink-500 transition-colors">Privacy Policy</Link>
              <Link href="/cookies" className="hover:text-pink-500 transition-colors">Cookie Policy</Link>
              <Link href="/accessibility" className="hover:text-pink-500 transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
