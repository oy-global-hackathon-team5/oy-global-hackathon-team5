"use client"

import { useState } from "react"
import { Heart, Star } from "lucide-react"

interface ProductCardProps {
  product: {
    id: string
    name: string
    brand: string
    price: number
    originalPrice?: number
    rating: number
    image: string
    badge?: string | null
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center px-4">
              <p className="text-xs text-gray-400 font-light">{product.brand}</p>
              <p className="text-xs text-gray-500 mt-1">Image unavailable</p>
            </div>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart size={18} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <p className="text-xs text-gray-500 font-medium mb-1">{product.brand}</p>

        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-10">{product.name}</h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star size={14} className="fill-gray-900 text-gray-900" />
          <span className="text-xs text-gray-600">{product.rating}</span>
        </div>

        {/* CTA */}
        <button className="w-full mt-3 text-xs text-gray-600 hover:text-gray-900 font-medium text-center">
          Save More with Coupon
        </button>
      </div>
    </div>
  )
}
