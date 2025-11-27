import { supabase } from "./supabase"
import type { CountryCode, CategoryId } from "./constants"

// 프로모션 데이터 타입 정의
export interface PromotionData {
  plndp_no: string // 기획전 번호
  country_code: CountryCode // 국가 코드 (ISO 3166-1 alpha-2)
  title: string // 기획전 제목
  description: string // 기획전 설명
  theme?: string // 기획전 테마 (optional)
  hero_banner_image_url: string // 히어로 배너 이미지 URL
  detail_image_urls?: string[] // 상세 페이지 이미지 URL 배열 (optional)
  products?: any // 상품 데이터 JSON (optional)
  trend_keywords?: string[] // 트렌드 키워드 배열 (optional)
}

export interface Promotion extends PromotionData {
  id: string
  created_at: string
  updated_at: string
}

/**
 * 국가별 프로모션 목록 조회
 */
export async function getPromotionsByCountry(countryCode: CountryCode): Promise<Promotion[]> {
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("country_code", countryCode)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching promotions:", error)
    throw error
  }

  return data || []
}

/**
 * 프로모션 ID로 조회
 */
export async function getPromotionById(id: string): Promise<Promotion | null> {
  const { data, error } = await supabase.from("promotions").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching promotion:", error)
    throw error
  }

  return data
}

/**
 * 새로운 프로모션 생성
 */
export async function createPromotion(promotionData: PromotionData): Promise<Promotion> {
  const { data, error } = await supabase.from("promotions").insert(promotionData).select().single()

  if (error) {
    console.error("Error creating promotion:", error)
    throw error
  }

  return data
}

/**
 * 프로모션 수정
 */
export async function updatePromotion(id: string, promotionData: Partial<PromotionData>): Promise<Promotion> {
  const { data, error } = await supabase.from("promotions").update(promotionData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating promotion:", error)
    throw error
  }

  return data
}

/**
 * 프로모션 삭제
 */
export async function deletePromotion(id: string): Promise<void> {
  const { error } = await supabase.from("promotions").delete().eq("id", id)

  if (error) {
    console.error("Error deleting promotion:", error)
    throw error
  }
}

/**
 * 기획전 번호 자동 생성 함수
 * 형식: PLNDP-{국가코드}-{타임스탬프}
 */
export function generatePlndpNo(countryCode: CountryCode): string {
  const timestamp = Date.now()
  return `PLNDP-${countryCode}-${timestamp}`
}

/**
 * GenAI로 생성된 프로모션을 DB에 저장
 * (generate-promotion API에서 사용)
 */
export async function saveGeneratedPromotion(params: {
  countryCode: CountryCode
  category: CategoryId
  title: string
  description: string
  theme?: string
  heroBannerImageUrl: string
  detailImageUrls?: string[]
  products?: any
  trendKeywords?: string[]
}): Promise<Promotion> {
  const plndpNo = generatePlndpNo(params.countryCode)

  const promotionData: PromotionData = {
    plndp_no: plndpNo,
    country_code: params.countryCode,
    title: params.title,
    description: params.description,
    theme: params.theme,
    hero_banner_image_url: params.heroBannerImageUrl,
    detail_image_urls: params.detailImageUrls,
    products: params.products,
    trend_keywords: params.trendKeywords,
  }

  return await createPromotion(promotionData)
}
