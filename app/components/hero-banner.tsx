"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getPromotionsByCountry, type Promotion } from "@/lib/actions/promotions"
import type { CountryCode } from "@/lib/constants"

export default function HeroBanner({ country }: { country: CountryCode }) {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true)
      setImageError(false)
      const data = await getPromotionsByCountry(country)
      setPromotions(data)
      setCurrentIndex(0)
      setLoading(false)
    }

    fetchPromotions()
  }, [country])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length)
    setImageError(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % promotions.length)
    setImageError(false)
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
      </div>
    )
  }

  if (promotions.length === 0) {
    return (
      <div className="w-full">
        <div className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg">
          <p className="text-gray-500 text-lg">No promotions available for {country}</p>
        </div>
      </div>
    )
  }

  const currentPromotion = promotions[currentIndex]

  return (
    <div className="w-full">
      <div className="relative group">
        {/* Banner Image */}
        <Link href={`/event/${currentPromotion.plndp_no}`}>
          <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden cursor-pointer">
            {!imageError && currentPromotion.hero_banner_image_url ? (
              <img
                src={currentPromotion.hero_banner_image_url}
                alt={currentPromotion.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                loading="eager"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900" />
            )}

            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

            {/* Additional dim overlay for text area */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-8 z-10">
              <div className="max-w-4xl">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 drop-shadow-2xl leading-tight">
                  {currentPromotion.title}
                </h2>
              </div>
            </div>
          </div>
        </Link>

        {/* Navigation Arrows */}
        {promotions.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault()
                goToPrevious()
              }}
              className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-20"
              aria-label="Previous promotion"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault()
                goToNext()
              }}
              className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-20"
              aria-label="Next promotion"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {promotions.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex justify-center gap-2 z-20">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentIndex(index)
                  setImageError(false)
                }}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white w-8 h-2"
                    : "bg-white/50 w-2 h-2 hover:bg-white/75"
                }`}
                aria-label={`Go to promotion ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
