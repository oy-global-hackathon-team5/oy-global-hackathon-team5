import Link from "next/link"
import { Settings } from "lucide-react"

export default function Header() {
    return (
      <header className="bg-white border-b border-gray-200">
        {/* Promo Bar */}
        <div className="bg-yellow-100 text-gray-900 text-center text-sm font-medium py-2">
          BLACK FRIDAY SALE - ONCE A YEAR, BIGGEST SAVINGS
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition">
            OLIVE YOUNG
          </Link>

          <div className="flex-1 mx-8">
            <input
              type="text"
              placeholder="Search for a product or brand..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="flex items-center gap-6 text-gray-900">
            <button className="hover:text-gray-600">Sign in</button>
            <button className="hover:text-gray-600">Cart</button>
            <Link
              href="/admin"
              className="hover:text-gray-600 transition"
              title="Admin Dashboard"
            >
              <Settings size={20} />
            </Link>
          </div>
        </div>
  
        {/* Navigation */}
        <div className="bg-gray-100 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 flex gap-8 text-sm font-medium text-gray-700 py-3">
            <button className="hover:text-gray-900">Categories</button>
            <button className="hover:text-gray-900">Best</button>
            <button className="hover:text-gray-900">New</button>
            <button className="hover:text-gray-900">Sale</button>
            <button className="hover:text-gray-900">Brands</button>
            <button className="hover:text-gray-900">Skincare</button>
            <button className="hover:text-gray-900">Makeup</button>
          </div>
        </div>
      </header>
    )
  }
  