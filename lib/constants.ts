// 국가 코드 및 Google Trends 카테고리 상수 정의
// ISO 3166-1 alpha-2 표준 사용

export const COUNTRIES = [
  { code: "KR", name: "대한민국", emoji: "🇰🇷", nameEn: "Korea" },
  { code: "US", name: "미국", emoji: "🇺🇸", nameEn: "United States" },
  { code: "JP", name: "일본", emoji: "🇯🇵", nameEn: "Japan" },
  { code: "GB", name: "영국", emoji: "🇬🇧", nameEn: "United Kingdom" },
  { code: "CN", name: "중국", emoji: "🇨🇳", nameEn: "China" },
  { code: "DE", name: "독일", emoji: "🇩🇪", nameEn: "Germany" },
  { code: "FR", name: "프랑스", emoji: "🇫🇷", nameEn: "France" },
  { code: "ES", name: "스페인", emoji: "🇪🇸", nameEn: "Spain" },
  { code: "IT", name: "이탈리아", emoji: "🇮🇹", nameEn: "Italy" },
  { code: "CA", name: "캐나다", emoji: "🇨🇦", nameEn: "Canada" },
  { code: "AU", name: "호주", emoji: "🇦🇺", nameEn: "Australia" },
  { code: "IN", name: "인도", emoji: "🇮🇳", nameEn: "India" },
  { code: "BR", name: "브라질", emoji: "🇧🇷", nameEn: "Brazil" },
  { code: "MX", name: "멕시코", emoji: "🇲🇽", nameEn: "Mexico" },
  { code: "RU", name: "러시아", emoji: "🇷🇺", nameEn: "Russia" },
  { code: "SG", name: "싱가포르", emoji: "🇸🇬", nameEn: "Singapore" },
  { code: "TW", name: "대만", emoji: "🇹🇼", nameEn: "Taiwan" },
  { code: "HK", name: "홍콩", emoji: "🇭🇰", nameEn: "Hong Kong" },
] as const

export const GOOGLE_TRENDS_CATEGORIES = [
  { id: "0", name: "전체 카테고리", nameEn: "All Categories", isDefault: true },
  { id: "20", name: "미용 & 패션", nameEn: "Beauty & Fitness", isRecommended: true },
  { id: "66", name: "건강", nameEn: "Health" },
  { id: "71", name: "쇼핑", nameEn: "Shopping" },
  { id: "3", name: "비즈니스", nameEn: "Business" },
  { id: "12", name: "엔터테인먼트", nameEn: "Entertainment" },
  { id: "16", name: "뉴스", nameEn: "News" },
  { id: "17", name: "과학 기술", nameEn: "Science & Tech" },
  { id: "18", name: "스포츠", nameEn: "Sports" },
  { id: "22", name: "금융", nameEn: "Finance" },
  { id: "45", name: "게임", nameEn: "Games" },
  { id: "108", name: "여행", nameEn: "Travel" },
] as const

// 타입 정의
export type CountryCode = (typeof COUNTRIES)[number]["code"]
export type CategoryId = (typeof GOOGLE_TRENDS_CATEGORIES)[number]["id"]

// 유틸리티 함수: 국가 코드로 국가 정보 찾기
export function getCountryByCode(code: string) {
  return COUNTRIES.find((country) => country.code === code)
}

// 유틸리티 함수: 카테고리 ID로 카테고리 정보 찾기
export function getCategoryById(id: string) {
  return GOOGLE_TRENDS_CATEGORIES.find((category) => category.id === id)
}

// 유틸리티 함수: 국가 코드를 표시명으로 변환 (영문)
export function getCountryNameEn(code: string): string {
  return getCountryByCode(code)?.nameEn || code
}

// 유틸리티 함수: 국가 코드를 표시명으로 변환 (한글)
export function getCountryName(code: string): string {
  return getCountryByCode(code)?.name || code
}

// 유틸리티 함수: 카테고리 ID를 표시명으로 변환 (영문)
export function getCategoryNameEn(id: string): string {
  return getCategoryById(id)?.nameEn || id
}

// 유틸리티 함수: 카테고리 ID를 표시명으로 변환 (한글)
export function getCategoryName(id: string): string {
  return getCategoryById(id)?.name || id
}
