'use server'

import { supabase } from '@/lib/supabase'
import type { CountryCode } from '@/lib/constants'

export interface Promotion {
  id: number
  plndp_no: string
  country_code: string
  title: string
  description: string | null
  theme: string | null
  hero_banner_image_url: string
  detail_image_urls: string[] | null
  products: {
    items: Array<{
      id: string
      name: string
      price: number
      discount_price: number
      image_url: string
      brand?: string
      category?: string
    }>
  } | null
  trend_keywords: string[] | null
  created_at: string
  updated_at: string
}

/**
 * 국가 코드로 최신 프로모션 조회 (히어로 배너용)
 */
export async function getPromotionByCountry(countryCode: CountryCode): Promise<Promotion | null> {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('country_code', countryCode)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching promotion by country:', error)
      return null
    }

    return data as Promotion
  } catch (error) {
    console.error('Error in getPromotionByCountry:', error)
    return null
  }
}

/**
 * 국가 코드로 모든 프로모션 조회 (히어로 배너 슬라이더용)
 */
export async function getPromotionsByCountry(countryCode: CountryCode): Promise<Promotion[]> {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('country_code', countryCode)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching promotions by country:', error)
      return []
    }

    return (data || []) as Promotion[]
  } catch (error) {
    console.error('Error in getPromotionsByCountry:', error)
    return []
  }
}

/**
 * 기획전 번호로 프로모션 상세 조회
 */
export async function getPromotionByPlndpNo(plndpNo: string): Promise<Promotion | null> {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('plndp_no', plndpNo)
      .single()

    if (error) {
      console.error('Error fetching promotion by plndp_no:', error)
      return null
    }

    return data as Promotion
  } catch (error) {
    console.error('Error in getPromotionByPlndpNo:', error)
    return null
  }
}

