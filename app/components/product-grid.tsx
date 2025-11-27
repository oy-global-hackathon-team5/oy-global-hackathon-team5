import ProductCard from "./product-card"
import type { CountryCode } from "@/lib/constants"

interface ProductGridProps {
  country: CountryCode
  variant?: "default" | "picks"
}

const products = {
  default: [
    {
      id: "1",
      name: "ROUND LAB LHA Birch Juice Juice Moisturizing Sunscreen",
      brand: "ROUND LAB",
      price: 43.2,
      originalPrice: 54.0,
      rating: 4.9,
      image: "/skincare-sunscreen-product.jpg",
      badge: null,
    },
    {
      id: "2",
      name: "SKIN1004 Madagascar Centella Hyalu-Cica Water-Fit Sun",
      brand: "SKIN1004",
      price: 23.8,
      originalPrice: 29.75,
      rating: 4.9,
      image: "/hydrating-sunscreen-korean.jpg",
      badge: null,
    },
    {
      id: "3",
      name: "Beauty of Joseon Relief Sun",
      brand: "Beauty of Joseon",
      price: 30.0,
      rating: 4.9,
      image: "/korean-beauty-sunscreen.jpg",
      badge: null,
    },
    {
      id: "4",
      name: "FOODOLOGY Colodology Jelly 30 Sticks",
      brand: "FOODOLOGY",
      price: 55.17,
      rating: 4.8,
      image: "/beauty-jelly-product.jpg",
      badge: "SALE",
    },
    {
      id: "5",
      name: "d'Alba White Truffle First Spray Serum 100mL",
      brand: "d'Alba",
      price: 59.14,
      rating: 4.8,
      image: "/luxury-serum-spray.jpg",
      badge: null,
    },
  ],
  picks: [
    {
      id: "6",
      name: "JUNGSAEMMOOL Essential",
      brand: "JUNGSAEMMOOL",
      price: 45.0,
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=250",
      badge: "BEST",
    },
    {
      id: "7",
      name: "TONYMOLY Perfect Lips",
      brand: "TONYMOLY",
      price: 12.5,
      rating: 4.7,
      image: "/placeholder.svg?height=300&width=250",
      badge: "HOT DEAL",
    },
    {
      id: "8",
      name: "SKINFOOD Carrot Calming Water Pad",
      brand: "SKINFOOD",
      price: 14.99,
      rating: 4.9,
      image: "/placeholder.svg?height=300&width=250",
      badge: "HOT DEAL",
    },
    {
      id: "9",
      name: "BB LAB Collagen S 30 Sticks",
      brand: "BB LAB",
      price: 38.5,
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=250",
      badge: "HOT DEAL",
    },
  ],
}

export default function ProductGrid({ country, variant = "default" }: ProductGridProps) {
  const items = products[variant]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
