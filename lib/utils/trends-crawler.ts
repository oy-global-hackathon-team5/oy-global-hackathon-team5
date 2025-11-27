import { chromium } from 'playwright';

/**
 * Google Trends에서 국가별 트렌드 키워드를 크롤링하는 함수
 *
 * @param countryCode - 국가 코드 (예: 'KR', 'US', 'JP')
 * @param category - 카테고리 ID (예: '20' = Beauty & Fitness, '0' = 전체)
 * @returns 트렌드 키워드 문자열 배열 (상위 10개)
 */
export async function getTrendsKeywords(
  countryCode: string,
  category: string
): Promise<string[]> {
  const range = 7; // 7일 고정

  try {
    console.log(`🔍 Fetching trends for ${countryCode} (category: ${category})...`);

    const browser = await chromium.launch({
      headless: true,
      timeout: 60000 // 브라우저 실행 타임아웃 60초
    });

    // 클립보드 권한을 가진 context 생성
    const context = await browser.newContext({
      permissions: ['clipboard-read', 'clipboard-write']
    });
    const page = await context.newPage();

    // 페이지 타임아웃 설정 (90초)
    page.setDefaultTimeout(90000);
    page.setDefaultNavigationTimeout(90000);

    // Google Trends URL 생성
    const url =
      `https://trends.google.com/trending?geo=${countryCode}` +
      `&sort=search-volume` +
      `&hours=${range * 24}` +
      `&category=${category}`;

    console.log(`📍 Navigating to: ${url}`);

    // 페이지 로딩 (더 유연한 대기 전략 사용)
    await page.goto(url, {
      waitUntil: 'domcontentloaded', // networkidle 대신 domcontentloaded 사용 (더 빠름)
      timeout: 90000
    });

    // 페이지가 완전히 렌더링될 때까지 추가 대기
    await page.waitForTimeout(5000);

    // 쿠키 배너 처리 (있는 경우)
    try {
      const cookieButton = page.locator('button:has-text("Got it"), button:has-text("확인")').first();
      await cookieButton.click({ timeout: 5000 });
      await page.waitForTimeout(1000);
    } catch (e) {
      // 쿠키 배너가 없으면 무시
      console.log('No cookie banner found, continuing...');
    }

    console.log('📤 Exporting data...');

    // 페이지 맨 위로 스크롤
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);

    // Export 버튼 찾기 및 클릭
    const exportButton = page
      .locator('button:has-text("Export"), button:has-text("내보내기")')
      .filter({ hasText: /Export|내보내기/ })
      .first();

    await exportButton.waitFor({ state: 'visible', timeout: 60000 });
    await exportButton.click();

    // 드롭다운 메뉴 대기
    await page.waitForTimeout(3000);

    console.log('📋 Copying to clipboard...');

    // '클립보드에 복사' 메뉴 항목 찾기 및 클릭 (다국어 대응)
    const copyMenuItem = page
      .locator('[role="menuitem"][aria-label="클립보드에 복사"], [role="menuitem"][aria-label="Copy to clipboard"]')
      .last();

    await copyMenuItem.waitFor({ state: 'attached', timeout: 30000 });
    await copyMenuItem.click({ force: true });

    // 클립보드 복사 완료 대기
    await page.waitForTimeout(2000);

    console.log('📋 Reading from clipboard...');

    // 클립보드에서 데이터 가져오기
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText()
    );

    await browser.close();

    console.log('✅ Successfully fetched trends data');

    // 텍스트 파싱 - 키워드만 추출
    const keywords = parseTextToKeywords(clipboardText);
    console.log(`📊 Found ${keywords.length} keywords`);

    return keywords;

  } catch (error) {
    console.error('❌ Error crawling trends:', error);
    return []; // 에러 발생 시 빈 배열 반환
  }
}

/**
 * 클립보드 텍스트를 파싱하여 키워드 배열로 변환
 * 텍스트 형식: 탭으로 구분된 TSV (Tab-Separated Values)
 * 형식: "Trends\tSearch volume\tStarted\tTrend breakdown"
 *
 * @param clipboardText - 클립보드에서 가져온 텍스트
 * @returns 키워드 문자열 배열 (상위 10개)
 */
function parseTextToKeywords(clipboardText: string): string[] {
  const lines = clipboardText.split('\n');
  const keywords: string[] = [];

  // 첫 줄은 헤더이므로 스킵하고, 두 번째 줄부터 파싱
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // 탭으로 구분된 값 파싱 (TSV 형식)
    // 첫 번째 컬럼(Trends)만 추출
    const columns = line.split('\t');
    if (columns.length > 0 && columns[0]) {
      const keyword = columns[0].trim();
      if (keyword) {
        keywords.push(keyword);
      }
    }
  }

  // 상위 10개만 반환
  return keywords.slice(0, 10);
}
