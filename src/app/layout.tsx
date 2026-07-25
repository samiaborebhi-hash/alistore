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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://novapure.beauty'),
  title: {
    default: 'نوفا بيور | متجر التجميل الأول - منتجات تجميل وعناية نسائية',
    template: '%s | نوفا بيور للتجميل',
  },
  description: 'تسوقي أفضل منتجات التجميل والعناية النسائية بأسعار تنافسية. جملة وتجزئة. شحن سريع. دفع عبر واتساب.',
  keywords: ['متجر تجميل', 'منتجات تجميل نسائية', 'مكياج', 'عناية بالبشرة', 'جملة', 'تجزئة', 'عطور', 'نوفا بيور'],
  authors: [{ name: 'نوفا بيور' }],
  creator: 'نوفا بيور',
  publisher: 'نوفا بيور',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://novapure.beauty',
    siteName: 'نوفا بيور للتجميل',
    title: 'نوفا بيور | متجر التجميل الأول',
    description: 'تسوقي أفضل منتجات التجميل والعناية النسائية بأسعار تنافسية.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'نوفا بيور للتجميل' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'نوفا بيور | متجر التجميل',
    description: 'منتجات تجميل وعناية نسائية - جملة وتجزئة',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'نوفا بيور' },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Store',
              name: 'نوفا بيور للتجميل',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://novapure.beauty',
              description: 'متجر متخصص في منتجات التجميل والعناية النسائية - جملة وتجزئة',
              telephone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
              priceRange: '$$',
              currenciesAccepted: 'SAR',
              paymentAccepted: 'WhatsApp',
            }),
          }}
        />
      </body>
    </html>
  )
}
