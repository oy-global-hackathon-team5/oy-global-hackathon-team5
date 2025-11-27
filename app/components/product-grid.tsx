import ProductCard from "./product-card"
import type { CountryCode } from "@/lib/constants"

interface ProductGridProps {
  country: CountryCode
  variant?: "default" | "picks"
}

const products = {
  default: [
    {
      id: "GA210000096",
      name: "아로마티카 수딩 알로에 베라 젤 300ml",
      brand: "아로마티카",
      price: 18.5,
      originalPrice: 24.0,
      rating: 4.8,
      image: "https://cdn-image.oliveyoung.com/prdtImg/1356/514bb7aa-76f5-4073-8add-6430d13481b5.jpg",
      badge: null,
    },
    {
      id: "GA210000106",
      name: "아토팜 MLE 크림 100g",
      brand: "아토팜",
      price: 22.3,
      originalPrice: 28.0,
      rating: 4.9,
      image: "https://cdn-image.oliveyoung.com/prdtImg/1379/094dc2c9-3f85-43e9-adf6-1b42fbf40a63.jpg",
      badge: "SALE",
    },
    {
      id: "GA210000123",
      name: "린제이 콜라겐 모델링 마스크 28g",
      brand: "린제이",
      price: 12.9,
      rating: 4.7,
      image: "https://cdn-image.oliveyoung.com/mig/prdtImg/1c3642c222ccf5a153bf6ee1b0b4ee6d.jpg",
      badge: null,
    },
    {
      id: "GA210000821",
      name: "코스알엑스 어드벤스드 스네일 92 올인원 크림 100ml",
      brand: "코스알엑스",
      price: 28.5,
      originalPrice: 35.0,
      rating: 4.9,
      image: "https://cdn-image.oliveyoung.com/prdtImg/1864/f0924102-6d83-4d33-982c-7f4d17487b19.jpg",
      badge: "SALE",
    },
    {
      id: "GA210001964",
      name: "코스알엑스 풀핏 프로폴리스 시너지 토너 280ml",
      brand: "코스알엑스",
      price: 24.8,
      rating: 4.8,
      image: "https://cdn-image.oliveyoung.com/prdtImg/1686/0ad49de7-e333-496f-b3eb-66e3c58f9d97.jpg",
      badge: null,
    },
  ],
  picks: [
    {
      id: "GA210000530",
      name: "코스알엑스 어드벤스드 스네일 96 뮤신 파워 에센스 100ml",
      brand: "코스알엑스",
      price: 32.0,
      rating: 4.9,
      image: "https://cdn-image.oliveyoung.com/prdtImg/1850/9bdea5b1-3e0e-4afd-ba56-30da82bb31ae.jpg",
      badge: "BEST",
    },
    {
      id: "GA210000608",
      name: "코스알엑스 찹쌀쫀쫀팩 60ml",
      brand: "코스알엑스",
      price: 15.5,
      rating: 4.8,
      image: "https://cdn-image.oliveyoung.com/prdtImg/1080/df4495e1-d65a-4999-838f-31863c307446.jpg",
      badge: "HOT DEAL",
    },
    {
      id: "GA210000630",
      name: "클리오 킬커버 에어리핏 컨실러",
      brand: "CLIO",
      price: 14.2,
      rating: 4.7,
      image: "https://cdn-image.oliveyoung.com/prdtImg/1431/d704d2d4-f44e-454f-92a2-d80725cbed5b.jpg",
      badge: "HOT DEAL",
    },
    {
      id: "GA210002228",
      name: "라운드랩 1025 독도 토너 200ml",
      brand: "라운드랩",
      price: 19.9,
      originalPrice: 25.0,
      rating: 4.9,
      image: "https://cdn-image.oliveyoung.com/prdtImg/1128/b148d3fa-b06d-4235-8d2f-e76c2e512033.png",
      badge: "HOT DEAL",
    },
    {
      id: "GA210000123",
      name: "린제이 콜라겐 모델링 마스크 28g",
      brand: "린제이",
      price: 12.9,
      rating: 4.7,
      image: "https://cdn-image.oliveyoung.com/mig/prdtImg/1c3642c222ccf5a153bf6ee1b0b4ee6d.jpg",
      badge: null,
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

