'use client'

import { useEffect } from 'react'

export function PwaRegistrar() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silently fail - PWA is optional enhancement
      })
    }
  }, [])

  return null
}
