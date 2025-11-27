import { VertexAI, type Part } from '@google-cloud/vertexai';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Vertex AI 분석 결과 인터페이스
 */
export interface AIAnalysisResult {
  productIds: string[];        // 상품 GA 아이디 배열
  targetNation: string;         // 국가 코드
  promotionTitle: string;       // 프로모션 제목
  promotionDescription: string; // 프로모션 상세 설명
  promotionBuzzwords: string[]; // 이목을 끄는 단어 목록
}

/**
 * Google Trends 키워드와 상품 데이터를 Vertex AI로 분석하여
 * 프로모션 정보를 생성하는 함수
 *
 * @param trendKeywords - 트렌드 키워드 배열 (getTrendsKeywords 결과)
 * @param targetCountry - ISO 국가 코드 (예: 'KR', 'US', 'JP')
 * @returns 프로모션 분석 결과
 *
 * @example
 * const result = await analyzeWithVertexAI(
 *   ['수분 장벽', '겨울 건조', '보습'],
 *   'KR'
 * );
 */
export async function analyzeWithVertexAI(
  trendKeywords: string[],
  targetCountry: string
): Promise<AIAnalysisResult> {
  // 실제 GCS 상품 데이터셋 URI
  const productDatasetUri = 'gs://oy-global-hackathon-team5/products.mapping.lite.csv';
  try {
    console.log('🤖 Initializing Vertex AI analysis...');
    console.log(`📊 Target Country: ${targetCountry}`);
    console.log(`🔑 Trend Keywords: ${trendKeywords.join(', ')}`);
    console.log(`📁 Product Dataset: ${productDatasetUri}`);

    // 1. Credentials 설정 (generate-image와 동일한 패턴)
    const credentialsDir = path.join(process.cwd(), 'app');
    const files = fs.readdirSync(credentialsDir);
    const credentialsFile = files.find(
      (file: string) => file.startsWith('global-hackathon') && file.endsWith('.json')
    );

    if (!credentialsFile) {
      throw new Error('Google Cloud credentials file not found');
    }

    const credentialsPath = path.join(credentialsDir, credentialsFile);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
    console.log('✅ Credentials loaded');

    // 2. Vertex AI 초기화
    const vertexAI = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT || 'global-hackathon-479205',
      location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
    });

    // 3. 모델 설정 (gemini-2.5-flash 사용)
    const model = 'gemini-2.5-flash';
    const generativeModel = vertexAI.preview.getGenerativeModel({
      model: model,
      generationConfig: {
        maxOutputTokens: 8192,  // JSON 응답을 위해 충분한 토큰 할당
        temperature: 0.7,
        // responseMimeType 제거 - 완전한 응답을 받은 후 수동으로 파싱
      }
    });

    console.log(`✅ Model initialized: ${model}`);

    // 4. System Prompt 읽기
    const systemPromptPath = path.join(process.cwd(), 'lib/constants/step1_system_prompt.md');
    const systemPrompt = fs.readFileSync(systemPromptPath, 'utf-8');
    console.log('✅ System prompt loaded');

    // 5. 프롬프트 조합 (변수 치환)
    const promptWithData = systemPrompt
      .replace('{Target_Country}', targetCountry)
      .replace('{Trend_Keywords}', trendKeywords.join(', '))
      .replace('{Product_List}', productDatasetUri);

    // 6. API 요청 (GCS CSV 파일 포함)
    const parts: Part[] = [
      { text: promptWithData },
      {
        fileData: {
          mimeType: 'text/csv',
          fileUri: productDatasetUri  // GCS URI
        }
      }
    ];

    const request_data = {
      contents: [{ role: 'user', parts: parts }]
    };

    console.log('🚀 Sending request to Vertex AI...');
    console.log('📋 Request structure:', JSON.stringify({
      model: model,
      partsCount: parts.length,
      fileUri: productDatasetUri,
      promptLength: promptWithData.length
    }, null, 2));

    const result = await generativeModel.generateContent(request_data);

    console.log('📥 Response structure:', JSON.stringify({
      hasCandidates: !!result.response.candidates,
      candidatesCount: result.response.candidates?.length || 0,
      firstCandidateHasContent: !!result.response.candidates?.[0]?.content,
      partsCount: result.response.candidates?.[0]?.content?.parts?.length || 0
    }, null, 2));

    // 7. JSON 파싱
    if (!result.response.candidates || result.response.candidates.length === 0) {
      throw new Error('No response from Vertex AI');
    }

    const responseText = result.response.candidates[0].content.parts[0].text;

    if (!responseText) {
      throw new Error('Empty response from Vertex AI');
    }

    console.log('📥 Response received, parsing JSON...');
    console.log('📄 Raw response text (first 500 chars):', responseText?.substring(0, 500));

    // JSON 추출 및 파싱
    let parsedResult: AIAnalysisResult;
    try {
      // JSON 부분만 추출 (```json ... ``` 또는 순수 JSON)
      let jsonText = responseText.trim();

      // 마크다운 코드 블록 제거
      const jsonBlockMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonBlockMatch) {
        jsonText = jsonBlockMatch[1].trim();
      } else {
        // 코드 블록이 없으면 {} 사이의 내용 추출
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonText = jsonMatch[0];
        }
      }

      console.log('📄 Extracted JSON (first 500 chars):', jsonText.substring(0, 500));
      parsedResult = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('❌ JSON parsing failed. Full response:', responseText);
      throw parseError;
    }

    // 8. 결과 검증
    if (!parsedResult.productIds || !Array.isArray(parsedResult.productIds)) {
      throw new Error('Invalid response format: productIds missing or not an array');
    }

    console.log('✅ Analysis complete!');
    console.log(`📦 Matched Products: ${parsedResult.productIds.length}`);
    console.log(`🎯 Promotion Title: ${parsedResult.promotionTitle}`);

    return parsedResult;

  } catch (error) {
    console.error('❌ Error in Vertex AI analysis:', error);

    // 에러 발생 시 기본값 반환 (graceful degradation)
    return {
      productIds: [],
      targetNation: targetCountry,
      promotionTitle: `${targetCountry} Trending Products`,
      promotionDescription: `Discover trending products in ${targetCountry}`,
      promotionBuzzwords: trendKeywords.slice(0, 3)  // 첫 3개 키워드 사용
    };
  }
}
