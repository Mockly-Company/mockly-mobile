---
name: auto-test-generator
description: 코드 변경을 감지하고 프론트엔드/백엔드 테스트 코드를 자동으로 생성하거나 업데이트하는 스킬
---

# 자동 테스트 생성기

이 스킬은 변경된 코드를 분석하여 적절한 테스트 코드를 자동으로 생성하거나 업데이트합니다.

## 실행 프로세스

### 1단계: 변경사항 감지 및 분석

먼저 git diff를 통해 변경된 파일을 확인합니다:

```bash
# Staged와 unstaged 변경사항 모두 확인
git diff HEAD
git status --short
```

다음 기준으로 파일 타입을 자동 분류:

- **프론트엔드**: `*.tsx`, `*.jsx`, `src/components/*`, `src/hooks/*`, `src/pages/*`
- **백엔드**: `*.controller.ts`, `*.service.ts`, `*.route.ts`, `src/api/*`, `src/services/*`

### 2단계: 코드 분석

변경된 각 파일을 읽고 다음 요소를 파악:

- 새로 추가된 함수/메서드
- 변경된 함수 시그니처
- 새로운 컴포넌트
- 변경된 Props 인터페이스
- 새로운 API 엔드포인트
- 변경된 비즈니스 로직

### 3단계: 테스트 전략 수립

파일 타입에 따라 적절한 테스트 전략을 선택:

#### 프론트엔드 테스트

- **React 컴포넌트**: `templates/frontend-component-test.md` 참고
- **Custom Hooks**: `templates/frontend-hook-test.md` 참고
- **유틸리티 함수**: `templates/frontend-util-test.md` 참고

#### 백엔드 테스트

- **API 엔드포인트**: `templates/backend-api-test.md` 참고
- **Service 레이어**: `templates/backend-service-test.md` 참고
- **Repository**: `templates/backend-repository-test.md` 참고

### 4단계: 테스트 파일 생성/업데이트

**중요**: 모든 테스트 파일은 `FORMS.md`에 정의된 출력 형식을 따라야 합니다.

#### 테스트 파일 위치 규칙

- **프론트엔드**: 소스 파일과 같은 디렉토리
  - `ComponentName.tsx` → `ComponentName.test.tsx`
  - `useHook.ts` → `useHook.test.ts`
- **백엔드**: 소스 파일과 같은 디렉토리
  - `user.service.ts` → `user.service.test.ts`
  - `user.controller.ts` → `user.controller.test.ts`

#### 출력 형식 (FORMS.md 참고)

생성되는 테스트 파일은 다음 구조를 따릅니다:

- 파일 메타데이터 (주석)
- Import 문
- describe 블록 (섹션별 구분)
- AAA 패턴 (Arrange-Act-Assert)
- 명확한 테스트 이름
- Mock 데이터 정의

자세한 형식은 `FORMS.md` 문서를 참고하세요.

#### 기존 테스트 파일이 있는 경우

1. 파일을 읽어 현재 테스트 케이스 파악
2. 변경된 코드에 맞춰 테스트 업데이트
3. 새로운 기능에 대한 테스트 추가
4. Deprecated된 테스트 제거 또는 주석 처리
5. FORMS.md 형식 준수 확인

### 5단계: 결과 리포트 생성

**중요**: 리포트 형식은 `FORMS.md`의 "완료 리포트" 섹션을 따라야 합니다.

다음 형식으로 결과를 리포트:

```
🔍 변경사항 스캔 완료

📁 감지된 변경 파일:
  - src/components/UserProfile.tsx (프론트엔드)
  - src/services/userService.ts (백엔드)

⚙️ 테스트 생성 중...

✅ 생성 완료:
  - src/components/UserProfile.test.tsx (4 test cases)
    └─ should render user information
    └─ should handle edit button click
    └─ should display loading state
    └─ should handle error state

  - src/services/userService.test.ts (6 test cases)
    └─ should fetch user by id
    └─ should create new user
    └─ should update user
    └─ should delete user
    └─ should handle database errors
    └─ should validate user data

📊 테스트 커버리지: 87%
```

## 테스트 품질 체크리스트

생성된 모든 테스트는 다음 기준을 충족해야 합니다:

### 공통 기준

- [ ] 테스트 이름이 명확하고 설명적
- [ ] Arrange-Act-Assert 패턴 준수
- [ ] 테스트가 독립적이고 순서에 의존하지 않음
- [ ] Mock/Stub이 적절하게 사용됨
- [ ] 엣지 케이스를 다룸

### 프론트엔드 추가 기준

- [ ] 사용자 시나리오를 테스트
- [ ] 접근성(a11y)을 고려
- [ ] 비동기 작업을 올바르게 처리
- [ ] 에러 상태를 테스트

### 백엔드 추가 기준

- [ ] 인증/인가를 테스트
- [ ] 입력 검증을 테스트
- [ ] DB 트랜잭션을 올바르게 처리
- [ ] 에러 응답이 적절

## 사용 예시

```
# 스킬 직접 호출
auto-test-generator

# 자연어 요청
"변경된 코드에 대한 테스트 생성해줘"
"UserProfile 컴포넌트 테스트 코드 만들어줘"
"userService의 테스트 업데이트해줘"
```

## 주의사항

1. **Mock 데이터**: 실제 API나 DB를 호출하지 않도록 Mock 사용
2. **테스트 격리**: 각 테스트는 독립적으로 실행 가능해야 함
3. **빠른 실행**: 단위 테스트는 빠르게 실행되어야 함 (< 100ms per test)
4. **의미 있는 테스트**: 단순히 커버리지를 위한 테스트는 지양
5. **유지보수**: 코드가 변경되면 테스트도 함께 업데이트

## 필수 의존성

이 스킬은 다음 패키지가 설치되어 있다고 가정합니다:

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/react-hooks": "^8.0.1",
    "@testing-library/jest-dom": "^6.1.5",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "@types/jest": "^29.5.11",
    "@types/supertest": "^6.0.2"
  }
}
```

설치되지 않은 경우:

```bash
npm install --save-dev @testing-library/react @testing-library/react-hooks @testing-library/jest-dom jest supertest @types/jest @types/supertest
```
