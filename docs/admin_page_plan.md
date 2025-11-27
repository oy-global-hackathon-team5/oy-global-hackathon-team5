# Admin Page Implementation Plan

## 개요
국가별 프로모션(기획전)을 관리할 수 있는 Admin 페이지 구현 계획입니다.
기존 홈페이지 및 이벤트 상세 페이지와 동일한 디자인 톤을 유지하며, CRUD 기능을 제공합니다.

---

## 디자인 톤 & 스타일 가이드

기존 페이지들과 일관성을 유지하기 위해 다음 디자인 원칙을 따릅니다:

- **색상 팔레트**: stone 계열 (stone-50 ~ stone-900)
- **타이포그래피**: font-light, tracking-tight/wide 활용
- **레이아웃**: 미니멀하고 여백이 넉넉한 구성
- **인터랙션**: 부드러운 hover transition 효과
- **전체 톤**: 고급스럽고 깔끔한 뷰티 커머스 느낌

---

## 페이지 구조

### Route
```
/admin
```

### 레이아웃 구성

```
┌─────────────────────────────────────┐
│          Header Component           │
├─────────────────────────────────────┤
│  Country Filter & Add New Button    │
├─────────────────────────────────────┤
│                                     │
│     Promotions Table/Grid View      │
│                                     │
│  ┌────────┬────────┬────────┐      │
│  │ Promo1 │ Promo2 │ Promo3 │      │
│  │        │        │        │      │
│  └────────┴────────┴────────┘      │
│                                     │
└─────────────────────────────────────┘
```

---

## 주요 기능

### 1. 국가별 프로모션 목록 조회

**UI 컴포넌트**
- 국가 선택 드롭다운 (기존 CountrySelector 재사용)
- 선택된 국가의 프로모션 목록을 카드 그리드 형태로 표시

**표시 정보** (각 프로모션 카드)
- `hero_banner_image_url` (썸네일)
- `title`
- `description` (1-2줄 요약)
- `trend_keywords` (태그 형태)
- `created_at`
- 삭제 버튼

**데이터 조회**
```typescript
// Supabase에서 국가별 필터링
const { data, error } = await supabase
  .from('promotions')
  .select('*')
  .eq('country_code', selectedCountry)
  .order('created_at', { ascending: false })
```

### 2. GenAI 기반 프로모션 자동 생성

**UI 플로우**
1. "Generate New Promotion" 버튼 클릭
2. 간단한 모달/다이얼로그 오픈
3. 국가코드 + 카테고리 선택
4. Generate 버튼 클릭 → GenAI 서비스 호출
5. 생성 완료 시 목록 자동 갱신

**입력 파라미터** (최소한의 입력)

| 필드명 | 타입 | 입력 방식 | 필수 여부 |
|--------|------|-----------|----------|
| country_code | select | 드롭다운 (KR, US, JP, GB 등 18개 국가) | Required |
| category | select | 드롭다운 (Google Trends 카테고리 ID) | Required |

**지원 국가 코드** (ISO 3166-1 alpha-2)
- 🇰🇷 KR (대한민국)
- 🇺🇸 US (미국)
- 🇯🇵 JP (일본)
- 🇬🇧 GB (영국)
- 🇨🇳 CN (중국)
- 🇩🇪 DE (독일)
- 🇫🇷 FR (프랑스)
- 🇪🇸 ES (스페인)
- 🇮🇹 IT (이탈리아)
- 🇨🇦 CA (캐나다)
- 🇦🇺 AU (호주)
- 🇮🇳 IN (인도)
- 🇧🇷 BR (브라질)
- 🇲🇽 MX (멕시코)
- 🇷🇺 RU (러시아)
- 🇸🇬 SG (싱가포르)
- 🇹🇼 TW (대만)
- 🇭🇰 HK (홍콩)

**Google Trends 카테고리**
- 0: 전체 카테고리 (기본값)
- 3: 비즈니스 (Business)
- 12: 엔터테인먼트 (Entertainment)
- 16: 뉴스 (News)
- 17: 과학 기술 (Science & Tech)
- 18: 스포츠 (Sports)
- 20: 미용 & 패션 (Beauty & Fitness) ⭐ 주요 타겟
- 22: 금융 (Finance)
- 45: 게임 (Games)
- 66: 건강 (Health)
- 71: 쇼핑 (Shopping)
- 108: 여행 (Travel)

**GenAI 자동 생성 프로세스** (백엔드 서비스)
1. Google Trends에서 국가별 트렌드 키워드 크롤링
2. GenAI로 뷰티 연관 키워드 분석 및 상품 매핑
3. Nano Banana API로 히어로 배너 이미지 생성
4. 자동으로 `title`, `description`, `theme` 등 생성
5. 모든 데이터를 Supabase `promotions` 테이블에 자동 저장

**API 호출 예시**
```typescript
// API Route: /api/generate-promotion
const response = await fetch('/api/generate-promotion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    country_code: 'US',      // ISO 3166-1 alpha-2 코드
    category: '20'           // Google Trends 카테고리 ID (20 = Beauty & Fitness)
  })
})

// 서비스가 자동으로 promotions 테이블에 데이터 삽입
// 응답으로 생성된 프로모션 ID 반환
const { promotion_id } = await response.json()
```

### 3. 프로모션 삭제

**삭제**
- Delete 버튼 클릭
- 확인 다이얼로그 표시
- 확인 시 DB에서 삭제

```typescript
const { error } = await supabase
  .from('promotions')
  .delete()
  .eq('id', promotionId)
```

---

## 컴포넌트 구조

```
app/
└── admin/
    └── page.tsx                    // Admin 메인 페이지

app/api/
└── generate-promotion/
    └── route.ts                    // GenAI 프로모션 생성 API (미구현)

components/
├── admin/
│   ├── promotion-list.tsx          // 프로모션 목록 그리드
│   ├── promotion-card.tsx          // 개별 프로모션 카드
│   └── generate-dialog.tsx         // 국가코드+카테고리 선택 다이얼로그
```

---

## 상세 UI 명세

### Admin 메인 페이지 (`app/admin/page.tsx`)

```tsx
"use client"

import { useState } from "react"
import Header from "@/components/header"
import CountrySelector from "@/components/country-selector"
import PromotionList from "@/components/admin/promotion-list"
import GenerateDialog from "@/components/admin/generate-dialog"

export default function AdminPage() {
  const [selectedCountry, setSelectedCountry] = useState("US")
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleGenerateSuccess = () => {
    setIsGenerateOpen(false)
    setRefreshKey(prev => prev + 1) // 목록 새로고침
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-stone-900 tracking-tight">
            Promotion Management
          </h1>
          <p className="text-sm font-light text-stone-500 mt-2">
            Generate and manage AI-powered country-specific promotions
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <CountrySelector
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
          />

          <button
            onClick={() => setIsGenerateOpen(true)}
            className="px-6 py-2.5 bg-stone-900 text-white text-sm font-light
                       tracking-wide rounded-sm hover:bg-stone-800 transition"
          >
            Generate New Promotion
          </button>
        </div>

        {/* Promotion List */}
        <PromotionList country={selectedCountry} key={refreshKey} />

        {/* Generate Dialog */}
        <GenerateDialog
          isOpen={isGenerateOpen}
          onClose={() => setIsGenerateOpen(false)}
          onSuccess={handleGenerateSuccess}
        />
      </div>
    </div>
  )
}
```

### Promotion Card (`components/admin/promotion-card.tsx`)

```tsx
interface PromotionCardProps {
  promotion: {
    id: string
    plndp_no: string
    title: string
    description: string
    hero_banner_image_url: string
    trend_keywords: string[]
    created_at: string
  }
  onDelete: () => void
}

export default function PromotionCard({ promotion, onDelete }: PromotionCardProps) {
  return (
    <div className="border border-stone-200 rounded-sm overflow-hidden
                    hover:shadow-md transition group">
      {/* Image */}
      <div className="relative bg-stone-100 aspect-[16/9] overflow-hidden">
        <img
          src={promotion.hero_banner_image_url}
          alt={promotion.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-light text-stone-900 mb-1">
          {promotion.title}
        </h3>
        <p className="text-xs text-stone-500 line-clamp-2 mb-3">
          {promotion.description}
        </p>

        {/* Keywords */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {promotion.trend_keywords?.map((keyword, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-stone-100 text-stone-600
                         text-xs rounded-sm"
            >
              {keyword}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-stone-100">
          <button
            onClick={onDelete}
            className="w-full px-3 py-1.5 border border-red-300
                       text-red-600 text-xs font-light rounded-sm
                       hover:bg-red-50 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="px-4 py-2 bg-stone-50 border-t border-stone-100">
        <p className="text-xs text-stone-400">
          Created: {new Date(promotion.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
```

### Generate Dialog (`components/admin/generate-dialog.tsx`)

```tsx
"use client"

import { useState } from "react"

interface GenerateDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function GenerateDialog({ isOpen, onClose, onSuccess }: GenerateDialogProps) {
  const [countryCode, setCountryCode] = useState("US")
  const [category, setCategory] = useState("20") // Beauty & Fitness
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/generate-promotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country_code: countryCode,
          category: category
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate promotion')
      }

      const data = await response.json()
      console.log('Generated promotion:', data.promotion_id)

      onSuccess() // 성공 시 목록 새로고침
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-sm shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200">
          <h2 className="text-xl font-light text-stone-900 tracking-tight">
            Generate New Promotion
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            AI will create a promotion based on current trends
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5">
          {/* Country Code */}
          <div>
            <label className="block text-sm font-light text-stone-700 mb-2">
              Country Code *
            </label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-sm
                         text-sm font-light focus:outline-none focus:ring-2
                         focus:ring-stone-900"
            >
              <option value="KR">🇰🇷 KR - 대한민국</option>
              <option value="US">🇺🇸 US - 미국</option>
              <option value="JP">🇯🇵 JP - 일본</option>
              <option value="GB">🇬🇧 GB - 영국</option>
              <option value="CN">🇨🇳 CN - 중국</option>
              <option value="DE">🇩🇪 DE - 독일</option>
              <option value="FR">🇫🇷 FR - 프랑스</option>
              <option value="ES">🇪🇸 ES - 스페인</option>
              <option value="IT">🇮🇹 IT - 이탈리아</option>
              <option value="CA">🇨🇦 CA - 캐나다</option>
              <option value="AU">🇦🇺 AU - 호주</option>
              <option value="IN">🇮🇳 IN - 인도</option>
              <option value="BR">🇧🇷 BR - 브라질</option>
              <option value="MX">🇲🇽 MX - 멕시코</option>
              <option value="RU">🇷🇺 RU - 러시아</option>
              <option value="SG">🇸🇬 SG - 싱가포르</option>
              <option value="TW">🇹🇼 TW - 대만</option>
              <option value="HK">🇭🇰 HK - 홍콩</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-light text-stone-700 mb-2">
              Google Trends Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-sm
                         text-sm font-light focus:outline-none focus:ring-2
                         focus:ring-stone-900"
            >
              <option value="0">전체 카테고리</option>
              <option value="20">미용 & 패션 (Beauty & Fitness) ⭐</option>
              <option value="66">건강 (Health)</option>
              <option value="71">쇼핑 (Shopping)</option>
              <option value="3">비즈니스 (Business)</option>
              <option value="12">엔터테인먼트 (Entertainment)</option>
              <option value="16">뉴스 (News)</option>
              <option value="17">과학 기술 (Science & Tech)</option>
              <option value="18">스포츠 (Sports)</option>
              <option value="22">금융 (Finance)</option>
              <option value="45">게임 (Games)</option>
              <option value="108">여행 (Travel)</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-sm">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Info */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm">
            <p className="text-xs text-stone-600 leading-relaxed">
              This will automatically:
              <br />• Collect trending keywords from Google Trends
              <br />• Map relevant products using GenAI
              <br />• Generate hero banner images with Nano Banana
              <br />• Create promotion data in the database
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-stone-200 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-2.5 border border-stone-300 text-stone-700
                       text-sm font-light rounded-sm hover:bg-stone-50 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex-1 px-6 py-2.5 bg-stone-900 text-white text-sm
                       font-light rounded-sm hover:bg-stone-800 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

## 데이터베이스 연동

### Supabase Client 설정

기존 설정을 활용하거나 다음과 같이 구성:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### Database Operations

```typescript
// lib/promotions.ts

// Read - 국가별 프로모션 목록 조회
export async function getPromotionsByCountry(countryCode: string) {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('country_code', countryCode)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Delete - 프로모션 삭제
export async function deletePromotion(id: string) {
  const { error } = await supabase
    .from('promotions')
    .delete()
    .eq('id', id)

  if (error) throw error
}
```

### GenAI API Route (미구현)

```typescript
// app/api/generate-promotion/route.ts

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { country_code, category } = await request.json()

    // country_code: ISO 3166-1 alpha-2 (예: 'US', 'KR', 'JP')
    // category: Google Trends 카테고리 ID (예: '20' = Beauty & Fitness)

    // TODO: 구현 필요
    // 1. Google Trends에서 트렌드 키워드 크롤링
    //    - pytrends 라이브러리 사용 가능
    //    - country_code와 category로 필터링
    //
    // 2. GenAI로 키워드 분석 및 상품 매핑
    //    - Claude/GPT를 통해 뷰티 연관성 분석
    //    - 상품 DB와 매칭하여 추천 상품 세트 구성
    //
    // 3. Nano Banana API로 이미지 생성
    //    - 히어로 배너 이미지 생성
    //    - 프롬프트에 국가별 스타일 반영
    //
    // 4. Supabase promotions 테이블에 데이터 저장
    //    - plndp_no, title, description, theme 자동 생성
    //    - hero_banner_image_url, trend_keywords 등 저장

    // 예시 응답
    return NextResponse.json({
      success: true,
      promotion_id: 'generated-id',
      message: `Promotion generated for ${country_code} in category ${category}`
    })
  } catch (error) {
    console.error('Generate promotion error:', error)
    return NextResponse.json(
      { error: 'Failed to generate promotion', details: error.message },
      { status: 500 }
    )
  }
}
```

---

## 구현 순서

### Phase 1: Admin UI 구현 (프론트엔드)

1. **기본 레이아웃 구성**
   - `app/admin/page.tsx` 생성
   - Header 및 CountrySelector 재사용
   - 페이지 타이틀 및 설명 추가

2. **프로모션 목록 조회**
   - `components/admin/promotion-list.tsx` 구현
   - `components/admin/promotion-card.tsx` 구현
   - Supabase에서 국가별 데이터 조회
   - 그리드 레이아웃 구성

3. **생성 다이얼로그**
   - `components/admin/generate-dialog.tsx` 구현
   - 국가코드 + 카테고리 선택 UI
   - 로딩 상태 및 에러 처리

4. **삭제 기능**
   - 삭제 버튼 클릭 시 확인 다이얼로그
   - Supabase에서 데이터 삭제
   - 목록 자동 갱신

5. **UX 개선**
   - 로딩 스피너
   - 에러 메시지 표시
   - 빈 상태(Empty State) 처리

### Phase 2: GenAI 서비스 구현 (백엔드 - 별도 작업)

6. **API Route 생성**
   - `app/api/generate-promotion/route.ts` 생성

7. **Google Trends 크롤링**
   - 국가별 트렌드 키워드 수집
   - 뷰티/코스메틱 필터링

8. **GenAI 키워드 분석 & 상품 매핑**
   - LLM을 통한 키워드 분석
   - 상품 데이터와 매칭

9. **Nano Banana 이미지 생성**
   - 히어로 배너 이미지 자동 생성
   - 상세 페이지 이미지 생성

10. **Supabase 데이터 저장**
    - 생성된 모든 정보를 promotions 테이블에 저장

---

## 추가 고려사항

### 인증 & 권한
- Admin 페이지는 인증된 관리자만 접근 가능하도록 보호
- Supabase Auth 또는 Next.js 미들웨어 활용
- 추후 구현 예정

### 생성 진행 상태 모니터링
- GenAI 서비스 호출은 시간이 오래 걸릴 수 있음 (1-3분)
- WebSocket 또는 Polling으로 진행 상태 표시
- "Generating... (Step 1/4: Collecting trends)" 등

### 검색 & 필터링
- 제목, 키워드로 검색 기능
- 날짜 범위 필터링
- 카테고리별 필터링

### 페이지네이션
- 프로모션이 많아질 경우 페이지네이션 또는 Infinite Scroll 추가

### 프로모션 미리보기
- 생성된 프로모션을 사용자 화면에서 바로 확인
- Event Detail 페이지로 이동하는 링크 제공

### 재생성 기능
- 마음에 들지 않는 프로모션 재생성
- 동일 국가/카테고리로 다시 생성

---

## 예상 개발 시간

### Phase 1: Admin UI (프론트엔드만)
- 기본 레이아웃 및 조회: 1-2시간
- Generate Dialog 구현: 1시간
- 삭제 기능: 30분
- 스타일링 및 UX 개선: 1-2시간
- **Phase 1 총 예상 시간: 3.5-5.5시간**

### Phase 2: GenAI 서비스 (백엔드)
- Google Trends 크롤링: 2-3시간
- GenAI 키워드 분석 & 상품 매핑: 3-4시간
- Nano Banana 이미지 생성 연동: 2-3시간
- 통합 및 테스트: 2-3시간
- **Phase 2 총 예상 시간: 9-13시간**

### 전체 예상 시간
**12.5-18.5시간** (Phase 1 + Phase 2)

---

## 참고 파일

- `app/page.tsx` - 디자인 톤 참고
- `app/event/[plndpNo]/page.tsx` - 레이아웃 참고
- `docs/promotions_table_fields.md` - DB 스키마
- `docs/genai_promotion_prd.md` - 전체 프로젝트 맥락

---

## Appendix A: 지원 국가 & 카테고리 전체 목록

### 지원 국가 코드 (ISO 3166-1 alpha-2)

| 국가 | 코드 | 영문명 |
|------|------|--------|
| 🇰🇷 대한민국 | KR | Korea |
| 🇺🇸 미국 | US | United States |
| 🇯🇵 일본 | JP | Japan |
| 🇬🇧 영국 | GB | United Kingdom |
| 🇨🇳 중국 | CN | China |
| 🇩🇪 독일 | DE | Germany |
| 🇫🇷 프랑스 | FR | France |
| 🇪🇸 스페인 | ES | Spain |
| 🇮🇹 이탈리아 | IT | Italy |
| 🇨🇦 캐나다 | CA | Canada |
| 🇦🇺 호주 | AU | Australia |
| 🇮🇳 인도 | IN | India |
| 🇧🇷 브라질 | BR | Brazil |
| 🇲🇽 멕시코 | MX | Mexico |
| 🇷🇺 러시아 | RU | Russia |
| 🇸🇬 싱가포르 | SG | Singapore |
| 🇹🇼 대만 | TW | Taiwan |
| 🇭🇰 홍콩 | HK | Hong Kong |

**참고:** 영국의 경우 세부 지역 코드도 지원 (GB-ENG, GB-SCT, GB-WLS)

### Google Trends 카테고리 목록

| 카테고리 ID | 카테고리 이름 (한글) | 카테고리 이름 (영문) | 비고 |
|------------|---------------------|---------------------|------|
| 0 | 전체 카테고리 | All Categories | 기본값 |
| 3 | 비즈니스 | Business | |
| 12 | 엔터테인먼트 | Entertainment | |
| 16 | 뉴스 | News | |
| 17 | 과학 기술 | Science & Tech | |
| 18 | 스포츠 | Sports | |
| **20** | **미용 & 패션** | **Beauty & Fitness** | **⭐ 주요 타겟** |
| 22 | 금융 | Finance | |
| 45 | 게임 | Games | |
| 66 | 건강 | Health | |
| 71 | 쇼핑 | Shopping | |
| 108 | 여행 | Travel | |

**추천 카테고리:** 뷰티 커머스 특성상 카테고리 ID `20` (미용 & 패션)을 기본값으로 사용하는 것을 권장합니다.

---

## Appendix B: 구현 시 활용 가능한 상수 정의

개발 시 편의를 위해 다음과 같이 상수로 정의하여 사용할 수 있습니다:

```typescript
// lib/constants.ts

export const COUNTRIES = [
  { code: 'KR', name: '대한민국', emoji: '🇰🇷', nameEn: 'Korea' },
  { code: 'US', name: '미국', emoji: '🇺🇸', nameEn: 'United States' },
  { code: 'JP', name: '일본', emoji: '🇯🇵', nameEn: 'Japan' },
  { code: 'GB', name: '영국', emoji: '🇬🇧', nameEn: 'United Kingdom' },
  { code: 'CN', name: '중국', emoji: '🇨🇳', nameEn: 'China' },
  { code: 'DE', name: '독일', emoji: '🇩🇪', nameEn: 'Germany' },
  { code: 'FR', name: '프랑스', emoji: '🇫🇷', nameEn: 'France' },
  { code: 'ES', name: '스페인', emoji: '🇪🇸', nameEn: 'Spain' },
  { code: 'IT', name: '이탈리아', emoji: '🇮🇹', nameEn: 'Italy' },
  { code: 'CA', name: '캐나다', emoji: '🇨🇦', nameEn: 'Canada' },
  { code: 'AU', name: '호주', emoji: '🇦🇺', nameEn: 'Australia' },
  { code: 'IN', name: '인도', emoji: '🇮🇳', nameEn: 'India' },
  { code: 'BR', name: '브라질', emoji: '🇧🇷', nameEn: 'Brazil' },
  { code: 'MX', name: '멕시코', emoji: '🇲🇽', nameEn: 'Mexico' },
  { code: 'RU', name: '러시아', emoji: '🇷🇺', nameEn: 'Russia' },
  { code: 'SG', name: '싱가포르', emoji: '🇸🇬', nameEn: 'Singapore' },
  { code: 'TW', name: '대만', emoji: '🇹🇼', nameEn: 'Taiwan' },
  { code: 'HK', name: '홍콩', emoji: '🇭🇰', nameEn: 'Hong Kong' },
] as const

export const GOOGLE_TRENDS_CATEGORIES = [
  { id: '0', name: '전체 카테고리', nameEn: 'All Categories', isDefault: true },
  { id: '20', name: '미용 & 패션', nameEn: 'Beauty & Fitness', isRecommended: true },
  { id: '66', name: '건강', nameEn: 'Health' },
  { id: '71', name: '쇼핑', nameEn: 'Shopping' },
  { id: '3', name: '비즈니스', nameEn: 'Business' },
  { id: '12', name: '엔터테인먼트', nameEn: 'Entertainment' },
  { id: '16', name: '뉴스', nameEn: 'News' },
  { id: '17', name: '과학 기술', nameEn: 'Science & Tech' },
  { id: '18', name: '스포츠', nameEn: 'Sports' },
  { id: '22', name: '금융', nameEn: 'Finance' },
  { id: '45', name: '게임', nameEn: 'Games' },
  { id: '108', name: '여행', nameEn: 'Travel' },
] as const

export type CountryCode = typeof COUNTRIES[number]['code']
export type CategoryId = typeof GOOGLE_TRENDS_CATEGORIES[number]['id']
```

**사용 예시:**
```typescript
// Generate Dialog에서 활용
import { COUNTRIES, GOOGLE_TRENDS_CATEGORIES } from '@/lib/constants'

{COUNTRIES.map((country) => (
  <option key={country.code} value={country.code}>
    {country.emoji} {country.code} - {country.name}
  </option>
))}

{GOOGLE_TRENDS_CATEGORIES.map((category) => (
  <option key={category.id} value={category.id}>
    {category.name} ({category.nameEn})
    {category.isRecommended && ' ⭐'}
  </option>
))}
```
