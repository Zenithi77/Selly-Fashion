import Link from 'next/link'

interface BrandPageProps {
  params: Promise<{ slug: string }>
}

const brandData: Record<string, { name: string; tagline: string; description: string; style: string }> = {
  lumina: {
    name: 'Lumina Collective',
    tagline: 'High-End Silhouettes',
    description: 'High-end evening wear inspired by starlight and the fluttering grace of butterflies. Lumina creates pieces that transform ordinary moments into extraordinary memories.',
    style: 'LUMINA',
  },
  velvet: {
    name: 'Velvet & Vine',
    tagline: 'Organic Textiles',
    description: 'Sustainable fashion with a conscience. Velvet & Vine crafts timeless pieces using only the finest organic materials and ethical practices.',
    style: 'VELVET',
  },
  aura: {
    name: 'Aura Studio',
    tagline: 'Modern Minimalism',
    description: 'Minimalist streetwear that honors heritage through subtle patriotic detailing. Aura believes in the power of understated elegance.',
    style: 'AURA',
  },
  nova: {
    name: 'Nova X Selly',
    tagline: 'Patriotic Flutter',
    description: 'A limited edition collaboration featuring hand-painted butterfly motifs on luxury denim. Bold, beautiful, and unmistakably patriotic.',
    style: 'NOVA',
  },
  moderna: {
    name: 'Moderna Studio',
    tagline: 'Contemporary Elegance',
    description: 'Where modern aesthetics meet timeless craftsmanship. Moderna creates pieces for the woman who appreciates both innovation and tradition.',
    style: 'MODERNA',
  },
}

// Sample products
const products = [
  {
    id: 1,
    name: 'Signature Collection Dress',
    price: 289,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDa6Pco0Eua9_egjCcWcUyz3dUmmzFPeik_Nq55kxlNAJ746KOu-9saiZMWY9OEnqLTBcTS1h7gOi06YVaN4469ZKlhQDKUorWTxGWqfRm1burTqTob4wnTawZcl4MxAzmeSMyKzVDQ3mrRIqDntZkYm9LqHLGVayk0lziEofP97zZHoxJP_vPmj0CDMxPOxtww6DhOEkE28ofRrKSGfJneXq6c2S8Zb4rd1h-cx6AvMjwRjjVxaGsdM2JAqSafgB-5PkVw1etBzst',
  },
  {
    id: 2,
    name: 'Limited Edition Top',
    price: 129,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPrNEYv6kmEm41Vmvk2WdjLxAGAjc89Pj6D6bpsfd6L_NgE0PJ2C4Q0mFYMKdp9aobnYt4RWHj11ee1F8oEewWtOnVPYWC5qDmZhPNXK7vfchGaWLI7OISR2RTKRfNPLcEGeDpk7IFc4s7S6NIqpUe2Y6y0fsQYF0vgj94JKJm1iWwtjAeVnS62ftcrZ9_Qg9wZo0Ir1oacva-3EWd0RuBhM5cqef_uxRkxTnvtQ85WtfRNRGRNbS-9gNfYzMmEWQWNGnkIDxJ4H1y',
  },
  {
    id: 3,
    name: 'Exclusive Jacket',
    price: 349,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyhHnJubprKsL9AYscrPvsuJWOWXjGTrw5XIOsT5Fq5v9CzmpSW5ni052ur3Rezbcm_BG5lEei3SkXCGdTiVZvslbdZ-TkTGfGit_pXrAQY76rCONlAGhg9c64CCOY2M9Id66_XIeOIdB8ug3k0-9CbjOuImeo-Y6-XJrU-nZ-GIgjary9XfMuex-4qZmGQrfT3Ks2VsrdwvzXUtqKoPTfsQuEo-_ctMEk6kkkrTtRoOivbaAFUHu-NBgoDTGSQqpKlz8bp8nxnCKt',
  },
  {
    id: 4,
    name: 'Designer Accessory',
    price: 89,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKWZ0-82kaS8tSp_bKLk92cN2hAgdEqu9hqLjq5xGoYSxLiiUblmKw_kXXQSKpNSrFQGhnXdIgOQo4NDoii7AJLMnbpXBivLPAgBTZOLN_LFGVlFlwrWw_358Xas2l17vhp9psECU99YkzT03fIwZCNOMXl7qZ7CkP9mlWPltJDdGiuJP4OtXl0AftclveqMDwmAB_bDc0Pmwcnjq-_2n4acnxrrFFA8TidN6A1vc9Oj0av5u9nIfNWOwkvybx_SEcVG_-rB3dyft2',
  },
]

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params
  const brand = brandData[slug] || {
    name: 'Brand',
    tagline: 'Fashion Partner',
    description: 'Discover our curated collection.',
    style: 'BRAND',
  }

  return (
    <main className="pt-20">
      {/* Hero */}
      <header className="py-20 px-6 bg-gradient-to-r from-pink-100 to-transparent dark:from-pink-950/20 dark:to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/brands-types" className="hover:text-primary">Brands</Link>
            <span>/</span>
            <span className="text-primary">{brand.name}</span>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-4xl font-bold tracking-widest text-primary/30 block mb-4">{brand.style}</span>
              <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">{brand.name}</h1>
              <p className="text-primary font-semibold mb-6">{brand.tagline}</p>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">{brand.description}</p>
              <div className="flex gap-4">
                <button className="bg-primary hover:bg-pink-600 text-white px-8 py-4 rounded-full font-bold transition-colors">
                  Shop Collection
                </button>
                <button className="border-2 border-primary text-primary px-8 py-4 rounded-full font-bold hover:bg-primary hover:text-white transition-colors">
                  Follow Brand
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img src={products[0].image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden mt-8">
                <img src={products[1].image} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-display text-3xl font-bold mb-10">Shop {brand.name}</h2>
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
                <p className="text-xs text-primary font-semibold mb-1">{brand.name}</p>
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
