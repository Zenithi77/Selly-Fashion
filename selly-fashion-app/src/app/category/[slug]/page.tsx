import Link from 'next/link'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

const categoryData: Record<string, { name: string; description: string; icon: string; subcategories: string[] }> = {
  dresses: {
    name: 'Dresses',
    description: 'Elegant dresses for every occasion - from casual sundresses to glamorous evening gowns.',
    icon: 'styler',
    subcategories: ['Sundresses', 'Maxi Dresses', 'Cocktail Dresses', 'Evening Gowns'],
  },
  tops: {
    name: 'Tops & Blouses',
    description: 'Statement tops and elegant blouses featuring flutter sleeves and premium fabrics.',
    icon: 'checkroom',
    subcategories: ['Silk Blouses', 'Flutter-Sleeve', 'Basics', 'Statement Tops'],
  },
  outerwear: {
    name: 'Outerwear',
    description: 'Iconic jackets, blazers, and coats crafted with attention to detail.',
    icon: 'dry_cleaning',
    subcategories: ['Denim Jackets', 'Blazers', 'Coats', 'Cardigans'],
  },
  accessories: {
    name: 'Accessories',
    description: 'Complete your look with our curated selection of scarves, belts, and jewelry.',
    icon: 'diamond',
    subcategories: ['Scarves', 'Belts', 'Bags', 'Jewelry'],
  },
  footwear: {
    name: 'Footwear',
    description: 'Step out in style with our elegant footwear collection.',
    icon: 'footprint',
    subcategories: ['Heels', 'Flats', 'Boots', 'Sandals'],
  },
}

// Sample products
const products = [
  {
    id: 1,
    name: 'Butterfly Silk Dress',
    price: 189,
    brand: 'Lumina',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDa6Pco0Eua9_egjCcWcUyz3dUmmzFPeik_Nq55kxlNAJ746KOu-9saiZMWY9OEnqLTBcTS1h7gOi06YVaN4469ZKlhQDKUorWTxGWqfRm1burTqTob4wnTawZcl4MxAzmeSMyKzVDQ3mrRIqDntZkYm9LqHLGVayk0lziEofP97zZHoxJP_vPmj0CDMxPOxtww6DhOEkE28ofRrKSGfJneXq6c2S8Zb4rd1h-cx6AvMjwRjjVxaGsdM2JAqSafgB-5PkVw1etBzst',
  },
  {
    id: 2,
    name: 'Flutter Sleeve Blouse',
    price: 79,
    brand: 'Aura',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPrNEYv6kmEm41Vmvk2WdjLxAGAjc89Pj6D6bpsfd6L_NgE0PJ2C4Q0mFYMKdp9aobnYt4RWHj11ee1F8oEewWtOnVPYWC5qDmZhPNXK7vfchGaWLI7OISR2RTKRfNPLcEGeDpk7IFc4s7S6NIqpUe2Y6y0fsQYF0vgj94JKJm1iWwtjAeVnS62ftcrZ9_Qg9wZo0Ir1oacva-3EWd0RuBhM5cqef_uxRkxTnvtQ85WtfRNRGRNbS-9gNfYzMmEWQWNGnkIDxJ4H1y',
  },
  {
    id: 3,
    name: 'Patriotic Denim Jacket',
    price: 249,
    brand: 'Nova',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyhHnJubprKsL9AYscrPvsuJWOWXjGTrw5XIOsT5Fq5v9CzmpSW5ni052ur3Rezbcm_BG5lEei3SkXCGdTiVZvslbdZ-TkTGfGit_pXrAQY76rCONlAGhg9c64CCOY2M9Id66_XIeOIdB8ug3k0-9CbjOuImeo-Y6-XJrU-nZ-GIgjary9XfMuex-4qZmGQrfT3Ks2VsrdwvzXUtqKoPTfsQuEo-_ctMEk6kkkrTtRoOivbaAFUHu-NBgoDTGSQqpKlz8bp8nxnCKt',
  },
  {
    id: 4,
    name: 'Silk Butterfly Scarf',
    price: 59,
    brand: 'Velvet',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKWZ0-82kaS8tSp_bKLk92cN2hAgdEqu9hqLjq5xGoYSxLiiUblmKw_kXXQSKpNSrFQGhnXdIgOQo4NDoii7AJLMnbpXBivLPAgBTZOLN_LFGVlFlwrWw_358Xas2l17vhp9psECU99YkzT03fIwZCNOMXl7qZ7CkP9mlWPltJDdGiuJP4OtXl0AftclveqMDwmAB_bDc0Pmwcnjq-_2n4acnxrrFFA8TidN6A1vc9Oj0av5u9nIfNWOwkvybx_SEcVG_-rB3dyft2',
  },
]

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = categoryData[slug] || {
    name: 'Category',
    description: 'Browse our collection',
    icon: 'category',
    subcategories: [],
  }

  return (
    <main className="pt-20">
      {/* Header */}
      <header className="py-16 px-6 bg-gradient-to-r from-pink-100 to-transparent dark:from-pink-950/20 dark:to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-primary">Categories</Link>
            <span>/</span>
            <span className="text-primary">{category.name}</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">{category.icon}</span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold">{category.name}</h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">{category.description}</p>
        </div>
      </header>

      {/* Subcategories */}
      <section className="max-w-7xl mx-auto px-6 py-8 border-b border-pink-100 dark:border-pink-900/30">
        <div className="flex flex-wrap gap-3">
          {category.subcategories.map((sub) => (
            <button key={sub} className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-pink-100 dark:border-pink-900/30 hover:border-primary hover:text-primary transition-colors text-sm font-medium">
              {sub}
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
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
      </section>
    </main>
  )
}
