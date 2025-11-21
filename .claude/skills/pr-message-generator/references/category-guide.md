# 카테고리 분류 가이드

이 문서는 PR 메시지 작성 시 변경사항을 적절한 카테고리로 분류하는 방법을 제공합니다.

## 카테고리 결정 흐름도

```
변경사항 분석
    ↓
파일 경로 확인 → 카테고리 추론
    ↓
파일 내용 확인 → 카테고리 조정
    ↓
커밋 메시지 확인 → 카테고리 확정
```

## 프론트엔드 프로젝트 카테고리

### 1. 빌드 및 설정 (Build & Configuration)

**포함 내용:**

- 패키지 의존성 변경 (package.json)
- 빌드 도구 설정 (vite.config, webpack.config, metro.config)
- TypeScript 설정 (tsconfig.json)
- Lint/Prettier 설정 (.eslintrc, .prettierrc)
- 환경 변수 (.env)
- CI/CD 설정 (.github/workflows)

**파일 패턴:**

- `package.json`
- `*.config.js`, `*.config.ts`
- `tsconfig.json`
- `.eslintrc.*`, `.prettierrc.*`
- `.env*`
- `.github/workflows/*`

**예시:**

```markdown
### 빌드 및 설정

- twrnc 라이브러리로 마이그레이션 (NativeWind 제거)
- TypeScript strict 모드 활성화
- ESLint 규칙 업데이트 (import 순서 자동 정렬)
- Vite 빌드 최적화 설정 추가
```

### 2. UI 컴포넌트 (UI Components)

**포함 내용:**

- 새로운 컴포넌트 추가
- 기존 컴포넌트 수정
- 컴포넌트 구조 변경
- Props 인터페이스 변경

**파일 패턴:**

- `components/**/*.tsx`
- `src/components/**/*`
- `*.component.tsx`

**예시:**

```markdown
### UI 컴포넌트

#### Button 컴포넌트

- variant: primary, secondary, outline
- size: small, medium, large
- disabled 상태 지원
- loading indicator 추가

#### Input 컴포넌트

- label, error, helperText props 추가
- 포커스 상태 애니메이션
- 비밀번호 토글 기능
```

### 3. 페이지 / 스크린 (Pages / Screens)

**포함 내용:**

- 새로운 페이지/스크린 추가
- 기존 페이지 레이아웃 변경
- 페이지별 상태 관리

**파일 패턴:**

- `pages/**/*.tsx`
- `screens/**/*.tsx`
- `src/pages/**/*`
- `src/screens/**/*`

**예시:**

```markdown
### 페이지 / 스크린

- 로그인 페이지 추가 (screens/LoginScreen.tsx)
- 대시보드 레이아웃 개선 (그리드 → 플렉스 박스)
- 프로필 페이지 탭 네비게이션 추가
```

### 4. 상태 관리 (State Management)

**포함 내용:**

- 전역 상태 관리 (Redux, Zustand, Recoil 등)
- Context API
- 상태 관리 로직
- Store 설정

**파일 패턴:**

- `store/**/*`
- `redux/**/*`
- `context/**/*`
- `*Context.tsx`
- `*Store.ts`

**예시:**

```markdown
### 상태 관리

- Zustand를 사용한 전역 인증 상태 관리
- userStore: 사용자 정보 및 로그인 상태
- authStore: 토큰 관리 및 자동 로그인
- Context API로 테마 상태 관리 (light/dark mode)
```

### 5. API 연동 (API Integration)

**포함 내용:**

- API 호출 함수
- HTTP 클라이언트 설정
- API 응답 타입 정의
- 에러 핸들링

**파일 패턴:**

- `api/**/*`
- `services/**/*`
- `*Api.ts`, `*Service.ts`
- `lib/api/*`

**예시:**

```markdown
### API 연동

- axios 인스턴스 설정 (baseURL, timeout, interceptors)
- authApi: 로그인, 회원가입, 토큰 갱신 API
- userApi: 사용자 정보 조회/수정 API
- 에러 응답 통합 핸들링 (401 → 자동 로그아웃)
```

### 6. 네비게이션 / 라우팅 (Navigation / Routing)

**포함 내용:**

- 라우팅 설정
- 네비게이션 구조
- 딥링크 설정

**파일 패턴:**

- `navigation/**/*`
- `routes/**/*`
- `App.tsx` (라우팅 부분)

**예시:**

```markdown
### 네비게이션 / 라우팅

- React Navigation 스택 네비게이터 설정
- 인증 플로우 분기 (로그인 전/후)
- 탭 네비게이션 추가 (홈, 검색, 프로필)
- 딥링크 스키마 설정
```

### 7. 스타일링 / 디자인 시스템 (Styling / Design System)

**포함 내용:**

- 디자인 토큰
- 테마 설정
- 전역 스타일
- CSS/Styled Components

**파일 패턴:**

- `styles/**/*`
- `theme/**/*`
- `tailwind.config.js`
- `*.styles.ts`

**예시:**

```markdown
### 스타일링 / 디자인 시스템

- 디자인 토큰 정의
  - colors: primary, secondary, accent, error, warning, success
  - spacing: xs(4), sm(8), md(16), lg(24), xl(32)
  - fontSize: xs(12), sm(14), md(16), lg(18), xl(24)
- 다크모드 테마 추가
- 공통 애니메이션 유틸리티
```

### 8. 유틸리티 / 훅 (Utilities / Hooks)

**포함 내용:**

- 커스텀 훅
- 유틸리티 함수
- 헬퍼 함수
- 공통 로직

**파일 패턴:**

- `hooks/**/*`
- `utils/**/*`
- `helpers/**/*`
- `lib/**/*`
- `use*.ts`

**예시:**

```markdown
### 유틸리티 / 훅

- useAuth 훅: 로그인 상태 관리 및 인증 로직
- useForm 훅: 폼 검증 및 상태 관리
- formatDate 유틸: 날짜 포맷팅 함수
- cn 유틸: className 조합 함수 (clsx + tailwind-merge)
```

### 9. 테스트 (Testing)

**포함 내용:**

- 단위 테스트
- 통합 테스트
- E2E 테스트
- 테스트 설정

**파일 패턴:**

- `__tests__/**/*`
- `*.test.ts`, `*.test.tsx`
- `*.spec.ts`, `*.spec.tsx`
- `jest.config.js`
- `cypress/**/*`

**예시:**

```markdown
### 테스트

- Button 컴포넌트 렌더링 테스트
- useAuth 훅 로직 테스트 (로그인/로그아웃)
- 로그인 플로우 E2E 테스트 (Detox)
- Jest 설정 업데이트 (React Native 0.82 호환)
```

### 10. 문서화 (Documentation)

**포함 내용:**

- README
- 주석
- Storybook
- API 문서

**파일 패턴:**

- `README.md`
- `docs/**/*`
- `*.stories.tsx`
- `*.mdx`

**예시:**

```markdown
### 문서화

- README에 프로젝트 구조 설명 추가
- 각 컴포넌트별 Storybook 스토리 작성
- API 연동 가이드 문서 작성 (docs/api-guide.md)
- 주요 함수에 JSDoc 주석 추가
```

## 백엔드 프로젝트 카테고리

### 1. API 엔드포인트 (API Endpoints)

**포함 내용:**

- REST API 라우트
- GraphQL resolver
- 컨트롤러

**파일 패턴:**

- `routes/**/*`
- `controllers/**/*`
- `resolvers/**/*`
- `*Controller.ts`, `*Router.ts`

**예시:**

```markdown
### API 엔드포인트

- POST /api/auth/login - 로그인
- POST /api/auth/register - 회원가입
- GET /api/users/:id - 사용자 정보 조회
- PUT /api/users/:id - 사용자 정보 수정
- DELETE /api/users/:id - 사용자 삭제
```

### 2. 비즈니스 로직 (Business Logic)

**포함 내용:**

- 서비스 계층
- 도메인 로직
- 비즈니스 규칙

**파일 패턴:**

- `services/**/*`
- `domain/**/*`
- `*Service.ts`

**예시:**

```markdown
### 비즈니스 로직

- AuthService: JWT 토큰 생성 및 검증
- UserService: 사용자 CRUD 로직
- EmailService: 이메일 발송 기능
- 비밀번호 검증 규칙 (8자 이상, 특수문자 포함)
```

### 3. 데이터베이스 / 모델 (Database / Models)

**포함 내용:**

- DB 스키마
- ORM 모델
- 마이그레이션
- 시드 데이터

**파일 패턴:**

- `models/**/*`
- `entities/**/*`
- `migrations/**/*`
- `schema/**/*`
- `prisma/schema.prisma`

**예시:**

```markdown
### 데이터베이스 / 모델

- User 모델 생성
  - id, email, password, name, createdAt, updatedAt
- Post 모델에 authorId 외래키 추가
- 마이그레이션: users 테이블에 isVerified 컬럼 추가
- 인덱스 추가: users.email (UNIQUE)
```

### 4. 인증 / 인가 (Authentication / Authorization)

**포함 내용:**

- 인증 로직
- 권한 검증
- JWT/세션 관리

**파일 패턴:**

- `auth/**/*`
- `guards/**/*`
- `strategies/**/*`

**예시:**

```markdown
### 인증 / 인가

- JWT 토큰 기반 인증 구현
- Refresh token 로직 추가
- RBAC (Role-Based Access Control) 미들웨어
- 관리자 권한 검증 guard
```

### 5. 미들웨어 (Middleware)

**포함 내용:**

- Express 미들웨어
- 요청/응답 처리
- 에러 핸들링

**파일 패턴:**

- `middleware/**/*`
- `*Middleware.ts`

**예시:**

```markdown
### 미들웨어

- authMiddleware: JWT 토큰 검증
- errorHandler: 통합 에러 핸들링
- rateLimiter: API 요청 제한 (100req/15min)
- logger: 요청/응답 로깅
```

### 6. 설정 및 환경변수 (Configuration)

**포함 내용:**

- 환경 설정
- DB 연결 설정
- 외부 서비스 설정

**파일 패턴:**

- `config/**/*`
- `.env*`
- `*Config.ts`

**예시:**

```markdown
### 설정 및 환경변수

- DB 연결 풀 설정 (max: 20)
- Redis 세션 스토어 설정
- AWS S3 파일 업로드 설정
- CORS 정책 업데이트
```

### 7. 테스트 (Testing)

**포함 내용:**

- 단위 테스트
- 통합 테스트
- API 테스트

**파일 패턴:**

- `__tests__/**/*`
- `*.test.ts`
- `*.spec.ts`

**예시:**

```markdown
### 테스트

- AuthService 단위 테스트
- /api/auth/login 통합 테스트
- 인증 미들웨어 테스트
- E2E 테스트: 회원가입 → 로그인 플로우
```

### 8. 문서화 (Documentation)

**포함 내용:**

- API 문서
- README
- 주석

**파일 패턴:**

- `docs/**/*`
- `README.md`
- `swagger.yaml`

**예시:**

```markdown
### 문서화

- Swagger API 문서 자동 생성 설정
- 각 엔드포인트에 JSDoc 주석 추가
- 데이터베이스 ERD 다이어그램 추가
- 환경 설정 가이드 작성
```

## 풀스택 / 공통 카테고리

### 1. 인프라 / DevOps

**포함 내용:**

- Docker 설정
- CI/CD 파이프라인
- 배포 스크립트
- 모니터링 설정

**파일 패턴:**

- `Dockerfile`, `docker-compose.yml`
- `.github/workflows/**/*`
- `deploy/**/*`
- `scripts/**/*`

**예시:**

```markdown
### 인프라 / DevOps

- Docker 멀티스테이지 빌드 설정
- GitHub Actions CI 파이프라인 (테스트 자동화)
- Vercel 배포 설정
- Sentry 에러 모니터링 추가
```

### 2. 보안 (Security)

**포함 내용:**

- 보안 관련 업데이트
- 취약점 수정
- 암호화 로직

**예시:**

```markdown
### 보안

- bcrypt 해싱 rounds 12로 증가
- SQL Injection 방지 (Prepared Statement)
- XSS 방지 (입력값 sanitize)
- HTTPS 강제 리다이렉트 설정
```

### 3. 성능 최적화 (Performance)

**포함 내용:**

- 성능 개선
- 캐싱
- 쿼리 최적화

**예시:**

```markdown
### 성능 최적화

- React.memo로 불필요한 리렌더링 방지
- DB 인덱스 추가로 쿼리 속도 70% 개선
- Redis 캐싱 적용 (사용자 프로필 조회)
- 이미지 lazy loading 구현
```

## 카테고리 결정 가이드

### 파일 경로 기반 자동 분류

| 파일 경로                      | 카테고리                                       |
| ------------------------------ | ---------------------------------------------- |
| `components/`                  | UI 컴포넌트                                    |
| `pages/`, `screens/`           | 페이지 / 스크린                                |
| `hooks/`                       | 유틸리티 / 훅                                  |
| `utils/`, `helpers/`           | 유틸리티 / 훅                                  |
| `api/`, `services/`            | API 연동 (FE) / 비즈니스 로직 (BE)             |
| `store/`, `redux/`, `context/` | 상태 관리                                      |
| `styles/`, `theme/`            | 스타일링 / 디자인 시스템                       |
| `navigation/`, `routes/`       | 네비게이션 / 라우팅 (FE) / API 엔드포인트 (BE) |
| `models/`, `entities/`         | 데이터베이스 / 모델                            |
| `middleware/`                  | 미들웨어                                       |
| `config/`                      | 설정 및 환경변수                               |
| `__tests__/`, `*.test.*`       | 테스트                                         |
| `docs/`, `*.stories.*`         | 문서화                                         |
| `package.json`, `*.config.*`   | 빌드 및 설정                                   |

### 애매한 경우 결정 기준

1. **주요 변경사항 기준**: 파일이 여러 역할을 한다면 주된 변경사항으로 분류
2. **파일 위치 우선**: 파일 경로가 명확한 카테고리를 나타낸다면 그것을 따름
3. **커밋 메시지 참고**: 커밋 메시지의 타입(feat, fix 등)과 내용 참고
4. **리뷰어 관점**: 리뷰어가 가장 이해하기 쉬운 분류 선택

### 예시: LoginScreen.tsx 분류

```
파일: screens/LoginScreen.tsx
변경 내용: 로그인 폼 UI + 인증 API 호출 로직

옵션 1: 페이지 / 스크린 (파일 위치 기준)
옵션 2: API 연동 (주요 로직 기준)

→ 결정: "페이지 / 스크린" (파일 위치가 명확하고, API 연동은 부수적)
```

### 예시: useAuth.ts 분류

```
파일: hooks/useAuth.ts
변경 내용: 인증 상태 관리 + API 호출

옵션 1: 유틸리티 / 훅 (파일 위치 기준)
옵션 2: 상태 관리 (주요 로직 기준)

→ 결정: "유틸리티 / 훅" (훅이 상태와 API를 통합 제공하는 역할)
```

## 작성 시 주의사항

1. **너무 많은 카테고리 지양**: 5-8개 정도가 적절
2. **일관성 유지**: 같은 프로젝트 내에서 비슷한 분류 기준 사용
3. **명확한 제목**: 카테고리 이름만 보고도 내용을 짐작할 수 있도록
4. **논리적 순서**: 중요도 또는 의존성 순서로 카테고리 나열
5. **유연성**: 프로젝트 특성에 맞게 카테고리 조정 가능
