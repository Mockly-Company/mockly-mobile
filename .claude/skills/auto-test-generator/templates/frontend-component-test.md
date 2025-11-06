# React 컴포넌트 테스트 템플릿

## 기본 구조

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  // 테스트 케이스들
});
```

## 필수 테스트 케이스

### 1. 렌더링 테스트
컴포넌트가 올바르게 렌더링되는지 확인

```typescript
it('should render correctly', () => {
  render(<ComponentName />);
  expect(screen.getByText('expected text')).toBeInTheDocument();
});

it('should render with default props', () => {
  render(<ComponentName />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

### 2. Props 테스트
Props가 올바르게 전달되고 표시되는지 확인

```typescript
it('should display props correctly', () => {
  const props = {
    title: 'Test Title',
    count: 5
  };
  render(<ComponentName {...props} />);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
  expect(screen.getByText('5')).toBeInTheDocument();
});

it('should handle optional props', () => {
  render(<ComponentName title="Test" />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

### 3. 사용자 이벤트 테스트
클릭, 입력 등 사용자 인터랙션 테스트

```typescript
it('should handle button click', () => {
  const handleClick = jest.fn();
  render(<ComponentName onClick={handleClick} />);

  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

it('should handle input change', () => {
  const handleChange = jest.fn();
  render(<ComponentName onChange={handleChange} />);

  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'test' } });
  expect(handleChange).toHaveBeenCalledWith('test');
});
```

### 4. 조건부 렌더링 테스트
상태에 따른 조건부 렌더링 확인

```typescript
it('should show loading state', () => {
  render(<ComponentName isLoading={true} />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

it('should show error message', () => {
  render(<ComponentName error="Something went wrong" />);
  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
});

it('should hide content when empty', () => {
  render(<ComponentName items={[]} />);
  expect(screen.getByText('No items')).toBeInTheDocument();
});
```

### 5. 비동기 작업 테스트
API 호출 등 비동기 작업 테스트

```typescript
it('should load data on mount', async () => {
  render(<ComponentName />);

  await waitFor(() => {
    expect(screen.getByText('Loaded Data')).toBeInTheDocument();
  });
});

it('should handle async errors', async () => {
  // Mock API 실패
  jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));

  render(<ComponentName />);

  await waitFor(() => {
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
  });
});
```

### 6. 상태 변경 테스트
컴포넌트 내부 상태 변경 테스트

```typescript
it('should update state on user action', () => {
  render(<ComponentName />);

  const button = screen.getByRole('button', { name: 'Increment' });
  fireEvent.click(button);

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

## 고급 테스트 패턴

### Context 사용하는 컴포넌트

```typescript
import { SomeContext } from './context';

it('should use context value', () => {
  const contextValue = { user: 'John' };
  render(
    <SomeContext.Provider value={contextValue}>
      <ComponentName />
    </SomeContext.Provider>
  );
  expect(screen.getByText('Hello, John')).toBeInTheDocument();
});
```

### Router 사용하는 컴포넌트

```typescript
import { BrowserRouter } from 'react-router-dom';

it('should navigate on click', () => {
  const { container } = render(
    <BrowserRouter>
      <ComponentName />
    </BrowserRouter>
  );

  fireEvent.click(screen.getByText('Go to page'));
  expect(window.location.pathname).toBe('/page');
});
```

### Form 제출 테스트

```typescript
it('should submit form with valid data', async () => {
  const handleSubmit = jest.fn();
  render(<ComponentName onSubmit={handleSubmit} />);

  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: 'John' }
  });
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'john@example.com' }
  });

  fireEvent.submit(screen.getByRole('form'));

  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@example.com'
    });
  });
});
```

## 접근성(a11y) 테스트

```typescript
it('should have accessible button', () => {
  render(<ComponentName />);
  const button = screen.getByRole('button', { name: 'Submit' });
  expect(button).toHaveAttribute('aria-label', 'Submit form');
});

it('should have proper heading hierarchy', () => {
  render(<ComponentName />);
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
});
```

## Mock 설정 예시

```typescript
// API 모킹
jest.mock('./api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'mock data' }))
}));

// 모듈 모킹
jest.mock('./utils', () => ({
  formatDate: jest.fn((date) => '2024-01-01')
}));
```

## 정리(Cleanup)

```typescript
beforeEach(() => {
  // 각 테스트 전 초기화
  jest.clearAllMocks();
});

afterEach(() => {
  // 각 테스트 후 정리
  cleanup();
});
```
