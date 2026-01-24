export default function CookiesPage() {
  return (
    <main className="min-h-screen pt-[104px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Күүки бодлого</h1>
        
        <div className="prose max-w-none">
          <p className="text-slate-600 mb-6">
            Сүүлд шинэчлэгдсэн: 2026 оны 1-р сарын 19
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Күүки гэж юу вэ?</h2>
          <p className="text-slate-600 mb-4">
            Күүки нь таны төхөөрөмжид хадгалагддаг жижиг текст файлууд юм. 
            Бид вэбсайтаа сайжруулах, таны туршлагыг хувийн болгоход ашигладаг.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Бидний ашигладаг күүки</h2>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            <li className="mb-2"><strong>Зайлшгүй:</strong> Вэбсайт ажиллахад шаардлагатай</li>
            <li className="mb-2"><strong>Функционал:</strong> Таны сонголтуудыг санах</li>
            <li className="mb-2"><strong>Аналитик:</strong> Вэбсайтыг сайжруулах мэдээлэл цуглуулах</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">Күүки удирдах</h2>
          <p className="text-slate-600">
            Та өөрийн хөтчийн тохиргооноос күүкийг устгах эсвэл блоклох боломжтой.
          </p>
        </div>
      </div>
    </main>
  )
}
