'use client'

import { useEffect } from 'react'

export function PwaRegistrar() {
  useEffect(() => {
    // 1. Unregister all old service workers so returning users immediately see new products
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister()
        }
      })
    }

    // 2. Clear all browser CacheStorage to eliminate stale page snapshots
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name)
        }
      })
    }
  }, [])

  return null
}
