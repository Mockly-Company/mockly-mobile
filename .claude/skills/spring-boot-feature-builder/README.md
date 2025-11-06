# Spring Boot Feature Builder

Spring Boot 백엔드 API를 체계적으로 분석하고 Layered Architecture 기반으로 구현하는 워크플로우 스킬입니다.

## 개요

RESTful API를 추가할 때 4단계 워크플로우를 통해 체계적으로 개발할 수 있습니다:

1. **요구사항 정리** - API 엔드포인트, 우선순위
2. **API 및 데이터 설계** - Entity, DTO, API 명세
3. **Layered Architecture 설계** - Controller-Service-Repository
4. **구현 및 컨벤션 적용** - 실제 코드 작성

## 사용 시나리오

다음과 같은 경우 이 스킬을 사용하세요:

- ✅ 새로운 RESTful API를 구현할 때
- ✅ 복잡한 비즈니스 로직을 개발할 때
- ✅ 데이터베이스 Entity 설계가 필요할 때
- ✅ CRUD API를 빠르게 생성할 때
- ✅ Spring Boot 프로젝트 구조 개선 시

## 빠른 시작

### 스킬 호출

```
"사용자 관리 API 만들어줘"
"게시글 CRUD API 구현해줘"
"주문 생성 API 추가해줘"
```

### 워크플로우

스킬이 4단계로 안내합니다:

#### Phase 1: 요구사항 정리
- API 엔드포인트 목록 작성
- RESTful 설계 원칙 적용
- 우선순위 설정 (P0/P1/P2)
- 제약사항 파악

#### Phase 2: API 및 데이터 설계
- Entity 설계 (JPA)
- DTO 설계 (Request/Response)
- API 명세서 작성
- Entity 관계 정의
- 비즈니스 로직 정의

#### Phase 3: Layered Architecture 설계
- Controller Layer (REST API)
- Service Layer (비즈니스 로직)
- Repository Layer (데이터 접근)
- Entity Layer (도메인 모델)
- 파일 구조 설계

#### Phase 4: 구현 및 컨벤션 적용
- Spring Boot 컨벤션 적용
- 레이어별 구현
- Exception 처리
- 테스트 코드 작성

## Layered Architecture

```
Controller Layer (REST API)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Entity Layer (Domain Model)
```

### 레이어별 책임

**Controller Layer:**
- REST API 엔드포인트
- Request/Response 처리
- 입력 검증 (@Valid)

**Service Layer:**
- 비즈니스 로직
- 트랜잭션 관리 (@Transactional)
- Entity ↔ DTO 변환

**Repository Layer:**
- JPA Repository
- 커스텀 쿼리 메서드
- 데이터베이스 접근

**Entity Layer:**
- JPA Entity
- 도메인 모델
- 관계 매핑

## 실전 예제

### 예제 1: User API

**Phase 1 - 요구사항:**
```
API 엔드포인트:
- GET    /api/users          # 사용자 목록
- GET    /api/users/{id}     # 사용자 조회
- POST   /api/users          # 사용자 생성
- PUT    /api/users/{id}     # 사용자 수정
- DELETE /api/users/{id}     # 사용자 삭제
```

**Phase 2 - 설계:**
```
Entity: User
- id: Long
- email: String (unique)
- name: String
- password: String
- createdAt: LocalDateTime

DTO:
- CreateUserRequest (email, name, password)
- UpdateUserRequest (name, profileImage)
- UserResponse (id, email, name, createdAt)
```

**Phase 3 - Architecture:**
```
UserController → UserService → UserRepository → User Entity
```

**Phase 4 - 구현:**
자동으로 Controller, Service, Repository, Entity, DTO 생성

### 예제 2: Post API (관계 포함)

**간단한 요청:**
```
"게시글 API 만들어줘. 사용자가 작성하고, 카테고리를 여러 개 가질 수 있어"
```

**자동 생성:**
- Entity: Post, User, Category (Many-to-Many)
- Controller: PostController (CRUD + 검색)
- Service: PostService (비즈니스 로직, 권한 확인)
- Repository: PostRepository (커스텀 쿼리)
- DTO: CreatePostRequest, PostResponse

## 파일 구조

```
src/main/java/com/example/project/
├── domain/
│   ├── user/
│   │   ├── entity/User.java
│   │   ├── repository/UserRepository.java
│   │   ├── service/UserService.java
│   │   ├── controller/UserController.java
│   │   └── dto/
│   │       ├── CreateUserRequest.java
│   │       ├── UpdateUserRequest.java
│   │       └── UserResponse.java
│   └── post/
│       └── ... (동일한 구조)
└── global/
    ├── config/
    ├── exception/
    └── util/
```

## 참고 자료

### Reference 문서

- [Spring Boot 컨벤션](./reference/spring-boot-conventions.md)
  - 패키지 구조
  - 네이밍 규칙
  - Entity 작성
  - Repository 작성
  - Service 작성
  - Controller 작성
  - 테스트 작성

### 템플릿

- [Service 템플릿](./templates/service-template.md)
  - UserService (기본 CRUD)
  - PostService (복잡한 비즈니스 로직)
  - OrderService (트랜잭션 관리)

## 주요 기능

### 1. RESTful API 설계

표준 HTTP 메서드와 상태 코드 사용:
- GET: 조회 (200 OK)
- POST: 생성 (201 Created)
- PUT: 수정 (200 OK)
- DELETE: 삭제 (204 No Content)

### 2. Entity 관계 자동 설정

- @OneToMany, @ManyToOne
- @ManyToMany with @JoinTable
- Fetch 전략 최적화

### 3. DTO 자동 생성

- Request DTO (입력 검증)
- Response DTO (보안 - password 제외)
- Mapper 유틸리티

### 4. Exception 처리

- GlobalExceptionHandler
- Custom Exceptions
- 표준 Error Response

### 5. 테스트 코드 생성

- Repository Test (@DataJpaTest)
- Service Test (Mockito)
- Controller Test (@WebMvcTest)

## Best Practices

### 아키텍처

1. **레이어 분리**: 각 레이어의 책임 명확히
2. **의존성 방향**: Controller → Service → Repository
3. **트랜잭션**: Service 레이어에서 관리
4. **DTO 사용**: Entity 직접 노출 금지

### 코드 품질

1. **입력 검증**: @Valid, Bean Validation
2. **Exception 처리**: 일관된 에러 응답
3. **보안**: Password 암호화, 민감 정보 보호
4. **로깅**: 중요한 작업 로깅

### JPA 최적화

1. **N+1 문제**: Fetch Join, EntityGraph
2. **Lazy Loading**: 기본 전략 사용
3. **Batch Size**: @BatchSize 설정
4. **Query 최적화**: Custom Query 작성

## 사용 팁

### 간단한 CRUD API

```
"User CRUD API 만들어줘"
↓
Entity, Repository, Service, Controller 자동 생성
↓
표준 RESTful API 완성
```

### 복잡한 비즈니스 로직

```
"주문 생성 API 만들어줘. 재고 확인, 결제 처리, 주문 생성이 필요해"
↓
Phase 1-2: 요구사항 및 설계 분석
↓
Phase 3: 트랜잭션 설계
↓
Phase 4: 복잡한 Service 로직 구현
```

### 기존 코드 개선

```
"이 Controller를 Layered Architecture로 리팩토링해줘"
↓
기존 코드 분석
↓
레이어별 재구조화
↓
테스트 코드 추가
```

## 워크플로우 다이어그램

```
사용자 요청
    ↓
Phase 1: 요구사항 정리
    ├─ API 엔드포인트
    ├─ HTTP 메서드
    └─ 우선순위
    ↓
Phase 2: 데이터 설계
    ├─ Entity 설계
    ├─ DTO 설계
    ├─ API 명세서
    └─ 관계 설계
    ↓
Phase 3: Architecture 설계
    ├─ Controller Layer
    ├─ Service Layer
    ├─ Repository Layer
    └─ 파일 구조
    ↓
Phase 4: 구현
    ├─ 코드 생성
    ├─ 컨벤션 적용
    ├─ Exception 처리
    └─ 테스트 작성
    ↓
완성된 API
```

## 체크리스트

### Phase 1 완료
- [ ] API 엔드포인트 목록
- [ ] RESTful 설계 확인
- [ ] 우선순위 설정

### Phase 2 완료
- [ ] Entity 설계
- [ ] DTO 설계
- [ ] API 명세서 작성
- [ ] 관계 정의

### Phase 3 완료
- [ ] Repository 정의
- [ ] Service 정의
- [ ] Controller 정의
- [ ] 파일 구조 설계

### Phase 4 완료
- [ ] 모든 레이어 구현
- [ ] Exception 처리
- [ ] 테스트 코드 작성
- [ ] API 문서 작성

## 변경 이력

### v1.0.0
- 초기 릴리즈
- 4단계 워크플로우
- Layered Architecture 템플릿
- Spring Boot 컨벤션
