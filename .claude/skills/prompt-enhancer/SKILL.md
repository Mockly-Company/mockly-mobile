---
name: prompt-enhancer
description: 사용자가 간단한 개발 요청을 할 때, 프로젝트 특화 정보를 반영하여 보다 정확하고 문맥에 맞는 요구사항으로 변환합니다.
---

# 프롬프트 향상기

간단한 개발 요청을 프로젝트 컨텍스트를 분석하여 명확하고 상세한 요구사항으로 변환합니다. 변환된 요구사항은 구현 전에 사용자에게 확인을 받습니다.

## 사용 시점

다음과 같은 경우 이 스킬을 사용합니다:

- 사용자가 "로그인 기능 만들어줘", "API 추가해줘" 같은 간단한 요청을 제공할 때
- 요청에 구체적인 구현 정보가 부족할 때
- 사용자가 프로젝트 파일을 업로드하거나 "프로젝트"라고 언급할 때
- 작업이 프로젝트 아키텍처를 이해해야 할 때

## 핵심 워크플로우

### 1단계: 프로젝트 컨텍스트 분석

**업로드된 파일 확인:**

```bash
view /mnt/user-data/uploads
```

**주요 정보 수집:**

- 프로젝트 구조 및 폴더 구성
- 기술 스택 (package.json, pubspec.yaml, requirements.txt 등)
- 기존 패턴 (상태 관리, API 호출, 라우팅 등)
- 코드 컨벤션 (네이밍, 파일 구조)
- 유사 기능 존재 여부

### 2단계: 요청 의도 추출

사용자의 간단한 요청에서 다음 사항을 확인:

- 기능 유형: 신규 기능, 버그 수정, 리팩터링, API 통합
- 범위: 단일 화면, 전체 플로우, 백엔드 + 프론트엔드
- 의존성: 관련 기능 또는 시스템

### 3단계: 상세 요구사항 작성

구조화된 요구사항 문서를 작성:

```markdown
# [기능명] 구현 요구사항

## 📋 프로젝트 컨텍스트

- Framework: [감지된 프레임워크와 버전]
- Architecture: [감지된 아키텍처 패턴]
- State Management: [감지된 상태 관리 라이브러리]
- Key Libraries: [관련 의존성 목록]

## 🎯 구현 범위

### 주요 기능

1. [주요 기능 1]
2. [주요 기능 2]
3. [주요 기능 3]

### 파일 구조
```

[프로젝트 기준 예상 파일 구조]

```
## 📝 상세 요구사항

### 1. [레이어/컴포넌트 이름]
- **위치**: [파일 경로]
- **목적**: [무엇을 하는지]
- **구현 내용**:
  - [구체적 요구사항 1]
  - [구체적 요구사항 2]
- **기존 패턴 준수**: [참조할 기존 패턴]

### 2. [다음 레이어/컴포넌트]
...

## ✅ 성공 기준
- [ ] [수용 기준 1]
- [ ] [수용 기준 2]
- [ ] [수용 기준 3]
- [ ] 기존 코드 스타일 및 아키텍처 일관성 유지
- [ ] 모든 주요 기능에 대한 테스트 작성

## 🔍 확인 사항
- [필요한 질문 또는 명확히 해야 할 사항]
- [가정 사항]

---
이 요구사항으로 진행할까요? 수정이나 추가할 내용이 있으면 말씀해주세요.
```

### 4단계: 사용자에게 제시

**중요**: 더 강화된 요구사항을 만든 후, 다음 문구를 보여주며 확인 받기:

```
위 요구사항을 분석해서 정리했습니다.

이대로 진행해도 될까요?
수정하거나 추가할 내용이 있으면 말씀해주세요!
```

**주의**: 사용자가 확인하기 전까지 구현하지 않습니다. 목표는 요구사항을 명확히 하는 것입니다.

## 기술 스택별 분석 패턴

### Next.js/React 프로젝트

**감지 방법**: package.json 내 "next" 또는 "react"
**주요 컨텍스트 수집 항목**:

- Next.js version (App Router vs Pages Router)
- State management (Zustand, Redux, Context)
- Styling (Tailwind, CSS Modules, styled-components)
- API approach (Next.js API routes, external API)
- TypeScript usage

**포함할 내용**:

```markdown
### UI Components

- 컴포넌트: [path]/[ComponentName].tsx
- Props interface: [existing pattern]
- Styling: [Tailwind classes/CSS modules]

### State Management

- Store: [existing state structure]
- Actions: [action naming convention]

### API Layer

- Endpoint: [app/api or external]
- Method: [GET/POST/PUT/DELETE]
- Response type: [TypeScript interface]

### Routing

- Route: [app/[route] or pages/[route]]
- Dynamic segments: [if needed]

## 성공 기준

✅ TypeScript 타입 안정성
✅ [Existing components] 재사용
✅ 반응형 디자인 (모바일/데스크톱)
✅ SEO 최적화 (메타데이터)
✅ Unit test + Integration test
```

## 프롬프트 강화 예시

**User input:**

```
로그인 기능 구현해줘
```

**스킬 결과:**

```markdown
로그인 기능 구현 요구사항

## 📋 프로젝트 컨텍스트

- 프레임워크: React Native 0.82.1 with TypeScript 5.9.3
- 모노레포: Turborepo + pnpm workspace
- 스타일링: NativeWind 4.2.1 (Tailwind CSS)
- 네트워크: Axios 1.13.2 (@mockly/api)
- 상태 관리: Zustand 5.0.8, tanstack/react-query 5.90.7
- 네비게이션: @react-navigation/native 7.1.19
- 저장소: @react-native-async-storage/async-storage 2.2.0
- 패키지 매니저: pnpm 9.x

## 🎯 구현 범위

### 주요 기능

1. 이메일/비밀번호 로그인 폼
2. JWT 토큰 기반 인증
3. 로그인 성공 시 홈 화면 이동
4. 에러 처리 및 사용자 피드백

### 파일 구조

mockly-mobile/
├── apps/
│ ├── mobile/ # React Native 모바일 앱
| | └── src/
│ │ ├── hooks # 훅
│ │ └── screens # 화면
│ └── storybook/ # Storybook 문서화
├── packages/
│ ├── entities/ # 공통 엔티티 타입 정의
| | └── src/
│ │ └── user.ts # 유저 타입
│ ├── design-system/ # 디자인 시스템 컴포넌트
│ │ └── src/
│ │ └── components/
│ │ ├── Button.tsx # 재사용
│ │ ├── Input.tsx # 예시
│ │ └── Form.tsx # 예시
│ ├── api/ # API 클라이언트 및 서비스
│ │ └── src/
│ │ └── auth/
│ │ └── login.ts # 로그인 API
│ └── typescript-config/ # 공유 TypeScript 설정
└── .env.\* # 환경별 환경변수 파일

## 📝 상세 요구사항

### 1. Entities Package - User 타입 정의

- **위치**: `packages/entities/src/user.ts`
- **목적**: 사용자 도메인 모델 및 인증 관련 타입 정의
- **구현 내용**:
  - User 인터페이스 (id, email, name, profileImageUrl, createdAt)
  - LoginCredentials 인터페이스 (email, password)
  - AuthTokens 인터페이스 (accessToken, refreshToken)
  - LoginResponse 인터페이스 (user, tokens)
- **기존 패턴 준수**: 순수 TypeScript 인터페이스, 명시적 export

### 2. API Package - TokenProvider 인터페이스 추가

- **위치**: `packages/api/src/client.ts`
- **목적**: 플랫폼 독립적인 토큰 관리 인터페이스
- **구현 내용**:
  - TokenProvider 인터페이스 (getToken, clearTokens 메서드)
  - ApiClientConfig에 tokenProvider 옵션 추가
  - Request interceptor에서 토큰 자동 주입
  - Response interceptor에서 401 시 토큰 제거
- **기존 패턴 준수**: Dependency Injection 패턴, 기존 ApiClient 클래스 확장

### 3. API Package - AuthService 구현

- **위치**: `packages/api/src/services/authService.ts`
- **목적**: 로그인 API 통신 레이어
- **구현 내용**:
  - login(credentials) 메서드 (POST /auth/login)
  - logout() 메서드 (POST /auth/logout)
  - refreshToken(refreshToken) 메서드
  - getMe() 메서드 (사용자 정보 조회)
- **기존 패턴 준수**: UserService, MockService와 동일한 클래스 기반 패턴

### 4. Mobile App - TokenProvider 구현

- **위치**: `apps/mobile/src/utils/tokenProvider.ts`
- **목적**: React Native용 토큰 관리 구현
- **구현 내용**:
  - getToken() 메서드 (AsyncStorage에서 accessToken 조회)
  - clearTokens() 메서드 (accessToken, refreshToken 삭제)
- **기존 패턴 준수**: Interface 구현 패턴

### 5. Mobile App - ApiClient 인스턴스 생성

- **위치**: `apps/mobile/src/api/client.ts`
- **목적**: TokenProvider를 주입한 ApiClient 및 Service 인스턴스 생성
- **구현 내용**:
  - ApiClient 인스턴스 생성 (tokenProvider 주입, baseURL은 환경변수 사용)
  - authService, userService, mockService 인스턴스 생성 및 export
- **기존 패턴 준수**: 싱글톤 인스턴스 패턴

### 6. Design System - Input 컴포넌트 추가

- **위치**: `packages/design-system/src/components/Input.tsx`
- **목적**: 재사용 가능한 텍스트 입력 컴포넌트
- **구현 내용**:
  - TextInput 래핑 컴포넌트
  - label, error, required props 지원
  - theme 토큰 활용한 스타일링
  - error 상태 시 빨간색 테두리 표시
- **기존 패턴 준수**: Button.tsx와 동일한 구조, StyleSheet.create, theme 토큰 활용

### 7. Mobile App - Auth Zustand Store

- **위치**: `apps/mobile/src/stores/authStore.ts`
- **목적**: 전역 인증 상태 관리
- **구현 내용**:
  - user, isAuthenticated, isInitialized 상태
  - setUser, logout, initialize 액션
  - initialize에서 토큰으로 사용자 정보 복원
- **기존 패턴 준수**: Zustand create 패턴, TypeScript 인터페이스 정의

### 8. Mobile App - useLogin React Query Hook

- **위치**: `apps/mobile/src/hooks/useLogin.ts`
- **목적**: React Query 기반 로그인 mutation 훅
- **구현 내용**:
  - useMutation으로 authService.login 호출
  - onSuccess에서 토큰 AsyncStorage 저장 및 Zustand 스토어 업데이트
  - onError에서 에러 로깅
- **기존 패턴 준수**: React Query useMutation 패턴, Zustand 스토어 연동

### 9. Mobile App - LoginScreen 구현

- **위치**: `apps/mobile/src/screens/auth/LoginScreen.tsx`
- **목적**: 로그인 UI 화면
- **구현 내용**:
  - 이메일/비밀번호 Input 컴포넌트
  - 클라이언트 사이드 유효성 검증 (이메일 형식, 비밀번호 8자 이상)
  - useLogin 훅으로 로그인 처리
  - 로딩 중 버튼 비활성화 및 Input editable=false
  - KeyboardAvoidingView로 키보드 처리
- **기존 패턴 준수**: NativeWind className, Design System 컴포넌트 재사용

### 10. Mobile App - Navigation 설정

- **위치**: `apps/mobile/src/navigation/AppNavigator.tsx`
- **목적**: 인증 상태 기반 조건부 네비게이션
- **구현 내용**:
  - useAuthStore에서 isAuthenticated, isInitialized 구독
  - 초기화 중일 때 ActivityIndicator 표시
  - isAuthenticated에 따라 Login 화면 또는 Home 화면 표시
  - useEffect에서 authStore.initialize 호출
- **기존 패턴 준수**: React Navigation Stack Navigator, 조건부 렌더링

## ✅ 성공 기준

- [ ] 사용자가 이메일과 비밀번호 입력
- [ ] 로그인 버튼 클릭 시 API 호출
- [ ] 성공 시 토큰 저장 및 홈 화면 이동
- [ ] 실패 시 적절한 에러 메시지 표시 (SnackBar)
- [ ] 로딩 중 버튼 비활성화 및 로딩 인디케이터 표시
- [ ] 이메일 형식 및 비밀번호 길이 검증
- [ ] 기존 코드 스타일 및 아키텍처 일관성 유지
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성

## 🔍 확인 사항

- API 엔드포인트 주소가 `https://api.example.com`이 맞나요?
- 토큰 만료 시 자동 갱신 기능이 필요한가요?
- 소셜 로그인(구글, 애플 등)도 함께 구현할까요?
- "비밀번호 찾기" 기능이 필요한가요?

---

위 요구사항으로 진행할까요? 수정이 필요한 부분이 있다면 말씀해주세요!
```

## 효과적인 요구사항 향상 팁

### 항상 명확하게 확인하기

프로젝트 컨텍스트가 불분명하거나 충분하지 않을 때:

```
프로젝트 파일을 업로드해주시면 더 정확한 요구사항을 만들 수 있습니다.
또는 다음 정보를 알려주세요:
- 사용 중인 프레임워크
- 상태 관리 라이브러리
- 기존 프로젝트 구조
```

### 시각적 예시 포함

유사한 화면이나 컴포넌트가 있다면:

```
기존 ProfileScreen과 유사한 레이아웃으로 구현
- AppBar 스타일 동일
- TextFormField 디자인 재사용
- PrimaryButton 컴포넌트 사용
```

### 의존성 강조

```
## 🔗 연관 기능
- AuthService: 사용자 정보 조회에 재사용
- TokenProvider: 기존 토큰 저장 로직 활용
```

## 참조 파일

- **향상 패턴**: references/enhancement-patterns.md
- **프레임워크 가이드**: references/framework-guides.md
