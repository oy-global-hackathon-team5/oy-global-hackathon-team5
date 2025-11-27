"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useState, useEffect, use } from "react"
import Header from "@/components/header"
import { getPromotionByPlndpNo, type Promotion } from "@/lib/actions/promotions"

export default function EventDetailPage({ params }: { params: Promise<{ plndpNo: string }> }) {
  const resolvedParams = use(params)
  const promotionId = resolvedParams.plndpNo

  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getPromotionByPlndpNo(promotionId)
        if (data) {
          setPromotion(data)
        } else {
          setError("Promotion not found")
        }
      } catch (err) {
        console.error("Error fetching promotion:", err)
        setError("Failed to load promotion")
      } finally {
        setLoading(false)
      }
    }

    if (promotionId) {
      fetchPromotion()
    }
  }, [promotionId])

  // Extract products from promotion data
  const products = promotion?.products?.items || []

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !promotion) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-gray-500 text-lg">{error || "Promotion not found"}</p>
            <Link href="/" className="mt-4 inline-block text-stone-600 hover:text-stone-900">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Calculate discount percentage
  const calculateDiscount = (price: number, discountPrice: number) => {
    if (price === discountPrice) return 0
    return Math.round(((price - discountPrice) / price) * 100)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Navigation Back Button */}
      <div className="border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition w-fit text-sm font-light"
          >
            <ChevronLeft size={18} />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto" style={{ maxWidth: "800px" }}>
        {/* Promotion Hero Banner */}
        <div className="relative w-full bg-stone-100 overflow-hidden">
          <img
            src={promotion.hero_banner_image_url || "/placeholder.svg"}
            alt={promotion.title}
            className="w-full h-auto object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end">
            <div className="px-6 pb-12 text-white">
              <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4 leading-tight drop-shadow-lg">
                {promotion.title}
              </h1>
              {promotion.description && (
                <p className="text-sm font-light text-white/90 leading-relaxed max-w-lg drop-shadow">
                  {promotion.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Detail Images */}
        {promotion.detail_image_urls && promotion.detail_image_urls.length > 0 && (
          <div className="w-full space-y-0">
            {promotion.detail_image_urls.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`${promotion.title} - Detail ${index + 1}`}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
            ))}
          </div>
        )}

        {/* Products Section */}
        {products.length > 0 && (
          <div className="px-6 py-16">
            <h2 className="text-2xl font-light text-stone-900 mb-12 tracking-wide">FEATURED PRODUCTS</h2>

            <div className="grid grid-cols-2 gap-6">
              {products.map((product) => {
                const discount = calculateDiscount(product.price, product.discount_price)
                return (
                  <div key={product.id} className="group cursor-pointer">
                    <div className="relative bg-stone-100 rounded-sm overflow-hidden mb-4 aspect-square group-hover:shadow-lg transition duration-300">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg"
                        }}
                      />
                      {discount > 0 && (
                        <div className="absolute top-3 right-3 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xs font-semibold">
                          -{discount}%
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-medium mb-1">{product.brand}</p>
                    <p className="text-stone-900 font-light text-sm mb-2 line-clamp-2 min-h-10">{product.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-light text-stone-900">
                        ${product.discount_price.toFixed(2)}
                      </span>
                      {product.price > product.discount_price && (
                        <span className="text-xs text-stone-400 line-through">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-12 text-center">
              <Link href="/">
                <button className="px-10 py-3 bg-stone-900 text-white text-sm font-light tracking-wide rounded-sm hover:bg-stone-800 transition">
                  View All Products
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
