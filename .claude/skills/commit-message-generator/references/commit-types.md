# 커밋 타입 상세 가이드

이 문서는 각 커밋 타입의 의미, 사용 시점, 그리고 프론트엔드/백엔드 예시를 제공합니다.

## 타입 정의표

| 태그     | 의미                        | 사용 시점                                                           |
| -------- | --------------------------- | ------------------------------------------------------------------- |
| feat     | 새로운 기능 추가            | 새로운 페이지, 컴포넌트, 훅, API 연동 등 새로운 기능을 구현했을 때  |
| fix      | 버그 수정                   | 기존 기능이 오동작하는 문제를 해결했을 때                           |
| docs     | 문서 관련 수정              | README, 주석, API 문서 등 코드 실행에 영향 없는 문서 변경           |
| style    | 코드 스타일 수정            | 코드 동작에는 영향 없고, 들여쓰기·세미콜론·공백·lint 등 포맷팅 변경 |
| refactor | 리팩터링 (기능 변화 없음)   | 동작은 같지만 코드 구조/가독성/재사용성을 개선할 때                 |
| test     | 테스트 코드 추가 또는 수정  | Jest, Vitest, Cypress 등 테스트 코드 관련 변경                      |
| chore    | 잡무, 빌드나 설정 관련 변경 | 패키지 버전 업데이트, lint 설정 수정, dev script 추가 등            |
| perf     | 성능 개선                   | 렌더링 최적화, 메모이제이션, API 응답 처리 개선 등                  |
| ci       | CI/CD 설정 변경             | GitHub Actions, Jenkins, Vercel, Netlify 등 파이프라인 관련 변경    |
| build    | 빌드 시스템이나 의존성 변경 | webpack, vite, babel, tsconfig 등 빌드 관련 수정                    |
| revert   | 이전 커밋 되돌리기          | 잘못된 커밋을 되돌릴 때 (자동 생성 메시지로 남기는 게 일반적)       |

## 프론트엔드 예시

### feat (새로운 기능 추가)

```
[feat] 회원가입 폼 검증 기능 추가
[feat] 다크모드 토글 추가
[feat] 무한 스크롤 구현
[feat] 사용자 프로필 페이지 추가
```

**사용 상황:**

- 새로운 페이지 추가
- 새로운 컴포넌트 생성
- 새로운 커스텀 훅 구현
- 새로운 API 엔드포인트 연동
- 새로운 기능의 UI/UX 구현

### fix (버그 수정)

```
[fix] 로그인 실패 시 에러 메시지 안 나오는 문제 수정
[fix] 모바일에서 메뉴가 안 닫히는 버그 수정
[fix] 프로필 이미지 업로드 실패 오류 해결
[fix] 날짜 포맷 표시 오류 수정
```

**사용 상황:**

- 기능이 의도대로 동작하지 않을 때
- 특정 조건에서 에러가 발생할 때
- UI가 깨지거나 잘못 표시될 때
- 데이터가 올바르게 처리되지 않을 때

### docs (문서 수정)

```
[docs] README에 설치 가이드 추가
[docs] API 연동 방법 주석 추가
[docs] 컴포넌트 사용 예시 문서화
[docs] 프로젝트 구조 설명 업데이트
```

**사용 상황:**

- README 파일 작성 또는 수정
- 코드 주석 추가 또는 개선
- 사용 가이드 작성
- API 문서 업데이트

### style (코드 스타일 수정)

```
[style] prettier 포맷 적용
[style] import 순서 정렬
[style] 들여쓰기 및 공백 정리
[style] ESLint 규칙에 맞게 코드 포맷팅
```

**사용 상황:**

- prettier, ESLint 등으로 코드 포맷팅
- import 문 순서 정렬
- 불필요한 공백 제거
- 코드 정렬 및 들여쓰기 수정
- 세미콜론 추가/제거 (기능 변화 없음)

### refactor (리팩터링)

```
[refactor] SignupForm 컴포넌트 구조 단순화
[refactor] API 호출 로직을 커스텀 훅으로 분리
[refactor] 중복된 스타일 코드 통합
[refactor] 조건부 렌더링 로직 개선
```

**사용 상황:**

- 컴포넌트 구조 개선 (동작은 동일)
- 복잡한 로직을 함수/훅으로 분리
- 중복 코드 제거
- 변수명, 함수명 개선
- 코드 가독성 향상

### test (테스트 코드)

```
[test] useAuth 훅 단위 테스트 추가
[test] LoginForm 컴포넌트 테스트 작성
[test] API 모킹 테스트 추가
[test] E2E 테스트 시나리오 추가
```

**사용 상황:**

- Jest, Vitest로 단위 테스트 작성
- React Testing Library로 컴포넌트 테스트
- Cypress, Playwright로 E2E 테스트
- 기존 테스트 수정 또는 보완

### chore (잡무/설정)

```
[chore] eslint 규칙 업데이트
[chore] npm 패키지 버전 업그레이드
[chore] husky pre-commit 훅 추가
[chore] 개발 환경 설정 파일 추가
```

**사용 상황:**

- 패키지 의존성 업데이트
- Lint, Prettier 설정 변경
- Git hooks 설정
- 환경 변수 설정
- dev 스크립트 추가

### perf (성능 개선)

```
[perf] 이미지 로딩 지연 렌더링 적용
[perf] React.memo로 불필요한 리렌더링 방지
[perf] useMemo로 계산 비용 최적화
[perf] 번들 사이즈 최적화를 위한 코드 스플리팅
```

**사용 상황:**

- 렌더링 성능 최적화 (React.memo, useMemo, useCallback)
- 이미지 lazy loading
- 코드 스플리팅
- 번들 사이즈 감소
- API 응답 캐싱

### ci (CI/CD 설정)

```
[ci] Github Actions 캐시 설정 추가
[ci] Vercel 배포 설정 수정
[ci] 자동 테스트 워크플로우 추가
[ci] 빌드 파이프라인 최적화
```

**사용 상황:**

- GitHub Actions 워크플로우 추가/수정
- Vercel, Netlify 배포 설정
- Jenkins 파이프라인 구성
- 자동 테스트/빌드/배포 설정

### build (빌드 시스템)

```
[build] vite 설정 수정 (alias 경로 추가)
[build] webpack 번들 최적화 설정
[build] tsconfig 경로 매핑 추가
[build] babel 플러그인 추가
```

**사용 상황:**

- Vite, Webpack 설정 변경
- Babel, TypeScript 설정 수정
- 경로 alias 설정
- 빌드 최적화 설정

### revert (커밋 되돌리기)

```
[revert] feat: 회원가입 폼 검증 기능 추가
[revert] fix: 로그인 실패 시 에러 메시지 표시 오류 수정
```

**사용 상황:**

- 이전 커밋을 되돌려야 할 때
- 일반적으로 `git revert` 명령으로 자동 생성됨
- 수동 작성 시 되돌린 커밋의 제목을 그대로 사용

## 백엔드 예시 (참고용)

### feat

```
[feat] 사용자 인증 API 엔드포인트 추가
[feat] 주문 생성 비즈니스 로직 구현
[feat] 이메일 발송 서비스 추가
```

### fix

```
[fix] JWT 토큰 만료 시간 검증 오류 수정
[fix] DB 트랜잭션 롤백 처리 누락 수정
[fix] API 응답 상태 코드 오류 수정
```

### refactor

```
[refactor] 사용자 서비스 계층 구조 개선
[refactor] DB 쿼리 최적화
[refactor] 중복된 검증 로직 유틸 함수로 분리
```

### perf

```
[perf] DB 인덱스 추가로 쿼리 성능 개선
[perf] Redis 캐싱 적용
[perf] N+1 쿼리 문제 해결
```

### test

```
[test] 사용자 인증 서비스 단위 테스트 추가
[test] API 통합 테스트 작성
[test] 엣지 케이스 테스트 보완
```

## 타입 선택이 애매한 경우

### refactor vs feat

- **refactor**: 기능은 그대로, 내부 구조만 개선
- **feat**: 새로운 기능이 추가되거나 기능이 확장됨

예시:

- `[refactor] 로그인 컴포넌트 구조 개선` (기능 동일)
- `[feat] 소셜 로그인 기능 추가` (새 기능)

### fix vs refactor

- **fix**: 잘못 동작하던 것을 고침
- **refactor**: 원래 잘 동작했지만 코드를 개선

예시:

- `[fix] 버튼 클릭 시 폼이 제출되지 않는 버그 수정` (버그)
- `[refactor] 버튼 클릭 핸들러 로직 분리` (개선)

### chore vs build

- **chore**: 일반적인 프로젝트 관리 작업
- **build**: 빌드 시스템 자체의 설정 변경

예시:

- `[chore] 패키지 버전 업데이트` (의존성 관리)
- `[build] vite 빌드 설정 최적화` (빌드 도구)

### style vs refactor

- **style**: 코드 포맷팅만 변경 (prettier, lint)
- **refactor**: 코드 구조나 로직 개선

예시:

- `[style] prettier 포맷 적용` (포맷팅)
- `[refactor] 복잡한 조건문 단순화` (로직 개선)

## 결정 가이드라인

1. **주된 변경사항 우선**: 여러 타입이 섞여있다면 가장 중요한 변경사항의 타입을 선택
2. **기능 우선**: feat와 다른 타입이 섞여있다면 일반적으로 feat 사용
3. **커밋 분리 고려**: 너무 많은 타입이 섞여있다면 커밋을 여러 개로 나누는 것을 고려
