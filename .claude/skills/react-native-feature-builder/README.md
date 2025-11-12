# React Native Feature Builder

React Native 앱 기능을 체계적으로 분석하고 Clean Architecture 기반으로 구현하는 워크플로우 스킬입니다.

## 개요

새로운 기능을 추가할 때 4단계 워크플로우를 통해 체계적으로 개발할 수 있습니다:

1. **요구사항 정리** - 사용자 스토리, 기능 목록, 우선순위
2. **상세 기능 분석** - 화면 흐름, 데이터 모델, API 설계
3. **Clean Architecture 설계** - 레이어별 설계, 파일 구조
4. **구현 및 컨벤션 적용** - 실제 코드 작성

## 사용 시나리오

다음과 같은 경우 이 스킬을 사용하세요:

- ✅ 새로운 기능을 추가할 때
- ✅ 복잡한 화면을 구현할 때
- ✅ 요구사항을 코드로 변환할 때
- ✅ Clean Architecture 설계가 필요할 때
- ✅ 아키텍처 리팩토링 시

## 빠른 시작

### 스킬 호출

```
"사용자 로그인 기능 만들어줘"
"게시글 목록 화면 구현해줘"
"프로필 편집 기능 추가해줘"
```

### 워크플로우

스킬이 4단계로 안내합니다:

#### Phase 1: 요구사항 정리

- 사용자 스토리 작성
- 기능 목록 정리
- 우선순위 설정 (P0/P1/P2)
- 제약사항 파악

#### Phase 2: 상세 기능 분석

- 화면 흐름 정의
- 화면별 상세 분석
- Entity 정의
- API 엔드포인트 설계
- 필요한 라이브러리 파악

#### Phase 3: Clean Architecture 설계

- Domain Layer 설계 (Entities, Use Cases, Repositories)
- Data Layer 설계 (Repository 구현, Data Sources)
- Presentation Layer 설계 (Screens, Hooks, Components)
- 파일 구조 설계

#### Phase 4: 구현 및 컨벤션 적용

- 프로젝트 컨벤션 적용
- 레이어별 구현
- 테스트 코드 작성
- 문서화

## Clean Architecture 레이어

```
Presentation Layer (UI)
    ↓ Use Cases
Domain Layer (Business Logic)
    ↓ Repository Interfaces
Data Layer (Data Access)
    ↓ Data Sources
Infrastructure (API, Storage)
```

### 레이어별 책임

**Domain Layer (핵심):**

- Entities: 비즈니스 데이터 모델
- Use Cases: 비즈니스 로직
- Repository Interfaces: 데이터 접근 추상화

**Data Layer:**

- Repository Implementations
- Data Sources (API, Storage)
- DTO ↔ Entity 변환

**Presentation Layer:**

- Screens: 전체 화면
- Components: 재사용 UI
- Hooks: 비즈니스 로직과 UI 연결

## 실전 예제

### 예제 1: 로그인 기능

**Phase 1 - 요구사항:**

```
As a 앱 사용자
I want to 이메일/비밀번호로 로그인
So that 내 계정에 접근할 수 있다

기능:
- 이메일/비밀번호 로그인
- 자동 로그인
- 소셜 로그인 (Google, Apple)
```

**Phase 2 - 분석:**

```
화면: Login Screen → Home Screen

Entity:
- User { id, email, name, profileImage }
- AuthToken { accessToken, refreshToken, expiresIn }

API:
- POST /auth/login
- POST /auth/refresh
```

**Phase 3 - 설계:**

```
Domain:
- entities/User.ts
- usecases/auth/LoginUseCase.ts
- repositories/AuthRepository.ts

Data:
- repositories/AuthRepositoryImpl.ts
- datasources/AuthApiDataSource.ts

Presentation:
- screens/LoginScreen.tsx
- hooks/useAuth.ts
```

**Phase 4 - 구현:**
자동으로 템플릿 기반 코드 생성 및 프로젝트 컨벤션 적용

### 예제 2: 게시글 목록 기능

**간단한 요청:**

```
"게시글 목록 기능 만들어줘. 무한 스크롤, 새로고침, 검색 기능이 필요해"
```

**자동 생성:**

- Domain: Post Entity, GetPostsUseCase
- Data: PostRepositoryImpl, PostApiDataSource
- Presentation: PostListScreen, usePosts Hook
- 무한 스크롤, RefreshControl, 검색 UI 포함

## 파일 구조

```
src/
├── domain/
│   ├── entities/
│   ├── usecases/
│   └── repositories/
├── data/
│   ├── repositories/
│   └── datasources/
├── infrastructure/
│   ├── api/
│   ├── storage/
│   └── di/
└── presentation/
    ├── screens/
    ├── components/
    ├── hooks/
    └── navigation/
```

## 참고 자료

### Reference 문서

- [Clean Architecture 가이드](./reference/clean-architecture.md)
  - 레이어별 상세 설명
  - 의존성 규칙
  - 실전 예제

- [React Native 컨벤션](./reference/react-native-conventions.md)
  - 파일/폴더 구조
  - TypeScript 규칙
  - 컴포넌트 작성
  - Hooks 사용법
  - 스타일링
  - 성능 최적화

### 템플릿

- [Use Case 템플릿](./templates/usecase-template.md)
  - LoginUseCase
  - GetPostsUseCase
  - UpdateProfileUseCase
  - CreateOrderUseCase (복잡한 예제)

- [Screen 템플릿](./templates/screen-template.md)
  - 기본 Screen 구조
  - LoginScreen
  - ProfileScreen (탭 기반)
  - PostListScreen (FlatList)

## 주요 기능

### 1. 단계별 가이드

각 Phase마다 명확한 체크리스트와 완료 기준 제공

### 2. 템플릿 기반 생성

검증된 템플릿으로 일관된 코드 생성

### 3. 컨벤션 자동 적용

- Import 순서
- 네이밍 규칙
- 타입 안전성
- 에러 처리 패턴

### 4. Clean Architecture 강제

의존성 방향 준수 및 레이어 분리

### 5. 테스트 코드 생성

각 레이어별 테스트 코드 자동 생성

## Best Practices

### 아키텍처

1. **의존성 방향**: 항상 외부 → 내부
2. **단일 책임**: 하나의 Use Case는 하나의 책임
3. **인터페이스 분리**: Domain은 인터페이스만
4. **의존성 주입**: 직접 생성 대신 주입

### 코드 품질

1. **타입 안전성**: `any` 사용 금지
2. **불변성**: 상태 변경 시 새 객체 생성
3. **에러 처리**: 모든 비동기 작업에 에러 처리
4. **재사용성**: 공통 로직은 Hook/Utility로 분리

### React Native 특화

1. **성능**: useMemo, useCallback 활용
2. **접근성**: accessibilityLabel 설정
3. **플랫폼 분기**: Platform.select 사용
4. **네비게이션**: 타입 안전한 네비게이션

## 사용 팁

### 작은 기능부터 시작

```
"간단한 프로필 조회 화면 만들어줘"
↓
요구사항 정리 → 분석 → 설계 → 구현
↓
코드 생성 완료
```

### 복잡한 기능은 단계별 확인

```
"주문 생성 기능 만들어줘"
↓
Phase 1 완료 후 사용자 확인
↓
Phase 2 완료 후 사용자 확인
↓
Phase 3 완료 후 사용자 확인
↓
Phase 4 구현
```

### 기존 코드 리팩토링

```
"이 화면을 Clean Architecture로 리팩토링해줘"
↓
기존 코드 분석
↓
레이어별 재구조화
↓
테스트 코드 작성
```

## 워크플로우 다이어그램

```
사용자 요청
    ↓
Phase 1: 요구사항 정리
    ├─ 사용자 스토리
    ├─ 기능 목록
    └─ 우선순위
    ↓
Phase 2: 상세 분석
    ├─ 화면 흐름
    ├─ Entity 정의
    ├─ API 설계
    └─ 라이브러리 선정
    ↓
Phase 3: Architecture 설계
    ├─ Domain Layer
    ├─ Data Layer
    ├─ Presentation Layer
    └─ 파일 구조
    ↓
Phase 4: 구현
    ├─ 컨벤션 적용
    ├─ 코드 생성
    ├─ 테스트 작성
    └─ 문서화
    ↓
완성된 기능
```

## 체크리스트

### Phase 1 완료

- [ ] 사용자 스토리 작성
- [ ] 기능 목록 정리
- [ ] 우선순위 설정
- [ ] 제약사항 파악

### Phase 2 완료

- [ ] 화면 흐름 정의
- [ ] 모든 화면 상세 분석
- [ ] Entity 정의
- [ ] API 엔드포인트 정의

### Phase 3 완료

- [ ] Use Cases 정의
- [ ] Repository Interfaces 정의
- [ ] 파일 구조 설계

### Phase 4 완료

- [ ] 모든 레이어 구현
- [ ] 테스트 코드 작성
- [ ] 문서 작성

## 변경 이력

### v1.0.0

- 초기 릴리즈
- 4단계 워크플로우
- Clean Architecture 템플릿
- React Native 컨벤션
