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

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true)
      const data = await getPromotionsByCountry(country)
      setPromotions(data)
      setCurrentIndex(0)
      setLoading(false)
    }

    fetchPromotions()
  }, [country])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % promotions.length)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative h-96 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (promotions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">No promotions available for {country}</p>
        </div>
      </div>
    )
  }

  const currentPromotion = promotions[currentIndex]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative group">
        {/* Banner Image */}
        <Link href={`/event/${currentPromotion.plndp_no}`}>
          <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden cursor-pointer">
            <img
              src={currentPromotion.hero_banner_image_url || "/placeholder.svg"}
              alt={currentPromotion.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay Text */}
            <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center text-center">
              <h2 className="text-5xl font-bold text-white mb-4">{currentPromotion.title}</h2>
              {currentPromotion.description && (
                <p className="text-2xl text-white px-4">{currentPromotion.description}</p>
              )}
            </div>
          </div>
        </Link>

        {/* Navigation Arrows */}
        {promotions.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {promotions.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-gray-900 w-8" : "bg-gray-300 w-2"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
