'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const menuVariants = {
  closed: { x: '100%', transition: { duration: 0.4, ease: 'easeInOut' as const } },
  open: { x: 0, transition: { duration: 0.5, ease: 'easeInOut' as const } },
}

const linkVariants = {
  closed: { opacity: 0, x: 40 },
  open: (i: number) => ({ opacity: 1, x: 0, transition: { delay: 0.1 + i * 0.08, duration: 0.4 } }),
}

interface NavLink {
  id: string
  label: string
  url: string
}

interface MobileNavProps {
  siteName?: string
  menuItems?: NavLink[]
}

export function MobileNav({ siteName = 'القائمة', menuItems }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const links: NavLink[] = menuItems && menuItems.length > 0
    ? menuItems
    : [
        { id: 'home', label: 'الرئيسية', url: '/' },
        { id: 'men', label: 'رجالي', url: '/men' },
        { id: 'women', label: 'نسائي', url: '/women' },
        { id: 'wholesale', label: 'جملة', url: '/wholesale' },
      ]

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(true)} className="p-2 text-gray-700 hover:text-purple-600 transition-colors" aria-label="فتح القائمة">
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <motion.nav variants={menuVariants} initial="closed" animate="open" exit="closed" className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-lg font-bold text-purple-600">{siteName}</span>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="إغلاق القائمة"><X size={20} /></button>
              </div>
              <div className="p-4">
                {links.map((link, i) => (
                  <motion.div key={link.id} variants={linkVariants} custom={i}>
                    <Link
                      href={link.url}
                      onClick={() => setIsOpen(false)}
                      className="block py-4 px-4 text-lg font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
