# AGENTS - AI 협업 가이드

Mockly 프로젝트에서 Claude와 효율적으로 협업하기 위한 핵심 컨텍스트

---

## 프로젝트 구조

```
apps/
  mobile/           # React Native 앱 (iOS/Android)
    src/            # 앱 소스코드
      app/          # 앱 UI 관련 코드
        components/ # 앱 컴포넌트
        navigation/ # 앱 네비게이션
        screens/    # 앱 스크린
      features/     # 앱 기능 관련 코드
        auth/       # auth 기능, 스토어, 컴포넌트
        interview/  # interview 기능, 스토어, 컴포넌트
      libs/         # 의존성 있는 libs
      errors/       # 에러 바운더리, Fallback 컴포넌트
      hooks/        # 공통 훅 (useNetworkMonitor.ts 등)
      utils/        # 공통 함수 (toast, deviceInfo, location)
      configs/      # 설정 코드 (apiClient, queryClient)
    __tests__/      # 테스트 파일
    android/        # Android 네이티브 코드
    ios/            # iOS 네이티브 코드

  storybook/        # 디자인 시스템 문서화 및 프리뷰
    .storybook/     # 웹 Storybook 설정
    .rnstorybook/   # 모바일 Storybook 설정
    storyForWeb/    # 웹용 스토리
    storyForMobile/ # 모바일용 스토리
    src             # 웹/모바일 공용 스토리

packages/
  design-system/    # UI 컴포넌트, 테마, tw 객체
    src/
      components/   # 재사용 가능한 UI 컴포넌트
      layout/       # 재사용 가능한 UI 레이아웃
      animations/   # 재사용 가능한 UI 애니메이션
      lib/          # export하는 tw 객체
      stories/      # 일부 토큰들의 stories
      theme/        # 테마 설정 (colors, spacing 등)

  api/              # API 클라이언트, DTO→Entity 변환
    src/
      [domain]/       # 도메인 ([domain] = Auth or User or Interview...)
        getXXX.ts   # 자원 요청
        deleteXXX.ts# 자원 삭제
        patchXXX.ts # 자원 일부 수정
        postXXX.ts  # 자원 생성
        putXXX.ts   # 자원 전체 수정

  domain/           # 도메인 엔티티 타입 + 비즈니스 로직
    src/            # User, Interview 등 엔티티 및 서비스
      [domain]/
      auth/
      user/
      mock/

  utils/            # 공통 유틸리티 함수
    src/            # 날짜, 문자열 포맷, CN 등
      cn.ts

  typescript-config/ # 공유 tsconfig
```

---

## 기술 스택

- **앱**: React Native, TypeScript, Zustand
- **스타일**: twrnc, cva, clsx, tailwind-merge
- **빌드**: Turborepo, pnpm workspace
- **테스트**: Jest, @testing-library/react-native
- **문서화**: Storybook (React Native Web/Android)
- **린팅**: ESLint, Prettier, commitlint, husky

---

## API 통신 아키텍처

### 기본 원칙

모든 백엔드 통신은 **@mockly/api**에서 제공하는 함수를 통해서만 수행합니다.

### 데이터 흐름

```
App Component
    ↓ 호출
@mockly/api 함수 (getUser, postInterview 등)
    ↓ 반환: @mockly/domain 타입 또는 원시 타입
    ↓ 내부 동작
RequestDTO → 백엔드 API 통신 → ResponseDTO
    ↓ 변환
@mockly/domain 타입
```

### 구체적인 규칙

#### 1. API 함수 작성 (`@mockly/api`)

- 위치: `packages/api/src/[도메인]/[동사][자원].ts`
- 반환 타입: **반드시 @mockly/domain 타입 또는 원시 타입**

```typescript
// packages/api/src/user/getUser.ts
import { User } from '@mockly/domain';
import { ApiResponse } from '../../types';
import { apiClient } from '../client';

interface GetUserRequestDto {
  userId: string;
}

interface GetUserResponseDto {
  user_id: string;
  user_name: string;
  created_at: number;
}

export async function getUser(userId: string): Promise<User> {
  const response = await apiClient.get<ApiResponse<GetUserResponseDto>>(`/users/${userId}`);

  // DTO → Entity 변환
  return {
    id: response.data.user_id,
    name: response.data.user_name,
    createdAt: new Date(response.data.created_at),
  };
}
```

#### 2. Domain 타입 작성 (`@mockly/domain`)

- 위치: `packages/domain/src/[domain]/`
- 타입 정의: `domain.type.ts`
- 비즈니스 로직: `domain.service.ts`
- 런타임 검증이 필요하면 **zod 스키마 함께 정의**
- **핵심 도메인 비즈니스 로직도 같은 패키지 내에 작성**
  - 도메인 서비스 (예: `domain.service.ts`)
  - 도메인 유효성 검증 로직
  - 엔티티 메서드 또는 헬퍼 함수

```typescript
// packages/domain/src/user/user.type.ts
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// 런타임 검증 함수
export function validateUser(data: unknown): User {
  return UserSchema.parse(data);
}
```

```typescript
// packages/domain/src/user/user.service.ts
import { User } from './user.type';

export class UserService {
  // 도메인 비즈니스 로직 예시
  static isActiveUser(user: User): boolean {
    const daysSinceCreation = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation <= 90;
  }

  static canEditProfile(user: User, targetUserId: string): boolean {
    return user.id === targetUserId;
  }
}
```

#### 3. 앱에서 사용

```typescript
// apps/mobile/src/features/auth/store/useAuthStore.ts
import { getUser } from '@mockly/api';
import { User } from '@mockly/domain';

const fetchUser = async (userId: string) => {
  const user = await getUser(userId); // Entity 타입 반환
  setUser(user);
};
```

### 주의사항

- ❌ 앱 코드에서 직접 axios/fetch 사용 금지
- ❌ DTO 타입을 앱 코드에서 사용 금지
- ❌ ResponseDTO를 그대로 반환 금지 (반드시 Entity로 변환)
- ✅ 모든 API 함수는 Entity 타입 반환
- ✅ 런타임 검증이 필요한 Entity는 zod 스키마 작성
- ✅ `ApiResponse<T>` 구조 활용

---

## 코딩 컨벤션

### 파일 구조

#### 앱 컴포넌트 (`apps/mobile`)

- 컴포넌트: `ComponentName.tsx`, `ComponentName.test.tsx`
- 스토어: `useXxxStore.ts` (Zustand)
- 앱 컴포넌트는 스토리 파일 작성 안 함

#### 디자인 시스템 컴포넌트 (`packages/design-system`)

- 컴포넌트 위치: `packages/design-system/src/components/[ComponentName]/`
- 파일 구성:
  - `ComponentName.tsx` - 컴포넌트 구현
  - `ComponentName.stories.tsx` - Storybook 스토리 (필수)
  - `index.ts` - export

```
packages/design-system/src/components/
  Button/
    Button.tsx
    Button.stories.tsx
    index.ts
  Input/
    Input.tsx
    Input.stories.tsx
    index.ts
```

#### API

- 위치: `packages/api/src/domain/getDomain.ts`
- 파일: `getXxx.ts`, `postXxx.ts`, `patchXxx.ts`, `putXxx.ts`, `deleteXxx.ts`

#### 유틸

- 파일명: `xxxUtil.ts`

### Import 순서

```typescript
// 1. React/React Native
import { View } from 'react-native';

// 2. 외부 라이브러리
import { create } from 'zustand';

// 3. 내부 패키지
import { Button, Text } from '@mockly/design-system';
import { User } from '@mockly/domain';

// 4. 상대 경로
import { useAuthStore } from '../store';
```

### 스타일링 규칙

- **항상 tw 객체 사용** (인라인 방식)
- cva로 variant 정의
- StyleSheet.create 사용 금지
- **기존 컴포넌트의 Props를 최대한 활용**
  - style prop은 최후의 수단으로만 사용
  - 반복되는 스타일 패턴이 발견되면 컴포넌트에 props 추가 검토
  - 예: `<Button variant="primary" size="lg" />` (Good)
  - 예: `<Button style={tw`bg-blue-500 px-4`} />` (Bad - props로 추상화해야 함)

```typescript
import { tw } from '@repo/design-system';

// Good
<View style={tw`flex-1 bg-white`} />

// Bad
<View style={styles.container} />
```

### 컴포넌트 작성

- Props 인터페이스는 컴포넌트 위에 선언
- export는 파일 하단에서 한 번만
- 조건부 렌더링은 early return 활용

---

## 테스트 규칙

### 파일 위치

- 패키지루트/**tests**
- 네이밍: `*.test.tsx` 또는 `*.test.ts`

### 작성 원칙

- **프론트엔드**: 사용자 관점에서 테스트 (클릭, 입력, 화면 표시)
- **백엔드**: API 응답, 에러 핸들링, DTO 변환
- **유틸**: 순수 함수 입출력 검증

---

## 커밋/PR 규칙

### 커밋 메시지

```
[type] 한글로 작성된 명확한 설명

커밋 메시지 내용
```

**Type 목록**: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert

### 브랜치 전략

- 메인 브랜치: `develop`
- 기능 개발: `feat/기능명`
- 버그 수정: `fix/버그명`
- 문서 작업: `docs/문서명`
- 기타 작업: `chore/작업명`

---

## 스킬 사용 가이드

| 상황                                     | 사용할 스킬                  | 경로                                           |
| ---------------------------------------- | ---------------------------- | ---------------------------------------------- |
| **코드 작성 후 리뷰 필요**               | code-review                  | `.claude/skills/code-review/`                  |
| **커밋 메시지 자동 생성**                | commit-message-generator     | `.claude/skills/commit-message-generator/`     |
| **백엔드 테스트 코드 생성**              | backend-test-generator       | `.claude/skills/backend-test-generator/`       |
| **프론트엔드 테스트 코드 생성**          | frontend-test-generator      | `.claude/skills/frontend-test-generator/`      |
| **GitHub 기능 이슈 생성**                | github-issue-generator       | `.claude/skills/github-issue-generator/`       |
| **GitHub 작업 티켓 생성**                | github-task-ticket-generator | `.claude/skills/github-task-ticket-generator/` |
| **PR 메시지 자동 생성**                  | pr-message-generator         | `.claude/skills/pr-message-generator/`         |
| **사용자 요청을 상세 요구사항으로 변환** | prompt-enhancer              | `.claude/skills/prompt-enhancer/`              |
| **새로운 스킬 생성**                     | skill-creator                | `.claude/skills/skill-creator/`                |

---

## 작업 시 주의사항

### 절대 하지 말 것

- ❌ StyleSheet.create 사용
- ❌ 불필요한 주석/docstring 추가
- ❌ 과도한 추상화/헬퍼 함수
- ❌ 사용하지 않는 코드 주석 처리 (완전 삭제)
- ❌ 쓸모없는 React 라이브러리 임포트
- ❌ 요청받지 않은 리팩터링

### 반드시 할 것

- ✅ 파일 수정 전 Read로 기존 코드 확인
- ✅ @mockly/design-system에서 export하는 tw 객체로 스타일링, props에 따른 복잡한 스타일 분기는 cva 사용
- ✅ 보안 취약점 체크 (XSS, SQL Injection 등)
- ✅ 테스트 코드 작성 시 적절한 스킬 활용
- ✅ 커밋 시 commit-message-formatter 스킬 사용
