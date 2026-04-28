'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api, Product } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'

export default function AdminBarcodeListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { isAdmin } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin && !loading) {
      router.push('/login')
      return
    }
    const fetchProducts = async () => {
      const { data } = await api.getProducts()
      if (data) setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [isAdmin, router, loading])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = q
      ? products.filter(
          p =>
            p.name.toLowerCase().includes(q) ||
            (p.barcode || '').toLowerCase().includes(q)
        )
      : products
    // Баркодтойг эхэнд, дараа нь нэрээр
    return [...list].sort((a, b) => {
      const ab = a.barcode || ''
      const bb = b.barcode || ''
      if (ab && !bb) return -1
      if (!ab && bb) return 1
      if (ab && bb) return ab.localeCompare(bb)
      return a.name.localeCompare(b.name)
    })
  }, [products, search])

  const withBarcodeCount = useMemo(
    () => products.filter(p => p.barcode && p.barcode.trim()).length,
    [products]
  )

  const handleDownloadCsv = () => {
    const header = 'Барааны нэр,Баркод\n'
    const escape = (s: string) => `"${(s || '').replace(/"/g, '""')}"`
    const rows = filtered
      .map(p => `${escape(p.name)},${escape(p.barcode || '')}`)
      .join('\n')
    // BOM нэмж UTF-8 (Excel-д кирилл зөв харагдана)
    const csv = '\uFEFF' + header + rows
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const today = new Date().toISOString().slice(0, 10)
    link.download = `barcodes-${today}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-[104px] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-[104px] bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Баркод жагсаалт</h1>
              <p className="text-sm text-slate-500">
                Нийт {products.length} бүтээгдэхүүн · {withBarcodeCount} баркодтой
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadCsv}
            disabled={filtered.length === 0}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            CSV татах
          </button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">Авто-баркодны формат: <span className="font-mono">YYMMNNNNN</span> (9 орон)</p>
          <p className="text-xs">Жишээ: <span className="font-mono">260400001</span> = 2026 оны 4 сард үүсгэгдсэн 1 дэх бараа. Шинэ бараа нэмэхэд систем автоматаар үүсгэнэ.</p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Барааны нэр эсвэл баркодоор хайх..."
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 w-2/3">
                    Барааны нэр
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600 w-1/3">
                    Баркод
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-10 text-center text-slate-400">
                      Бараа олдсонгүй
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {p.image_url && (
                            <div className="w-10 h-12 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
                              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <span className="font-medium text-slate-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        {p.barcode ? (
                          <span className="font-mono text-sm font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                            {p.barcode}
                          </span>
                        ) : (
                          <span className="text-xs text-amber-600 italic">Хоосон</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
