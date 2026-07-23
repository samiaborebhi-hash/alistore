'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Percent, Sparkles, ArrowLeft } from 'lucide-react'

export function PromotionalBanner({ badge, title, text, btn }: {
  badge?: string
  title?: string
  text?: string
  btn?: string
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-rose-500 via-purple-600 to-violet-700 py-10 md:py-14 lg:py-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/60 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-right md:flex-1"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles size={16} />
              {badge || 'عروض محدودة'}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {title || 'خصم يصل إلى 30% على منتجات الجملة'}
            </h2>
            <p className="text-white/80 text-base sm:text-lg mb-5 md:mb-6 max-w-xl mx-auto md:mx-0 px-2 md:px-0">
              {text || 'استفد من الأسعار التنافسية للكميات الكبيرة. عرض ساري لفترة محدودة فقط!'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start px-4 md:px-0">
              <Link
                href="/wholesale"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-purple-700 rounded-full font-bold hover:bg-amber-50 hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
              >
                تصفح عروض الجملة
                <ArrowLeft size={18} />
              </Link>
              <Link
                href="/women"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white/15 backdrop-blur-sm text-white border border-white/30 rounded-full font-semibold hover:bg-white/25 transition-all duration-300 text-sm sm:text-base"
              >
                اكتشف المنتجات
              </Link>
            </div>
          </motion.div>

          {/* Right offer cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4 w-full md:w-80 px-4 md:px-0"
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white/70">الحد الأدنى</span>
                <span className="text-2xl font-bold text-amber-300">10</span>
              </div>
              <p className="text-sm text-white/60">قطع للاستفادة من أسعار الجملة</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white/70">التوصيل</span>
                <span className="text-2xl font-bold text-amber-300">مجاني</span>
              </div>
              <p className="text-sm text-white/60">للطلبات الجملة داخل المدينة</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
