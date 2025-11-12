# 테스트 코드 생성 출력 형식

이 파일은 `auto-test-generator` 스킬이 테스트 코드를 생성할 때 따라야 하는 출력 형식을 정의합니다.

## 출력 구조

### 1. 분석 리포트

스킬 실행 시 먼저 다음 형식의 분석 리포트를 제공:

```markdown
## 🔍 코드 변경 분석

### 감지된 파일

- **프론트엔드**: [파일 수]개
  - [파일1 경로]
  - [파일2 경로]

- **백엔드**: [파일 수]개
  - [파일1 경로]
  - [파일2 경로]

### 생성할 테스트

- [ ] [파일명].test.[확장자] - [테스트 타입]
- [ ] [파일명].test.[확장자] - [테스트 타입]
```

### 2. 테스트 파일 구조

#### 프론트엔드 테스트

**파일명 형식**: `[원본파일명].test.[확장자]`

**기본 구조**:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { [컴포넌트명] } from './[원본파일명]';

describe('[컴포넌트명]', () => {
  // 1. 렌더링 테스트
  describe('rendering', () => {
    it('should render correctly', () => {
      // 테스트 코드
    });
  });

  // 2. Props 테스트
  describe('props', () => {
    it('should handle props correctly', () => {
      // 테스트 코드
    });
  });

  // 3. 이벤트 테스트
  describe('user interactions', () => {
    it('should handle [이벤트명]', () => {
      // 테스트 코드
    });
  });

  // 4. 상태 테스트 (필요시)
  describe('state management', () => {
    it('should update state correctly', () => {
      // 테스트 코드
    });
  });

  // 5. 에러 처리
  describe('error handling', () => {
    it('should handle errors gracefully', () => {
      // 테스트 코드
    });
  });
});
```

#### 백엔드 테스트

**파일명 형식**: `[원본파일명].test.[확장자]`

**기본 구조**:

```typescript
import request from 'supertest';
import { app } from '../app';

describe('[API 엔드포인트 또는 서비스명]', () => {
  // Setup
  beforeAll(async () => {
    // 테스트 환경 설정
  });

  afterAll(async () => {
    // 정리
  });

  beforeEach(async () => {
    // 각 테스트 전 초기화
  });

  // 1. 성공 케이스
  describe('success cases', () => {
    it('should [기능] successfully', async () => {
      // 테스트 코드
    });
  });

  // 2. 검증 테스트
  describe('validation', () => {
    it('should validate [필드명]', async () => {
      // 테스트 코드
    });
  });

  // 3. 에러 케이스
  describe('error cases', () => {
    it('should handle [에러 유형]', async () => {
      // 테스트 코드
    });
  });

  // 4. 인증/인가 (API인 경우)
  describe('authentication', () => {
    it('should require authentication', async () => {
      // 테스트 코드
    });
  });
});
```

### 3. 완료 리포트

모든 테스트 파일 생성 후 다음 형식의 리포트 제공:

```markdown
## ✅ 테스트 생성 완료

### 생성된 파일

1. **[파일경로]**
   - 테스트 케이스: [개수]개
   - 커버리지 예상: [비율]%
   - 포함된 테스트:
     - ✅ [테스트 설명]
     - ✅ [테스트 설명]

2. **[파일경로]**
   - 테스트 케이스: [개수]개
   - 커버리지 예상: [비율]%
   - 포함된 테스트:
     - ✅ [테스트 설명]
     - ✅ [테스트 설명]

### 테스트 실행

\`\`\`bash

# 모든 테스트 실행

npm test

# 특정 파일만 실행

npm test [파일명]

# 커버리지 확인

npm test -- --coverage
\`\`\`

### 다음 단계

- [ ] 생성된 테스트 검토
- [ ] Mock 데이터 추가/수정
- [ ] 엣지 케이스 추가
- [ ] CI/CD 파이프라인 설정
```

## 테스트 케이스 명명 규칙

### 프론트엔드

```typescript
// ✅ Good: 명확하고 설명적
it('should render user name when user prop is provided', () => {});
it('should call onClick handler when button is clicked', () => {});
it('should display error message when email is invalid', () => {});

// ❌ Bad: 불명확
it('works', () => {});
it('test 1', () => {});
it('renders', () => {});
```

### 백엔드

```typescript
// ✅ Good
it('should return 200 and user data when valid id is provided', () => {});
it('should return 404 when user does not exist', () => {});
it('should validate email format before creating user', () => {});

// ❌ Bad
it('api works', () => {});
it('returns data', () => {});
```

## 코드 코멘트 스타일

### 테스트 섹션 구분

```typescript
describe('ComponentName', () => {
  // ===========================================
  // Rendering Tests
  // ===========================================
  describe('rendering', () => {
    // 테스트들...
  });

  // ===========================================
  // User Interaction Tests
  // ===========================================
  describe('user interactions', () => {
    // 테스트들...
  });
});
```

### AAA 패턴 명시

```typescript
it('should update count when increment button is clicked', () => {
  // Arrange: 테스트 환경 설정
  const { getByRole } = render(<Counter initialCount={0} />);
  const button = getByRole('button', { name: 'Increment' });

  // Act: 동작 실행
  fireEvent.click(button);

  // Assert: 결과 검증
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

## Mock 데이터 형식

### 공통 Mock 데이터 파일

테스트에 필요한 Mock 데이터는 별도 파일로 관리:

**위치**: `[테스트파일경로]/__mocks__/[데이터명].ts`

```typescript
// __mocks__/users.ts
export const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
};

export const mockUsers = [
  mockUser,
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
  },
];

export const mockUserResponse = {
  data: mockUser,
  status: 'success',
};
```

### 테스트 내 Mock 함수

```typescript
// API Mock
const mockFetchUser = jest.fn();
mockFetchUser.mockResolvedValue(mockUser);

// Component Mock
jest.mock('./UserProfile', () => ({
  UserProfile: jest.fn(() => <div>Mocked UserProfile</div>)
}));
```

## 비동기 테스트 패턴

### 프론트엔드

```typescript
// waitFor 사용
it('should load and display user data', async () => {
  render(<UserProfile userId={1} />);

  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

// findBy 사용 (권장)
it('should load and display user data', async () => {
  render(<UserProfile userId={1} />);

  expect(await screen.findByText('John Doe')).toBeInTheDocument();
});
```

### 백엔드

```typescript
it('should create user asynchronously', async () => {
  const response = await request(app)
    .post('/api/users')
    .send({ name: 'John', email: 'john@example.com' })
    .expect(201);

  expect(response.body).toHaveProperty('id');
});
```

## 에러 메시지 형식

테스트 실패 시 명확한 메시지 제공:

```typescript
// ✅ Good: 맥락이 있는 메시지
expect(result, 'User should be created with valid email').toHaveProperty('id');

// Custom matcher message
expect(email).toMatch(
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  `Expected "${email}" to be a valid email format`
);

// ❌ Bad: 기본 메시지만
expect(result).toHaveProperty('id');
```

## 테스트 파일 메타데이터

각 테스트 파일 상단에 다음 정보 포함:

```typescript
/**
 * @file ComponentName.test.tsx
 * @description Tests for ComponentName component
 * @author auto-test-generator
 * @created [생성일자]
 *
 * Test Coverage:
 * - Rendering
 * - Props validation
 * - User interactions
 * - Error handling
 */

import { render, screen } from '@testing-library/react';
// ...
```

## 커버리지 목표

생성된 테스트는 다음 커버리지를 목표로 함:

```yaml
coverage:
  statements: 80%
  branches: 75%
  functions: 80%
  lines: 80%
```

## 실행 가능한 테스트

생성된 모든 테스트는 즉시 실행 가능해야 함:

- 필요한 모든 import 포함
- Mock 데이터 정의
- Setup/Teardown 코드 완성
- 실제 기대값 사용 (placeholder 아님)

## 예시: 완전한 테스트 파일

```typescript
/**
 * @file UserProfile.test.tsx
 * @description Tests for UserProfile component
 * @author auto-test-generator
 * @created 2024-01-06
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';
import { mockUser } from './__mocks__/users';

describe('UserProfile', () => {
  // ===========================================
  // Rendering Tests
  // ===========================================
  describe('rendering', () => {
    it('should render user information when user prop is provided', () => {
      // Arrange
      render(<UserProfile user={mockUser} />);

      // Assert
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should render loading state when user is null', () => {
      // Arrange
      render(<UserProfile user={null} />);

      // Assert
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  // ===========================================
  // User Interaction Tests
  // ===========================================
  describe('user interactions', () => {
    it('should call onEdit when edit button is clicked', () => {
      // Arrange
      const onEdit = jest.fn();
      render(<UserProfile user={mockUser} onEdit={onEdit} />);

      // Act
      fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

      // Assert
      expect(onEdit).toHaveBeenCalledWith(mockUser.id);
      expect(onEdit).toHaveBeenCalledTimes(1);
    });
  });

  // ===========================================
  // Error Handling Tests
  // ===========================================
  describe('error handling', () => {
    it('should display error message when user data is invalid', () => {
      // Arrange
      const invalidUser = { ...mockUser, email: null };
      render(<UserProfile user={invalidUser} />);

      // Assert
      expect(screen.getByText('Invalid user data')).toBeInTheDocument();
    });
  });
});
```

이 형식을 따르면:

- ✅ 일관된 구조
- ✅ 명확한 테스트 의도
- ✅ 쉬운 유지보수
- ✅ 즉시 실행 가능
- ✅ 높은 가독성
