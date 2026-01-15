import Link from 'next/link'

export default function BrandsTypesPage() {
  return (
    <main className="pt-20">
      {/* Header */}
      <header className="py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4 uppercase tracking-widest">
            Discovery Hub
          </span>
          <h1 className="font-display text-4xl lg:text-6xl font-bold mb-6">
            Explore the <span className="text-primary italic">Selly</span> Universe
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A structured directory of our premium brand partners and curated clothing categories.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Featured Brands */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-pink-100 dark:border-pink-900/30 pb-4">
              <h2 className="font-display text-3xl font-bold flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">verified</span>
                Featured Brands
              </h2>
              <Link href="/brands" className="text-primary font-semibold hover:underline text-sm">
                View All 24 Brands
              </Link>
            </div>

            {/* Brand Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Link href="/brand/lumina" className="group bg-white dark:bg-slate-900/40 p-6 rounded-2xl border border-pink-50 dark:border-pink-900/10 hover:border-primary/30 transition-all flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold tracking-widest italic opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all">LUMINA</span>
                </div>
                <h3 className="font-bold">Lumina Collective</h3>
                <p className="text-xs text-slate-400 mt-1">High-End Silhouettes</p>
              </Link>

              <Link href="/brand/velvet" className="group bg-white dark:bg-slate-900/40 p-6 rounded-2xl border border-pink-50 dark:border-pink-900/10 hover:border-primary/30 transition-all flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold tracking-widest opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all">VELVET</span>
                </div>
                <h3 className="font-bold">Velvet & Vine</h3>
                <p className="text-xs text-slate-400 mt-1">Organic Textiles</p>
              </Link>

              <Link href="/brand/aura" className="group bg-white dark:bg-slate-900/40 p-6 rounded-2xl border border-pink-50 dark:border-pink-900/10 hover:border-primary/30 transition-all flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold tracking-widest underline decoration-primary opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all">AURA</span>
                </div>
                <h3 className="font-bold">Aura Studio</h3>
                <p className="text-xs text-slate-400 mt-1">Modern Minimalism</p>
              </Link>

              <Link href="/brand/nova" className="group bg-white dark:bg-slate-900/40 p-6 rounded-2xl border border-pink-50 dark:border-pink-900/10 hover:border-primary/30 transition-all flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold tracking-widest italic text-primary">NOVA</span>
                </div>
                <h3 className="font-bold">Nova Fashion</h3>
                <p className="text-xs text-slate-400 mt-1">Patriotic Flutter</p>
              </Link>
            </div>

            {/* A-Z Partners */}
            <div className="bg-pink-50/50 dark:bg-pink-900/10 p-6 rounded-2xl">
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-4">A-Z Partners</h4>
              <div className="grid grid-cols-2 gap-y-3">
                <Link href="#" className="text-sm hover:text-primary flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span> Adorn Boutique
                </Link>
                <Link href="#" className="text-sm hover:text-primary flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span> Blue Ridge Wear
                </Link>
                <Link href="#" className="text-sm hover:text-primary flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span> Crimson Threads
                </Link>
                <Link href="#" className="text-sm hover:text-primary flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span> Flutter Design
                </Link>
                <Link href="#" className="text-sm hover:text-primary flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span> Liberty Luxe
                </Link>
                <Link href="#" className="text-sm hover:text-primary flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span> Patriot Sport
                </Link>
              </div>
            </div>
          </div>

          {/* Clothing Types */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-pink-100 dark:border-pink-900/30 pb-4">
              <h2 className="font-display text-3xl font-bold flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">apparel</span>
                Clothing Types
              </h2>
              <span className="text-slate-400 text-sm">8 Primary Categories</span>
            </div>

            {/* Category Cards */}
            <div className="space-y-4">
              <Link href="/category/dresses" className="group relative overflow-hidden rounded-2xl h-32 cursor-pointer transition-all block">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDa6Pco0Eua9_egjCcWcUyz3dUmmzFPeik_Nq55kxlNAJ746KOu-9saiZMWY9OEnqLTBcTS1h7gOi06YVaN4469ZKlhQDKUorWTxGWqfRm1burTqTob4wnTawZcl4MxAzmeSMyKzVDQ3mrRIqDntZkYm9LqHLGVayk0lziEofP97zZHoxJP_vPmj0CDMxPOxtww6DhOEkE28ofRrKSGfJneXq6c2S8Zb4rd1h-cx6AvMjwRjjVxaGsdM2JAqSafgB-5PkVw1etBzst"
                  alt="Dresses"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-center px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/80 backdrop-blur flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">styler</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl uppercase tracking-wide">Dresses</h3>
                      <p className="text-pink-200 text-xs">Sundresses, Maxi, Cocktail</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/category/tops" className="group relative overflow-hidden rounded-2xl h-32 cursor-pointer transition-all block">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPrNEYv6kmEm41Vmvk2WdjLxAGAjc89Pj6D6bpsfd6L_NgE0PJ2C4Q0mFYMKdp9aobnYt4RWHj11ee1F8oEewWtOnVPYWC5qDmZhPNXK7vfchGaWLI7OISR2RTKRfNPLcEGeDpk7IFc4s7S6NIqpUe2Y6y0fsQYF0vgj94JKJm1iWwtjAeVnS62ftcrZ9_Qg9wZo0Ir1oacva-3EWd0RuBhM5cqef_uxRkxTnvtQ85WtfRNRGRNbS-9gNfYzMmEWQWNGnkIDxJ4H1y"
                  alt="Tops"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-center px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/80 backdrop-blur flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">checkroom</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl uppercase tracking-wide">Tops & Blouses</h3>
                      <p className="text-pink-200 text-xs">Silk, Flutter-Sleeve, Basics</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/category/outerwear" className="group relative overflow-hidden rounded-2xl h-32 cursor-pointer transition-all block">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyhHnJubprKsL9AYscrPvsuJWOWXjGTrw5XIOsT5Fq5v9CzmpSW5ni052ur3Rezbcm_BG5lEei3SkXCGdTiVZvslbdZ-TkTGfGit_pXrAQY76rCONlAGhg9c64CCOY2M9Id66_XIeOIdB8ug3k0-9CbjOuImeo-Y6-XJrU-nZ-GIgjary9XfMuex-4qZmGQrfT3Ks2VsrdwvzXUtqKoPTfsQuEo-_ctMEk6kkkrTtRoOivbaAFUHu-NBgoDTGSQqpKlz8bp8nxnCKt"
                  alt="Outerwear"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-center px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/80 backdrop-blur flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">dry_cleaning</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl uppercase tracking-wide">Outerwear</h3>
                      <p className="text-pink-200 text-xs">Jackets, Blazers, Coats</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/category/accessories" className="group relative overflow-hidden rounded-2xl h-32 cursor-pointer transition-all block">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKWZ0-82kaS8tSp_bKLk92cN2hAgdEqu9hqLjq5xGoYSxLiiUblmKw_kXXQSKpNSrFQGhnXdIgOQo4NDoii7AJLMnbpXBivLPAgBTZOLN_LFGVlFlwrWw_358Xas2l17vhp9psECU99YkzT03fIwZCNOMXl7qZ7CkP9mlWPltJDdGiuJP4OtXl0AftclveqMDwmAB_bDc0Pmwcnjq-_2n4acnxrrFFA8TidN6A1vc9Oj0av5u9nIfNWOwkvybx_SEcVG_-rB3dyft2"
                  alt="Accessories"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-center px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/80 backdrop-blur flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">diamond</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl uppercase tracking-wide">Accessories</h3>
                      <p className="text-pink-200 text-xs">Scarves, Belts, Bags</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shuffle Section */}
      <section className="py-20 bg-white dark:bg-slate-900/30 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUhqIVUxrspQkW8ScdnzwVV9EMpgEPAgo2L7bu23SwwNg8qD-CnNhEC3itMmcueMcm_dv7Mmptg_RwKBkZEUBgYMNxsmgZc75T19_HCifcEiO-CWOvOc2l15GnxUk7JuAnzoZCR2e8MExYX2-kYP0F1OxzhpnM_iDJTSJp65l8-0BCiUMYD4kJhTHjzs4v0lhfXtNVSDxSzj1-J8FheN1R9iiAbfgRGr_PKRGONBFel1GAkTfpgPOVv5XrijdDLyuqKgMVG0wLVaqD"
            alt="Background Motif"
            className="w-64 butterfly-glow"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <h2 className="font-display text-4xl font-bold mb-6">Can&apos;t decide where to start?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-2xl">
            Use our signature brand shuffle to get a curated selection of styles from our diverse partner network.
          </p>
          <button className="flex items-center gap-3 bg-primary hover:bg-pink-600 text-white px-10 py-5 rounded-full font-bold shadow-xl shadow-pink-500/20 transition-all transform hover:-translate-y-1">
            <span className="material-symbols-outlined">shuffle</span>
            Shuffle My Discovery
          </button>
        </div>
      </section>
    </main>
  )
}
