---
name: react-native-feature-builder
description: React Native 앱 기능 개발을 위한 체계적인 워크플로우 스킬. 요구사항 분석부터 Clean Architecture 기반 설계, 프로젝트 컨벤션 적용까지 전체 개발 프로세스를 가이드. 새로운 기능 추가, 화면 구현, 아키텍처 설계 시 사용.
---

# React Native Feature Builder

React Native 앱의 기능을 체계적으로 분석하고 Clean Architecture 기반으로 구현하는 워크플로우 스킬.

## Overview

이 스킬은 React Native 앱 개발 시 다음을 제공:
1. 요구사항 체계적 정리 및 분석
2. 상세 기능 분석 및 데이터 모델링
3. Clean Architecture 기반 설계
4. 프로젝트 컨벤션 자동 적용
5. 레이어별 코드 생성

## When to Use

다음과 같은 경우 이 스킬을 사용:
- 새로운 기능을 추가할 때
- 복잡한 화면을 구현할 때
- 요구사항을 코드로 변환할 때
- Clean Architecture 설계가 필요할 때
- 아키텍처 리팩토링 시

## Workflow Overview

### 4단계 프로세스

```
Phase 1: 요구사항 정리
    ↓
Phase 2: 상세 기능 분석
    ↓
Phase 3: Clean Architecture 설계
    ↓
Phase 4: 구현 및 컨벤션 적용
```

---

# Phase 1: 요구사항 정리

## 목표

사용자의 요구사항을 명확하고 구조화된 형태로 정리.

## 단계

### 1.1 요구사항 수집

사용자에게 다음 질문:
- 어떤 기능을 만들고 싶으신가요?
- 주요 사용자는 누구인가요?
- 이 기능으로 달성하고자 하는 목표는 무엇인가요?

### 1.2 사용자 스토리 작성

**형식:**
```
As a [사용자 역할]
I want to [목표/욕구]
So that [이유]
```

**예시:**
```
As a 앱 사용자
I want to 로그인하고 내 프로필을 볼 수 있게
So that 개인화된 경험을 제공받을 수 있다
```

### 1.3 기능 목록 정리

요구사항을 구체적인 기능 목록으로 분해:

**예시:**
```markdown
## 주요 기능
1. 사용자 인증
   - 이메일/비밀번호 로그인
   - 소셜 로그인 (Google, Apple)
   - 자동 로그인 (토큰 저장)

2. 프로필 관리
   - 프로필 조회
   - 프로필 수정
   - 프로필 이미지 업로드

3. 설정
   - 알림 설정
   - 언어 설정
   - 로그아웃
```

### 1.4 우선순위 설정

각 기능에 우선순위 부여:
- **P0 (Must Have)**: 핵심 기능, 반드시 필요
- **P1 (Should Have)**: 중요하지만 나중에 가능
- **P2 (Nice to Have)**: 있으면 좋음

### 1.5 제약사항 파악

- 기술적 제약 (지원 OS 버전, 디바이스)
- 비즈니스 제약 (기한, 예산)
- 외부 의존성 (API, 서드파티 서비스)

**Phase 1 완료 체크리스트:**
- [ ] 사용자 스토리 작성
- [ ] 기능 목록 정리
- [ ] 우선순위 설정
- [ ] 제약사항 파악
- [ ] 사용자 확인 완료

---

# Phase 2: 상세 기능 분석

## 목표

각 기능의 세부 사항을 분석하고 필요한 리소스를 파악.

## 단계

### 2.1 화면 흐름(Flow) 정의

각 기능의 화면 흐름을 정의:

**예시: 로그인 기능**
```
Splash Screen
    ↓
Login Screen ──→ Sign Up Screen
    ↓ (성공)         ↓ (완료)
Home Screen ←────────┘
```

### 2.2 화면별 상세 분석

각 화면에 대해:

**템플릿:**
```markdown
### [화면 이름]

**목적:** [이 화면의 목적]

**UI 요소:**
- Input: 이메일, 비밀번호
- Button: 로그인, 회원가입, 소셜 로그인
- Link: 비밀번호 찾기

**상태:**
- Loading: 로그인 진행 중
- Error: 로그인 실패 메시지
- Success: 홈 화면으로 이동

**사용자 액션:**
1. 이메일/비밀번호 입력
2. 로그인 버튼 클릭
3. 자동 로그인 체크박스 토글

**비즈니스 로직:**
- 이메일 형식 검증
- 비밀번호 최소 길이 검증
- 로그인 API 호출
- 토큰 저장 (자동 로그인 시)
- 홈 화면으로 네비게이션
```

### 2.3 데이터 모델 정의

필요한 Entity 정의:

**예시:**
```typescript
// User Entity
interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// AuthToken Entity
interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

### 2.4 API 엔드포인트 정의

필요한 API 목록:

```markdown
### POST /auth/login
**Request:**
- email: string
- password: string

**Response:**
- user: User
- token: AuthToken

**Error:**
- 400: Invalid credentials
- 500: Server error
```

### 2.5 상태 관리 필요성 판단

- **Local State**: 화면 내부에서만 사용
- **Global State**: 여러 화면에서 공유
- **Persistent State**: 앱 재시작 후에도 유지

**예시:**
```markdown
- Local: 로그인 form 입력값, loading 상태
- Global: 현재 로그인된 사용자 정보
- Persistent: 자동 로그인 토큰, 설정 값
```

### 2.6 외부 라이브러리/서비스 파악

필요한 라이브러리:
```markdown
- react-navigation: 화면 네비게이션
- axios: HTTP 통신
- react-native-keychain: 토큰 안전 저장
- @react-native-google-signin: Google 로그인
- @invertase/react-native-apple-authentication: Apple 로그인
- react-hook-form: 폼 상태 관리
- zod: 입력 검증
```

**Phase 2 완료 체크리스트:**
- [ ] 화면 흐름 정의
- [ ] 모든 화면 상세 분석
- [ ] Entity 정의
- [ ] API 엔드포인트 정의
- [ ] 상태 관리 전략 수립
- [ ] 필요 라이브러리 파악

---

# Phase 3: Clean Architecture 설계

## 목표

Clean Architecture 원칙에 따라 레이어별 설계 수립.

## Clean Architecture 레이어

```
┌─────────────────────────────────────┐
│   Presentation Layer (UI)           │
│   - Screens, Components, Hooks      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Domain Layer (Business Logic)     │
│   - Entities, Use Cases             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Data Layer                        │
│   - Repositories, Data Sources      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Infrastructure                    │
│   - API, Storage, External Services │
└─────────────────────────────────────┘
```

**참고:** [Clean Architecture 상세 가이드](./reference/clean-architecture.md)

## 단계

### 3.1 Domain Layer 설계

#### Entities 정의

Phase 2에서 정의한 데이터 모델을 Entity로:

```typescript
// src/domain/entities/User.ts
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Use Cases 정의

각 비즈니스 로직을 Use Case로:

**네이밍 규칙:** `[Verb][Noun]UseCase`

**예시:**
```typescript
// src/domain/usecases/auth/LoginUseCase.ts
export interface LoginUseCase {
  execute(email: string, password: string): Promise<AuthResult>;
}

// src/domain/usecases/auth/GetCurrentUserUseCase.ts
export interface GetCurrentUserUseCase {
  execute(): Promise<User | null>;
}

// src/domain/usecases/profile/UpdateProfileUseCase.ts
export interface UpdateProfileUseCase {
  execute(userId: string, data: UpdateProfileData): Promise<User>;
}
```

#### Repository Interfaces 정의

데이터 접근 추상화:

```typescript
// src/domain/repositories/AuthRepository.ts
export interface AuthRepository {
  login(email: string, password: string): Promise<AuthToken>;
  logout(): Promise<void>;
  getStoredToken(): Promise<AuthToken | null>;
  storeToken(token: AuthToken): Promise<void>;
  refreshToken(refreshToken: string): Promise<AuthToken>;
}

// src/domain/repositories/UserRepository.ts
export interface UserRepository {
  getCurrentUser(): Promise<User>;
  updateUser(userId: string, data: UpdateUserData): Promise<User>;
  uploadProfileImage(userId: string, image: File): Promise<string>;
}
```

### 3.2 Data Layer 설계

#### Repository 구현

```typescript
// src/data/repositories/AuthRepositoryImpl.ts
export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private apiDataSource: AuthApiDataSource,
    private storageDataSource: AuthStorageDataSource
  ) {}

  async login(email: string, password: string): Promise<AuthToken> {
    const token = await this.apiDataSource.login(email, password);
    await this.storageDataSource.storeToken(token);
    return token;
  }

  // ... 다른 메서드 구현
}
```

#### Data Sources 정의

```typescript
// src/data/datasources/AuthApiDataSource.ts
export interface AuthApiDataSource {
  login(email: string, password: string): Promise<AuthToken>;
  refreshToken(refreshToken: string): Promise<AuthToken>;
}

// src/data/datasources/AuthStorageDataSource.ts
export interface AuthStorageDataSource {
  storeToken(token: AuthToken): Promise<void>;
  getToken(): Promise<AuthToken | null>;
  deleteToken(): Promise<void>;
}
```

### 3.3 Presentation Layer 설계

#### Screen 구조

```typescript
// src/presentation/screens/LoginScreen/LoginScreen.tsx
export const LoginScreen = () => {
  // 1. Hooks
  const { login, isLoading, error } = useAuth();
  const { control, handleSubmit } = useForm();

  // 2. Event Handlers
  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };

  // 3. Render
  return (
    <SafeAreaView>
      {/* UI 컴포넌트 */}
    </SafeAreaView>
  );
};
```

#### Custom Hooks

```typescript
// src/presentation/hooks/useAuth.ts
export const useAuth = () => {
  const loginUseCase = useInjection(LoginUseCase);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await loginUseCase.execute(email, password);
      // 성공 처리
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
```

### 3.4 파일 구조 설계

```
src/
├── domain/
│   ├── entities/
│   │   ├── User.ts
│   │   └── AuthToken.ts
│   ├── usecases/
│   │   ├── auth/
│   │   │   ├── LoginUseCase.ts
│   │   │   ├── LogoutUseCase.ts
│   │   │   └── GetCurrentUserUseCase.ts
│   │   └── profile/
│   │       ├── GetProfileUseCase.ts
│   │       └── UpdateProfileUseCase.ts
│   └── repositories/
│       ├── AuthRepository.ts
│       └── UserRepository.ts
│
├── data/
│   ├── repositories/
│   │   ├── AuthRepositoryImpl.ts
│   │   └── UserRepositoryImpl.ts
│   └── datasources/
│       ├── api/
│       │   ├── AuthApiDataSource.ts
│       │   └── UserApiDataSource.ts
│       └── storage/
│           └── AuthStorageDataSource.ts
│
├── infrastructure/
│   ├── api/
│   │   ├── ApiClient.ts
│   │   └── interceptors/
│   ├── storage/
│   │   └── SecureStorage.ts
│   └── di/
│       └── container.ts
│
└── presentation/
    ├── screens/
    │   ├── LoginScreen/
    │   │   ├── LoginScreen.tsx
    │   │   ├── LoginScreen.styles.ts
    │   │   └── components/
    │   └── ProfileScreen/
    ├── components/
    │   ├── common/
    │   └── feature-specific/
    ├── hooks/
    │   ├── useAuth.ts
    │   └── useProfile.ts
    ├── navigation/
    └── state/
```

**Phase 3 완료 체크리스트:**
- [ ] Entities 정의
- [ ] Use Cases 정의
- [ ] Repository Interfaces 정의
- [ ] Data Sources 정의
- [ ] 파일 구조 설계
- [ ] 의존성 주입 설계

---

# Phase 4: 구현 및 컨벤션 적용

## 목표

Phase 3의 설계를 바탕으로 실제 코드 구현 및 프로젝트 컨벤션 적용.

## 단계

### 4.1 프로젝트 컨벤션 로드

프로젝트의 기존 컨벤션 확인:
- 코딩 스타일 (ESLint, Prettier 설정)
- 네이밍 규칙
- 파일/폴더 구조
- 상태 관리 방식 (Context, Redux, Zustand 등)
- 스타일링 방식 (StyleSheet, Styled Components 등)

**프로젝트 컨벤션 파일:**
- `.claude/skills/project-guide.md`
- `README.md`
- `.eslintrc.js`, `prettier.config.js`
- 기존 코드 샘플

**참고:** [React Native 컨벤션 가이드](./reference/react-native-conventions.md)

### 4.2 레이어별 구현

#### Step 1: Domain Layer 구현

**순서:**
1. Entities 생성
2. Repository Interfaces 생성
3. Use Cases 구현

**사용 템플릿:**
- [Entity 템플릿](./templates/entity-template.md)
- [Use Case 템플릿](./templates/usecase-template.md)
- [Repository Interface 템플릿](./templates/repository-template.md)

#### Step 2: Data Layer 구현

**순서:**
1. Data Sources 구현 (API, Storage)
2. Repository 구현

**사용 템플릿:**
- [Data Source 템플릿](./templates/datasource-template.md)
- [Repository Implementation 템플릿](./templates/repository-impl-template.md)

#### Step 3: Infrastructure 구현

**순서:**
1. API Client 설정
2. Storage 유틸리티 설정
3. DI Container 설정

#### Step 4: Presentation Layer 구현

**순서:**
1. Custom Hooks 구현
2. Components 구현
3. Screens 구현
4. Navigation 설정

**사용 템플릿:**
- [Screen 템플릿](./templates/screen-template.md)
- [Component 템플릿](./templates/component-template.md)
- [Hook 템플릿](./templates/hook-template.md)

### 4.3 컨벤션 자동 적용

각 파일 생성 시 자동 적용:

1. **Import 순서:**
   ```typescript
   // 1. React/React Native
   import React from 'react';
   import { View, Text } from 'react-native';

   // 2. 외부 라이브러리
   import axios from 'axios';

   // 3. 내부 모듈 (절대 경로)
   import { User } from '@/domain/entities/User';
   import { useAuth } from '@/presentation/hooks/useAuth';

   // 4. 상대 경로
   import { LoginForm } from './components/LoginForm';
   import styles from './LoginScreen.styles';
   ```

2. **네이밍 규칙:**
   - Components: PascalCase (e.g., `LoginScreen`, `Button`)
   - Files: PascalCase for components, camelCase for utilities
   - Functions/Variables: camelCase
   - Constants: UPPER_SNAKE_CASE
   - Interfaces: PascalCase with `I` prefix optional
   - Types: PascalCase with `T` prefix optional

3. **타입 안전성:**
   - 모든 함수에 타입 명시
   - `any` 사용 금지 (`unknown` 사용)
   - Props interface 정의

4. **에러 처리:**
   ```typescript
   try {
     // 비즈니스 로직
   } catch (error) {
     if (error instanceof ApiError) {
       // API 에러 처리
     } else {
       // 예상치 못한 에러
     }
   }
   ```

### 4.4 테스트 코드 작성

각 레이어별 테스트:

**Use Case 테스트:**
```typescript
describe('LoginUseCase', () => {
  it('should login successfully with valid credentials', async () => {
    // Given
    const mockRepo = createMockAuthRepository();
    const useCase = new LoginUseCase(mockRepo);

    // When
    const result = await useCase.execute('test@example.com', 'password123');

    // Then
    expect(result.success).toBe(true);
    expect(mockRepo.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
```

### 4.5 문서화

각 기능에 대한 문서 생성:

```markdown
# [기능명] 구현 문서

## 개요
[기능 설명]

## 아키텍처
[레이어 다이어그램]

## 주요 파일
- Domain:
  - entities/User.ts
  - usecases/LoginUseCase.ts
- Data:
  - repositories/AuthRepositoryImpl.ts
- Presentation:
  - screens/LoginScreen.tsx

## 사용 방법
[사용 예시]

## 테스트
[테스트 실행 방법]
```

**Phase 4 완료 체크리스트:**
- [ ] 모든 레이어 구현 완료
- [ ] 프로젝트 컨벤션 적용 확인
- [ ] 테스트 코드 작성
- [ ] 문서 작성
- [ ] 코드 리뷰 준비

---

# Best Practices

## 아키텍처

1. **의존성 방향:** 항상 외부에서 내부로 (Presentation → Domain ← Data)
2. **인터페이스 분리:** Domain은 인터페이스만, Data는 구현
3. **단일 책임:** 각 Use Case는 하나의 책임만
4. **의존성 주입:** 직접 생성 대신 주입 받기

## 코드 품질

1. **타입 안전성:** TypeScript를 최대한 활용
2. **불변성:** 상태 변경 시 항상 새 객체 생성
3. **에러 처리:** 모든 비동기 작업에 에러 처리
4. **코드 재사용:** 공통 로직은 Hook이나 Utility로 분리

## React Native 특화

1. **성능:** useMemo, useCallback 활용
2. **접근성:** accessibilityLabel, accessibilityRole 설정
3. **플랫폼 분기:** Platform.select 사용
4. **네이티브 모듈:** 필요 시 Native Module 연동

## 참고 자료

- [Clean Architecture 가이드](./reference/clean-architecture.md)
- [React Native 컨벤션](./reference/react-native-conventions.md)
- [기능 분석 가이드](./reference/feature-analysis-guide.md)
- [템플릿 모음](./templates/)
