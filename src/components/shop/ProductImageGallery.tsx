'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, ZoomIn } from 'lucide-react'

export function ProductImageGallery({ images, name }: { images: string[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  if (images.length === 0) {
    return (
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
        <span className="text-6xl text-gray-300">🛍️</span>
      </div>
    )
  }

  function goNext() { setActiveIndex((prev) => (prev + 1) % images.length) }
  function goPrev() { setActiveIndex((prev) => (prev - 1 + images.length) % images.length) }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 group cursor-zoom-in"
        onClick={() => setZoomed(!zoomed)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={images[activeIndex]}
              alt={`${name} - صورة ${activeIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover transition-transform duration-500 ${zoomed ? 'scale-150' : 'group-hover:scale-105'}`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom indicator */}
        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <ZoomIn size={18} />
        </div>

        {/* Navigation arrows (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
              aria-label="الصورة السابقة"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
              aria-label="الصورة التالية"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs z-10">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                i === activeIndex
                  ? 'border-purple-500 shadow-md scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${name} - مصغرة ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
