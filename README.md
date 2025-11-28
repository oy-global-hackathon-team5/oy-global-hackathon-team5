# AI-Powered Global Trend Promotion Generator for Olive Young

## 🎯 Project Overview

글로벌 시장에서 국가별로 빠르게 변화하는 트렌드를 실시간으로 포착하고, 이를 기반으로 올리브영 상품 프로모션을 자동 생성하는 GenAI 솔루션입니다.

### Problem Statement
- 국가별로 검색되는 키워드와 트렌드가 모두 다름
- 빠르게 변화하는 트렌드를 수동으로 파악하는 데 많은 시간과 비용 소요
- 트렌드 분석 → 상품 매칭 → 프로모션 기획 → 디자인까지의 전 과정이 비효율적

### Solution
Google Trends의 실시간 데이터를 활용하여 **검색 키워드 수집 → 트렌드 파악 → 상품 매칭 → 프로모션 기획 → 디자인 생성**의 전 과정을 원클릭으로 자동화

**Example**: 미국에서 "비건" 키워드가 반복적으로 검색된다면, 해당 트렌드를 포착하여 비건 관련 뷰티&헬스케어 제품 기획전을 자동으로 생성

## 🏗️ System Architecture

### Workflow
1. **Data Collection**: Google Trends에서 실시간 트렌드 키워드 크롤링 (Playwright)
2. **Trend Analysis**: 수집된 키워드를 통한 현황 분석
3. **Product Mapping**: Gemini 2.5 Pro를 활용한 트렌드-상품 데이터 매핑
4. **Promotion Planning**: AI 기반 프로모션 기획
5. **Image Generation**: Gemini 2.5 Flash (NanoBanana)를 활용한 프로모션 이미지 생성
6. **Storage & Display**: Supabase DB 저장 및 프론트엔드 노출

### Tech Stack

**Frontend & Backend**
- Next.js (Full-Stack Framework)
- Vercel (Deployment)

**Database**
- Supabase

**AI/ML**
- Gemini 2.5 Pro (Thinking Model for Trend Analysis & Product Mapping)
- Gemini 2.5 Flash - NanoBanana (Image Generation)
- Vertex AI Studio (Prompt Engineering & Testing)

**Data Collection**
- Playwright (TypeScript)
- CSV Data Processing

## 💡 Key Features

### 1. Real-time Trend Crawling
- Playwright 기반 TypeScript CLI 프로그램
- Google Trends 직접 크롤링
- CSV 형식으로 데이터 저장

### 2. AI-Powered Product Mapping
- 구조화되지 않은 데이터 환경에서 알고리즘 대신 LLM 활용
- Gemini 2.5 Pro의 사고 능력을 활용한 정교한 매핑
- [System Prompt Design 문서](링크) 참고

### 3. Automated Promotion Generation
- 트렌드 키워드 기반 프로모션 컨셉 자동 기획
- 상품 이미지를 활용한 프로모션 배너 생성
- 국가별 맞춤형 콘텐츠 제공

## 📸 Demo
|JP|US|
|--|--|
| <img width="1024" height="559" alt="image" src="https://github.com/user-attachments/assets/dc60391c-bad4-42b9-b3dc-9d7cfb996f82" /> | <img width="1024" height="1024" alt="image" src="https://github.com/user-attachments/assets/ba13d2cd-b527-40a1-88c7-c101bd572cee" /> |

<img width="1301" height="1254" alt="Promotion Generation Example" src="https://github.com/user-attachments/assets/b8ba1c75-4a7c-4138-9244-7395bc27258f" />

## 🔍 Key Challenges & Solutions

### Challenge 1: 비구조화된 데이터 매핑
**Problem**: 트렌드 키워드와 상품 데이터 간의 관계가 명확한 규칙으로 정의되지 않음

**Solution**: 
- Gemini 2.5 Pro의 사고 능력을 활용한 의미적 매핑
- Vertex AI Studio를 통한 반복적인 프롬프트 최적화
- 다양한 시스템 프롬프트 비교 테스트

### Challenge 2: 실시간 트렌드 데이터 수집
**Problem**: Google Trends의 동적 웹페이지 크롤링 난이도

**Solution**:
- Playwright를 활용한 동적 콘텐츠 크롤링
- CLI 기반 자동화 프로그램 구현
- CSV 형식의 체계적인 데이터 관리

### Challenge 3: 프로모션 이미지 품질
**Problem**: 생성된 이미지의 일관성과 품질 보장

**Solution**:
- NanoBanana 모델의 프롬프트 엔지니어링
- 상품 이미지를 활용한 컨텍스트 제공
- 반복적인 프롬프트 개선

## 📝 License

This project is part of the Olive Young Global GenAI Hackathon.

---

**Built with ❤️ by Team 5 at Olive Young Global GenAI Hackathon**
