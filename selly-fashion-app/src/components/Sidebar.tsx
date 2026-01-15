import Link from 'next/link'

export default function Sidebar() {
  return (
    <aside className="hidden xl:block w-72 h-[calc(100vh-5rem)] sticky top-20 border-r border-pink-100 dark:border-pink-900/30 overflow-y-auto custom-scrollbar bg-white/30 dark:bg-black/10 px-8 py-10">
      {/* Shop By Type */}
      <div className="mb-10">
        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-6">Shop By Type</h3>
        <nav className="space-y-3">
          <Link href="/category/dresses" className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">
            <span className="material-symbols-outlined text-xl">styler</span> Dresses
          </Link>
          <Link href="/category/tops" className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">
            <span className="material-symbols-outlined text-xl">apparel</span> Tops & Blouses
          </Link>
          <Link href="/category/outerwear" className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">
            <span className="material-symbols-outlined text-xl">checkroom</span> Outerwear
          </Link>
          <Link href="/category/accessories" className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">
            <span className="material-symbols-outlined text-xl">diamond</span> Accessories
          </Link>
          <Link href="/category/footwear" className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">
            <span className="material-symbols-outlined text-xl">footprint</span> Footwear
          </Link>
        </nav>
      </div>

      {/* Our Brands */}
      <div className="mb-10">
        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-6">Our Brands</h3>
        <nav className="space-y-3">
          <Link href="/brand/lumina" className="flex items-center justify-between text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium group">
            Lumina Boutique <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/40 text-primary opacity-0 group-hover:opacity-100">New</span>
          </Link>
          <Link href="/brand/velvet" className="block text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">
            Velvet & Silk
          </Link>
          <Link href="/brand/aura" className="block text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">
            Aura Collective
          </Link>
          <Link href="/brand/moderna" className="block text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">
            Moderna Studio
          </Link>
          <Link href="/brand/nova" className="block text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium italic font-bold">
            Nova X Selly
          </Link>
        </nav>
      </div>

      {/* VIP Access */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-pink-100 dark:border-pink-900/20">
        <span className="material-symbols-outlined text-primary mb-2">stars</span>
        <p className="text-sm font-bold mb-1">VIP Access</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Early access to butterfly collection drops.</p>
        <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-pink-600 transition-colors">
          Join Now
        </button>
      </div>
    </aside>
  )
}
