"use client"

import { useState } from "react"
import Header from "@/components/header"
import CountrySelector from "@/components/country-selector"
import PromotionList from "@/components/admin/promotion-list"
import GenerateDialog from "@/components/admin/generate-dialog"

export default function AdminPage() {
  const [selectedCountry, setSelectedCountry] = useState("US")
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleGenerateSuccess = () => {
    setIsGenerateOpen(false)
    setRefreshKey((prev) => prev + 1) // 목록 새로고침
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-stone-900 tracking-tight">Promotion Management</h1>
          <p className="text-sm font-light text-stone-500 mt-2">Generate and manage AI-powered country-specific promotions</p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <CountrySelector selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />

          <button
            onClick={() => setIsGenerateOpen(true)}
            className="px-6 py-2.5 bg-stone-900 text-white text-sm font-light
                       tracking-wide rounded-sm hover:bg-stone-800 transition"
          >
            Generate New Promotion
          </button>
        </div>

        {/* Promotion List */}
        <PromotionList country={selectedCountry} key={refreshKey} />

        {/* Generate Dialog */}
        <GenerateDialog isOpen={isGenerateOpen} onClose={() => setIsGenerateOpen(false)} onSuccess={handleGenerateSuccess} />
      </div>
    </div>
  )
}
