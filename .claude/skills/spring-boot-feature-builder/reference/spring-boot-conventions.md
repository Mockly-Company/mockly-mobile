# Spring Boot 개발 컨벤션

Spring Boot 프로젝트의 코딩 컨벤션 및 베스트 프랙티스입니다.

## 패키지 구조

### Feature 기반 패키지 구조 (권장)

```
com.example.project/
├── domain/
│   ├── user/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── controller/
│   │   └── dto/
│   ├── post/
│   └── auth/
├── global/
│   ├── config/
│   ├── exception/
│   ├── util/
│   └── common/
└── ProjectApplication.java
```

### 레이어 기반 패키지 구조

```
com.example.project/
├── entity/
├── repository/
├── service/
├── controller/
├── dto/
├── config/
├── exception/
└── ProjectApplication.java
```

## 네이밍 규칙

### 클래스 네이밍

```java
// Entity
public class User { }
public class Post { }

// Repository
public interface UserRepository extends JpaRepository<User, Long> { }

// Service
public class UserService { }
public interface UserService { } // 인터페이스 사용 시
public class UserServiceImpl implements UserService { }

// Controller
public class UserController { }

// DTO
public class CreateUserRequest { }
public class UpdateUserRequest { }
public class UserResponse { }

// Exception
public class ResourceNotFoundException extends RuntimeException { }
public class UserAlreadyExistsException extends RuntimeException { }
```

### 메서드 네이밍

```java
// CRUD
public User createUser(CreateUserRequest request) { }
public User getUser(Long id) { }
public User updateUser(Long id, UpdateUserRequest request) { }
public void deleteUser(Long id) { }

// 조회
public List<User> findAllUsers() { }
public List<User> findUsersByName(String name) { }
public Page<User> searchUsers(String keyword, Pageable pageable) { }

// 검증
public boolean existsUserByEmail(String email) { }
public void validateUser(User user) { }

// 비즈니스 로직
public void activateUser(Long userId) { }
public void sendWelcomeEmail(User user) { }
```

## Entity 작성

### 기본 구조

```java
@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {
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
}
```

### BaseEntity 패턴

```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
public abstract class BaseEntity {
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
```

### 관계 매핑

```java
// One-to-Many
@Entity
public class User {
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();
}

@Entity
public class Post {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
}

// Many-to-Many
@Entity
public class Post {
    @ManyToMany
    @JoinTable(
        name = "post_categories",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();
}
```

## Repository 작성

### 기본 Repository

```java
public interface UserRepository extends JpaRepository<User, Long> {
    // 자동 제공되는 메서드
    // save(), findById(), findAll(), delete() 등
}
```

### Custom Query Methods

```java
public interface UserRepository extends JpaRepository<User, Long> {
    // Method Name Query
    Optional<User> findByEmail(String email);
    List<User> findByNameContaining(String name);
    boolean existsByEmail(String email);

    // @Query (JPQL)
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.active = true")
    Optional<User> findActiveUserByEmail(@Param("email") String email);

    // @Query (Native SQL)
    @Query(value = "SELECT * FROM users WHERE created_at > :since", nativeQuery = true)
    List<User> findRecentUsers(@Param("since") LocalDateTime since);

    // Projection
    @Query("SELECT new com.example.dto.UserSummary(u.id, u.name, u.email) FROM User u")
    List<UserSummary> findAllUserSummaries();
}
```

### Pagination

```java
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByTitleContaining(String keyword, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.author.id = :authorId")
    Page<Post> findByAuthor(@Param("authorId") Long authorId, Pageable pageable);
}
```

## Service 작성

### 기본 구조

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse getUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserMapper.toResponse(user);
    }

    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
            .map(UserMapper::toResponse);
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        // 1. 검증
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        // 2. Entity 생성
        User user = User.builder()
            .email(request.getEmail())
            .name(request.getName())
            .password(passwordEncoder.encode(request.getPassword()))
            .build();

        // 3. 저장
        User savedUser = userRepository.save(user);

        // 4. Response 변환
        return UserMapper.toResponse(savedUser);
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setName(request.getName());
        user.setProfileImage(request.getProfileImage());

        return UserMapper.toResponse(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }
}
```

### 트랜잭션 관리

```java
@Service
@Transactional(readOnly = true) // 클래스 레벨: 읽기 전용
public class PostService {
    @Transactional // 쓰기 작업: readOnly=false
    public PostResponse createPost(CreatePostRequest request) {
        // ...
    }

    public PostResponse getPost(Long id) {
        // readOnly=true (클래스 레벨 설정)
    }
}
```

## Controller 작성

### REST API 구조

```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(
        @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<UserResponse> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        UserResponse user = userService.getUser(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
        @Valid @RequestBody CreateUserRequest request
    ) {
        UserResponse user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
        @PathVariable Long id,
        @Valid @RequestBody UpdateUserRequest request
    ) {
        UserResponse user = userService.updateUser(id, request);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
```

### 검증 및 예외 처리

```java
// DTO Validation
public class CreateUserRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{8,}$",
             message = "Password must contain at least one letter and one number")
    private String password;
}

// Global Exception Handler
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.NOT_FOUND.value())
            .error("NOT_FOUND")
            .message(ex.getMessage())
            .timestamp(LocalDateTime.now())
            .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
        MethodArgumentNotValidException ex
    ) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );

        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.BAD_REQUEST.value())
            .error("VALIDATION_FAILED")
            .message("Validation failed")
            .errors(errors)
            .timestamp(LocalDateTime.now())
            .build();

        return ResponseEntity.badRequest().body(error);
    }
}
```

## DTO 작성

### Request DTO

```java
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @NotBlank(message = "Content is required")
    @Size(min = 10, message = "Content must be at least 10 characters")
    private String content;

    @NotEmpty(message = "At least one category is required")
    @Size(max = 5, message = "Maximum 5 categories allowed")
    private List<Long> categoryIds;
}
```

### Response DTO

```java
@Getter
@Builder
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String profileImage;
    private LocalDateTime createdAt;

    // password는 포함하지 않음!
}
```

### Mapper 유틸리티

```java
public class UserMapper {
    public static UserResponse toResponse(User user) {
        return UserResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .name(user.getName())
            .profileImage(user.getProfileImage())
            .createdAt(user.getCreatedAt())
            .build();
    }

    public static User toEntity(CreateUserRequest request) {
        return User.builder()
            .email(request.getEmail())
            .name(request.getName())
            .password(request.getPassword()) // 암호화는 Service에서
            .build();
    }
}
```

## Configuration

### Security Configuration

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### JPA Configuration

```java
@Configuration
@EnableJpaAuditing
public class JpaConfig {
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return Optional.empty();
            }
            return Optional.of(authentication.getName());
        };
    }
}
```

## 테스트 작성

### Repository Test

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Test
    void findByEmail_ShouldReturnUser_WhenExists() {
        // given
        User user = User.builder()
            .email("test@example.com")
            .name("Test User")
            .password("password")
            .build();
        userRepository.save(user);

        // when
        Optional<User> found = userRepository.findByEmail("test@example.com");

        // then
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Test User");
    }
}
```

### Service Test

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void createUser_ShouldSaveUser_WhenValidRequest() {
        // given
        CreateUserRequest request = new CreateUserRequest("test@example.com", "Test", "password123");
        User user = User.builder()
            .id(1L)
            .email(request.getEmail())
            .name(request.getName())
            .password("encoded")
            .build();

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // when
        UserResponse response = userService.createUser(request);

        // then
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getEmail()).isEqualTo("test@example.com");
        verify(userRepository).save(any(User.class));
    }
}
```

### Controller Test

```java
@WebMvcTest(UserController.class)
class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void getUser_ShouldReturnUser_WhenExists() throws Exception {
        // given
        UserResponse user = UserResponse.builder()
            .id(1L)
            .email("test@example.com")
            .name("Test User")
            .build();
        when(userService.getUser(1L)).thenReturn(user);

        // when & then
        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.email").value("test@example.com"))
            .andExpect(jsonPath("$.name").value("Test User"));
    }

    @Test
    void createUser_ShouldReturnCreated_WhenValidRequest() throws Exception {
        // given
        CreateUserRequest request = new CreateUserRequest("test@example.com", "Test", "password123");
        UserResponse response = UserResponse.builder()
            .id(1L)
            .email(request.getEmail())
            .name(request.getName())
            .build();
        when(userService.createUser(any())).thenReturn(response);

        // when & then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1));
    }
}
```

## 코드 리뷰 체크리스트

- [ ] 레이어 분리가 명확한가?
- [ ] Entity에 비즈니스 로직이 없는가?
- [ ] Service에서 트랜잭션이 적절히 설정되었는가?
- [ ] Controller에서 비즈니스 로직을 처리하지 않는가?
- [ ] DTO에 password 같은 민감 정보가 노출되지 않는가?
- [ ] 입력 검증이 적절히 이루어지는가?
- [ ] Exception 처리가 일관되게 이루어지는가?
- [ ] N+1 문제가 없는가?
- [ ] 테스트 코드가 작성되었는가?
- [ ] API 문서가 작성되었는가?
