"use client"

import { ChevronDown } from "lucide-react"
import { COUNTRIES, type CountryCode } from "@/lib/constants"

interface CountrySelectorProps {
  selectedCountry: CountryCode
  onCountryChange: (country: CountryCode) => void
}

export default function CountrySelector({ selectedCountry, onCountryChange }: CountrySelectorProps) {

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Shipping to:</span>
      <div className="relative">
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value as CountryCode)}
          className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg text-sm font-medium bg-white cursor-pointer hover:border-gray-400"
        >
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.nameEn}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none"
        />
      </div>
    </div>
  )
}
