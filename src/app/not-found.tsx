import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="text-center max-w-lg animate-fade-in">
        <div className="w-28 h-28 bg-gradient-to-br from-purple-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">🔍</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">الصفحة غير موجودة</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك العودة للصفحة الرئيسية أو تصفح أقسام المتجر.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
          >
            الصفحة الرئيسية
          </Link>
          <Link
            href="/women"
            className="px-6 py-3 bg-white text-purple-600 border-2 border-purple-100 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
          >
            منتجات نسائية
          </Link>
        </div>
      </div>
    </div>
  )
}
