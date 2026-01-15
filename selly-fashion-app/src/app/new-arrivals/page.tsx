import Link from 'next/link'

// Sample new arrivals - will come from Supabase
const newArrivals = [
  {
    id: 1,
    name: 'Spring Butterfly Dress',
    price: 229,
    brand: 'Lumina',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDa6Pco0Eua9_egjCcWcUyz3dUmmzFPeik_Nq55kxlNAJ746KOu-9saiZMWY9OEnqLTBcTS1h7gOi06YVaN4469ZKlhQDKUorWTxGWqfRm1burTqTob4wnTawZcl4MxAzmeSMyKzVDQ3mrRIqDntZkYm9LqHLGVayk0lziEofP97zZHoxJP_vPmj0CDMxPOxtww6DhOEkE28ofRrKSGfJneXq6c2S8Zb4rd1h-cx6AvMjwRjjVxaGsdM2JAqSafgB-5PkVw1etBzst',
    addedDate: '2 days ago',
  },
  {
    id: 2,
    name: 'Patriotic Lace Top',
    price: 119,
    brand: 'Aura',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPrNEYv6kmEm41Vmvk2WdjLxAGAjc89Pj6D6bpsfd6L_NgE0PJ2C4Q0mFYMKdp9aobnYt4RWHj11ee1F8oEewWtOnVPYWC5qDmZhPNXK7vfchGaWLI7OISR2RTKRfNPLcEGeDpk7IFc4s7S6NIqpUe2Y6y0fsQYF0vgj94JKJm1iWwtjAeVnS62ftcrZ9_Qg9wZo0Ir1oacva-3EWd0RuBhM5cqef_uxRkxTnvtQ85WtfRNRGRNbS-9gNfYzMmEWQWNGnkIDxJ4H1y',
    addedDate: '3 days ago',
  },
  {
    id: 3,
    name: 'Limited Edition Jacket',
    price: 349,
    brand: 'Nova',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyhHnJubprKsL9AYscrPvsuJWOWXjGTrw5XIOsT5Fq5v9CzmpSW5ni052ur3Rezbcm_BG5lEei3SkXCGdTiVZvslbdZ-TkTGfGit_pXrAQY76rCONlAGhg9c64CCOY2M9Id66_XIeOIdB8ug3k0-9CbjOuImeo-Y6-XJrU-nZ-GIgjary9XfMuex-4qZmGQrfT3Ks2VsrdwvzXUtqKoPTfsQuEo-_ctMEk6kkkrTtRoOivbaAFUHu-NBgoDTGSQqpKlz8bp8nxnCKt',
    addedDate: '1 week ago',
  },
  {
    id: 4,
    name: 'Heritage Silk Scarf',
    price: 79,
    brand: 'Velvet',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKWZ0-82kaS8tSp_bKLk92cN2hAgdEqu9hqLjq5xGoYSxLiiUblmKw_kXXQSKpNSrFQGhnXdIgOQo4NDoii7AJLMnbpXBivLPAgBTZOLN_LFGVlFlwrWw_358Xas2l17vhp9psECU99YkzT03fIwZCNOMXl7qZ7CkP9mlWPltJDdGiuJP4OtXl0AftclveqMDwmAB_bDc0Pmwcnjq-_2n4acnxrrFFA8TidN6A1vc9Oj0av5u9nIfNWOwkvybx_SEcVG_-rB3dyft2',
    addedDate: '1 week ago',
  },
]

export default function NewArrivalsPage() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-r from-pink-100 to-transparent dark:from-pink-950/20 dark:to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary animate-pulse">new_releases</span>
            <span className="text-sm font-bold tracking-[0.2em] text-primary uppercase">Just Dropped</span>
          </div>
          <h1 className="font-display text-4xl lg:text-6xl font-bold mb-6">
            New <span className="text-primary italic">Arrivals</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Be the first to discover our latest additions. Fresh styles from our partner brands, updated weekly.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {newArrivals.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {product.addedDate}
                </span>
                <button className="absolute bottom-4 right-4 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <span className="material-symbols-outlined text-primary">add_shopping_cart</span>
                </button>
              </div>
              <div>
                <p className="text-xs text-primary font-semibold mb-1">{product.brand}</p>
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-slate-600 dark:text-slate-400">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900/30">
        <div className="max-w-2xl mx-auto text-center">
          <span className="material-symbols-outlined text-primary text-4xl mb-4">notifications_active</span>
          <h2 className="font-display text-3xl font-bold mb-4">Never Miss a Drop</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Subscribe to get notified when new items arrive from your favorite brands.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-white dark:bg-slate-800 border border-pink-100 dark:border-pink-900/30 rounded-full py-3 px-6"
            />
            <button className="bg-primary hover:bg-pink-600 text-white px-8 py-3 rounded-full font-bold transition-colors">
              Notify Me
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
