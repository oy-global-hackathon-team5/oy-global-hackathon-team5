"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import PromotionCard from "./promotion-card"

interface PromotionListProps {
  country: string
}

interface Promotion {
  id: string
  plndp_no: string
  country_code: string
  title: string
  description: string
  theme?: string
  hero_banner_image_url: string
  detail_image_urls?: string[]
  products?: any
  trend_keywords?: string[]
  created_at: string
  updated_at: string
}

export default function PromotionList({ country }: PromotionListProps) {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPromotions()
  }, [country])

  async function fetchPromotions() {
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .eq("country_code", country)
        .order("created_at", { ascending: false })

      if (error) throw error

      setPromotions(data || [])
    } catch (err) {
      console.error("Error fetching promotions:", err)
      setError(err instanceof Error ? err.message : "Failed to load promotions")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this promotion?")) {
      return
    }

    try {
      const { error } = await supabase.from("promotions").delete().eq("id", id)

      if (error) throw error

      // 목록에서 제거
      setPromotions((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Error deleting promotion:", err)
      alert("Failed to delete promotion")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-sm font-light text-stone-500">Loading promotions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-sm font-light text-red-600">Error: {error}</div>
      </div>
    )
  }

  if (promotions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-stone-200 rounded-sm">
        <p className="text-base font-light text-stone-500 mb-2">No promotions found for {country}</p>
        <p className="text-xs font-light text-stone-400">Click "Generate New Promotion" to create one</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {promotions.map((promotion) => (
        <PromotionCard key={promotion.id} promotion={promotion} onDelete={() => handleDelete(promotion.id)} />
      ))}
    </div>
  )
}
