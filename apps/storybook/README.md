# Mockly Storybook (디자인 시스템/컴포넌트 문서화)

## 🚀 빠른 시작

1. **의존성 설치**
   ```bash
   pnpm install
   ```
2. **스토리북 정적 파일 생성 (최초 1회 필수)**
   ```bash
   pnpm storybook-generate
   # storybook-static/ 폴더가 생성되어야 웹/배포 가능
   ```
3. **스토리북 실행**
   ```bash
   pnpm storybook-generate
   pnpm storybook:web      # 웹 프리뷰
   pnpm storybook:android # 안드로이드 에뮬레이터
   ```
4. **Chromatic 배포**
   ```bash
   pnpm chromatic
   # .env 또는 .env.dev에 CHROMATIC_PROJECT_TOKEN 등 환경변수 필요
   ```

---

## 📂 주요 폴더 구조

```
apps/storybook/
├── src/                # 공통 스토리/컴포넌트
│   ├── AnimationOverview.stories.tsx
│   ├── ComponentsOverview.stories.tsx
│   ├── FoundationOverview.stories.tsx
│   ├── LayoutOverview.stories.tsx
│   └── screens/
├── storyForWeb/        # 웹 전용 스토리
│   └── Welcome.stories.tsx
├── storyForMobile/     # 모바일 전용 스토리
│   └── WelcomeMoible.stories.tsx
├── storybook-static/   # 정적 빌드 결과물 (자동 생성)
├── public/             # 폰트/이미지 등
├── __tests__/          # 스토리북 테스트
```

---

## ✨ 주요 기능

- 디자인 시스템 컴포넌트 실시간 프리뷰/문서화
- 다크/라이트 모드 토글 지원
- 테마/컬러 토큰 확인 가능
- Storybook에서 바로 컴포넌트 props/variant 테스트
- 웹/모바일 스토리 분리 관리
- **컴포넌트 개별 스토리**는 `@mockly/design-system` 패키지에서 선언
- **페이지 단위/전체 개요 스토리**는 Storybook 프로젝트(`apps/storybook`)에서 관리

---

## 🧪 테스트

- 스토리북 자체 테스트: `__tests__/storybook.test.ts`
- 컴포넌트 단위/통합 테스트는 각 패키지(`@mockly/design-system`)에서 관리

---

## 📑 기타 참고

- 디자인 시스템 전체 구조/가이드: [루트 README](../../README.md) 및 [@mockly/design-system]
- 스토리북 배포/공유: Chromatic 등 외부 서비스 연동 가능
- Chromatic 배포 환경변수 예시:
  ```env
  // .env
  CHROMATIC_PROJECT_TOKEN=your_chromatic_token
  CHROMATIC_USER_ID=your_chromatic_user_id
  ```

---

> 공통 규칙, 커밋 메시지, AGENTS 안내 등은 [루트 README](../../README.md)에서 확인하세요!
