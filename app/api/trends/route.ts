import { NextRequest, NextResponse } from 'next/server';
import { getTrendsKeywords } from '@/lib/utils/trends-crawler';

/**
 * Google Trends 크롤링 API 엔드포인트
 * 테스트 및 관리 도구용
 *
 * GET /api/trends?country=KR&category=20
 *
 * Query Parameters:
 * - country: 국가 코드 (기본값: 'US')
 * - category: 카테고리 ID (기본값: '20' = Beauty & Fitness)
 *
 * Response:
 * {
 *   success: true,
 *   country: "KR",
 *   category: "20",
 *   keywords: ["키워드1", "키워드2", ...],
 *   count: 10
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country') || 'US';
    const category = searchParams.get('category') || '20';
    const range = 7

    console.log(`📡 API Request: country=${country}, category=${category}`);

    // Google Trends에서 키워드 가져오기
    const keywords = await getTrendsKeywords(country, category);

    return NextResponse.json({
      success: true,
      country,
      category,
      keywords,
      count: keywords.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch trends',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
