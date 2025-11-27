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
    const context = await browser.newContext({
      acceptDownloads: true
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

    console.log('⬇️  Downloading CSV...');

    // 'CSV 다운로드' 메뉴 항목 찾기
    const csvMenuItem = page
      .locator('[role="menuitem"][aria-label="CSV 다운로드"], [role="menuitem"][aria-label="Download CSV"]')
      .last();

    await csvMenuItem.waitFor({ state: 'attached', timeout: 30000 });

    // 다운로드 이벤트 설정 및 클릭
    const downloadPromise = page.waitForEvent('download');
    await csvMenuItem.click({ force: true });

    // 다운로드 완료 대기
    const download = await downloadPromise;

    // CSV 내용을 메모리로 읽기
    const stream = await download.createReadStream();
    let csvContent = '';

    for await (const chunk of stream) {
      csvContent += chunk.toString();
    }

    await browser.close();

    console.log('✅ Successfully fetched trends data');

    // CSV 파싱 - 키워드만 추출
    const keywords = parseCSVToKeywords(csvContent);
    console.log(`📊 Found ${keywords.length} keywords`);

    return keywords;

  } catch (error) {
    console.error('❌ Error crawling trends:', error);
    return []; // 에러 발생 시 빈 배열 반환
  }
}

/**
 * CSV 내용을 파싱하여 키워드 배열로 변환
 * CSV 형식: "Trends","Search volume","Started","Trend breakdown"
 *
 * @param csvContent - CSV 문자열
 * @returns 키워드 문자열 배열 (상위 10개)
 */
function parseCSVToKeywords(csvContent: string): string[] {
  const lines = csvContent.split('\n');
  const keywords: string[] = [];

  // 첫 줄은 헤더이므로 스킵하고, 두 번째 줄부터 파싱
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // CSV 파싱: 쉼표로 구분된 값 처리
    // 첫 번째 컬럼(Trends)만 추출
    const columns = parseCSVLine(line);
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

/**
 * CSV 한 줄을 파싱하여 컬럼 배열로 변환
 * 따옴표로 감싸진 값과 쉼표 처리
 *
 * @param line - CSV 한 줄
 * @returns 컬럼 값 배열
 */
function parseCSVLine(line: string): string[] {
  const columns: string[] = [];
  let currentColumn = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      // 따옴표 토글
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      // 따옴표 밖의 쉼표는 구분자
      columns.push(currentColumn);
      currentColumn = '';
    } else {
      currentColumn += char;
    }
  }

  // 마지막 컬럼 추가
  if (currentColumn) {
    columns.push(currentColumn);
  }

  return columns;
}
