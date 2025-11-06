# Clean Architecture for React Native

React Native 앱에서 Clean Architecture를 적용하는 상세 가이드입니다.

## 핵심 원칙

### 1. 의존성 규칙 (Dependency Rule)

**의존성은 항상 외부에서 내부로만 향한다**

```
Presentation → Domain ← Data → Infrastructure
```

- Domain Layer는 어떤 것에도 의존하지 않음
- Data Layer는 Domain에만 의존
- Presentation Layer는 Domain에만 의존

### 2. 관심사의 분리 (Separation of Concerns)

각 레이어는 명확한 책임을 가집니다:
- **Domain**: 비즈니스 로직
- **Data**: 데이터 접근
- **Presentation**: UI 표현

## 레이어 상세 설명

### Domain Layer (핵심 레이어)

**책임:** 비즈니스 로직과 규칙

**구성요소:**
- **Entities**: 비즈니스 데이터 모델
- **Use Cases**: 비즈니스 로직 단위
- **Repository Interfaces**: 데이터 접근 추상화

**규칙:**
- 외부 의존성 없음 (React, React Native, 외부 라이브러리 금지)
- 순수한 TypeScript/JavaScript만 사용
- 모든 비즈니스 로직은 이곳에

**예시:**
```typescript
// domain/entities/User.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

// domain/usecases/LoginUseCase.ts
export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<User> {
    // 비즈니스 로직
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    const user = await this.authRepository.login(email, password);
    return user;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// domain/repositories/AuthRepository.ts
export interface AuthRepository {
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
}
```

### Data Layer

**책임:** 데이터 소스와의 통신

**구성요소:**
- **Repository Implementations**: Domain의 Repository 구현
- **Data Sources**: 실제 데이터 소스 (API, Storage)
- **Models**: API 응답 모델 (Entity와 별도)

**규칙:**
- Domain의 Repository interface 구현
- 여러 Data Source를 조합 가능
- DTO (Data Transfer Object)를 Entity로 변환

**예시:**
```typescript
// data/models/UserDto.ts
export interface UserDto {
  id: string;
  email: string;
  full_name: string; // API 응답 형식
  created_at: string;
}

// data/datasources/AuthApiDataSource.ts
export class AuthApiDataSource {
  constructor(private apiClient: ApiClient) {}

  async login(email: string, password: string): Promise<UserDto> {
    const response = await this.apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  }
}

// data/repositories/AuthRepositoryImpl.ts
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private apiDataSource: AuthApiDataSource) {}

  async login(email: string, password: string): Promise<User> {
    const userDto = await this.apiDataSource.login(email, password);

    // DTO를 Entity로 변환
    return {
      id: userDto.id,
      email: userDto.email,
      name: userDto.full_name,
    };
  }

  async logout(): Promise<void> {
    // 구현
  }
}
```

### Presentation Layer

**책임:** UI 표현 및 사용자 상호작용

**구성요소:**
- **Screens**: 전체 화면 컴포넌트
- **Components**: 재사용 가능한 UI 컴포넌트
- **Hooks**: 비즈니스 로직과 UI 연결
- **View Models**: 화면 상태 관리 (선택)

**규칙:**
- Use Case를 통해 비즈니스 로직 실행
- UI 상태 관리
- React Native 특화 로직 포함 가능

**예시:**
```typescript
// presentation/hooks/useAuth.ts
export const useAuth = () => {
  const loginUseCase = useInjection<LoginUseCase>(LoginUseCase);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUseCase.execute(email, password);
      setUser(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, login, isLoading, error };
};

// presentation/screens/LoginScreen.tsx
export const LoginScreen = () => {
  const { login, isLoading, error } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    navigation.navigate('Home');
  };

  return (
    <View>
      {/* UI */}
    </View>
  );
};
```

## 의존성 주입 (Dependency Injection)

### 왜 필요한가?

- 테스트 용이성
- 유연한 구현 교체
- 의존성 방향 준수

### 구현 방법

#### 1. 간단한 Container 패턴

```typescript
// infrastructure/di/Container.ts
class Container {
  private services: Map<string, any> = new Map();

  register<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
  }

  resolve<T>(key: string): T {
    const factory = this.services.get(key);
    if (!factory) {
      throw new Error(`Service ${key} not registered`);
    }
    return factory();
  }
}

export const container = new Container();

// 등록
container.register('AuthRepository', () =>
  new AuthRepositoryImpl(new AuthApiDataSource(apiClient))
);

container.register('LoginUseCase', () =>
  new LoginUseCase(container.resolve('AuthRepository'))
);

// 사용
const loginUseCase = container.resolve<LoginUseCase>('LoginUseCase');
```

#### 2. React Context 패턴

```typescript
// infrastructure/di/DIContext.tsx
const DIContext = createContext<Container | null>(null);

export const DIProvider: React.FC = ({ children }) => {
  const container = useMemo(() => {
    const c = new Container();
    // 등록
    c.register('AuthRepository', () => new AuthRepositoryImpl(...));
    c.register('LoginUseCase', () => new LoginUseCase(...));
    return c;
  }, []);

  return (
    <DIContext.Provider value={container}>
      {children}
    </DIContext.Provider>
  );
};

export const useInjection = <T,>(key: string): T => {
  const container = useContext(DIContext);
  if (!container) {
    throw new Error('DIProvider not found');
  }
  return container.resolve<T>(key);
};
```

## 디렉토리 구조

```
src/
├── domain/
│   ├── entities/
│   │   ├── User.ts
│   │   ├── Post.ts
│   │   └── index.ts
│   ├── usecases/
│   │   ├── auth/
│   │   │   ├── LoginUseCase.ts
│   │   │   ├── LogoutUseCase.ts
│   │   │   └── index.ts
│   │   └── posts/
│   │       ├── GetPostsUseCase.ts
│   │       ├── CreatePostUseCase.ts
│   │       └── index.ts
│   └── repositories/
│       ├── AuthRepository.ts
│       ├── PostRepository.ts
│       └── index.ts
│
├── data/
│   ├── models/
│   │   ├── UserDto.ts
│   │   └── PostDto.ts
│   ├── repositories/
│   │   ├── AuthRepositoryImpl.ts
│   │   └── PostRepositoryImpl.ts
│   └── datasources/
│       ├── api/
│       │   ├── AuthApiDataSource.ts
│       │   └── PostApiDataSource.ts
│       └── storage/
│           ├── AuthStorageDataSource.ts
│           └── UserStorageDataSource.ts
│
├── infrastructure/
│   ├── api/
│   │   ├── ApiClient.ts
│   │   ├── interceptors/
│   │   └── config.ts
│   ├── storage/
│   │   ├── SecureStorage.ts
│   │   └── AsyncStorage.ts
│   └── di/
│       ├── Container.ts
│       └── DIContext.tsx
│
└── presentation/
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen/
    │   │   └── SignUpScreen/
    │   └── home/
    │       └── HomeScreen/
    ├── components/
    │   ├── common/
    │   │   ├── Button/
    │   │   ├── Input/
    │   │   └── Card/
    │   └── features/
    │       └── post/
    │           └── PostCard/
    ├── hooks/
    │   ├── useAuth.ts
    │   ├── usePosts.ts
    │   └── index.ts
    ├── navigation/
    │   ├── AppNavigator.tsx
    │   ├── AuthNavigator.tsx
    │   └── types.ts
    └── theme/
        ├── colors.ts
        ├── spacing.ts
        └── typography.ts
```

## 실전 예제: 게시글 기능

### 1. Domain Layer

```typescript
// domain/entities/Post.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// domain/repositories/PostRepository.ts
export interface PostRepository {
  getPosts(page: number, limit: number): Promise<Post[]>;
  getPostById(id: string): Promise<Post>;
  createPost(data: CreatePostData): Promise<Post>;
  updatePost(id: string, data: UpdatePostData): Promise<Post>;
  deletePost(id: string): Promise<void>;
}

// domain/usecases/posts/GetPostsUseCase.ts
export class GetPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(page: number = 1, limit: number = 10): Promise<Post[]> {
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }

    return await this.postRepository.getPosts(page, limit);
  }
}
```

### 2. Data Layer

```typescript
// data/models/PostDto.ts
export interface PostDto {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
}

// data/datasources/api/PostApiDataSource.ts
export class PostApiDataSource {
  constructor(private apiClient: ApiClient) {}

  async getPosts(page: number, limit: number): Promise<PostDto[]> {
    const response = await this.apiClient.get('/posts', {
      params: { page, limit },
    });
    return response.data;
  }
}

// data/repositories/PostRepositoryImpl.ts
export class PostRepositoryImpl implements PostRepository {
  constructor(private apiDataSource: PostApiDataSource) {}

  async getPosts(page: number, limit: number): Promise<Post[]> {
    const dtos = await this.apiDataSource.getPosts(page, limit);
    return dtos.map(this.mapDtoToEntity);
  }

  private mapDtoToEntity(dto: PostDto): Post {
    return {
      id: dto.id,
      title: dto.title,
      content: dto.content,
      authorId: dto.author_id,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  // 다른 메서드들...
}
```

### 3. Presentation Layer

```typescript
// presentation/hooks/usePosts.ts
export const usePosts = () => {
  const getPostsUseCase = useInjection<GetPostsUseCase>('GetPostsUseCase');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getPostsUseCase.execute(page);
      setPosts(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return { posts, loadPosts, isLoading, error };
};

// presentation/screens/PostListScreen/PostListScreen.tsx
export const PostListScreen = () => {
  const { posts, loadPosts, isLoading, error } = usePosts();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostCard post={item} />}
      keyExtractor={(item) => item.id}
      onRefresh={loadPosts}
      refreshing={isLoading}
    />
  );
};
```

## 테스트

### Use Case 테스트

```typescript
describe('GetPostsUseCase', () => {
  let useCase: GetPostsUseCase;
  let mockRepository: jest.Mocked<PostRepository>;

  beforeEach(() => {
    mockRepository = {
      getPosts: jest.fn(),
      getPostById: jest.fn(),
      createPost: jest.fn(),
      updatePost: jest.fn(),
      deletePost: jest.fn(),
    };
    useCase = new GetPostsUseCase(mockRepository);
  });

  it('should return posts from repository', async () => {
    const mockPosts: Post[] = [
      { id: '1', title: 'Test', content: 'Content', authorId: 'user1', createdAt: new Date(), updatedAt: new Date() },
    ];
    mockRepository.getPosts.mockResolvedValue(mockPosts);

    const result = await useCase.execute(1, 10);

    expect(result).toEqual(mockPosts);
    expect(mockRepository.getPosts).toHaveBeenCalledWith(1, 10);
  });

  it('should throw error for invalid page number', async () => {
    await expect(useCase.execute(0, 10)).rejects.toThrow('Page must be greater than 0');
  });
});
```

## 장점

1. **테스트 용이성**: 각 레이어를 독립적으로 테스트
2. **유지보수성**: 관심사가 명확히 분리
3. **확장성**: 새 기능 추가 시 구조가 명확
4. **유연성**: 구현 교체 용이 (API → Mock으로 쉽게 전환)
5. **재사용성**: Domain 로직은 다른 플랫폼에서도 재사용 가능

## 주의사항

1. **과도한 추상화 피하기**: 간단한 기능에는 오버엔지니어링
2. **실용성 유지**: 프로젝트 규모에 맞게 적용
3. **팀 컨벤션**: 팀원들과 합의된 구조 사용
4. **점진적 도입**: 한 번에 모두 적용하지 말고 단계적으로
