import Link from 'next/link'

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen pt-[104px] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Захиалга амжилттай!
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Таны захиалга амжилттай бүртгэгдлээ. Бид таны захиалгыг боловсруулж, 
          тун удахгүй холбоо барих болно.
        </p>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <span className="font-semibold">Хүргэлтийн мэдээлэл</span>
          </div>
          <p className="text-sm text-slate-500">
            Таны захиалга 1-3 ажлын өдрийн дотор хүргэгдэх болно. 
            Хүргэлтийн өмнө бид тантай холбогдох болно.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/shop"
            className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all"
          >
            Дэлгүүр үргэлжлүүлэх
          </Link>
          <Link 
            href="/"
            className="flex-1 py-3 px-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Нүүр хуудас
          </Link>
        </div>
      </div>
    </main>
  )
}
