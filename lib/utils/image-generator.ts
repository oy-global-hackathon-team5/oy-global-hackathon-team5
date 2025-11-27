import { AspectRatio } from './../../node_modules/csstype/index.d';
import { VertexAI, HarmCategory, HarmBlockThreshold, type Part } from '@google-cloud/vertexai';
import * as fs from 'fs';
import * as path from 'path';
import type { AIAnalysisResult } from './vertex-ai-analyzer';

/**
 * 이미지 생성 결과 인터페이스
 */
export interface ImageGenerationResult {
  heroBannerUrl: string;      // 히어로 배너 이미지 URL (base64)
  detailImageUrls: string[];  // 상세 페이지 이미지 URL 배열
}

/**
 * Inline 이미지 데이터 타입
 */
type InlineImage = {
  mimeType: string;
  data: string;
};

/**
 * Step 2 결과를 바탕으로 Vertex AI (Gemini 2.5 Flash Image)를 사용하여
 * 프로모션 배너 이미지를 생성하는 함수
 *
 * @param aiResult - Step 2에서 생성된 AI 분석 결과
 * @returns 생성된 이미지 URL (base64 인코딩)
 *
 * @example
 * const images = await generatePromotionImages({
 *   productIds: ['A0001', 'A0123'],
 *   targetNation: 'KR',
 *   promotionTitle: '겨울 수분 장벽 케어',
 *   promotionDescription: '건조한 겨울, 피부 보습 솔루션',
 *   promotionBuzzwords: ['수분폭탄', '장벽강화']
 * });
 */
export async function generatePromotionImages(
  aiResult: AIAnalysisResult
): Promise<ImageGenerationResult> {
  try {
    console.log('🎨 Initializing image generation...');
    console.log(`🌍 Target Nation: ${aiResult.targetNation}`);
    console.log(`🎯 Promotion: ${aiResult.promotionTitle}`);

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

    // 3. 모델 설정 (gemini-2.5-flash-image 사용)
    const model = 'gemini-2.5-flash-image';
    const generativeModel = vertexAI.preview.getGenerativeModel({
      model: model,
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 1,
        topP: 0.95,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        }
      ],
    });

    console.log(`✅ Model initialized: ${model}`);

    // 4. System Prompt 읽기
    const systemPromptPath = path.join(process.cwd(), 'lib/constants/step2_system_prompt.md');
    const systemPrompt = fs.readFileSync(systemPromptPath, 'utf-8');
    console.log('✅ System prompt loaded');

    // 5. Step 2 결과를 JSON 문자열로 변환
    const curationData = JSON.stringify(aiResult, null, 2);

    // 6. 프롬프트 조합
    const fullPrompt = `${curationData}\n\n${systemPrompt}\n\nPlease generate a promotional banner image (16:9 ratio) for ${aiResult.targetNation} market based on the above promotion data. Use the local language and cultural aesthetics appropriate for ${aiResult.targetNation}.`;

    console.log('📝 Prompt prepared');

    // 7. API 요청
    const parts: Part[] = [{ text: fullPrompt }];

    const request_data = {
      contents: [{ role: 'user', parts: parts }]
    };

    console.log('🚀 Sending request to Vertex AI for image generation...');
    const streamingResp = await generativeModel.generateContentStream(request_data);

    // 8. 스트림 응답 처리
    const images: InlineImage[] = [];
    let fullText = '';

    for await (const chunk of streamingResp.stream) {
      if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
        for (const part of chunk.candidates[0].content.parts) {
          if (part.text) {
            fullText += part.text;
          }
          // Inline data (이미지) 확인
          if (part.inlineData) {
            images.push({
              mimeType: part.inlineData.mimeType,
              data: part.inlineData.data
            });
          }
        }
      }
    }

    console.log(`✅ Image generation complete! Generated ${images.length} image(s)`);

    // 9. 결과 검증 및 반환
    if (images.length === 0) {
      throw new Error('No images generated from Vertex AI');
    }

    // 첫 번째 이미지를 히어로 배너로 사용
    const heroBannerUrl = `data:${images[0].mimeType};base64,${images[0].data}`;

    // 나머지 이미지들을 상세 페이지 이미지로 사용
    const detailImageUrls = images.slice(1).map(img =>
      `data:${img.mimeType};base64,${img.data}`
    );

    console.log('🎉 Image URLs prepared');

    return {
      heroBannerUrl,
      detailImageUrls
    };

  } catch (error) {
    console.error('❌ Error in image generation:', error);

    // 에러 발생 시 빈 값 반환 (graceful degradation)
    return {
      heroBannerUrl: '',
      detailImageUrls: []
    };
  }
}
