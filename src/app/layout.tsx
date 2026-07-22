import type { Metadata, Viewport } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ClientProviders } from '@/components/providers/ClientProviders'
import { PageTransitionProvider } from '@/components/providers/PageTransitionProvider'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { PwaRegistrar } from '@/components/providers/PwaRegistrar'

const cairo = Cairo({ subsets: ['arabic'] })

export const metadata: Metadata = {
  title: 'متجر التجميل - منتجات تجميل رجالية ونسائية',
  description: 'متجر متخصص في بيع منتجات التجميل الرجالية والنسائية - جملة وتجزئة',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'متجر التجميل',
  },
}

export const viewport: Viewport = {
  themeColor: '#9333ea',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <body className={cairo.className}>
        <ClientProviders>
          <SmoothScrollProvider>
            <Header />
            <PageTransitionProvider>
              <main className="min-h-screen">{children}</main>
            </PageTransitionProvider>
            <Footer />
          </SmoothScrollProvider>
        </ClientProviders>
        <Toaster position="top-center" />
        <PwaRegistrar />
      </body>
    </html>
  )
}
