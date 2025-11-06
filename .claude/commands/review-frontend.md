---
description: 프론트엔드 코드에 대한 리뷰를 수행합니다
---

현재 git 변경사항을 **프론트엔드 관점**에서 검토하고 다음 항목들을 확인해주세요:

## 검토 항목

### 1. 코드 품질
- 컴포넌트 구조 및 재사용성
- 네이밍 컨벤션 (PascalCase for components, camelCase for functions)
- 코드 중복 및 DRY 원칙
- Props drilling 문제

### 2. React/프론트엔드 특화
- 불필요한 리렌더링 방지 (useMemo, useCallback, React.memo)
- 상태 관리 적절성 (로컬 vs 글로벌 상태)
- useEffect 의존성 배열 정확성
- 이벤트 핸들러 메모리 누수 체크
- null/undefined 체크 및 옵셔널 체이닝 사용

### 3. 성능
- 번들 사이즈 최적화 (코드 스플리팅, lazy loading)
- 이미지 최적화 (lazy loading, 적절한 포맷)
- 무한 스크롤/가상화 필요성
- API 호출 최적화 (중복 요청, 캐싱)

### 4. 보안
- **XSS (Cross-Site Scripting)** 취약점
  - dangerouslySetInnerHTML 사용 검토
  - 사용자 입력 sanitization
- **민감 정보 노출**
  - API 키, 토큰이 클라이언트 코드에 하드코딩되지 않았는지
  - 환경 변수 적절한 사용
- **CSRF** 방지
- 입력 유효성 검사 (클라이언트 측)

### 5. 접근성 (Accessibility)
- 시맨틱 HTML 사용
- ARIA 속성 적절성
- 키보드 네비게이션
- 스크린 리더 호환성

### 6. 타입 안전성 (TypeScript)
- any 타입 사용 최소화
- Props 타입 정의
- API 응답 타입 정의

각 항목에 대해 구체적인 피드백을 제공하고, 개선이 필요한 부분은 코드 예시와 함께 제안해주세요.
