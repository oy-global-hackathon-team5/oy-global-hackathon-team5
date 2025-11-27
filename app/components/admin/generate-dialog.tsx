"use client"

import { useState } from "react"
import { COUNTRIES, GOOGLE_TRENDS_CATEGORIES } from "@/lib/constants"

interface GenerateDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function GenerateDialog({ isOpen, onClose, onSuccess }: GenerateDialogProps) {
  const [countryCode, setCountryCode] = useState("US")
  const [category, setCategory] = useState("20") // Beauty & Fitness
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/generate-promotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country_code: countryCode,
          category: category,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate promotion")
      }

      const data = await response.json()
      console.log("Generated promotion:", data.promotion_id)

      onSuccess() // 성공 시 목록 새로고침
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-sm shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200">
          <h2 className="text-xl font-light text-stone-900 tracking-tight">Generate New Promotion</h2>
          <p className="text-xs text-stone-500 mt-1">AI will create a promotion based on current trends</p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5">
          {/* Country Code */}
          <div>
            <label className="block text-sm font-light text-stone-700 mb-2">Country Code *</label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-sm
                         text-sm font-light focus:outline-none focus:ring-2
                         focus:ring-stone-900"
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.emoji} {country.code} - {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-light text-stone-700 mb-2">Google Trends Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-sm
                         text-sm font-light focus:outline-none focus:ring-2
                         focus:ring-stone-900"
            >
              <option value="0">전체 카테고리</option>
              <option value="20">미용 & 패션 (Beauty & Fitness) ⭐</option>
              <option value="66">건강 (Health)</option>
              <option value="71">쇼핑 (Shopping)</option>
              <option value="3">비즈니스 (Business)</option>
              <option value="12">엔터테인먼트 (Entertainment)</option>
              <option value="16">뉴스 (News)</option>
              <option value="17">과학 기술 (Science & Tech)</option>
              <option value="18">스포츠 (Sports)</option>
              <option value="22">금융 (Finance)</option>
              <option value="45">게임 (Games)</option>
              <option value="108">여행 (Travel)</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-sm">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Info */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm">
            <p className="text-xs text-stone-600 leading-relaxed">
              This will automatically:
              <br />• Collect trending keywords from Google Trends
              <br />• Map relevant products using GenAI
              <br />• Generate hero banner images with Nano Banana
              <br />• Create promotion data in the database
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-stone-200 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-2.5 border border-stone-300 text-stone-700
                       text-sm font-light rounded-sm hover:bg-stone-50 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex-1 px-6 py-2.5 bg-stone-900 text-white text-sm
                       font-light rounded-sm hover:bg-stone-800 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  )
}
