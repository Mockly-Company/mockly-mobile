# Auto Test Generator Skill

코드 변경을 자동으로 감지하고 테스트 코드를 생성하는 Claude Code 스킬입니다.

## 📁 폴더 구조

```
auto-test-generator/
├── SKILL.md                          # 스킬 메인 파일 (대문자)
├── README.md                         # 이 파일
├── FORMS.md                          # 출력 형식 정의
└── templates/                        # 테스트 템플릿
    ├── frontend-component-test.md    # React 컴포넌트 테스트
    ├── frontend-hook-test.md         # Custom Hook 테스트
    ├── frontend-util-test.md         # 유틸리티 함수 테스트
    ├── backend-api-test.md           # API 엔드포인트 테스트
    └── backend-service-test.md       # Service 레이어 테스트
```

## 🚀 사용 방법

### 기본 사용

```
auto-test-generator
```

### 자연어 요청

```
"변경된 코드에 대한 테스트 생성해줘"
"UserProfile 컴포넌트 테스트 코드 만들어줘"
"userService의 CRUD 테스트 작성해줘"
```

## 📝 템플릿 가이드

### 프론트엔드 템플릿

#### 1. `frontend-component-test.md`

React 컴포넌트 테스트를 위한 템플릿

**포함 내용:**

- 렌더링 테스트
- Props 테스트
- 사용자 이벤트 테스트
- 조건부 렌더링 테스트
- 비동기 작업 테스트
- 접근성(a11y) 테스트

**사용 케이스:**

- `.tsx`, `.jsx` 파일
- `src/components/` 디렉토리
- `src/pages/` 디렉토리

#### 2. `frontend-hook-test.md`

Custom Hook 테스트를 위한 템플릿

**포함 내용:**

- 초기화 테스트
- 상태 업데이트 테스트
- Effect 테스트
- Cleanup 테스트
- Context 통합 테스트

**사용 케이스:**

- `useXxx.ts` 파일
- `src/hooks/` 디렉토리

#### 3. `frontend-util-test.md`

유틸리티 함수 테스트를 위한 템플릿

**포함 내용:**

- 정상/엣지/에러 케이스
- 문자열/배열/객체 처리
- 날짜/시간 처리
- 비동기 함수 테스트
- 타입 체크 함수 테스트

**사용 케이스:**

- `src/utils/` 디렉토리
- `src/helpers/` 디렉토리
- Pure function 파일

### 백엔드 템플릿

#### 1. `backend-api-test.md`

API 엔드포인트 테스트를 위한 템플릿

**포함 내용:**

- GET/POST/PUT/DELETE 테스트
- 인증/인가 테스트
- 쿼리 파라미터 테스트
- 파일 업로드 테스트
- 에러 처리 테스트

**사용 케이스:**

- `*.controller.ts` 파일
- `*.route.ts` 파일
- `src/api/` 디렉토리

#### 2. `backend-service-test.md`

Service 레이어 테스트를 위한 템플릿

**포함 내용:**

- CRUD 작업 테스트
- 비즈니스 로직 테스트
- 트랜잭션 테스트
- 외부 서비스 통합 테스트
- 캐싱 테스트
- 권한 확인 테스트

**사용 케이스:**

- `*.service.ts` 파일
- `src/services/` 디렉토리

## 🎯 생성되는 테스트 예시

### React 컴포넌트

**입력:** `src/components/Button.tsx`

```typescript
export const Button = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};
```

**출력:** `src/components/Button.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### API 엔드포인트

**입력:** `src/api/users.controller.ts`

```typescript
app.get('/api/users/:id', async (req, res) => {
  const user = await userService.findById(req.params.id);
  res.json(user);
});
```

**출력:** `src/api/users.controller.test.ts`

```typescript
import request from 'supertest';
import { app } from '../app';

describe('GET /api/users/:id', () => {
  it('should return user by id', async () => {
    const response = await request(app).get('/api/users/1').expect(200);

    expect(response.body).toHaveProperty('id', 1);
  });

  it('should return 404 for non-existent user', async () => {
    await request(app).get('/api/users/999').expect(404);
  });
});
```

## ⚙️ 설정

### 필수 의존성

```bash
npm install --save-dev \
  @testing-library/react \
  @testing-library/react-hooks \
  @testing-library/jest-dom \
  jest \
  supertest \
  @types/jest \
  @types/supertest
```

### Jest 설정 (jest.config.js)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/*.test.{ts,tsx}'],
};
```

## 🔧 커스터마이징

### 새 템플릿 추가

1. `templates/` 디렉토리에 새 `.md` 파일 생성
2. 템플릿 구조 작성
3. `skill.md`에서 새 템플릿 참조

### 템플릿 수정

각 템플릿 파일을 직접 수정하여 프로젝트 요구사항에 맞게 조정할 수 있습니다.

## 📊 테스트 품질 기준

이 스킬은 다음 기준을 충족하는 테스트를 생성합니다:

- ✅ 명확한 테스트 이름 (should xxx)
- ✅ AAA 패턴 (Arrange-Act-Assert)
- ✅ 독립적인 테스트 (순서 무관)
- ✅ 적절한 Mock 사용
- ✅ 엣지 케이스 커버
- ✅ 에러 처리 테스트
- ✅ 빠른 실행 시간 (< 100ms per test)

## 📋 출력 형식 (FORMS.md)

이 스킬은 `FORMS.md`에 정의된 표준 형식으로 테스트 코드를 생성합니다.

**FORMS.md 주요 내용:**

- 분석 리포트 형식
- 테스트 파일 구조 (프론트엔드/백엔드)
- 테스트 케이스 명명 규칙
- Mock 데이터 형식
- 비동기 테스트 패턴
- 완료 리포트 형식

**형식 준수 이점:**

- ✅ 일관된 코드 스타일
- ✅ 즉시 실행 가능한 테스트
- ✅ 쉬운 유지보수
- ✅ 높은 가독성
- ✅ 팀 협업 용이

## 🤝 기여

새로운 템플릿이나 개선 사항이 있다면 템플릿 파일을 추가하거나 수정해주세요.

새로운 스킬을 추가하려면:

1. `SKILL_FORMAT.md` 가이드 참고
2. `.claude/skills/` 디렉토리에 스킬 추가
3. README 업데이트

## 📄 라이센스

이 스킬은 프로젝트 내부적으로 자유롭게 사용 및 수정 가능합니다.
