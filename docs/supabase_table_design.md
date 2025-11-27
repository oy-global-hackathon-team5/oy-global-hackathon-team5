# Supabase 테이블 설계

## 개요
GenAI 기반 국가별 트렌드 자동 기획전 생성 시스템을 위한 데이터베이스 설계입니다.
프론트엔드(app/page.tsx, app/event/[plndpNo]/page.tsx)에서 국가별 프로모션 데이터를 조회하여 표시합니다.

---

## 테이블: `promotions`

### 테이블 목적
- 국가별로 생성된 기획전(프로모션) 데이터를 저장
- 히어로 배너 및 기획전 상세 페이지에 필요한 모든 정보 포함
- GenAI로 생성된 이미지 URL 및 상품 데이터 저장

### 스키마

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | `bigint` | PRIMARY KEY, AUTO INCREMENT | 프로모션 고유 ID |
| `plndp_no` | `varchar(50)` | NOT NULL, INDEXED | 기획전 번호 (예: "1958", "1959") |
| `country_code` | `varchar(10)` | NOT NULL, INDEXED | (ISO 3166-1 alpha-2 표준 코드) |
| `title` | `varchar(200)` | NOT NULL | 기획전 제목 (예: "BLACK FRIDAY MEGA SALE") |
| `description` | `text` | NULL | 기획전 설명 |
| `theme` | `text` | NULL | 기획전 테마 (GenAI가 반영한 테마 기록) |
| `hero_banner_image_url` | `varchar(500)` | NOT NULL | 히어로 배너에 표시될 이미지 URL (GenAI 생성) |
| `detail_image_urls` | `text[]` | NULL | 기획전 상세 페이지에 사용될 이미지 URL 배열 (GenAI 생성) |
| `products` | `jsonb` | NULL | 기획전에 포함된 상품 데이터 (JSON 형태) |
| `trend_keywords` | `text[]` | NULL | 해당 기획전의 기반이 된 트렌드 키워드 배열 |
| `created_at` | `timestamp with time zone` | DEFAULT now() | 생성 일시 |
| `updated_at` | `timestamp with time zone` | DEFAULT now() | 수정 일시 |

### 인덱스
```sql
CREATE INDEX idx_promotions_country_code ON promotions(country_code);
CREATE INDEX idx_promotions_plndp_no ON promotions(plndp_no);
```

### products JSON 구조 예시
```json
{
  "items": [
    {
      "id": "P001",
      "name": "Hydrating Serum",
      "price": 49.99,
      "discount_price": 24.99,
      "image_url": "https://...",
      "brand": "Beauty Co",
      "category": "Skincare"
    },
    {
      "id": "P002",
      "name": "Anti-Aging Cream",
      "price": 79.99,
      "discount_price": 39.99,
      "image_url": "https://...",
      "brand": "Glow Lab",
      "category": "Skincare"
    }
  ]
}
```

---

## SQL 생성 스크립트

```sql
CREATE TABLE promotions (
  id BIGSERIAL PRIMARY KEY,
  plndp_no VARCHAR(50) NOT NULL,
  country_code VARCHAR(10) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  theme TEXT,
  hero_banner_image_url VARCHAR(500) NOT NULL,
  detail_image_urls TEXT[],
  products JSONB,
  trend_keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_promotions_country_code ON promotions(country_code);
CREATE INDEX idx_promotions_plndp_no ON promotions(plndp_no);

-- updated_at 자동 업데이트를 위한 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_promotions_updated_at
BEFORE UPDATE ON promotions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 쿼리 예시

### 1. 특정 국가의 프로모션 조회
```sql
SELECT * FROM promotions
WHERE country_code = 'USA'
ORDER BY created_at DESC;
```

### 2. 히어로 배너용 최신 프로모션 조회
```sql
SELECT
  plndp_no,
  title,
  description,
  theme,
  hero_banner_image_url
FROM promotions
WHERE country_code = 'USA'
ORDER BY created_at DESC
LIMIT 1;
```

### 3. 특정 기획전 상세 정보 조회
```sql
SELECT * FROM promotions
WHERE plndp_no = '1958'
  AND country_code = 'USA';
```

### 4. 국가별 프로모션 개수 확인
```sql
SELECT
  country_code,
  COUNT(*) as promotion_count
FROM promotions
GROUP BY country_code;
```

---

## 확장 고려사항

### 향후 분리 가능한 테이블
현재는 단일 테이블로 시작하지만, 데이터가 증가하면 다음과 같이 분리 가능:

1. **products 테이블**: 별도의 상품 마스터 테이블
2. **promotion_products**: 프로모션-상품 매핑 테이블 (N:M)
3. **promotion_images**: 이미지를 별도 테이블로 관리

### RLS (Row Level Security) 설정
Supabase에서 국가별 데이터 접근 제어가 필요한 경우:
```sql
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON promotions
  FOR SELECT USING (true);

-- 향후 인증 추가 시
CREATE POLICY "Enable insert for authenticated users only" ON promotions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

---

## 데이터 마이그레이션 계획

1. **Mock 데이터 삽입**: 기존 app/event/[plndpNo]/page.tsx의 하드코딩된 데이터를 promotions 테이블에 삽입
2. **GenAI 통합**: 트렌드 수집 → 상품 매핑 → 이미지 생성 → DB 저장 파이프라인 구축
3. **프론트엔드 연동**: Supabase 클라이언트로 데이터 조회하도록 컴포넌트 수정
