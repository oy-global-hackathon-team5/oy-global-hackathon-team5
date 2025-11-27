"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import CountrySelector from "@/components/country-selector"
import HeroBanner from "@/components/hero-banner"
import ProductGrid from "@/components/product-grid"
import Header from "@/components/header"
import { getCountryNameEn, type CountryCode } from "@/lib/constants"

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("US")

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CountrySelector selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />
      <HeroBanner country={selectedCountry} />

      {/* Best Sellers Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-light text-stone-500 tracking-widest uppercase">CURATED FOR YOU</span>
            <h2 className="text-3xl font-light text-stone-900 mt-2 tracking-tight">
              Best Sellers in {getCountryNameEn(selectedCountry)}
            </h2>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 text-xs font-light text-stone-600 hover:text-stone-900 transition uppercase tracking-wide"
          >
            View More <ChevronRight size={16} />
          </a>
        </div>

        <ProductGrid country={selectedCountry} />
      </div>

      {/* Our Picks Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-light text-stone-500 tracking-widest uppercase">EDITOR'S SELECTION</span>
            <h2 className="text-3xl font-light text-stone-900 mt-2 tracking-tight">Our Picks</h2>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 text-xs font-light text-stone-600 hover:text-stone-900 transition uppercase tracking-wide"
          >
            View More <ChevronRight size={16} />
          </a>
        </div>

        <ProductGrid country={selectedCountry} variant="picks" />
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-16 mt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-8 mb-12">
            <div>
              <p className="text-xs font-light text-stone-400 uppercase tracking-widest mb-6">Company</p>
              <ul className="space-y-3 text-sm font-light">
                <li>
                  <a href="#" className="text-stone-300 hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-stone-300 hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-stone-300 hover:text-white transition">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-light text-stone-400 uppercase tracking-widest mb-6">Customer Service</p>
              <ul className="space-y-3 text-sm font-light">
                <li>
                  <a href="#" className="text-stone-300 hover:text-white transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-stone-300 hover:text-white transition">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="text-stone-300 hover:text-white transition">
                    Returns
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-light text-stone-400 uppercase tracking-widest mb-6">Legal</p>
              <ul className="space-y-3 text-sm font-light">
                <li>
                  <a href="#" className="text-stone-300 hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-stone-300 hover:text-white transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-stone-300 hover:text-white transition">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-light text-stone-400 uppercase tracking-widest mb-6">Connect</p>
              <ul className="space-y-3 text-sm font-light">
                <li>
                  <a href="#" className="text-stone-300 hover:text-white transition">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-stone-300 hover:text-white transition">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="text-stone-300 hover:text-white transition">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8">
            <p className="text-xs font-light text-stone-400 text-center">© 2025 OLIVE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
