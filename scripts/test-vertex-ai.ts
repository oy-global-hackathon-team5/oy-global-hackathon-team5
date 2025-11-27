/**
 * Vertex AI Analyzer 테스트 스크립트
 *
 * 실행 방법:
 * npx tsx scripts/test-vertex-ai.ts
 */

import { analyzeWithVertexAI } from '../lib/utils/vertex-ai-analyzer';

async function testVertexAI() {
  console.log('🧪 Starting Vertex AI Analyzer Test...\n');

  // 테스트 데이터
  const testCases = [
    {
      name: '일본 - 메이크업',
      trendKeywords: ['リップ', 'アイシャドウ', 'マスカラ', 'ファンデーション'],
      targetCountry: 'JP'
    },
  
  ];

  // 테스트할 케이스 선택 (기본: 한국)
  const testCase = testCases[0];

  console.log(`📋 Test Case: ${testCase.name}`);
  console.log(`🌍 Country: ${testCase.targetCountry}`);
  console.log(`🔑 Keywords: ${testCase.trendKeywords.join(', ')}\n`);

  try {
    const startTime = Date.now();

    // Vertex AI 분석 실행
    const result = await analyzeWithVertexAI(
      testCase.trendKeywords,
      testCase.targetCountry
    );

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // 결과 출력
    console.log('\n✅ Analysis Complete!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 ANALYSIS RESULTS');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log(`🏷️  Target Nation: ${result.targetNation}`);
    console.log(`\n📦 Matched Products (${result.productIds.length}):`);
    console.log(`   ${result.productIds.join(', ')}`);

    console.log(`\n🎯 Promotion Title:`);
    console.log(`   ${result.promotionTitle}`);

    console.log(`\n📝 Promotion Description:`);
    console.log(`   ${result.promotionDescription}`);

    console.log(`\n✨ Buzzwords (${result.promotionBuzzwords.length}):`);
    console.log(`   ${result.promotionBuzzwords.join(', ')}`);

    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`⏱️  Execution Time: ${duration}s`);
    console.log('═══════════════════════════════════════════════════════\n');

    // JSON 전체 출력
    console.log('📄 Full JSON Response:');
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('\n❌ Test Failed!');
    console.error('Error:', error);
    process.exit(1);
  }
}

// 스크립트 실행
testVertexAI()
  .then(() => {
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed with error:', error);
    process.exit(1);
  });
