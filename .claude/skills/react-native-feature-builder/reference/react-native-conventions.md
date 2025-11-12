# React Native 개발 컨벤션

React Native 프로젝트의 코딩 컨벤션 및 베스트 프랙티스입니다.

## 파일 및 폴더 구조

### 네이밍 규칙

**파일명:**

- Components: PascalCase (예: `UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (예: `useAuth.ts`)
- Utils: camelCase (예: `dateFormatter.ts`)
- Constants: UPPER_SNAKE_CASE (예: `API_ENDPOINTS.ts`)

**폴더명:**

- kebab-case 또는 camelCase 일관되게 사용
- 기능별 폴더링 권장

### 컴포넌트 파일 구조

```
ComponentName/
├── ComponentName.tsx           # 메인 컴포넌트
├── ComponentName.styles.ts     # 스타일 (선택)
├── ComponentName.test.tsx      # 테스트
├── components/                 # 하위 컴포넌트
│   └── SubComponent.tsx
└── index.ts                    # export
```

## TypeScript 규칙

### 타입 정의

```typescript
// ✅ 좋은 예
interface UserProfileProps {
  user: User;
  onEdit: (userId: string) => void;
  isEditable?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit, isEditable = false }) => {
  // 구현
};

// ❌ 나쁜 예
export const UserProfile = (props: any) => {
  // any 사용 금지
};
```

### 타입 vs Interface

**Interface 사용:**

- Component Props
- 공개 API
- 확장 가능한 타입

**Type 사용:**

- Union types
- Utility types
- Computed properties

```typescript
// Interface
interface User {
  id: string;
  name: string;
}

// Type
type UserRole = 'admin' | 'user' | 'guest';
type UserWithRole = User & { role: UserRole };
```

### 제네릭 활용

```typescript
// ✅ 재사용 가능한 Hook
function useApiCall<T>(apiFunc: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ...

  return { data, loading, error };
}

// 사용
const { data: user } = useApiCall<User>(() => api.getUser());
```

## Component 작성

### 함수 컴포넌트 구조

```typescript
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 외부 라이브러리
import axios from 'axios';

// 내부 imports (절대 경로)
import { User } from '@/domain/entities/User';
import { useAuth } from '@/presentation/hooks/useAuth';

// 상대 경로 imports
import { ProfileImage } from './components/ProfileImage';
import { styles } from './UserProfile.styles';

// Types
interface UserProfileProps {
  userId: string;
  onEdit?: (user: User) => void;
}

// Component
export const UserProfile: React.FC<UserProfileProps> = ({ userId, onEdit }) => {
  // 1. Hooks (순서 중요)
  const navigation = useNavigation();
  const { currentUser } = useAuth();

  // 2. State
  const [isEditing, setIsEditing] = useState(false);
  const [localUser, setLocalUser] = useState<User | null>(null);

  // 3. Effects
  useEffect(() => {
    loadUser();
  }, [userId]);

  // 4. Callbacks
  const loadUser = useCallback(async () => {
    // 로직
  }, [userId]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    onEdit?.(localUser!);
  }, [localUser, onEdit]);

  // 5. Memoized values
  const displayName = useMemo(() => {
    return localUser?.name || 'Unknown';
  }, [localUser]);

  // 6. Early returns
  if (!localUser) {
    return <Text>Loading...</Text>;
  }

  // 7. Render
  return (
    <View style={styles.container}>
      <ProfileImage uri={localUser.profileImage} />
      <Text style={styles.name}>{displayName}</Text>
      {onEdit && (
        <TouchableOpacity onPress={handleEdit}>
          <Text>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
```

### Props 기본값

```typescript
// ✅ 구조 분해 할당에서 기본값
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
}) => {
  // ...
};

// ❌ defaultProps 사용 (deprecated)
Button.defaultProps = {
  variant: 'primary',
};
```

### Conditional Rendering

```typescript
// ✅ 명시적 boolean 체크
{isLoading && <LoadingSpinner />}
{!isLoading && data && <DataView data={data} />}
{error && <ErrorMessage message={error} />}

// ❌ 암시적 truthy/falsy (숫자 0이 렌더링될 수 있음)
{items.length && <List items={items} />}  // items.length가 0이면 0이 렌더링됨

// ✅ 올바른 방법
{items.length > 0 && <List items={items} />}
```

## Hooks 사용

### Custom Hook 규칙

```typescript
// ✅ 좋은 Custom Hook
export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getUser(userId);
      setUser(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, isLoading, error, refetch: fetchUser };
};
```

### useEffect 의존성

```typescript
// ✅ 모든 의존성 명시
useEffect(() => {
  fetchData(userId, filter);
}, [userId, filter]); // 모든 의존성 포함

// ❌ 의존성 누락
useEffect(() => {
  fetchData(userId, filter);
}, []); // ESLint 경고 발생
```

### useCallback과 useMemo

```typescript
// ✅ 필요한 경우에만 사용
const ExpensiveComponent = () => {
  // 자식 컴포넌트에 전달되는 함수
  const handlePress = useCallback(() => {
    console.log('pressed');
  }, []);

  // 복잡한 계산
  const expensiveValue = useMemo(() => {
    return complexCalculation(data);
  }, [data]);

  return <ChildComponent onPress={handlePress} value={expensiveValue} />;
};

// ❌ 불필요한 사용 (오버엔지니어링)
const SimpleComponent = () => {
  // 간단한 이벤트 핸들러는 useCallback 불필요
  const handlePress = useCallback(() => {
    console.log('pressed');
  }, []); // 불필요

  return <Button onPress={handlePress} />;
};
```

## Styling

### StyleSheet 사용

```typescript
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  button: ViewStyle;
}

export const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});
```

### 조건부 스타일

```typescript
// ✅ 배열 사용
<View style={[
  styles.button,
  disabled && styles.buttonDisabled,
  variant === 'primary' && styles.buttonPrimary,
]} />

// ✅ 동적 스타일
<View style={[
  styles.container,
  { backgroundColor: isDark ? '#000' : '#fff' },
]} />
```

### Theme 사용

```typescript
// theme/colors.ts
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#FFFFFF',
  text: '#000000',
  error: '#FF3B30',
  success: '#34C759',
} as const;

// theme/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

// 사용
import { colors, spacing } from '@/presentation/theme';

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
});
```

## 성능 최적화

### React.memo

```typescript
// ✅ 순수한 프레젠테이션 컴포넌트
export const UserCard = React.memo<UserCardProps>(({ user }) => {
  return (
    <View>
      <Text>{user.name}</Text>
    </View>
  );
});

// 커스텀 비교 함수
export const UserCard = React.memo(
  ({ user }) => <View><Text>{user.name}</Text></View>,
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
);
```

### FlatList 최적화

```typescript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  // 성능 최적화
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={5}
  // Item 최적화
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

## 에러 처리

### Try-Catch 패턴

```typescript
const fetchUser = async (userId: string) => {
  try {
    setIsLoading(true);
    const user = await api.getUser(userId);
    setUser(user);
  } catch (error) {
    if (error instanceof ApiError) {
      setError(error.message);
    } else if (error instanceof NetworkError) {
      setError('Network connection failed');
    } else {
      setError('An unexpected error occurred');
    }
    console.error('Failed to fetch user:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### Error Boundary

```typescript
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

## 접근성 (Accessibility)

```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Add to favorites"
  accessibilityHint="Adds this item to your favorites list"
  accessibilityRole="button"
  accessibilityState={{ disabled: isDisabled }}
  onPress={handlePress}
>
  <Icon name="heart" />
</TouchableOpacity>

<Text
  accessibilityRole="header"
  accessibilityLevel={1}
>
  Screen Title
</Text>
```

## 네비게이션

### 타입 안전한 네비게이션

```typescript
// navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: { section?: string };
};

// 사용
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Profile'
>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const goToSettings = () => {
    navigation.navigate('Settings', { section: 'privacy' });
  };

  return <View />;
};
```

## 상수 관리

```typescript
// constants/api.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },
} as const;

// constants/config.ts
export const CONFIG = {
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.example.com',
  API_TIMEOUT: 10000,
  MAX_RETRY: 3,
} as const;
```

## 환경 변수

```typescript
// config/env.ts
import { Platform } from 'react-native';

interface Environment {
  apiUrl: string;
  apiKey: string;
  environment: 'development' | 'staging' | 'production';
}

const getEnvironment = (): Environment => {
  if (__DEV__) {
    return {
      apiUrl: 'https://dev-api.example.com',
      apiKey: 'dev-key',
      environment: 'development',
    };
  }

  return {
    apiUrl: process.env.API_URL!,
    apiKey: process.env.API_KEY!,
    environment: 'production',
  };
};

export const ENV = getEnvironment();
```

## 플랫폼 분기

```typescript
import { Platform, StyleSheet } from 'react-native';

// ✅ Platform.select
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

// ✅ Platform.OS
if (Platform.OS === 'ios') {
  // iOS 전용 로직
}

// ✅ Platform.Version
if (Platform.OS === 'android' && Platform.Version >= 21) {
  // Android 5.0 이상에서만 실행
}
```

## 코드 리뷰 체크리스트

- [ ] TypeScript 타입이 명시되어 있는가?
- [ ] `any` 타입을 사용하지 않았는가?
- [ ] useEffect 의존성 배열이 올바른가?
- [ ] 불필요한 re-render가 없는가?
- [ ] 에러 처리가 적절한가?
- [ ] 접근성 속성이 추가되어 있는가?
- [ ] 하드코딩된 값이 상수로 분리되어 있는가?
- [ ] import 순서가 올바른가?
- [ ] 네이밍이 일관성 있는가?
- [ ] 주석이 필요한 복잡한 로직에 설명이 있는가?
