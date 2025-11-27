import { NextResponse } from "next/server"
import { saveGeneratedPromotion } from "@/lib/promotions"
import { getTrendsKeywords } from "@/lib/utils/trends-crawler"
import { analyzeWithVertexAI } from "@/lib/utils/vertex-ai-analyzer"
import { generatePromotionImages } from "@/lib/utils/image-generator"

export async function POST(request: Request) {
  try {
    const { country_code, category } = await request.json()

    // country_code: ISO 3166-1 alpha-2 (예: 'US', 'KR', 'JP')
    // category: Google Trends 카테고리 ID (예: '20' = Beauty & Fitness)

    console.log(`Generate promotion request: country=${country_code}, category=${category}`)

    // Step 1: Google Trends에서 트렌드 키워드 크롤링 ✅
    console.log('🔍 Fetching trend keywords from Google Trends...')
    const trendKeywords: string[] = await getTrendsKeywords(country_code, category)
    console.log(`✅ Found ${trendKeywords.length} trend keywords:`, trendKeywords)

    // Step 2: Vertex AI로 키워드 분석 및 상품 매핑 ✅
    console.log('🤖 Analyzing trends with Vertex AI...')
    const aiResult = await analyzeWithVertexAI(trendKeywords, country_code)
    console.log(`✅ AI analysis complete:`, {
      productCount: aiResult.productIds.length,
      title: aiResult.promotionTitle
    })

    const title = aiResult.promotionTitle
    const description = aiResult.promotionDescription
    const theme = aiResult.promotionBuzzwords.join(', ')
    const products = aiResult.productIds.length > 0 ? aiResult.productIds : null

    // Step 3: Gemini로 프로모션 이미지 생성 ✅
    console.log('🎨 Generating promotion images...')
    const imageResult = await generatePromotionImages(aiResult)
    console.log(`✅ Image generation complete:`, {
      hasHeroBanner: !!imageResult.heroBannerUrl,
      detailImagesCount: imageResult.detailImageUrls.length
    })

    const heroBannerUrl = imageResult.heroBannerUrl
    const detailImageUrls = imageResult.detailImageUrls

    // TODO 1~3이 완료되지 않았으면 에러 반환
    if (!title || !description || !heroBannerUrl) {
      return NextResponse.json(
        {
          error: "Promotion generation incomplete",
          message: "TODO 1~3 must be implemented before saving to database",
          status: "pending_implementation",
        },
        { status: 501 } // 501 Not Implemented
      )
    }

    // TODO 4: Supabase promotions 테이블에 데이터 저장
    try {
      const promotion = await saveGeneratedPromotion({
        countryCode: country_code,
        category: category,
        title: title,
        description: description,
        theme: theme || undefined,
        heroBannerImageUrl: heroBannerUrl,
        detailImageUrls: detailImageUrls.length > 0 ? detailImageUrls : undefined,
        products: products || undefined,
        trendKeywords: trendKeywords.length > 0 ? trendKeywords : undefined,
      })

      return NextResponse.json({
        success: true,
        promotion_id: promotion.id,
        plndp_no: promotion.plndp_no,
        message: "Promotion generated and saved successfully",
      })
    } catch (dbError) {
      console.error("Database save error:", dbError)

      // DB 저장 실패해도 생성된 데이터는 반환
      return NextResponse.json({
        success: false,
        db_save_failed: true,
        error: "Failed to save to database, but generation was successful",
        db_error: dbError instanceof Error ? dbError.message : "Unknown database error",
        generated_data: {
          title,
          description,
          theme,
          hero_banner_url: heroBannerUrl,
          detail_image_urls: detailImageUrls,
          products,
          trend_keywords: trendKeywords,
        },
        message: "Promotion generated successfully but not saved to database",
      }, { status: 207 }) // 207 Multi-Status: partial success
    }
  } catch (error) {
    console.error("Generate promotion error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate promotion",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
