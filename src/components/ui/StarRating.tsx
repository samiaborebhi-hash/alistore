import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  size?: number
  className?: string
  showValue?: boolean
}

export function StarRating({ rating, size = 16, className, showValue = false }: StarRatingProps) {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)))

  return (
    <div className={cn('flex items-center gap-1', className)} dir="ltr">
      <div className="relative">
        {/* Background stars */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={`bg-${star}`} size={size} className="text-gray-200 fill-gray-100" />
          ))}
        </div>
        {/* Filled stars */}
        <div
          className="absolute top-0 left-0 flex items-center gap-0.5 overflow-hidden"
          style={{ width: `${(rating / 5) * 100}%` }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={`fill-${star}`} size={size} className="text-amber-400 fill-amber-400" />
          ))}
        </div>
      </div>
      {showValue && (
        <span className="text-sm font-medium text-amber-500 mr-1">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}
