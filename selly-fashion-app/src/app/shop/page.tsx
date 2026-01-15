import Link from 'next/link'

// Sample products data - this will come from Supabase later
const products = [
  {
    id: 1,
    name: 'Butterfly Silk Dress',
    price: 189,
    brand: 'Lumina',
    category: 'Dresses',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDa6Pco0Eua9_egjCcWcUyz3dUmmzFPeik_Nq55kxlNAJ746KOu-9saiZMWY9OEnqLTBcTS1h7gOi06YVaN4469ZKlhQDKUorWTxGWqfRm1burTqTob4wnTawZcl4MxAzmeSMyKzVDQ3mrRIqDntZkYm9LqHLGVayk0lziEofP97zZHoxJP_vPmj0CDMxPOxtww6DhOEkE28ofRrKSGfJneXq6c2S8Zb4rd1h-cx6AvMjwRjjVxaGsdM2JAqSafgB-5PkVw1etBzst',
    isNew: true,
  },
  {
    id: 2,
    name: 'Flutter Sleeve Blouse',
    price: 79,
    brand: 'Aura',
    category: 'Tops',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPrNEYv6kmEm41Vmvk2WdjLxAGAjc89Pj6D6bpsfd6L_NgE0PJ2C4Q0mFYMKdp9aobnYt4RWHj11ee1F8oEewWtOnVPYWC5qDmZhPNXK7vfchGaWLI7OISR2RTKRfNPLcEGeDpk7IFc4s7S6NIqpUe2Y6y0fsQYF0vgj94JKJm1iWwtjAeVnS62ftcrZ9_Qg9wZo0Ir1oacva-3EWd0RuBhM5cqef_uxRkxTnvtQ85WtfRNRGRNbS-9gNfYzMmEWQWNGnkIDxJ4H1y',
    isNew: false,
  },
  {
    id: 3,
    name: 'Patriotic Denim Jacket',
    price: 249,
    brand: 'Nova',
    category: 'Outerwear',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyhHnJubprKsL9AYscrPvsuJWOWXjGTrw5XIOsT5Fq5v9CzmpSW5ni052ur3Rezbcm_BG5lEei3SkXCGdTiVZvslbdZ-TkTGfGit_pXrAQY76rCONlAGhg9c64CCOY2M9Id66_XIeOIdB8ug3k0-9CbjOuImeo-Y6-XJrU-nZ-GIgjary9XfMuex-4qZmGQrfT3Ks2VsrdwvzXUtqKoPTfsQuEo-_ctMEk6kkkrTtRoOivbaAFUHu-NBgoDTGSQqpKlz8bp8nxnCKt',
    isNew: true,
  },
  {
    id: 4,
    name: 'Silk Butterfly Scarf',
    price: 59,
    brand: 'Velvet',
    category: 'Accessories',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKWZ0-82kaS8tSp_bKLk92cN2hAgdEqu9hqLjq5xGoYSxLiiUblmKw_kXXQSKpNSrFQGhnXdIgOQo4NDoii7AJLMnbpXBivLPAgBTZOLN_LFGVlFlwrWw_358Xas2l17vhp9psECU99YkzT03fIwZCNOMXl7qZ7CkP9mlWPltJDdGiuJP4OtXl0AftclveqMDwmAB_bDc0Pmwcnjq-_2n4acnxrrFFA8TidN6A1vc9Oj0av5u9nIfNWOwkvybx_SEcVG_-rB3dyft2',
    isNew: false,
  },
  {
    id: 5,
    name: 'Evening Gown',
    price: 399,
    brand: 'Lumina',
    category: 'Dresses',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDa6Pco0Eua9_egjCcWcUyz3dUmmzFPeik_Nq55kxlNAJ746KOu-9saiZMWY9OEnqLTBcTS1h7gOi06YVaN4469ZKlhQDKUorWTxGWqfRm1burTqTob4wnTawZcl4MxAzmeSMyKzVDQ3mrRIqDntZkYm9LqHLGVayk0lziEofP97zZHoxJP_vPmj0CDMxPOxtww6DhOEkE28ofRrKSGfJneXq6c2S8Zb4rd1h-cx6AvMjwRjjVxaGsdM2JAqSafgB-5PkVw1etBzst',
    isNew: true,
  },
  {
    id: 6,
    name: 'Classic White Blouse',
    price: 89,
    brand: 'Aura',
    category: 'Tops',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPrNEYv6kmEm41Vmvk2WdjLxAGAjc89Pj6D6bpsfd6L_NgE0PJ2C4Q0mFYMKdp9aobnYt4RWHj11ee1F8oEewWtOnVPYWC5qDmZhPNXK7vfchGaWLI7OISR2RTKRfNPLcEGeDpk7IFc4s7S6NIqpUe2Y6y0fsQYF0vgj94JKJm1iWwtjAeVnS62ftcrZ9_Qg9wZo0Ir1oacva-3EWd0RuBhM5cqef_uxRkxTnvtQ85WtfRNRGRNbS-9gNfYzMmEWQWNGnkIDxJ4H1y',
    isNew: false,
  },
]

export default function ShopPage() {
  return (
    <main className="pt-20">
      {/* Header */}
      <header className="py-12 px-6 bg-gradient-to-r from-pink-50 to-transparent dark:from-pink-950/10 dark:to-transparent">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">Shop All</h1>
          <p className="text-slate-600 dark:text-slate-400">Discover our curated collection of patriotic fashion</p>
        </div>
      </header>

      {/* Filters & Products */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-pink-100 dark:border-pink-900/30">
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 rounded-full bg-primary text-white font-medium text-sm">All</button>
            <button className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-pink-100 dark:border-pink-900/30 hover:border-primary transition-colors font-medium text-sm">Dresses</button>
            <button className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-pink-100 dark:border-pink-900/30 hover:border-primary transition-colors font-medium text-sm">Tops</button>
            <button className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-pink-100 dark:border-pink-900/30 hover:border-primary transition-colors font-medium text-sm">Outerwear</button>
            <button className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-pink-100 dark:border-pink-900/30 hover:border-primary transition-colors font-medium text-sm">Accessories</button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Sort by:</span>
            <select className="bg-white dark:bg-slate-800 border border-pink-100 dark:border-pink-900/30 rounded-lg px-3 py-2 text-sm">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                    NEW
                  </span>
                )}
                <button className="absolute bottom-4 right-4 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <span className="material-symbols-outlined text-primary">favorite</span>
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

        {/* Load More */}
        <div className="text-center mt-16">
          <button className="px-10 py-4 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-colors">
            Load More Products
          </button>
        </div>
      </section>
    </main>
  )
}
