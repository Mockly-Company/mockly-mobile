# Custom Hook 테스트 템플릿

## 기본 구조

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCustomHook } from './useCustomHook';

describe('useCustomHook', () => {
  // 테스트 케이스들
});
```

## 필수 테스트 케이스

### 1. 초기화 테스트

Hook의 초기 상태 확인

```typescript
it('should initialize with default values', () => {
  const { result } = renderHook(() => useCustomHook());

  expect(result.current.value).toBe(null);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBe(null);
});

it('should initialize with provided values', () => {
  const initialValue = 'test';
  const { result } = renderHook(() => useCustomHook(initialValue));

  expect(result.current.value).toBe('test');
});
```

### 2. 상태 업데이트 테스트

Hook의 상태 변경 함수 테스트

```typescript
it('should update state correctly', () => {
  const { result } = renderHook(() => useCustomHook());

  act(() => {
    result.current.setValue('new value');
  });

  expect(result.current.value).toBe('new value');
});

it('should handle multiple state updates', () => {
  const { result } = renderHook(() => useCustomHook(0));

  act(() => {
    result.current.increment();
    result.current.increment();
  });

  expect(result.current.count).toBe(2);
});
```

### 3. 비동기 작업 테스트

비동기 데이터 로딩 테스트

```typescript
it('should fetch data successfully', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useCustomHook());

  expect(result.current.loading).toBe(true);

  await waitForNextUpdate();

  expect(result.current.loading).toBe(false);
  expect(result.current.data).toBeDefined();
});

it('should handle fetch errors', async () => {
  // Mock API 실패
  jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));

  const { result, waitForNextUpdate } = renderHook(() => useCustomHook());

  await waitForNextUpdate();

  expect(result.current.error).toBe('API Error');
  expect(result.current.loading).toBe(false);
});
```

### 4. Effect 테스트

useEffect 동작 확인

```typescript
it('should run effect on mount', () => {
  const mockEffect = jest.fn();
  const useTestHook = () => {
    useEffect(() => {
      mockEffect();
    }, []);
  };

  renderHook(() => useTestHook());
  expect(mockEffect).toHaveBeenCalledTimes(1);
});

it('should run effect on dependency change', () => {
  const mockEffect = jest.fn();
  const { rerender } = renderHook(
    ({ value }) => {
      useEffect(() => {
        mockEffect(value);
      }, [value]);
    },
    { initialProps: { value: 1 } }
  );

  expect(mockEffect).toHaveBeenCalledWith(1);

  rerender({ value: 2 });
  expect(mockEffect).toHaveBeenCalledWith(2);
  expect(mockEffect).toHaveBeenCalledTimes(2);
});
```

### 5. Cleanup 테스트

Effect cleanup 함수 확인

```typescript
it('should cleanup on unmount', () => {
  const mockCleanup = jest.fn();
  const useTestHook = () => {
    useEffect(() => {
      return mockCleanup;
    }, []);
  };

  const { unmount } = renderHook(() => useTestHook());
  unmount();

  expect(mockCleanup).toHaveBeenCalledTimes(1);
});
```

## 고급 테스트 패턴

### Context와 함께 사용하는 Hook

```typescript
import { SomeContext } from './context';

it('should use context value', () => {
  const wrapper = ({ children }) => (
    <SomeContext.Provider value={{ user: 'John' }}>
      {children}
    </SomeContext.Provider>
  );

  const { result } = renderHook(() => useCustomHook(), { wrapper });

  expect(result.current.user).toBe('John');
});
```

### 디바운스/쓰로틀 Hook 테스트

```typescript
import { renderHook, act } from '@testing-library/react-hooks';

it('should debounce value updates', async () => {
  jest.useFakeTimers();

  const { result } = renderHook(() => useDebounce('initial', 500));

  act(() => {
    result.current.setValue('updated');
  });

  expect(result.current.debouncedValue).toBe('initial');

  act(() => {
    jest.advanceTimersByTime(500);
  });

  expect(result.current.debouncedValue).toBe('updated');

  jest.useRealTimers();
});
```

### localStorage/sessionStorage 사용 Hook

```typescript
it('should persist value to localStorage', () => {
  const { result } = renderHook(() => useLocalStorage('key', 'default'));

  act(() => {
    result.current.setValue('new value');
  });

  expect(localStorage.getItem('key')).toBe(JSON.stringify('new value'));
  expect(result.current.value).toBe('new value');
});

it('should load value from localStorage', () => {
  localStorage.setItem('key', JSON.stringify('stored value'));

  const { result } = renderHook(() => useLocalStorage('key', 'default'));

  expect(result.current.value).toBe('stored value');
});
```

### API Hook 테스트

```typescript
it('should fetch and cache data', async () => {
  const mockFetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve({ data: 'test' }) })
  );
  global.fetch = mockFetch;

  const { result, waitForNextUpdate } = renderHook(() => useFetch('/api/data'));

  await waitForNextUpdate();

  expect(mockFetch).toHaveBeenCalledTimes(1);
  expect(result.current.data).toEqual({ data: 'test' });

  // 재렌더링 시 캐시 사용
  const { result: result2 } = renderHook(() => useFetch('/api/data'));
  expect(mockFetch).toHaveBeenCalledTimes(1); // 여전히 1회
});
```

### 타이머 사용 Hook

```typescript
it('should increment counter every second', () => {
  jest.useFakeTimers();

  const { result } = renderHook(() => useCounter());

  expect(result.current.count).toBe(0);

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(result.current.count).toBe(1);

  act(() => {
    jest.advanceTimersByTime(3000);
  });

  expect(result.current.count).toBe(4);

  jest.useRealTimers();
});
```

## Props 변경 테스트

```typescript
it('should update when props change', () => {
  const { result, rerender } = renderHook(({ id }) => useFetchUser(id), {
    initialProps: { id: 1 },
  });

  expect(result.current.userId).toBe(1);

  rerender({ id: 2 });

  expect(result.current.userId).toBe(2);
});
```

## 에러 처리 테스트

```typescript
it('should handle errors gracefully', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useCustomHook({ throwError: true }));

  await waitForNextUpdate();

  expect(result.current.error).toBeTruthy();
  expect(result.current.data).toBeNull();
});
```

## Mock 설정

```typescript
beforeEach(() => {
  // LocalStorage mock
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
  };
  global.localStorage = localStorageMock;

  // Fetch mock
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});
```
