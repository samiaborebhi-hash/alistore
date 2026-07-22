import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getPageBySlug, getPages } from '@/lib/site-data'

export async function generateStaticParams() {
  const pages = await getPages(true)
  return pages.map((page) => ({ slug: page.slug }))
}

export default async function PageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page || !page.isActive) notFound()

  return (
    <div className="pt-24 md:pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 mb-6">
          <ChevronLeft size={16} /> الرئيسية
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">
            {page.titleAr || page.title}
          </h1>

          {page.contentType === 'html' ? (
            <div
              className="prose prose-purple max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {page.content}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  return {
    title: page?.titleAr || page?.title || slug,
  }
}
