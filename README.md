# Mockly Mobile - Turborepo Monorepo

Turborepo + pnpm workspace 기반의 React Native 모바일 애플리케이션 monorepo 프로젝트입니다.

## 프로젝트 구조

```
mockly-mobile/
├── apps/
│   ├── mobile/              # React Native 모바일 앱
│   └── storybook/           # Storybook 문서화
├── packages/
│   ├── entities/            # 공통 엔티티 타입 정의
│   ├── design-system/       # 디자인 시스템 컴포넌트
│   ├── api/                 # API 클라이언트 및 서비스
│   └── typescript-config/   # 공유 TypeScript 설정
└── .env.*                   # 환경별 환경변수 파일
```

## 주요 구성 요소

### Apps

#### mobile

React Native 모바일 애플리케이션입니다.

**주요 기술:**

- React Native 0.82.1
- NativeWind (Tailwind CSS for React Native)
- React Native Dotenv (환경변수 관리)
- Design System 패키지 통합

**실행 방법:**
Android Studio와 앱 에뮬레이터가 설치되어 있어야 실행 가능합니다.

```bash
# Metro bundler 시작 (개발 모드, .env.dev 사용)
pnpm dev

# Android/iOS 실행 (별도 터미널)
cd apps/mobile
pnpm android  # Android 실행
pnpm ios      # iOS 실행
```

#### storybook

디자인 시스템 컴포넌트를 문서화하고 테스트하는 Storybook 앱입니다.

**주요 기술:**

- Storybook React Native Web
- Vite 빌더
- Design System 컴포넌트 통합

**실행 방법:**
Android Studio와 앱 에뮬레이터가 설치되어 있어야 실행 가능합니다.

```bash
# 루트에서 실행
pnpm storybook:web  # 웹을 통해 디자인 시스템 확인하는 방법

pnpm storybook # 안드로이드로 디자인 시스템 확인하는 방법

# 또는 직접 실행
cd apps/storybook
pnpm storybook:web
pnpm storybook:android
pnpm storybook:ios
```

### Packages

#### @mockly/entities

공통으로 사용되는 타입과 인터페이스를 정의합니다.

**포함 내용:**

- User 타입
- Mock 타입
- 기타 도메인 엔티티

#### @mockly/design-system

재사용 가능한 React Native 컴포넌트 라이브러리입니다.

**포함 컴포넌트:**

- Button
- Text
- Input

**테마 시스템:**

- `src/theme/index.ts`에서 중앙 관리
- Tailwind CSS 설정과 자동 동기화
- Colors, Spacing, Typography, BorderRadius 제공
- Storybook에서 시각적으로 확인 가능

#### @mockly/api

API 통신을 위한 클라이언트와 서비스 레이어입니다.

**포함 내용:**

- ApiClient (Axios 기반)
- UserService
- MockService
- 인터셉터 및 에러 핸들링

#### @mockly/typescript-config

공유 TypeScript 설정 파일입니다.

**포함 내용:**

- base.json (기본 설정)
- react-native.json (React Native 설정)

## 환경변수 설정

프로젝트는 세 가지 환경을 지원합니다:

- `.env.dev`: 개발 환경
- `.env.stage`: 스테이징 환경
- `.env.prod`: 운영 환경

### 환경변수 자동 로드

- **개발 모드 (`pnpm dev`)**: `.env.dev` 자동 로드
- **빌드 (`pnpm build`)**: `.env.prod` 자동 로드
- `babel.config.js`의 `react-native-dotenv` 플러그인으로 관리

### 환경변수 파일 예시

각 환경별로 `.env.*` 파일을 생성하고 필요한 환경변수를 설정하세요.

```bash
# .env.dev 예시
NODE_ENV=development
API_URL=your_api_url_here
# 기타 필요한 환경변수...
```

## 시작하기

### 1. 의존성 설치

먼저 pnpm을 설치합니다 (아직 설치하지 않은 경우):

```bash
npm install -g pnpm
```

루트 디렉토리에서 의존성을 설치합니다:

```bash
pnpm install
```

### 2. 패키지 빌드

모든 패키지를 빌드합니다:

```bash
pnpm run build
```

### 3. 개발 모드 실행

#### Mobile 앱 개발:

```bash
# Metro bundler 시작 (mobile만 실행, .env.dev 사용)
pnpm dev

# 별도 터미널에서 Android/iOS 실행
cd apps/mobile
pnpm android  # 또는 pnpm ios
```

#### Storybook 개발:

```bash
# Storybook만 실행
pnpm dev:storybook
```

#### 개별 앱 실행:

```bash
# Mobile Metro bundler
cd apps/mobile && pnpm dev

# Storybook
cd apps/storybook && pnpm dev
```

## 주요 명령어

### 개발

```bash
pnpm dev              # Mobile 앱 개발 모드 (Metro bundler)
pnpm dev:storybook    # Storybook 개발 모드
```

### 빌드

```bash
pnpm build            # 모든 패키지 빌드 (production 환경)
```

### 코드 품질

```bash
pnpm lint             # ESLint 검사
pnpm lint:fix         # ESLint 자동 수정
pnpm format           # Prettier 포맷팅
pnpm format:check     # Prettier 체크 (CI용)
pnpm type-check       # TypeScript 타입 체크
```

### 테스트

```bash
pnpm test             # 전체 테스트 실행
```

### 클린

```bash
pnpm clean            # node_modules 및 빌드 산출물 삭제
```

## 새 패키지 추가하기

1. `packages/` 디렉토리에 새 폴더 생성
2. `package.json` 생성 (name은 `@mockly/[package-name]` 형식)
3. 필요한 경우 `tsconfig.json` 생성
4. `src/index.ts` 진입점 생성
5. 루트에서 `pnpm install` 실행

## 패키지 간 의존성

pnpm workspace를 사용하여 패키지는 다음과 같이 서로를 참조할 수 있습니다:

```json
{
  "dependencies": {
    "@mockly/entities": "workspace:*",
    "@mockly/design-system": "workspace:*"
  }
}
```

## Git Hooks & 코드 품질

### Husky + lint-staged

프로젝트에 Git Hooks가 설정되어 있어 코드 품질을 자동으로 관리합니다.

#### Pre-commit Hook

커밋 전에 자동 실행:

- **lint-staged**: 변경된 파일에 대해 ESLint 자동 수정 + Prettier 포맷팅
- **type-check**: 전체 프로젝트 TypeScript 타입 체크

#### Commit-msg Hook

커밋 메시지 검증:

```bash
# 올바른 형식
[feat] 로그인 기능 추가
[fix] 버튼 클릭 이벤트 수정
[docs] README 업데이트

# 사용 가능한 타입
feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
```

### ESLint

- TypeScript, React, React Native 규칙 적용
- Prettier와 통합
- 커밋 시 자동 수정

### Prettier

- 일관된 코드 포맷팅
- `.prettierrc` 설정 파일로 관리
- 커밋 시 자동 포맷팅

## Tailwind CSS (NativeWind)

Design System의 테마 설정이 Tailwind CSS와 자동으로 동기화됩니다.

### 사용 방법

```tsx
import { View, Text } from 'react-native';

// Tailwind 클래스 사용
<View className="bg-primary p-md rounded-lg">
  <Text className="text-xl font-semibold text-white">Hello World</Text>
</View>;
```

### 사용 가능한 클래스

- **Colors**: `bg-primary`, `text-secondary`, `border-error` 등
- **Spacing**: `p-xs`, `m-md`, `gap-lg` 등
- **Font Size**: `text-sm`, `text-lg` 등
- **Font Weight**: `font-regular`, `font-bold` 등
- **Border Radius**: `rounded-sm`, `rounded-lg` 등

모든 값은 `packages/design-system/src/theme/index.ts`에서 관리됩니다.

## 환경 요구사항

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- React Native 개발 환경 (Android Studio / Xcode)

## 주요 기술 스택

- **React Native** 0.82.1
- **TypeScript** 5.9.3
- **Turborepo** 2.6.0 (Monorepo 관리)
- **NativeWind** 4.2.1 (Tailwind CSS)
- **Storybook** 10.0.5
- **Husky** 9.1.7 (Git Hooks)
- **Commitlint** 20.1.0 (커밋 메시지 검증)
- **lint-staged** 16.2.6 (자동 코드 품질 관리)

## 라이선스

MIT
