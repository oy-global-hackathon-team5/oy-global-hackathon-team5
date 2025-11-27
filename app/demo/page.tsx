'use client';

import { useState } from 'react';

// 주요 국가 코드 목록
const COUNTRIES = [
  { code: 'US', name: '미국 (US)' },
  { code: 'KR', name: '한국 (KR)' },
  { code: 'JP', name: '일본 (JP)' },
  { code: 'GB', name: '영국 (GB)' },
  { code: 'DE', name: '독일 (DE)' },
  { code: 'FR', name: '프랑스 (FR)' },
  { code: 'CN', name: '중국 (CN)' },
  { code: 'IN', name: '인도 (IN)' },
];

// Google Trends 카테고리
const CATEGORIES = [
  { id: '0', name: '전체' },
  { id: '2', name: 'Beauty & Fitness (뷰티 & 피트니스)' },
  { id: '18', name: 'Computers & Electronics (컴퓨터 & 전자기기)' },
  { id: '5', name: 'Entertainment (엔터테인먼트)' },
  { id: '8', name: 'Food & Drink (음식 & 음료)' },
  { id: '19', name: 'Home & Garden (홈 & 가든)' },
  { id: '11', name: 'News (뉴스)' },
  { id: '13', name: 'Shopping (쇼핑)' },
  { id: '16', name: 'Sports (스포츠)' },
  { id: '17', name: 'Travel (여행)' },
];

export default function DemoPage() {
  const [countryCode, setCountryCode] = useState('US');
  const [category, setCategory] = useState('20');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate-promotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country_code: countryCode,
          category: category,
        }),
      });

      const data = await response.json();

      // 207 (Partial Success)인 경우: 이미지는 생성되었지만 DB 저장 실패
      if (response.status === 207) {
        setResult({
          ...data,
          partial_success: true,
        });
      } else if (!response.ok) {
        throw new Error(data.details || data.error || '프로모션 생성에 실패했습니다');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            AI 프로모션 생성 시연
          </h1>
          <p className="text-gray-600 text-lg">
            국가와 카테고리를 선택하면 AI가 트렌드를 분석하여 프로모션을 자동 생성합니다
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* 국가 선택 */}
            <div>
              <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-3">
                국가 선택
              </label>
              <select
                id="country"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium disabled:bg-gray-100"
              >
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 카테고리 선택 */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-3">
                카테고리 선택
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium disabled:bg-gray-100"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] disabled:scale-100 shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                프로모션 생성 중...
              </span>
            ) : (
              '프로모션 생성하기'
            )}
          </button>

          {loading && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>처리 중:</strong> Google Trends 크롤링 → AI 분석 → 이미지 생성 → DB 저장
              </p>
              <p className="text-blue-600 text-xs mt-1">
                이 작업은 30초~1분 정도 소요될 수 있습니다
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8 shadow-md">
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-red-800 font-bold text-lg">오류 발생</h3>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800">생성 완료!</h2>
              <div className={`${result.partial_success ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'} px-4 py-2 rounded-full font-semibold text-sm`}>
                {result.partial_success ? '⚠ 부분 성공' : '✓ 성공'}
              </div>
            </div>

            {result.partial_success && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-yellow-800 font-bold">이미지는 생성되었으나 DB 저장 실패</h3>
                </div>
                <p className="text-yellow-700 text-sm">이미지 URL이 너무 길어서 DB에 저장하지 못했습니다. 생성된 이미지는 아래에서 확인할 수 있습니다.</p>
                {result.db_error && (
                  <p className="text-yellow-600 text-xs mt-2 font-mono">{result.db_error}</p>
                )}
              </div>
            )}

            {!result.partial_success && (
              <div className="grid md:grid-cols-2 gap-4 mb-6 bg-gray-50 rounded-lg p-4">
                <div>
                  <span className="text-gray-600 text-sm">프로모션 ID:</span>
                  <p className="font-mono font-bold text-gray-800">{result.promotion_id}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">계획 번호:</span>
                  <p className="font-mono font-bold text-gray-800">{result.plndp_no}</p>
                </div>
              </div>
            )}

            {/* 생성된 이미지 표시 */}
            {result.generated_data && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">생성된 프로모션</h3>

                {/* 제목 */}
                <div className="mb-4">
                  <span className="text-gray-600 text-sm font-semibold">제목:</span>
                  <p className="text-gray-900 text-lg font-bold mt-1">{result.generated_data.title}</p>
                </div>

                {/* 설명 */}
                <div className="mb-4">
                  <span className="text-gray-600 text-sm font-semibold">설명:</span>
                  <p className="text-gray-700 mt-1">{result.generated_data.description}</p>
                </div>

                {/* 히어로 배너 이미지 */}
                {result.generated_data.hero_banner_url && (
                  <div className="mb-4">
                    <span className="text-gray-600 text-sm font-semibold mb-2 block">히어로 배너 이미지:</span>
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={result.generated_data.hero_banner_url}
                        alt="Hero Banner"
                        className="w-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'p-4 text-center text-red-600';
                            errorDiv.textContent = '이미지를 불러올 수 없습니다';
                            parent.appendChild(errorDiv);
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* 상세 이미지들 */}
                {result.generated_data.detail_image_urls && result.generated_data.detail_image_urls.length > 0 && (
                  <div className="mb-4">
                    <span className="text-gray-600 text-sm font-semibold mb-2 block">상세 이미지:</span>
                    <div className="grid md:grid-cols-2 gap-4">
                      {result.generated_data.detail_image_urls.map((url: string, idx: number) => (
                        <div key={idx} className="border-2 border-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={url}
                            alt={`Detail ${idx + 1}`}
                            className="w-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 트렌드 키워드 */}
                {result.generated_data.trend_keywords && result.generated_data.trend_keywords.length > 0 && (
                  <div className="mb-4">
                    <span className="text-gray-600 text-sm font-semibold mb-2 block">트렌드 키워드:</span>
                    <div className="flex flex-wrap gap-2">
                      {result.generated_data.trend_keywords.map((keyword: string, idx: number) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {result.message && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800">{result.message}</p>
              </div>
            )}

            <div className="flex gap-4">
              {!result.partial_success && result.plndp_no && (
                <a
                  href={`/event/${result.plndp_no}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 text-center"
                >
                  프로모션 페이지 보기 →
                </a>
              )}
              <button
                onClick={() => {
                  setResult(null);
                  setError(null);
                }}
                className={`${result.partial_success ? 'flex-1' : 'flex-1'} bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200`}
              >
                새로 생성하기
              </button>
            </div>

            <details className="mt-6">
              <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800 py-2">
                전체 응답 데이터 보기
              </summary>
              <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96 mt-2">
                <pre className="text-sm text-green-400 whitespace-pre-wrap break-words font-mono">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
