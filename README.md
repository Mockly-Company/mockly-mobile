# Mockly Mobile

Turborepo + pnpm workspace 기반의 React Native 모바일 애플리케이션 monorepo 프로젝트입니다.

## 프로젝트 구조

```
mockly-mobile/
├── apps/
│   ├── mobile/                    # React Native 앱 (메인 애플리케이션)
│   │   ├── src/
│   │   │   ├── app/              # 애플리케이션 레이어 (screens, navigation, components)
│   │   │   ├── features/         # 도메인 기능 (auth, chat 등)
│   │   │   ├── lib/              # 라이브러리 래퍼 및 유틸리티
│   │   │   └── shared/           # 공유 리소스 (constants, utils)
│   │   └── __tests__/            # 테스트 파일
│   └── storybook/                 # 디자인 시스템 문서용 Storybook
├── packages/
│   ├── entities/                  # 공유 TypeScript 타입과 인터페이스
│   ├── design-system/             # 재사용 가능한 React Native 컴포넌트
│   ├── api/                       # API 클라이언트 및 서비스 레이어
│   ├── utils/                     # 공유 유틸리티 함수
│   └── typescript-config/         # 공유 TypeScript 설정
└── .env.*                         # 환경별 구성 파일
```

### 디렉토리 구조 (Feature-Sliced Design 영향)

Mobile 앱은 계층화된 아키텍처를 따릅니다:

```
src/
├── app/                    # 애플리케이션 레이어
│   ├── screens/           # 화면 컴포넌트
│   ├── navigation/        # 내비게이션 설정
│   └── components/        # 앱 전용 컴포넌트
├── features/              # 도메인 기능
│   └── auth/             # 인증 기능
│       ├── hooks.ts      # useAuth 훅
│       ├── store.ts      # Zustand 스토어
│       ├── types.ts      # 타입 정의
│       └── errors.ts     # 에러 정의
├── lib/                   # 외부 라이브러리 래퍼
│   └── app-auth/         # 인증 라이브러리
│       ├── base/         # 추상 클래스
│       ├── providers/    # Provider 구현체
│       └── index.ts
└── shared/                # 공유 리소스
    ├── constants/        # 상수
    └── utils/            # 유틸리티
```

## 주요 구성 요소

### Apps

#### mobile

React Native 모바일 애플리케이션입니다.

**주요 기술:**

- React Native 0.82.1
- twrnc 4.11.1 (Tailwind CSS for React Native)
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
- `twrnc` + `tailwind.config.js`로 스타일 관리
- Colors, Spacing, Typography, BorderRadius 제공
- Storybook에서 시각적으로 확인 가능

#### @mockly/api

API 통신을 위한 클라이언트와 서비스 레이어입니다.

**포함 내용:**

- ApiClient (Axios 기반)
- UserService
- MockService
- 인터셉터 및 에러 핸들링

#### @mockly/utils

공유 유틸리티 함수를 제공합니다.

**포함 내용:**

- `cn`: classnames 유틸리티 (클래스명 병합)
- 기타 공통 헬퍼 함수

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
- **빌드 (`pnpm build:android`, `pnpm build:ios`)**: `.env.prod` 자동 로드
- `babel.config.js`의 `react-native-dotenv` 플러그인으로 관리
- `NODE_ENV`는 자동으로 설정되므로 수동 설정 불필요

### 환경변수 파일 예시

각 환경별로 `.env.*` 파일을 생성하고 필요한 환경변수를 설정하세요.

```bash
# apps/mobile/.env.dev 예시
GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
GOOGLE_IOS_CLIENT_ID=your_google_ios_client_id
GOOGLE_ANDROID_CLIENT_ID=your_google_android_client_id
API_BASE_URL=http://localhost:8080
```

### 환경변수 사용 방법

```typescript
import { API_BASE_URL, GOOGLE_WEB_CLIENT_ID } from '@env';

console.log(API_BASE_URL); // http://localhost:8080
```

**주의사항:**

- 민감 정보는 `.env.*` 파일에 저장하고 Git에 커밋하지 마세요
- 서비스 초기화 시 필수 환경변수를 검증하세요

## 아키텍처 패턴

### Path Alias (tsconfig.json)

프로젝트는 절대 경로 import를 사용합니다:

```typescript
import { AuthUser } from '@features/auth/types';
import { GoogleAuthService } from '@lib/app-auth/providers/GoogleAuthService';
import { HomeScreen } from '@app/screens/home/HomeScreen';
import { API_BASE_URL } from '@env';
import { cn } from '@mockly/utils';
```

**사용 가능한 Alias:**

- `@app/*`: src/app/\* (애플리케이션 레이어)
- `@features/*`: src/features/\* (도메인 기능)
- `@lib/*`: src/lib/\* (라이브러리 래퍼)
- `@shared/*`: src/shared/\* (공유 리소스)
- `@mockly/*`: workspace 패키지

### 인증 아키텍처 (Provider Pattern + PKCE)

OAuth 2.0 PKCE 기반 인증을 Provider Pattern으로 구현했습니다:

```
BaseAuthService (추상 클래스)
    ↓
GoogleAuthService (구현체)
AppleAuthService (구현체)
    ↓
getAuthService(provider) (Factory)
    ↓
useAuthStore (Zustand)
    ↓
useAuth (Custom Hook)
```

**주요 특징:**

- PKCE (Proof Key for Code Exchange) 기반 보안
- Provider 패턴으로 확장 가능한 구조
- Zustand로 전역 상태 관리
- Custom Hook으로 캡슐화

### 컴포넌트 패턴 (cva + tw)

디자인 시스템 컴포넌트는 `class-variance-authority`와 `twrnc`를 사용합니다:

```tsx
import { cva, type VariantProps } from 'cva';
import { tw } from '../lib/tw';

const buttonVariants = cva('items-center justify-center rounded-md', {
  variants: {
    variant: {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
    },
    size: {
      small: 'py-sm px-md',
      medium: 'py-md px-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

export const Button: React.FC<ButtonProps> = ({ variant, size, ...props }) => {
  const buttonStyle = useMemo(() => tw.style(buttonVariants({ variant, size })), [variant, size]);

  return <TouchableOpacity style={buttonStyle} {...props} />;
};
```

### 상태 관리 (Zustand)

```typescript
import { create } from 'zustand';

interface State {
  user: User | null;
  isLoading: boolean;
}

interface Actions {
  signIn: (provider: AuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
}

type AuthStore = State & Actions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,

  signIn: async provider => {
    set({ isLoading: true });
    // 인증 로직...
  },

  signOut: async () => {
    // 로그아웃 로직...
  },
}));
```

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
pnpm android          # Android 앱 실행 + adb reverse
pnpm ios              # iOS 앱 실행
pnpm dev:storybook    # Storybook 개발 모드
```

### 빌드

```bash
pnpm build            # TypeScript 타입 체크
pnpm build:android    # Android 프로덕션 번들 생성
pnpm build:ios        # iOS 프로덕션 번들 생성
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
pnpm test:mobile      # Mobile 앱 테스트만 실행
pnpm test:watch       # Watch 모드
pnpm test:coverage    # 커버리지 포함
pnpm test:verbose     # 상세 로그 포함
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

### 커밋 메시지 규칙

**형식**: `[type] subject`

**사용 가능한 타입**:

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 코드 리팩터링
- `test`: 테스트 코드
- `chore`: 빌드 작업, 패키지 매니저 설정
- `perf`: 성능 개선
- `ci`: CI 설정 변경
- `build`: 빌드 시스템 변경
- `revert`: 커밋 되돌리기

**예시**:

```
[feat] Google 로그인 기능 추가
[fix] 토큰 갱신 로직 수정
[test] Auth Store 테스트 추가
```

### Husky + lint-staged

프로젝트에 Git Hooks가 설정되어 있어 코드 품질을 자동으로 관리합니다.

#### Pre-commit Hook

커밋 전에 자동 실행:

- **lint-staged**: 변경된 파일에 대해 ESLint 자동 수정 + Prettier 포맷팅
- **type-check**: 전체 프로젝트 TypeScript 타입 체크

#### Commit-msg Hook

커밋 메시지 검증 (commitlint 적용)

### TypeScript

- **Strict 모드** 활성화
- 명시적 `any` 금지 (경고만 표시)
- 사용하지 않는 변수는 `_`로 시작해야 함
- 공통 설정은 `@mockly/typescript-config` 사용

### ESLint

- TypeScript, React, React Native 규칙 적용
- Prettier와 통합
- 커밋 시 자동 수정
- 화살표 함수 매개변수 괄호: avoid (한 개일 경우)
- `_` 접두사 사용 시 사용하지 않는 변수 무시

### Prettier

코드 스타일 설정:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

## 테스트 전략

### 테스트 구조

```
__tests__/
├── features/
│   └── auth/
│       ├── store.test.tsx        # Auth Store 통합 테스트
│       └── GoogleAuth.test.ts    # GoogleAuthService 단위 테스트
├── navigation/
│   └── BottomTabNavigator.test.tsx
├── ui/
│   └── screens/
│       └── MyPageScreen.test.tsx
└── utils/
    └── stringUtils.test.ts
```

### 테스트 원칙

1. **커버리지보다 실용성**: 단순 setter 테스트 지양
2. **통합 테스트 선호**: 실제 사용 케이스 중심
3. **에러 케이스 포함**: 네트워크 오류, Storage 실패 등 검증
4. **Mock 공통화**: 반복되는 Mock 설정은 헬퍼 함수로 추출
5. **타입 안전**: `jest.fn<ReturnType, Parameters>()` 형식 사용

### 테스트 실행

```bash
pnpm test              # 전체 테스트
pnpm test:watch        # Watch 모드
pnpm test:coverage     # 커버리지 포함
pnpm test:verbose      # 상세 로그 포함
```

## 스타일링 (twrnc)

Design System은 `twrnc`를 사용하여 Tailwind CSS 기반의 스타일링을 제공합니다.

### 사용 방법

```tsx
import { View, Text } from 'react-native';
import { tw } from '@mockly/design-system';

// twrnc를 통한 Tailwind 스타일 사용
<View style={tw`bg-primary p-md rounded-lg`}>
  <Text style={tw`text-xl font-semibold text-white`}>Hello World</Text>
</View>;
```

### 사용 가능한 클래스

- **Colors**: `bg-primary`, `text-secondary`, `border-error` 등
- **Spacing**: `p-xs`, `m-md`, `gap-lg` 등
- **Font Size**: `text-sm`, `text-lg` 등
- **Font Weight**: `font-regular`, `font-bold` 등
- **Border Radius**: `rounded-sm`, `rounded-lg` 등

모든 값은 `packages/design-system/src/theme/index.ts`에서 관리됩니다.

### 스타일링 규칙

1. **테마 토큰 우선**: 값 하드코딩 금지, 테마 토큰 또는 `cva`, `tw` 사용
2. **스타일 우선순위**: `tw`, `cva` 함수 우선, 필요 시 `StyleSheet.create` 사용 (inline 객체 금지)
3. **컴포넌트 props**: React Native 기본 컴포넌트에서 확장 (`extends TouchableOpacityProps`)

## 라이선스

MIT
