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

### React Native 프로젝트 (Mockly)

**감지 방법**: package.json 내 "react-native"
**주요 컨텍스트 수집 항목**:

- React Native 버전
- State management (Zustand)
- Styling (twrnc, cva)
- API 통신 (@mockly/api의 DTO→Entity 변환 아키텍처)
- 디렉토리 구조 (apps/mobile, packages/)
- TypeScript 사용

**포함할 내용**:

```markdown
### UI Components

- 디자인 시스템: packages/design-system/src/components/
- 앱 컴포넌트: apps/mobile/src/app/components/
- tw 객체로 인라인 스타일링, cva로 variant 정의
- Props 최대한 활용, style prop은 최후의 수단

### State Management

- Zustand: features/[feature]/store/useXxxStore.ts
- create 패턴, TypeScript 인터페이스 정의

### API Layer

- 위치: packages/api/src/[domain]/[동사][자원].ts
- 반환 타입: @mockly/domain 타입 또는 원시 타입
- DTO → Entity 변환
- ApiResponse<T> 래핑

### Entities

- 위치: packages/domain/src/[entity]/entity.type.ts
- zod 스키마 + TypeScript 타입
- 런타임 검증 함수

### Navigation

- 위치: apps/mobile/src/app/navigation/
- 조건부 렌더링 활용 (early return)

## 성공 기준

✅ TypeScript 타입 안정성
✅ @mockly/design-system 컴포넌트 재사용
✅ tw 인라인 스타일링, cva variant 정의
✅ StyleSheet.create 사용 금지
✅ @mockly/api 통신 아키텍처 준수
✅ 테스트 파일: 패키지루트/**tests**
✅ 프론트엔드 테스트: 사용자 관점 (클릭, 입력, 화면 표시)
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

- 프레임워크: React Native with TypeScript
- 모노레포: Turborepo + pnpm workspace
- 스타일링: twrnc (Tailwind CSS for React Native), cva, clsx, tailwind-merge
- API 통신: @mockly/api (DTO→Entity 변환 아키텍처)
- 상태 관리: Zustand
- 테스트: Jest, @testing-library/react-native
- 문서화: Storybook (React Native Web/Android)
- 린팅: ESLint, Prettier, commitlint, husky

## 🎯 구현 범위

### 주요 기능

1. 이메일/비밀번호 로그인 폼
2. JWT 토큰 기반 인증
3. 로그인 성공 시 홈 화면 이동
4. 에러 처리 및 사용자 피드백

### 파일 구조

m/
├── apps/
│ ├── mobile/ # React Native 모바일 앱
│ │ └── src/
│ │ ├── app/ # 앱 UI 관련 코드
│ │ │ ├── components/ # 앱 컴포넌트
│ │ │ ├── navigation/ # 앱 네비게이션
│ │ │ └── screens/ # 앱 스크린
│ │ ├── features/ # 앱 기능 관련 코드
│ │ │ ├── auth/ # auth 기능, 스토어, 컴포넌트
│ │ │ └── interview/ # interview 기능, 스토어, 컴포넌트
│ │ └── shared/ # 공용 코드
│ │ ├── api/ # apiClient 초기화 코드
│ │ ├── errors/ # 에러 바운더리, Fallback 컴포넌트
│ │ ├── hooks/ # 공통 훅
│ │ └── utils/ # 공통 함수 (toast, deviceInfo, location)
│ └── storybook/ # Storybook 문서화
├── packages/
│ ├── design-system/ # UI 컴포넌트, 테마, tw 객체
│ │ └── src/
│ │ ├── components/ # 재사용 가능한 UI 컴포넌트
│ │ ├── layout/ # 재사용 가능한 UI 레이아웃
│ │ ├── animations/ # 재사용 가능한 UI 애니메이션
│ │ ├── lib/ # export하는 tw 객체
│ │ └── theme/ # 테마 설정 (colors, spacing 등)
│ ├── api/ # API 클라이언트, DTO→Entity 변환
│ │ └── src/
│ │ └── [domain]/ # Auth, User, Interview 등
│ │ ├── getXXX.ts # 자원 요청
│ │ ├── postXXX.ts # 자원 생성
│ │ ├── patchXXX.ts # 자원 일부 수정
│ │ ├── putXXX.ts # 자원 전체 수정
│ │ └── deleteXXX.ts # 자원 삭제
│ ├── domain/ # 도메인 엔티티 타입 정의, 핵심 비즈니스 로직
│ │ └── src/
│ │ ├── auth/
│ │ └── user/
│ ├── utils/ # 공통 유틸리티 함수
│ │ └── src/
│ │ └── cn.ts
│ └── typescript-config/ # 공유 tsconfig

## 📝 상세 요구사항

### 1. Domain Package - User 타입 정의

- **위치**: `packages/domain/src/user/user.type.ts`
- **목적**: 사용자 도메인 모델 및 인증 관련 타입 정의
- **구현 내용**:
  - User 인터페이스 (id, email, name, createdAt)
  - zod 스키마를 통한 런타임 검증 (UserSchema, validateUser)
- **기존 패턴 준수**: zod 스키마 + TypeScript 타입 조합 패턴

### 2. API Package - 로그인 API 함수 작성

- **위치**: `packages/api/src/Auth/postLogin.ts`
- **목적**: 로그인 API 통신 및 DTO→Entity 변환
- **구현 내용**:
  - LoginRequestDto, LoginResponseDto 인터페이스 정의
  - postLogin 함수 (email, password 받아서 User 엔티티 반환)
  - ApiResponse<T> 래핑
  - DTO → Entity 변환 로직
- **기존 패턴 준수**: `packages/api/src/[domain]/[동사][자원].ts` 네이밍 규칙

### 3. Mobile App - apiClient 초기화

- **위치**: `apps/mobile/src/configs/api/apiClient.ts`
- **목적**: @mockly/api에서 제공하는 apiClient 인스턴스화
- **구현 내용**:
  - apiClient 생성 (baseURL 환경변수 사용)
  - export하여 앱 전역에서 사용
- **기존 패턴 준수**: shared 디렉토리의 초기화 코드 패턴

### 4. Design System - Input 컴포넌트 추가

- **위치**: `packages/design-system/src/components/Input/`
- **목적**: 재사용 가능한 텍스트 입력 컴포넌트
- **구현 내용**:
  - Input.tsx - TextInput 래핑, variant/size props 지원, cva 활용
  - Input.stories.tsx - Storybook 스토리 (필수)
  - index.ts - export
  - tw 객체로 인라인 스타일링
- **기존 패턴 준수**: Button 컴포넌트와 동일한 디렉토리 구조, cva variant 정의

### 5. Mobile App - Auth Store (Zustand)

- **위치**: `apps/mobile/src/features/auth/store/useAuthStore.ts`
- **목적**: 전역 인증 상태 관리
- **구현 내용**:
  - user, isAuthenticated 상태
  - login, logout 액션
  - Zustand create 패턴
- **기존 패턴 준수**: features 디렉토리 내 store 위치

### 6. Mobile App - LoginScreen 구현

- **위치**: `apps/mobile/src/app/screens/LoginScreen.tsx`
- **목적**: 로그인 UI 화면
- **구현 내용**:
  - @mockly/api의 postLogin 함수 직접 호출
  - @mockly/design-system의 Input, Button 컴포넌트 사용
  - tw 객체로 인라인 스타일링 (StyleSheet.create 사용 금지)
  - Props 최대한 활용, style prop은 최후의 수단
  - 클라이언트 사이드 유효성 검증
  - 로딩 중 버튼 비활성화
- **기존 패턴 준수**: app/screens 위치, tw 인라인 스타일링

### 7. Mobile App - Navigation 설정

- **위치**: `apps/mobile/src/app/navigation/AppNavigator.tsx`
- **목적**: 인증 상태 기반 조건부 네비게이션
- **구현 내용**:
  - useAuthStore에서 isAuthenticated 구독
  - isAuthenticated에 따라 Login 화면 또는 Home 화면 표시
  - early return을 활용한 조건부 렌더링
- **기존 패턴 준수**: app/navigation 위치

## ✅ 성공 기준

- [ ] 사용자가 이메일과 비밀번호 입력
- [ ] 로그인 버튼 클릭 시 @mockly/api 함수로 API 호출
- [ ] 성공 시 Zustand 스토어 업데이트 및 홈 화면 이동
- [ ] 실패 시 적절한 에러 메시지 표시
- [ ] 로딩 중 버튼 비활성화 및 로딩 인디케이터 표시
- [ ] 이메일 형식 및 비밀번호 길이 검증
- [ ] tw 객체로 인라인 스타일링, cva로 variant 정의
- [ ] 기존 컴포넌트의 Props 최대한 활용
- [ ] 기존 코드 스타일 및 아키텍처 일관성 유지
- [ ] 테스트 파일 위치: 패키지루트/**tests**
- [ ] 프론트엔드 테스트: 사용자 관점 (클릭, 입력, 화면 표시)

## 🔍 확인 사항

- API 엔드포인트 baseURL을 환경변수로 설정할까요?
- 로그인 성공 후 토큰을 어디에 저장할까요? (AsyncStorage, SecureStore 등)
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
