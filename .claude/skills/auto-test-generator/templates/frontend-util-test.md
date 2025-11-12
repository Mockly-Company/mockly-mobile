# 유틸리티 함수 테스트 템플릿

## 기본 구조

```typescript
import { utilFunction } from './utils';

describe('utilFunction', () => {
  // 테스트 케이스들
});
```

## 필수 테스트 케이스

### 1. 정상 케이스 테스트

```typescript
it('should handle normal cases', () => {
  expect(utilFunction('input')).toBe('expected output');
  expect(utilFunction(123)).toBe(456);
  expect(utilFunction(true)).toBe(false);
});

it('should return correct value for valid inputs', () => {
  expect(add(2, 3)).toBe(5);
  expect(multiply(4, 5)).toBe(20);
  expect(formatDate(new Date('2024-01-01'))).toBe('01/01/2024');
});
```

### 2. 엣지 케이스 테스트

```typescript
describe('edge cases', () => {
  it('should handle null', () => {
    expect(utilFunction(null)).toBe(null);
  });

  it('should handle undefined', () => {
    expect(utilFunction(undefined)).toBeUndefined();
  });

  it('should handle empty string', () => {
    expect(utilFunction('')).toBe('');
  });

  it('should handle empty array', () => {
    expect(utilFunction([])).toEqual([]);
  });

  it('should handle empty object', () => {
    expect(utilFunction({})).toEqual({});
  });

  it('should handle zero', () => {
    expect(divide(10, 0)).toBe(Infinity);
  });

  it('should handle negative numbers', () => {
    expect(abs(-5)).toBe(5);
  });

  it('should handle very large numbers', () => {
    expect(add(Number.MAX_SAFE_INTEGER, 1)).toBe(Number.MAX_SAFE_INTEGER + 1);
  });
});
```

### 3. 에러 케이스 테스트

```typescript
describe('error cases', () => {
  it('should throw error for invalid input', () => {
    expect(() => utilFunction('invalid')).toThrow(Error);
  });

  it('should throw error with specific message', () => {
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
  });

  it('should throw specific error type', () => {
    expect(() => parseJSON('invalid json')).toThrow(SyntaxError);
  });

  it('should handle type mismatches', () => {
    expect(() => add('string', 5)).toThrow(TypeError);
  });
});
```

## 문자열 처리 함수 테스트

### 문자열 변환

```typescript
describe('capitalize', () => {
  it('should capitalize first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should handle already capitalized', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('should handle single character', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('should handle empty string', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('slugify', () => {
  it('should convert to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should handle special characters', () => {
    expect(slugify('Hello! @World#')).toBe('hello-world');
  });

  it('should handle multiple spaces', () => {
    expect(slugify('Hello   World')).toBe('hello-world');
  });
});
```

### 문자열 검증

```typescript
describe('isEmail', () => {
  it('should validate correct email', () => {
    expect(isEmail('test@example.com')).toBe(true);
  });

  it('should reject invalid email', () => {
    expect(isEmail('invalid-email')).toBe(false);
    expect(isEmail('test@')).toBe(false);
    expect(isEmail('@example.com')).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(isEmail('')).toBe(false);
    expect(isEmail('test@example')).toBe(false);
  });
});

describe('isURL', () => {
  it('should validate correct URLs', () => {
    expect(isURL('https://example.com')).toBe(true);
    expect(isURL('http://example.com')).toBe(true);
  });

  it('should reject invalid URLs', () => {
    expect(isURL('not-a-url')).toBe(false);
    expect(isURL('//example.com')).toBe(false);
  });
});
```

## 배열 처리 함수 테스트

```typescript
describe('unique', () => {
  it('should remove duplicates', () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
  });

  it('should handle empty array', () => {
    expect(unique([])).toEqual([]);
  });

  it('should handle array with no duplicates', () => {
    expect(unique([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('should work with objects', () => {
    const arr = [{ id: 1 }, { id: 2 }, { id: 1 }];
    expect(unique(arr, 'id')).toHaveLength(2);
  });
});

describe('groupBy', () => {
  it('should group array by key', () => {
    const data = [
      { category: 'A', value: 1 },
      { category: 'B', value: 2 },
      { category: 'A', value: 3 },
    ];

    const result = groupBy(data, 'category');

    expect(result.A).toHaveLength(2);
    expect(result.B).toHaveLength(1);
  });

  it('should handle empty array', () => {
    expect(groupBy([], 'key')).toEqual({});
  });
});

describe('chunk', () => {
  it('should split array into chunks', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('should handle chunk size larger than array', () => {
    expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
  });

  it('should handle empty array', () => {
    expect(chunk([], 2)).toEqual([]);
  });
});
```

## 객체 처리 함수 테스트

```typescript
describe('omit', () => {
  it('should omit specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
  });

  it('should handle non-existent keys', () => {
    const obj = { a: 1 };
    expect(omit(obj, ['b'])).toEqual({ a: 1 });
  });

  it('should handle empty object', () => {
    expect(omit({}, ['a'])).toEqual({});
  });
});

describe('pick', () => {
  it('should pick specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('should handle non-existent keys', () => {
    const obj = { a: 1 };
    expect(pick(obj, ['a', 'b'])).toEqual({ a: 1 });
  });
});

describe('deepClone', () => {
  it('should deep clone object', () => {
    const obj = { a: 1, b: { c: 2 } };
    const cloned = deepClone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.b).not.toBe(obj.b);
  });

  it('should handle arrays', () => {
    const arr = [1, [2, 3]];
    const cloned = deepClone(arr);

    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
    expect(cloned[1]).not.toBe(arr[1]);
  });

  it('should handle Date objects', () => {
    const date = new Date('2024-01-01');
    const cloned = deepClone(date);

    expect(cloned).toEqual(date);
    expect(cloned).not.toBe(date);
  });
});
```

## 날짜/시간 처리 함수 테스트

```typescript
describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-01');
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-01');
  });

  it('should handle different formats', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date, 'DD/MM/YYYY')).toBe('15/01/2024');
    expect(formatDate(date, 'MM-DD-YYYY')).toBe('01-15-2024');
  });

  it('should handle invalid dates', () => {
    expect(() => formatDate(new Date('invalid'))).toThrow();
  });
});

describe('addDays', () => {
  it('should add days to date', () => {
    const date = new Date('2024-01-01');
    const result = addDays(date, 5);
    expect(result.getDate()).toBe(6);
  });

  it('should subtract days with negative number', () => {
    const date = new Date('2024-01-10');
    const result = addDays(date, -5);
    expect(result.getDate()).toBe(5);
  });

  it('should handle month boundaries', () => {
    const date = new Date('2024-01-31');
    const result = addDays(date, 1);
    expect(result.getMonth()).toBe(1); // February
    expect(result.getDate()).toBe(1);
  });
});
```

## 숫자 처리 함수 테스트

```typescript
describe('formatNumber', () => {
  it('should format number with commas', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
  });

  it('should handle decimals', () => {
    expect(formatNumber(1234.56, 2)).toBe('1,234.56');
  });

  it('should handle negative numbers', () => {
    expect(formatNumber(-1000)).toBe('-1,000');
  });
});

describe('clamp', () => {
  it('should clamp value within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('should handle equal min and max', () => {
    expect(clamp(5, 3, 3)).toBe(3);
  });
});

describe('randomInt', () => {
  it('should generate number within range', () => {
    const result = randomInt(1, 10);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
    expect(Number.isInteger(result)).toBe(true);
  });

  it('should handle single value range', () => {
    expect(randomInt(5, 5)).toBe(5);
  });
});
```

## 비동기 함수 테스트

```typescript
describe('delay', () => {
  it('should delay execution', async () => {
    const start = Date.now();
    await delay(100);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(100);
  });
});

describe('retry', () => {
  it('should retry on failure', async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('success');

    const result = await retry(mockFn, 3);

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('should fail after max retries', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('fail'));

    await expect(retry(mockFn, 3)).rejects.toThrow('fail');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });
});

describe('debounce', () => {
  jest.useFakeTimers();

  it('should debounce function calls', () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 500);

    debounced();
    debounced();
    debounced();

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  jest.useRealTimers();
});
```

## 타입 체크 함수 테스트

```typescript
describe('isObject', () => {
  it('should return true for objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
  });

  it('should return false for non-objects', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject('string')).toBe(false);
    expect(isObject(123)).toBe(false);
  });
});

describe('isEmpty', () => {
  it('should return true for empty values', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it('should return false for non-empty values', () => {
    expect(isEmpty('text')).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});
```
