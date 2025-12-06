# Mockly Mobile - 코드베이스 개요

이 문서는 Mockly Mobile 프로젝트에서 AI 어시스턴트(예: Claude)가 작업할 때 필요한 핵심 정보를 제공합니다.

## 프로젝트 구조

```
mockly-mobile/
├── apps/
│ ├── mobile/ # React Native 앱 (메인 애플리케이션)
│ │ ├── src/
│ │ │ ├── app/ # 애플리케이션 레이어 (screens, navigation, components)
│ │ │ ├── features/ # 도메인 기능 (auth, chat 등)
│ │ │ ├── lib/ # 라이브러리 래퍼 및 유틸리티
│ │ │ └── shared/ # 공유 리소스 (constants, utils)
│ │ └── tests/ # 테스트 파일
│ └── storybook/ # 디자인 시스템 문서용 Storybook
├── packages/
│ ├── entities/ # 공유 TypeScript 타입과 인터페이스
│ ├── design-system/ # 재사용 가능한 React Native 컴포넌트
│ ├── api/ # API 클라이언트 및 서비스 레이어
│ ├── utils/ # 공유 유틸리티 함수
│ └── typescript-config/ # 공유 TypeScript 설정
└── .env.* # 환경별 구성 파일
```

### Apps

- **mobile**: React Native 0.82.1 앱, twrnc 사용
- **storybook**: Storybook React Native Web, 컴포넌트 문서용

### Packages (workspace:\*)

- `@mockly/entities`: 도메인 타입 및 인터페이스 (User, Mock 등)
- `@mockly/design-system`: UI 컴포넌트 라이브러리 + 테마 시스템
- `@mockly/api`: Axios 기반 API 클라이언트, 인터셉터 포함
- `@mockly/utils`: 공유 유틸리티 함수 (cn 등)
- `@mockly/typescript-config`: 공유 TypeScript 설정

## 기술 스택

**Monorepo**: Turborepo 2.6.0 + pnpm workspace

**런타임**: React Native 0.82.1, React 19.1.1

**언어**: TypeScript 5.9.3

**스타일링**: twrnc 4.11.1, class-variance-authority 0.7.1

**빌드**: Metro bundler

**테스트**: Jest 30.2.0 + @testing-library/react-native 13.3.3

**상태 관리**: Zustand 5.0.8

**내비게이션**: @react-navigation/native 7.1.20 + @react-navigation/bottom-tabs 7.8.5

**인증**: react-native-app-auth 8.1.0 (PKCE 기반 OAuth)

**문서화**: Storybook 10.0.5

### 주요 외부 의존성

- `@react-native-async-storage/async-storage`: 2.2.0 (로컬 스토리지)
- `base-64`: 1.0.0 (JWT 디코딩)
- `react-native-safe-area-context`: 5.4.0 (안전 영역 처리)
- `react-native-dotenv`: 3.4.11 (환경 변수 관리)

### 개발 도구

- **ESLint** 9.39.1 (TypeScript, React, React Native 플러그인 포함)
- **Prettier** 3.6.2 (코드 포맷팅)
- **Husky** 9.1.7 (Git 훅 관리)
- **Commitlint** 20.1.0 (커밋 메시지 검증)
- **lint-staged** 16.2.6 (사전 커밋 린트 실행)

## 코드 규칙

### 커밋 메시지

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

### TypeScript

- **Strict 모드** 활성화
- 명시적 `any` 금지 (경고만 표시)
- 사용하지 않는 변수는 `_`로 시작해야 함
- 공통 설정은 `@mockly/typescript-config` 사용

### 코드 스타일 (Prettier)

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

### ESLint 규칙

- TypeScript 추천 규칙
- React / React Native 권장 규칙
- Prettier 통합
- 화살표 함수 매개변수 괄호: avoid (한 개일 경우)
- \_ 접두사 사용 시 사용하지 않는 변수 무시

## 아키텍처 패턴

프로젝트 디렉토리 구조 (Feature-Sliced Design 영향)

```
src/
├── app/                    # 애플리케이션 레이어
│   ├── screens/           # 화면 컴포넌트
│   ├── navigation/        # 내비게이션 설정
│   └── components/        # 앱 전용 컴포넌트
├── features/              # 도메인 기능
│   └── auth/             # 인증 기능
│       ├── hooks.ts     # useAuth 훅
│       ├── store.ts     # Zustand 스토어
│       ├── types.ts     # 타입 정의
│       └── errors.ts    # 에러 정의
├── lib/                   # 외부 라이브러리 래퍼
│   └── app-auth/         # 인증 라이브러리
│       ├── base/         # 추상 클래스
│       ├── providers/    # Provider 구현체
│       └── index.ts
└── shared/                # 공유 리소스
    ├── constants/        # 상수
    └── utils/            # 유틸리티
```

Path Alias (tsconfig.json)

```js
import { AuthUser } from '@features/auth/types';
import { GoogleAuthService } from '@lib/app-auth/providers/GoogleAuthService';
import { HomeScreen } from '@app/screens/home/HomeScreen';
import { API_BASE_URL } from '@env';
import { cn } from '@mockly/utils';
```

- @app/_: src/app/_ (애플리케이션 레이어)
- @features/_: src/features/_ (도메인 기능)
- @lib/_: src/lib/_ (라이브러리 래퍼)
- @shared/_: src/shared/_ (공유 리소스)
- @mockly/\*: workspace 패키지

인증 아키텍처 (Provider Pattern + PKCE)
구조:

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

### 공통 패턴

디자인 시스템 컴포넌트 구조

```tsx
import React, { PropsWithChildren, useMemo } from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { cva, type VariantProps } from 'cva';

import { tw } from '../lib/tw';

const buttonVariants = cva({
  base: 'items-center justify-center rounded-md',
  variants: {
    variant: {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      outline: 'bg-transparent border border-primary',
    },
    size: {
      small: 'py-sm px-md',
      medium: 'py-md px-lg',
      large: 'py-md px-xl',
    },
    disabled: {
      true: 'opacity-50',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

const buttonTextVariants = cva({
  base: 'font-semibold',
  variants: {
    variant: {
      primary: 'text-white',
      secondary: 'text-white',
      outline: 'text-primary',
    },
    size: {
      small: 'text-sm',
      medium: 'text-md',
      large: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

export interface ButtonProps
  extends TouchableOpacityProps,
    Omit<VariantProps<typeof buttonVariants>, 'disabled'>,
    PropsWithChildren {}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  style,
  disabled,
  ...props
}) => {
  const buttonStyle = useMemo(
    () => tw.style(buttonVariants({ variant, size, disabled })),
    [variant, size, disabled]
  );
  const textStyle = useMemo(() => tw.style(buttonTextVariants({ variant, size })), [variant, size]);

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      {...props}
    >
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};
```

Zustand 스토어

```tsx
import { create } from 'zustand';

interface State {
  data: Data | null;
  isLoading: boolean;
}

interface Actions {
  fetchData: () => Promise<void>;
  reset: () => void;
}

type Store = State & Actions;

export const useStore = create<Store>((set, get) => ({
  // 초기 상태
  data: null,
  isLoading: false,

  // 액션
  fetchData: async () => {
    set({ isLoading: true });
    try {
      const data = await api.getData();
      set({ data, isLoading: false });
    } catch (error) {
      console.error('Error:', error);
      set({ isLoading: false });
    }
  },

  reset: () => set({ data: null, isLoading: false }),
}));
```

커스텀 훅

```tsx
// features/auth/hooks.ts
import { useEffect } from 'react';
import { useAuthStore } from './store';

export const useAuth = () => {
  const { user, isLoading, isAuthenticated, signIn, signOut, refreshUser, initialize } =
    useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    refreshUser,
  };
};
```

환경 변수

```tsx
import { API_BASE_URL, GOOGLE_WEB_CLIENT_ID } from '@env';

console.log(API_BASE_URL);
```

환경 변수 목록

```
# apps/mobile/.env.dev

GOOGLE_WEB_CLIENT_ID=something
GOOGLE_IOS_CLIENT_ID=something
GOOGLE_ANDROID_CLIENT_ID=something
API_BASE_URL=http://localhost:8080
```

### 테스트 전략

테스트 구조

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

테스트 실행

```bash
pnpm test              # 전체 테스트
pnpm test:watch        # Watch 모드
pnpm test:coverage     # 커버리지 포함
pnpm test:silent       # 로그 없이 실행
```

### 빌드 및 개발

주요 명령어

```bash
# 개발
pnpm dev                 # Metro bundler 시작 (개발 환경)
pnpm android             # Android 앱 실행 + adb reverse
pnpm ios                 # iOS 앱 실행
pnpm dev:storybook       # Storybook 시작

# 빌드
pnpm build               # TypeScript 타입 체크
pnpm build:android       # Android 프로덕션 번들 생성
pnpm build:ios           # iOS 프로덕션 번들 생성

# 코드 품질
pnpm lint                # ESLint 실행
pnpm lint:fix            # ESLint 자동 수정
pnpm format              # Prettier 포맷
pnpm type-check          # TypeScript 타입 체크

# 테스트
pnpm test                # 모든 테스트 실행
pnpm test:watch          # Watch 모드
pnpm test:coverage       # 커버리지 포함

# 클린업
pnpm clean               # node_modules 및 빌드 산출물 삭제
```

Git 훅 (Husky)
**Pre-commit:**

- lint-staged: ESLint 자동 수정 + Prettier 포맷
- type-check: TypeScript 전체 검증
  **Commit-msg:**
  commitlint: 커밋 메시지 형식 검증

### 요구 사항

- Node.js >= 20
- pnpm >= 9.0.0
- React Native 개발 환경 (Android Studio / Xcode)

AI 어시스턴트용 주의 사항
코드 작성

1. 내부 패키지: 항상 워크스페이스 참조 (workspace:\*) 사용
2. 커밋 메시지: [type] subject 형식 준수 (commitlint 적용)
3. 디자인 시스템: 값 하드코딩 금지, 테마 토큰 또는 cva, tw 사용
4. 컴포넌트 props: React Native 기본 컴포넌트에서 확장 (extends TouchableOpacityProps)
5. 스타일링: tw, cva 함수 우선, 필요 시 StyleSheet.create 사용 (inline 객체 금지)
6. 타입: any 사용 금지, 사용하지 않는 변수는 \_ 접두사
7. Path Alias: 절대 경로 사용 (@app/_, @features/_, @lib/_, @shared/_)
   아키텍처
8. 디렉토리 구조: Feature-Sliced Design 영향 받은 구조 준수
9. 인증: Provider Pattern + Factory 사용 (getAuthService)
10. 상태 관리: Zustand 사용, 커스텀 훅으로 캡슐화
11. 비동기 처리: async/await + try-catch, 에러 로깅 필수
12. 테스트: 실용적이고 의미 있는 테스트 작성, Mock 타입 안전성 확보
    테스트
13. 커버리지보다 실용성: 단순 setter 테스트 지양
14. 통합 테스트 선호: 실제 사용 케이스 중심
15. 에러 케이스 포함: 네트워크 오류, Storage 실패 등 검증
16. Mock 공통화: 반복되는 Mock 설정은 헬퍼 함수로 추출
17. 타입 안전: jest.fn<ReturnType, Parameters>() 형식 사용
    환경 변수
18. NODE_ENV: 자동 로드, 수동 설정 불필요
19. 민감 정보: .env.\* 파일에 저장, Git에 커밋 금지
20. 환경 변수 검증: 서비스 초기화 시 필수 변수 체크
