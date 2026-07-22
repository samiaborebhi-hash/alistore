'use client'

import { motion } from 'framer-motion'

const sectionStyles = ['section-rose', 'section-purple', 'section-gold'] as const

export function CinematicSection({ title, subtitle, children, className, variant = 0 }: { title: string; subtitle?: string; children: React.ReactNode; className?: string; variant?: number }) {
  const bg = sectionStyles[variant % 3]

  return (
    <section className={`py-14 md:py-20 lg:py-28 cosmetic-bg ${bg} ${className || ''}`}>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">{title}</h2>
          {subtitle && <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto px-2">{subtitle}</p>}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-purple-500 via-rose-400 to-amber-400 rounded-full mx-auto mt-6"
          />
        </motion.div>
        {children}
      </div>
    </section>
  )
}
