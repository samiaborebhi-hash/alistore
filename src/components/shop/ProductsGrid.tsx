'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface Product {
  id: string
  nameAr: string
  name: string
  price: number
  wholesalePrice: number | null
  images: string
  category: { nameAr: string; slug: string }
  isFeatured: boolean
  tags: string
  reviews: { rating: number }[]
}

interface Props {
  products: Product[]
  categories: { id: string; nameAr: string; slug: string }[]
}

export function ProductsGrid({ products, categories }: Props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let result = [...products]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.nameAr.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q)
      )
    }

    // Category
    if (category !== 'all') {
      result = result.filter(p => p.category.slug === category)
    }

    // Price
    if (minPrice) result = result.filter(p => p.price >= parseFloat(minPrice))
    if (maxPrice) result = result.filter(p => p.price <= parseFloat(maxPrice))

    // Sort
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break
      case 'price-high': result.sort((a, b) => b.price - a.price); break
      case 'rating': result.sort((a, b) => {
        const ar = a.reviews.length ? a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length : 0
        const br = b.reviews.length ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length : 0
        return br - ar
      }); break
      default: break // newest is default order
    }

    return result
  }, [products, search, category, minPrice, maxPrice, sortBy])

  function resetFilters() {
    setSearch(''); setCategory('all'); setMinPrice(''); setMaxPrice(''); setSortBy('newest')
  }

  return (
    <div>
      {/* Search + Filter bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="newest">الأحدث</option>
            <option value="price-low">السعر: الأقل أولاً</option>
            <option value="price-high">السعر: الأعلى أولاً</option>
            <option value="rating">الأعلى تقييماً</option>
          </select>

          {/* Toggle filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal size={16} />
            فلترة
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row gap-4">
            {/* Categories */}
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 block mb-2">القسم</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  الكل
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === c.slug ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {c.nameAr}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="flex items-end gap-2">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-2">السعر من</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-2">إلى</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  placeholder="∞"
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button onClick={resetFilters} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-xs flex items-center gap-1">
                <X size={14} /> إلغاء
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">{filtered.length} منتج</p>

      {/* Products grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {filtered.map(p => {
            const images: string[] = JSON.parse(p.images || '[]')
            const img = images[0] || '/placeholder.png'
            return (
              <a
                key={p.id}
                href={`/product/${p.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={img}
                    alt={p.nameAr}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <span className="text-xs text-purple-500 font-medium">{p.category.nameAr}</span>
                  <h3 className="font-bold text-sm text-gray-800 line-clamp-2 mt-1">{p.nameAr}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-purple-600">{p.price} <span className="text-xs">ر.س</span></span>
                    {p.wholesalePrice && p.wholesalePrice < p.price && (
                      <span className="text-xs text-green-600 font-medium">جملة</span>
                    )}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">لا توجد منتجات مطابقة</p>
          <button onClick={resetFilters} className="mt-4 text-purple-600 font-medium text-sm">إلغاء الفلاتر</button>
        </div>
      )}
    </div>
  )
}