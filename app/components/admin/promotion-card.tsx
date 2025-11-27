"use client"

interface PromotionCardProps {
  promotion: {
    id: string
    plndp_no: string
    title: string
    description: string
    hero_banner_image_url: string
    trend_keywords: string[]
    created_at: string
  }
  onDelete: () => void
}

export default function PromotionCard({ promotion, onDelete }: PromotionCardProps) {
  return (
    <div className="border border-stone-200 rounded-sm overflow-hidden hover:shadow-md transition group">
      {/* Image */}
      <div className="relative bg-stone-100 aspect-[16/9] overflow-hidden">
        <img
          src={promotion.hero_banner_image_url || "/placeholder.svg"}
          alt={promotion.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-light text-stone-900 mb-1">{promotion.title}</h3>
        <p className="text-xs text-stone-500 line-clamp-2 mb-3">{promotion.description}</p>

        {/* Keywords */}
        {promotion.trend_keywords && promotion.trend_keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {promotion.trend_keywords.map((keyword, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-sm">
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-stone-100">
          <button
            onClick={onDelete}
            className="w-full px-3 py-1.5 border border-red-300
                       text-red-600 text-xs font-light rounded-sm
                       hover:bg-red-50 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="px-4 py-2 bg-stone-50 border-t border-stone-100">
        <p className="text-xs text-stone-400">Created: {new Date(promotion.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  )
}
