import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-pink-50 to-transparent dark:from-pink-950/10 dark:to-transparent">
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
            <span className="material-symbols-outlined">flutter_dash</span>
            Our Story
          </span>
          <h1 className="font-display text-4xl lg:text-6xl font-bold mb-6">
            The <span className="text-primary italic">Selly</span> Philosophy
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            We believe fashion is a form of self-expression that celebrates heritage, elegance, and the transformative power of style.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              At Selly Fashion, we curate the finest patriotic styles across a structured network of elite brands. 
              Our mission is to bring together diverse fashion houses that share our vision of celebrating American 
              spirit through high-fashion aesthetics.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Like the butterfly that symbolizes our brand, we believe in transformation, beauty, and the 
              delicate balance between tradition and innovation.
            </p>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">24+</p>
                <p className="text-sm text-slate-500">Partner Brands</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">500+</p>
                <p className="text-sm text-slate-500">Curated Styles</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">50K+</p>
                <p className="text-sm text-slate-500">Happy Customers</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUhqIVUxrspQkW8ScdnzwVV9EMpgEPAgo2L7bu23SwwNg8qD-CnNhEC3itMmcueMcm_dv7Mmptg_RwKBkZEUBgYMNxsmgZc75T19_HCifcEiO-CWOvOc2l15GnxUk7JuAnzoZCR2e8MExYX2-kYP0F1OxzhpnM_iDJTSJp65l8-0BCiUMYD4kJhTHjzs4v0lhfXtNVSDxSzj1-J8FheN1R9iiAbfgRGr_PKRGONBFel1GAkTfpgPOVv5XrijdDLyuqKgMVG0wLVaqD"
              alt="Butterfly motif"
              className="rounded-3xl butterfly-glow"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-16">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">diamond</span>
              </div>
              <h3 className="font-bold text-xl mb-4">Quality First</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Every piece in our collection meets the highest standards of craftsmanship and design excellence.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">eco</span>
              </div>
              <h3 className="font-bold text-xl mb-4">Sustainability</h3>
              <p className="text-slate-600 dark:text-slate-400">
                We partner with brands committed to ethical practices and environmental responsibility.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">diversity_3</span>
              </div>
              <h3 className="font-bold text-xl mb-4">Inclusivity</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Fashion for everyone, celebrating diversity in style, size, and expression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-6">Join the Flutter</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
            Discover our curated collection and become part of the Selly Fashion family.
          </p>
          <Link href="/shop" className="inline-flex items-center gap-3 bg-primary hover:bg-pink-600 text-white px-10 py-5 rounded-full font-bold shadow-xl shadow-pink-500/20 transition-all transform hover:-translate-y-1">
            <span className="material-symbols-outlined">shopping_bag</span>
            Start Shopping
          </Link>
        </div>
      </section>
    </main>
  )
}
