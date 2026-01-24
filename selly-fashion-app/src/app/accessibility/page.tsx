export default function AccessibilityPage() {
  return (
    <main className="min-h-screen pt-[104px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Хүртээмжтэй байдал</h1>
        
        <div className="prose max-w-none">
          <p className="text-slate-600 mb-6">
            Selly Fashion нь бүх хэрэглэгчдэд хүртээмжтэй вэбсайт үүсгэхийг зорьдог.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Бидний амлалт</h2>
          <p className="text-slate-600 mb-4">
            Бид WCAG 2.1 стандартыг дагаж, вэбсайтаа бүх хүмүүст хүртээмжтэй болгохын төлөө ажилладаг.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Хүртээмжийн онцлогууд</h2>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            <li className="mb-2">Гар удирдлага (keyboard navigation)</li>
            <li className="mb-2">Screen reader дэмжлэг</li>
            <li className="mb-2">Өндөр тусгал (high contrast) горим</li>
            <li className="mb-2">Уян хатан текстийн хэмжээ</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">Санал хүсэлт</h2>
          <p className="text-slate-600">
            Хүртээмжийн асуудал илрүүлсэн бол бидэнд мэдэгдэнэ үү: accessibility@sellyfashion.mn
          </p>
        </div>
      </div>
    </main>
  )
}
