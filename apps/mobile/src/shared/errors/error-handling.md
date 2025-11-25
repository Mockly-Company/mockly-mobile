# 에러 처리 시스템

## 목차

1. [개요](#개요)
2. [핵심 개념](#핵심-개념)
3. [ErrorCode 체계](#errorcode-체계)
4. [ErrorCoverage 계층](#errorcoverage-계층)
5. [AppError 클래스](#apperror-클래스)
6. [Error Boundary 시스템](#error-boundary-시스템)
7. [사용 가이드](#사용-가이드)
8. [API 에러 처리](#api-에러-처리)
9. [베스트 프랙티스](#베스트-프랙티스)

---

## 개요

Mockly 앱은 계층별 에러 관리 시스템을 통해 일관되고 사용자 친화적인 에러 처리를 제공합니다. 이 시스템은 다음과 같은 목표를 가집니다:

- **일관성**: 모든 에러를 `AppError`로 통합하여 일관된 방식으로 처리
- **계층별 처리**: Global, Screen, Component 3단계로 에러를 분리하여 적절한 복구 전략 제공
- **사용자 경험**: 개발자용 에러 메시지와 사용자용 메시지를 분리하여 친화적인 UX 제공
- **디버깅**: 상세한 에러 정보와 로깅을 통해 빠른 문제 해결 지원

---

## 핵심 개념

### 에러 처리 흐름

```
에러 발생
    ↓
AppError로 변환
    ↓
Error Boundary에서 catch
    ↓
계층별 Fallback UI 표시
    ↓
복구 액션 제공 (재시도/뒤로가기/앱 재시작)
```

### 주요 구성 요소

1. **AppError**: 앱 내 모든 에러의 기본 클래스
2. **ErrorCode**: HTTP 상태 코드 기반의 에러 분류 체계
3. **ErrorCoverage**: 에러의 영향 범위를 정의하는 계층 체계
4. **Error Boundary**: React Error Boundary를 활용한 계층별 에러 처리
5. **Fallback UI**: 각 계층에 맞는 사용자 친화적인 에러 화면

---

## ErrorCode 체계

### HTTP 상태 코드 기반 분류

```typescript
export enum ErrorCode {
  // 4xx: Client Errors
  BAD_REQUEST = 'BAD_REQUEST', // 400
  UNAUTHORIZED = 'UNAUTHORIZED', // 401
  FORBIDDEN = 'FORBIDDEN', // 403
  NOT_FOUND = 'NOT_FOUND', // 404
  VALIDATION_ERROR = 'VALIDATION_ERROR', // 422
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS', // 429

  // 5xx: Server Errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR', // 500
  BAD_GATEWAY = 'BAD_GATEWAY', // 502
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE', // 503
  GATEWAY_TIMEOUT = 'GATEWAY_TIMEOUT', // 504

  // Network Errors
  TIMEOUT = 'TIMEOUT',
  NO_INTERNET = 'NO_INTERNET',
  NETWORK_ERROR = 'NETWORK_ERROR',

  // Unknown
  UNKNOWN = 'UNKNOWN',
}
```

### ErrorCode별 사용자 메시지

| ErrorCode             | 한글 메시지                                          | 사용 시점                       |
| --------------------- | ---------------------------------------------------- | ------------------------------- |
| BAD_REQUEST           | 잘못된 요청입니다. 다시 시도해주세요.                | 400 에러 또는 일반적인 4xx 에러 |
| UNAUTHORIZED          | 로그인이 필요합니다.                                 | 401 인증 실패                   |
| FORBIDDEN             | 접근 권한이 없습니다.                                | 403 권한 부족                   |
| NOT_FOUND             | 요청하신 정보를 찾을 수 없습니다.                    | 404 리소스 없음                 |
| VALIDATION_ERROR      | 입력하신 정보가 올바르지 않습니다.                   | 422 유효성 검증 실패            |
| TOO_MANY_REQUESTS     | 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.     | 429 Rate Limit                  |
| INTERNAL_SERVER_ERROR | 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요. | 500 서버 에러                   |
| BAD_GATEWAY           | 서버 연결에 문제가 있습니다.                         | 502 게이트웨이 에러             |
| SERVICE_UNAVAILABLE   | 서비스를 일시적으로 사용할 수 없습니다.              | 503 서비스 불가                 |
| GATEWAY_TIMEOUT       | 서버 응답 시간이 초과되었습니다.                     | 504 게이트웨이 타임아웃         |
| TIMEOUT               | 요청 시간이 초과되었습니다. 다시 시도해주세요.       | 네트워크 타임아웃               |
| NO_INTERNET           | 인터넷 연결을 확인해주세요.                          | 네트워크 연결 없음              |
| NETWORK_ERROR         | 네트워크 오류가 발생했습니다.                        | 일반 네트워크 에러              |
| UNKNOWN               | 알 수 없는 오류가 발생했습니다.                      | 분류 불가능한 에러              |

---

## ErrorCoverage 계층

### 계층 구조

```typescript
export enum ErrorCoverage {
  /** Global - 전체 앱 재시작 */
  GLOBAL = 'GLOBAL',
  /** Screen - 해당 화면 종료 */
  SCREEN = 'SCREEN',
  /** Component - 해당 컴포넌트만 재시도 */
  COMPONENT = 'COMPONENT',
  /** Logging - 로깅 전용 에러 */
  LOGGING = 'LOGGING',
}
```

### 각 계층의 특징

#### 1. GLOBAL (전역 레벨)

**사용 시점:**

- 앱 초기화 실패
- 치명적인 시스템 에러
- 복구 불가능한 상태

**복구 전략:**

- 앱 재시작 (RNRestart.restart())
- 전체 앱 초기화

**예시:**

```typescript
throw new AppError(error, ErrorCoverage.GLOBAL, '앱을 시작할 수 없습니다');
```

#### 2. SCREEN (화면 레벨)

**사용 시점:**

- API 호출 실패
- 화면 데이터 로드 실패
- 인증 관련 에러

**복구 전략:**

- 뒤로가기 (navigation.goBack())
- 이전 화면으로 복귀

**예시:**

```typescript
throw new AppError(
  error,
  ErrorCoverage.SCREEN,
  '데이터를 불러올 수 없습니다',
  ErrorCode.NETWORK_ERROR,
);
```

#### 3. COMPONENT (컴포넌트 레벨)

**사용 시점:**

- 특정 컴포넌트의 로직 실패
- 비필수 데이터 로드 실패
- 부분적인 UI 렌더링 에러

**복구 전략:**

- 컴포넌트 재시도
- 해당 컴포넌트만 다시 렌더링

**예시:**

```typescript
throw new AppError(error, ErrorCoverage.COMPONENT, '댓글을 불러올 수 없습니다');
```

#### 4. LOGGING (로깅 전용)

**사용 시점:**

- 사용자에게 보여줄 필요 없는 에러
- 디버깅용 에러
- 통계/분석용 에러

**복구 전략:**

- Error Boundary에서 catch하지 않음
- 로깅만 수행

**예시:**

```typescript
throw new AppError(error, ErrorCoverage.LOGGING, undefined, ErrorCode.UNKNOWN);
```

---

## AppError 클래스

### 기본 구조

```typescript
export class AppError extends Error {
  public readonly coverage: ErrorCoverage; // 에러 계층
  public readonly code: ErrorCode; // 에러 코드
  public readonly statusCode?: number; // HTTP 상태 코드
  public readonly displayMessage?: string; // 사용자용 메시지
  public readonly timestamp: Date; // 발생 시각
}
```

### 생성 방법

#### 1. 직접 생성

```typescript
// 기본 생성
throw new AppError(
  error, // 원본 에러
  ErrorCoverage.SCREEN, // 계층
  '사용자에게 보여줄 메시지', // 표시 메시지 (선택)
  ErrorCode.NETWORK_ERROR, // 에러 코드 (선택, 기본값: UNKNOWN)
  500, // HTTP 상태 코드 (선택)
);

// 간단한 생성
throw new AppError('에러 메시지', ErrorCoverage.COMPONENT);
```

#### 2. 팩토리 메서드 - fromAxiosError

```typescript
import { AxiosError } from '@mockly/api';

try {
  await apiClient.get('/users');
} catch (err) {
  if (err instanceof AxiosError) {
    throw AppError.fromAxiosError(
      err,
      ErrorCoverage.SCREEN,
      '사용자 정보를 불러올 수 없습니다',
    );
  }
}
```

**자동 처리 사항:**

- HTTP 상태 코드 → ErrorCode 자동 매핑
- statusCode 자동 추출

#### 3. 팩토리 메서드 - fromUnknownError

```typescript
try {
  await someOperation();
} catch (err) {
  throw AppError.fromUnknownError(
    err,
    ErrorCoverage.COMPONENT,
    '작업을 완료할 수 없습니다',
  );
}
```

**자동 처리 사항:**

- 이미 AppError면 그대로 반환
- AxiosError면 fromAxiosError 사용
- 일반 Error면 AppError로 변환

#### 4. 특수 팩토리 메서드

```typescript
// 네트워크 에러
AppError.fromNetworkError(
  err,
  ErrorCoverage.SCREEN,
  '네트워크에 연결할 수 없습니다',
);

// 타임아웃 에러
AppError.fromTimeoutError(
  err,
  ErrorCoverage.COMPONENT,
  '요청 시간이 초과되었습니다',
);
```

---

## Error Boundary 시스템

### 계층별 Error Boundary

#### 1. GlobalErrorBoundary

**위치:** `App.tsx` 최상위

```tsx
import { GlobalErrorBoundary } from '@shared/errors';

function App() {
  return <GlobalErrorBoundary>{/* 앱 전체 */}</GlobalErrorBoundary>;
}
```

**기능:**

- 모든 하위 에러 catch
- 앱 재시작 버튼 제공
- logger.error로 에러 로깅

#### 2. ScreenErrorBoundary

**위치:** 각 Screen 컴포넌트

```tsx
import { ScreenErrorBoundary } from '@shared/errors';

function MyScreen() {
  return (
    <ScreenErrorBoundary screenName="마이페이지">
      {/* 화면 내용 */}
    </ScreenErrorBoundary>
  );
}
```

**또는 HOC 사용:**

```tsx
import { withScreenErrorBoundary } from '@app/screens/withScreenErrorBoundary';

function MyScreen() {
  // 화면 내용
}

export default withScreenErrorBoundary(MyScreen, '마이페이지');
```

**기능:**

- 화면 레벨 에러 catch
- 뒤로가기 버튼 제공
- screenName 표시

#### 3. ComponentErrorBoundary

**위치:** 독립적인 컴포넌트

```tsx
import { ComponentErrorBoundary } from '@shared/errors';

function ParentComponent() {
  return (
    <ComponentErrorBoundary>
      <ProblematicComponent />
    </ComponentErrorBoundary>
  );
}
```

**기능:**

- 컴포넌트 레벨 에러 catch
- 재시도 버튼 제공
- 부모 컴포넌트는 정상 동작

### Fallback UI

각 Error Boundary는 전용 Fallback UI를 가집니다:

- **GlobalErrorFallback**: 앱 재시작 버튼
- **ScreenErrorFallback**: 뒤로가기 버튼 + screenName
- **ComponentErrorFallback**: 재시도 버튼

---

## 사용 가이드

### 1. 컴포넌트에서 에러 처리

```typescript
import { AppError, ErrorCoverage, ErrorCode } from '@shared/errors';

function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchData();
        setData(result);
      } catch (error) {
        // Error Boundary가 catch할 수 있도록 throw
        throw new AppError(
          error,
          ErrorCoverage.COMPONENT,
          '데이터를 불러올 수 없습니다'
        );
      }
    }

    loadData();
  }, []);

  return <View>{/* ... */}</View>;
}
```

### 2. 비동기 함수에서 에러 처리

```typescript
const handleSubmit = async () => {
  try {
    await submitForm(formData);
    showSuccess();
  } catch (error) {
    // Toast로 사용자에게 알림
    if (error instanceof AppError) {
      Toast.show({
        type: 'error',
        text1: error.displayMessage || '오류가 발생했습니다',
      });
    } else {
      // 예상치 못한 에러
      throw AppError.fromUnknownError(
        error,
        ErrorCoverage.COMPONENT,
        '요청을 처리할 수 없습니다',
      );
    }
  }
};
```

### 3. Store에서 에러 처리

```typescript
import { create } from 'zustand';
import { AppError, ErrorCoverage } from '@shared/errors';
import Toast from 'react-native-toast-message';

interface MyStore {
  data: Data | null;
  error: AppError | null;
  setError: (error: AppError | null) => void;
  clearError: () => void;
  fetchData: () => Promise<void>;
}

export const useMyStore = create<MyStore>(set => ({
  data: null,
  error: null,

  setError: error => set({ error }),

  clearError: () => set({ error: null }),

  fetchData: async () => {
    try {
      const data = await api.getData();
      set({ data, error: null });
    } catch (error) {
      const appError = AppError.fromUnknownError(
        error,
        ErrorCoverage.SCREEN,
        '데이터를 불러올 수 없습니다',
      );

      set({ error: appError });

      Toast.show({
        type: 'error',
        text1: appError.displayMessage,
      });

      // Screen Error Boundary가 catch하도록 throw
      throw appError;
    }
  },
}));
```

### 4. 에러 타입 체크

```typescript
import { isAppError, isScreenError, isComponentError } from '@shared/errors';

try {
  await someOperation();
} catch (error) {
  if (isAppError(error)) {
    console.log('AppError:', error.code, error.displayMessage);

    if (isScreenError(error)) {
      // Screen 레벨 에러 처리
      navigation.goBack();
    } else if (isComponentError(error)) {
      // Component 레벨 에러 처리
      retry();
    }
  } else {
    // 일반 에러
    console.error(error);
  }
}
```

---

## API 에러 처리

### API 클라이언트 자동 에러 변환

API 클라이언트는 `responseErrorInterceptor`를 통해 모든 HTTP 에러를 자동으로 AppError로 변환합니다.

```typescript
// apps/mobile/src/shared/api/initializeApiClient.ts

responseErrorInterceptor: async (error: AxiosError) => {
  // HTTP 에러 응답
  if (error.response) {
    const statusCode = error.response.status;
    const errorCode = mapStatusCodeToErrorCode(statusCode);

    // 서버 메시지 추출
    const serverMessage =
      error.response.data?.message || error.response.data?.error;

    const displayMessage = serverMessage || getDefaultErrorMessage(errorCode);

    throw new AppError(
      error,
      ErrorCoverage.SCREEN,
      displayMessage,
      errorCode,
      statusCode,
    );
  }

  // 타임아웃
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    throw new AppError(
      error,
      ErrorCoverage.COMPONENT,
      getDefaultErrorMessage(ErrorCode.TIMEOUT),
      ErrorCode.TIMEOUT,
    );
  }

  // 네트워크 에러
  if (!error.response) {
    throw new AppError(
      error,
      ErrorCoverage.COMPONENT,
      getDefaultErrorMessage(ErrorCode.NO_INTERNET),
      ErrorCode.NO_INTERNET,
    );
  }

  return Promise.reject(error);
};
```

### API 호출 시 에러 처리

```typescript
// 자동으로 AppError로 변환되므로 그냥 사용
try {
  const user = await apiClient.get('/users/me');
  return user;
} catch (error) {
  // 이미 AppError로 변환됨
  // Error Boundary가 자동으로 catch
  throw error;
}
```

### 특정 에러에 대한 커스텀 처리

```typescript
try {
  const user = await apiClient.get('/users/me');
  return user;
} catch (error) {
  if (error instanceof AppError && error.code === ErrorCode.UNAUTHORIZED) {
    // 401 에러 - 로그아웃 처리
    await logout();
    navigation.navigate('Login');
    return;
  }

  // 다른 에러는 Error Boundary로
  throw error;
}
```

---

## 베스트 프랙티스

### 1. 적절한 ErrorCoverage 선택

```typescript
// ✅ 좋은 예: 전체 화면 데이터 로드 실패 → SCREEN
async function loadScreenData() {
  try {
    const data = await api.getScreenData();
    return data;
  } catch (error) {
    throw new AppError(
      error,
      ErrorCoverage.SCREEN,
      '화면을 불러올 수 없습니다',
    );
  }
}

// ✅ 좋은 예: 부가적인 위젯 로드 실패 → COMPONENT
async function loadWidget() {
  try {
    const widget = await api.getWidget();
    return widget;
  } catch (error) {
    throw new AppError(
      error,
      ErrorCoverage.COMPONENT,
      '위젯을 불러올 수 없습니다',
    );
  }
}

// ❌ 나쁜 예: 부가적인 기능인데 SCREEN 사용
async function loadOptionalData() {
  try {
    return await api.getOptional();
  } catch (error) {
    // SCREEN을 사용하면 전체 화면이 에러 화면으로 대체됨
    throw new AppError(error, ErrorCoverage.SCREEN, '...');
  }
}
```

### 2. 사용자 친화적인 메시지

```typescript
// ✅ 좋은 예: 구체적이고 해결책 제시
throw new AppError(
  error,
  ErrorCoverage.SCREEN,
  '네트워크 연결을 확인하고 다시 시도해주세요',
);

// ❌ 나쁜 예: 기술적이고 모호한 메시지
throw new AppError(
  error,
  ErrorCoverage.SCREEN,
  'API request failed with status 500',
);
```

### 3. 에러 로깅

```typescript
import { logger } from '@shared/utils/logger';

try {
  await criticalOperation();
} catch (error) {
  // 에러 로깅
  logger.error('Critical operation failed', error);

  // AppError로 변환
  throw new AppError(
    error,
    ErrorCoverage.GLOBAL,
    '치명적인 오류가 발생했습니다',
  );
}
```

### 4. 에러 복구 시도

```typescript
async function fetchDataWithRetry(maxRetries = 3) {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await api.getData();
    } catch (error) {
      lastError = error;
      logger.warn(`Retry ${i + 1}/${maxRetries}`, error);
      await delay(1000 * (i + 1)); // 지수 백오프
    }
  }

  // 모든 재시도 실패
  throw new AppError(
    lastError!,
    ErrorCoverage.COMPONENT,
    '데이터를 불러올 수 없습니다. 나중에 다시 시도해주세요',
  );
}
```

### 5. Toast vs Error Boundary

```typescript
// ✅ Toast 사용: 사용자 액션의 즉각적인 피드백
const handleLike = async () => {
  try {
    await api.likePost(postId);
    Toast.show({ type: 'success', text1: '좋아요!' });
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: '좋아요를 누를 수 없습니다',
    });
  }
};

// ✅ Error Boundary 사용: 화면/컴포넌트 렌더링 에러
useEffect(() => {
  async function loadData() {
    try {
      const data = await api.getData();
      setData(data);
    } catch (error) {
      // Error Boundary가 catch
      throw new AppError(error, ErrorCoverage.SCREEN);
    }
  }
  loadData();
}, []);
```

### 6. 조건부 에러 처리

```typescript
try {
  await api.deletePost(postId);
} catch (error) {
  if (error instanceof AppError) {
    switch (error.code) {
      case ErrorCode.UNAUTHORIZED:
        // 로그인 필요
        navigation.navigate('Login');
        break;
      case ErrorCode.FORBIDDEN:
        // 권한 없음
        Toast.show({
          type: 'error',
          text1: '삭제 권한이 없습니다',
        });
        break;
      case ErrorCode.NOT_FOUND:
        // 이미 삭제됨
        Toast.show({
          type: 'info',
          text1: '이미 삭제된 게시글입니다',
        });
        break;
      default:
        // 기타 에러
        throw error;
    }
  }
}
```

---

## 예제 코드

### 완전한 화면 예제

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { ScreenErrorBoundary, AppError, ErrorCoverage } from '@shared/errors';
import { apiClient } from '@mockly/api';

function UserProfileScreen({ userId }: { userId: string }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await apiClient.get(`/users/${userId}`);
        setProfile(data);
      } catch (error) {
        // API 에러는 이미 AppError로 변환됨
        // ScreenErrorBoundary가 catch
        throw error;
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View>
      <Text>{profile.name}</Text>
      {/* ... */}
    </View>
  );
}

// ScreenErrorBoundary로 감싸서 export
export default function UserProfileScreenWithErrorBoundary(props) {
  return (
    <ScreenErrorBoundary screenName="프로필">
      <UserProfileScreen {...props} />
    </ScreenErrorBoundary>
  );
}
```

### 컴포넌트 레벨 에러 예제

```typescript
import { ComponentErrorBoundary, AppError, ErrorCoverage } from '@shared/errors';

function CommentList({ postId }: { postId: string }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function loadComments() {
      try {
        const data = await apiClient.get(`/posts/${postId}/comments`);
        setComments(data);
      } catch (error) {
        // 댓글 로드 실패해도 전체 화면은 유지
        throw new AppError(
          error,
          ErrorCoverage.COMPONENT,
          '댓글을 불러올 수 없습니다'
        );
      }
    }

    loadComments();
  }, [postId]);

  return (
    <View>
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </View>
  );
}

// ComponentErrorBoundary로 감싸기
export function CommentListWithErrorBoundary(props) {
  return (
    <ComponentErrorBoundary>
      <CommentList {...props} />
    </ComponentErrorBoundary>
  );
}
```

---

## 문제 해결

### Q: Error Boundary가 에러를 catch하지 못해요

**A:** Error Boundary는 렌더링 중 발생한 에러만 catch합니다. 이벤트 핸들러나 비동기 함수에서는 에러를 명시적으로 throw해야 합니다.

```typescript
// ❌ catch 안됨: 이벤트 핸들러
const handleClick = async () => {
  const data = await api.getData(); // 에러 발생해도 catch 안됨
};

// ✅ catch 됨: try-catch로 감싸고 throw
const handleClick = async () => {
  try {
    const data = await api.getData();
  } catch (error) {
    throw new AppError(error, ErrorCoverage.COMPONENT);
  }
};
```

### Q: Toast가 표시되지 않아요

**A:** App.tsx에 Toast 컴포넌트가 추가되어 있는지 확인하세요.

```tsx
import Toast from 'react-native-toast-message';

function App() {
  return (
    <>
      {/* ... */}
      <Toast />
    </>
  );
}
```

### Q: 401 에러인데 자동으로 로그아웃되지 않아요

**A:** 401 에러는 AppError로 변환되어 ErrorCoverage.SCREEN으로 처리됩니다. 자동 로그아웃을 원한다면 interceptor에서 처리하거나, 각 API 호출에서 401을 별도로 처리하세요.

---

## 참고 자료

- [Error Boundary 예제 화면](../apps/mobile/src/app/screens/examples/)
- [AppError 클래스](../apps/mobile/src/shared/errors/AppError.ts)
- [Error Boundary 구현](../apps/mobile/src/shared/errors/boundaries/)
- [API 클라이언트 초기화](../apps/mobile/src/shared/api/initializeApiClient.ts)
