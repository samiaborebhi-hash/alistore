'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">⚠️</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">حدث خطأ ما</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          نعتذر، حدث خطأ غير متوقع أثناء معالجة طلبك. يمكنك المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
          >
            إعادة المحاولة
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-white text-purple-600 border-2 border-purple-100 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
          >
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
