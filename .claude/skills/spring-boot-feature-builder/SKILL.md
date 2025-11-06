---
name: spring-boot-feature-builder
description: Spring Boot 백엔드 API 기능 개발을 위한 체계적인 워크플로우 스킬. 요구사항 분석부터 Layered Architecture 기반 설계, 프로젝트 컨벤션 적용까지 전체 개발 프로세스를 가이드. RESTful API 구현, 데이터베이스 연동, 비즈니스 로직 개발 시 사용.
---

# Spring Boot Feature Builder

Spring Boot 백엔드 API를 체계적으로 분석하고 Layered Architecture 기반으로 구현하는 워크플로우 스킬.

## Overview

이 스킬은 Spring Boot 백엔드 개발 시 다음을 제공:
1. RESTful API 요구사항 체계적 정리
2. Entity, DTO, API 설계
3. Layered Architecture 기반 설계 (Controller-Service-Repository)
4. Spring Boot 컨벤션 자동 적용
5. 레이어별 코드 생성 및 테스트

## When to Use

다음과 같은 경우 이 스킬을 사용:
- 새로운 RESTful API를 구현할 때
- 복잡한 비즈니스 로직을 개발할 때
- 데이터베이스 Entity 설계가 필요할 때
- Layered Architecture 설계가 필요할 때
- Spring Boot 프로젝트 구조 개선 시

## Workflow Overview

### 4단계 프로세스

```
Phase 1: 요구사항 정리
    ↓
Phase 2: API 및 데이터 설계
    ↓
Phase 3: Layered Architecture 설계
    ↓
Phase 4: 구현 및 컨벤션 적용
```

---

# Phase 1: 요구사항 정리

## 목표

API 요구사항을 명확하고 구조화된 형태로 정리.

## 단계

### 1.1 API 요구사항 수집

사용자에게 다음 질문:
- 어떤 API를 만들고 싶으신가요?
- 주요 기능은 무엇인가요?
- 어떤 데이터를 다루나요?
- 인증/인가가 필요한가요?

### 1.2 사용자 스토리 작성

**형식:**
```
As a [API 클라이언트]
I want to [API 기능]
So that [목적]
```

**예시:**
```
As a 모바일 앱
I want to GET /api/users/{id}로 사용자 정보를 조회
So that 사용자 프로필을 표시할 수 있다
```

### 1.3 API 엔드포인트 목록

요구사항을 RESTful API 엔드포인트로 정리:

**예시:**
```markdown
## User API
- GET    /api/users          - 사용자 목록 조회
- GET    /api/users/{id}     - 사용자 상세 조회
- POST   /api/users          - 사용자 생성
- PUT    /api/users/{id}     - 사용자 수정
- DELETE /api/users/{id}     - 사용자 삭제

## Auth API
- POST   /api/auth/login     - 로그인
- POST   /api/auth/logout    - 로그아웃
- POST   /api/auth/refresh   - 토큰 갱신

## Post API
- GET    /api/posts          - 게시글 목록 조회 (페이징, 검색)
- GET    /api/posts/{id}     - 게시글 상세 조회
- POST   /api/posts          - 게시글 작성
- PUT    /api/posts/{id}     - 게시글 수정
- DELETE /api/posts/{id}     - 게시글 삭제
```

### 1.4 우선순위 설정

- **P0 (Critical)**: 핵심 CRUD API
- **P1 (High)**: 검색, 필터링, 정렬
- **P2 (Medium)**: 통계, 부가 기능

### 1.5 제약사항 파악

- 데이터베이스 (MySQL, PostgreSQL, MongoDB 등)
- 인증 방식 (JWT, Session, OAuth2)
- 성능 요구사항 (응답 시간, TPS)
- 보안 요구사항

**Phase 1 완료 체크리스트:**
- [ ] API 엔드포인트 목록 작성
- [ ] 우선순위 설정
- [ ] 제약사항 파악
- [ ] 사용자 확인 완료

---

# Phase 2: API 및 데이터 설계

## 목표

각 API의 세부 사항과 데이터 모델을 설계.

## 단계

### 2.1 Entity 설계

데이터베이스 Entity 정의:

**예시: User Entity**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private String password;

    @Column(length = 500)
    private String profileImage;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Relationships
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    private List<Post> posts = new ArrayList<>();
}
```

### 2.2 DTO 설계

Request/Response DTO 정의:

**예시:**
```java
// Request DTO
public class CreateUserRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    private String name;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100)
    private String password;
}

// Response DTO
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String profileImage;
    private LocalDateTime createdAt;

    // password는 포함하지 않음 (보안)
}
```

### 2.3 API 명세서 작성

각 엔드포인트의 상세 명세:

**예시: POST /api/users**
```markdown
### POST /api/users
사용자를 생성합니다.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "profileImage": null,
  "createdAt": "2024-01-01T00:00:00"
}
\`\`\`

**Error Responses:**
- 400 Bad Request: 입력 검증 실패
- 409 Conflict: 이메일 중복
- 500 Internal Server Error: 서버 오류

**Validation Rules:**
- email: 필수, 이메일 형식, 최대 100자
- name: 필수, 2-100자
- password: 필수, 최소 8자
```

### 2.4 관계 설계

Entity 간 관계 정의:

```
User (1) ─── (N) Post
  │
  └─── (N) Comment

Post (1) ─── (N) Comment

Category (N) ─── (N) Post (Many-to-Many)
```

### 2.5 비즈니스 로직 정의

각 API의 비즈니스 규칙:

**예시: 게시글 작성**
```markdown
1. 인증된 사용자만 작성 가능
2. 제목은 5자 이상, 200자 이하
3. 내용은 10자 이상
4. 카테고리는 최소 1개, 최대 5개
5. 작성자 정보는 자동으로 설정
6. 작성 시간은 서버 시간 기준
```

**Phase 2 완료 체크리스트:**
- [ ] Entity 설계 완료
- [ ] DTO 설계 완료
- [ ] API 명세서 작성
- [ ] Entity 관계 정의
- [ ] 비즈니스 로직 정의

---

# Phase 3: Layered Architecture 설계

## 목표

Spring Boot Layered Architecture에 따라 레이어별 설계 수립.

## Layered Architecture

```
┌─────────────────────────────────────┐
│   Controller Layer (API)            │
│   - REST Controllers                │
│   - Request/Response 처리           │
│   - 입력 검증                        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Service Layer (Business Logic)    │
│   - 비즈니스 로직                    │
│   - 트랜잭션 관리                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Repository Layer (Data Access)    │
│   - JPA Repositories                │
│   - 데이터베이스 접근                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Entity Layer (Domain Model)       │
│   - JPA Entities                    │
│   - 도메인 모델                      │
└─────────────────────────────────────┘
```

**참고:** [Spring Boot Architecture 가이드](./reference/spring-boot-architecture.md)

## 단계

### 3.1 Entity Layer 설계

JPA Entity 정의:

```java
@Entity
@Table(name = "posts")
@Getter @Setter
@NoArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @ManyToMany
    @JoinTable(
        name = "post_categories",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

### 3.2 Repository Layer 설계

Spring Data JPA Repository:

```java
public interface PostRepository extends JpaRepository<Post, Long> {
    // 기본 CRUD는 자동 제공

    // Custom Query Methods
    List<Post> findByAuthorId(Long authorId);

    Page<Post> findByTitleContaining(String keyword, Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.categories c WHERE c.id = :categoryId")
    List<Post> findByCategoryId(@Param("categoryId") Long categoryId);

    @Query("SELECT p FROM Post p WHERE p.author.id = :authorId AND p.createdAt >= :since")
    List<Post> findRecentPostsByAuthor(
        @Param("authorId") Long authorId,
        @Param("since") LocalDateTime since
    );
}
```

### 3.3 Service Layer 설계

비즈니스 로직 구현:

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public PostResponse getPost(Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return PostMapper.toResponse(post);
    }

    public Page<PostResponse> getPosts(Pageable pageable) {
        return postRepository.findAll(pageable)
            .map(PostMapper::toResponse);
    }

    @Transactional
    public PostResponse createPost(Long userId, CreatePostRequest request) {
        // 1. 사용자 확인
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 2. 입력 검증
        validatePostRequest(request);

        // 3. Entity 생성
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(user);

        // 4. 카테고리 설정
        Set<Category> categories = categoryRepository
            .findAllById(request.getCategoryIds())
            .stream()
            .collect(Collectors.toSet());
        post.setCategories(categories);

        // 5. 저장
        Post savedPost = postRepository.save(post);

        return PostMapper.toResponse(savedPost);
    }

    private void validatePostRequest(CreatePostRequest request) {
        if (request.getTitle().length() < 5) {
            throw new ValidationException("Title must be at least 5 characters");
        }
        if (request.getContent().length() < 10) {
            throw new ValidationException("Content must be at least 10 characters");
        }
    }
}
```

### 3.4 Controller Layer 설계

REST API 엔드포인트:

```java
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @GetMapping
    public ResponseEntity<Page<PostResponse>> getPosts(
        @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<PostResponse> posts = postService.getPosts(pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long id) {
        PostResponse post = postService.getPost(id);
        return ResponseEntity.ok(post);
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody CreatePostRequest request
    ) {
        PostResponse post = postService.createPost(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
        @PathVariable Long id,
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody UpdatePostRequest request
    ) {
        PostResponse post = postService.updatePost(id, userDetails.getId(), request);
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
        @PathVariable Long id,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        postService.deletePost(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
```

### 3.5 파일 구조 설계

```
src/main/java/com/example/project/
├── domain/
│   ├── user/
│   │   ├── entity/
│   │   │   └── User.java
│   │   ├── repository/
│   │   │   └── UserRepository.java
│   │   ├── service/
│   │   │   └── UserService.java
│   │   ├── controller/
│   │   │   └── UserController.java
│   │   └── dto/
│   │       ├── CreateUserRequest.java
│   │       ├── UpdateUserRequest.java
│   │       └── UserResponse.java
│   │
│   ├── post/
│   │   ├── entity/
│   │   │   └── Post.java
│   │   ├── repository/
│   │   │   └── PostRepository.java
│   │   ├── service/
│   │   │   └── PostService.java
│   │   ├── controller/
│   │   │   └── PostController.java
│   │   └── dto/
│   │       ├── CreatePostRequest.java
│   │       ├── UpdatePostRequest.java
│   │       └── PostResponse.java
│   │
│   └── auth/
│       ├── service/
│       │   └── AuthService.java
│       ├── controller/
│       │   └── AuthController.java
│       └── dto/
│           ├── LoginRequest.java
│           └── TokenResponse.java
│
├── global/
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── JpaConfig.java
│   │   └── WebConfig.java
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceNotFoundException.java
│   │   └── ValidationException.java
│   ├── util/
│   │   ├── JwtUtil.java
│   │   └── MapperUtil.java
│   └── common/
│       ├── ApiResponse.java
│       └── PageResponse.java
│
└── ProjectApplication.java
```

**Phase 3 완료 체크리스트:**
- [ ] Entity 정의
- [ ] Repository 정의
- [ ] Service 정의
- [ ] Controller 정의
- [ ] 파일 구조 설계

---

# Phase 4: 구현 및 컨벤션 적용

## 목표

Phase 3의 설계를 바탕으로 실제 코드 구현 및 Spring Boot 컨벤션 적용.

## 단계

### 4.1 프로젝트 컨벤션 로드

프로젝트의 기존 컨벤션 확인:
- 패키지 구조
- 네이밍 규칙
- 어노테이션 스타일
- Exception 처리 방식
- Response 형식

**참고:** [Spring Boot 컨벤션 가이드](./reference/spring-boot-conventions.md)

### 4.2 레이어별 구현

#### Step 1: Entity 구현

**사용 템플릿:** [Entity 템플릿](./templates/entity-template.md)

#### Step 2: Repository 구현

**사용 템플릿:** [Repository 템플릿](./templates/repository-template.md)

#### Step 3: Service 구현

**사용 템플릿:** [Service 템플릿](./templates/service-template.md)

#### Step 4: Controller 구현

**사용 템플릿:** [Controller 템플릿](./templates/controller-template.md)

#### Step 5: DTO 구현

**사용 템플릿:** [DTO 템플릿](./templates/dto-template.md)

### 4.3 컨벤션 자동 적용

1. **어노테이션 순서:**
   ```java
   @Entity
   @Table(name = "users")
   @Getter @Setter
   @NoArgsConstructor
   @AllArgsConstructor
   @Builder
   public class User { }
   ```

2. **네이밍 규칙:**
   - Entity: PascalCase (User, Post)
   - DTO: PascalCase + 용도 (CreateUserRequest, UserResponse)
   - Service: PascalCase + Service (UserService)
   - Repository: PascalCase + Repository (UserRepository)
   - Controller: PascalCase + Controller (UserController)

3. **Exception 처리:**
   ```java
   @ControllerAdvice
   public class GlobalExceptionHandler {
       @ExceptionHandler(ResourceNotFoundException.class)
       public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
           return ResponseEntity.status(HttpStatus.NOT_FOUND)
               .body(new ErrorResponse(ex.getMessage()));
       }
   }
   ```

4. **Response 형식:**
   ```java
   // 성공
   {
       "success": true,
       "data": { ... },
       "message": "Success"
   }

   // 실패
   {
       "success": false,
       "error": {
           "code": "NOT_FOUND",
           "message": "Resource not found"
       }
   }
   ```

### 4.4 테스트 코드 작성

#### Repository 테스트
```java
@DataJpaTest
class PostRepositoryTest {
    @Autowired
    private PostRepository postRepository;

    @Test
    void findByTitleContaining_ShouldReturnMatchingPosts() {
        // given
        Post post = new Post();
        post.setTitle("Test Post");
        postRepository.save(post);

        // when
        List<Post> posts = postRepository.findByTitleContaining("Test", PageRequest.of(0, 10));

        // then
        assertThat(posts).hasSize(1);
        assertThat(posts.get(0).getTitle()).isEqualTo("Test Post");
    }
}
```

#### Service 테스트
```java
@ExtendWith(MockitoExtension.class)
class PostServiceTest {
    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private PostService postService;

    @Test
    void getPost_WhenExists_ShouldReturnPost() {
        // given
        Post post = new Post();
        post.setId(1L);
        post.setTitle("Test");
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        // when
        PostResponse response = postService.getPost(1L);

        // then
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Test");
    }
}
```

#### Controller 테스트
```java
@WebMvcTest(PostController.class)
class PostControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PostService postService;

    @Test
    void getPost_ShouldReturnPost() throws Exception {
        // given
        PostResponse response = new PostResponse(1L, "Test", "Content");
        when(postService.getPost(1L)).thenReturn(response);

        // when & then
        mockMvc.perform(get("/api/posts/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.title").value("Test"));
    }
}
```

**Phase 4 완료 체크리스트:**
- [ ] 모든 레이어 구현 완료
- [ ] Spring Boot 컨벤션 적용
- [ ] 테스트 코드 작성
- [ ] API 문서화 (Swagger/SpringDoc)

---

# Best Practices

## 아키텍처

1. **레이어 분리:** Controller, Service, Repository 명확히 분리
2. **단일 책임:** 각 클래스는 하나의 책임만
3. **의존성 주입:** @RequiredArgsConstructor로 생성자 주입
4. **트랜잭션 관리:** Service 레이어에서 @Transactional

## 코드 품질

1. **입력 검증:** @Valid, @NotNull, @Size 등 활용
2. **Exception 처리:** Custom Exception + GlobalExceptionHandler
3. **불변성:** DTO는 가능한 불변 객체로
4. **매핑 분리:** Entity ↔ DTO 변환 로직 분리

## Spring Boot 특화

1. **JPA 최적화:** N+1 문제 해결 (fetch join, EntityGraph)
2. **캐싱:** @Cacheable 활용
3. **비동기 처리:** @Async 활용
4. **Security:** Spring Security로 인증/인가

## 참고 자료

- [Spring Boot Architecture](./reference/spring-boot-architecture.md)
- [Spring Boot 컨벤션](./reference/spring-boot-conventions.md)
- [템플릿 모음](./templates/)
