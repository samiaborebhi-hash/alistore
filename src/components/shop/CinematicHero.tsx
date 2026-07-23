'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, ArrowDown, Star } from 'lucide-react'

export function CinematicHero({ badge, title, titleHighlight, subtitle, btnMen, btnWomen }: {
  badge?: string
  title?: string
  titleHighlight?: string
  subtitle?: string
  btnMen?: string
  btnWomen?: string
}) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Semi-transparent overlay to show background image */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-purple-50/50 to-pink-50/60" />
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23933' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Animated cosmetic orbs */}
      <div className="absolute inset-0">
        {/* Large rose orb */}
        <motion.div
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, rgba(244,63,94,0.05) 40%, transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Large purple orb */}
        <motion.div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.12) 0%, rgba(147,51,234,0.04) 40%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Gold shimmer orb */}
        <motion.div
          className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, rgba(251,191,36,0.03) 40%, transparent 70%)' }}
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Small floating sparkles */}
        <motion.div
          className="absolute top-1/4 right-1/4"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Star size={16} className="text-amber-300 fill-amber-300" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 left-1/4"
          animate={{ y: [0, -15, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Star size={12} className="text-purple-300 fill-purple-300" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-1/3"
          animate={{ y: [0, -25, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <Star size={10} className="text-rose-300 fill-rose-300" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur-md border border-purple-100 rounded-full text-purple-600 text-sm mb-8 shadow-lg shadow-purple-100/50">
            <Sparkles size={14} className="text-amber-400" />
            {badge || 'منتجات أصلية 100% - جملة وتجزئة'}
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-gray-800 mb-6 leading-tight break-words"
        >
          {title || 'متجر'}
          <span className="bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 bg-clip-text text-transparent"> {titleHighlight || 'التجميل'}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-gray-500 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2"
        >
          {subtitle || 'وجهتك الأولى لمنتجات التجميل الرجالية والنسائية. نوفر أفضل الماركات العالمية بأسعار تنافسية للجملة والتجزئة'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
        >
          <Link href="/men" className="group relative px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl font-semibold text-base sm:text-lg overflow-hidden hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5">
            <span className="relative z-10 flex items-center justify-center gap-2">{btnMen || 'تسوق رجالي'} →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link href="/women" className="group relative px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl font-semibold text-base sm:text-lg overflow-hidden hover:shadow-2xl hover:shadow-rose-500/25 transition-all duration-300 hover:-translate-y-0.5">
            <span className="relative z-10 flex items-center justify-center gap-2">{btnWomen || 'تسوق نسائي'} →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 md:mt-16 flex flex-col items-center gap-2 text-gray-300"
        >
          <span className="text-sm text-gray-400">تصفح المزيد</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ArrowDown size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
