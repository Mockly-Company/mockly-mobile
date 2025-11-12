# Service 템플릿

Spring Boot Service 레이어 작성 시 사용하는 템플릿입니다.

## 기본 Service 구조

\`\`\`java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class [Entity]Service {
private final [Entity]Repository [entity]Repository;

    public [Entity]Response get[Entity](Long id) {
        // 조회 로직
    }

    public Page<[Entity]Response> getAll[Entity]s(Pageable pageable) {
        // 목록 조회
    }

    @Transactional
    public [Entity]Response create[Entity](Create[Entity]Request request) {
        // 생성 로직
    }

    @Transactional
    public [Entity]Response update[Entity](Long id, Update[Entity]Request request) {
        // 수정 로직
    }

    @Transactional
    public void delete[Entity](Long id) {
        // 삭제 로직
    }

}
\`\`\`

## 예제 1: UserService

\`\`\`java
package com.example.project.domain.user.service;

import com.example.project.domain.user.entity.User;
import com.example.project.domain.user.repository.UserRepository;
import com.example.project.domain.user.dto.\*;
import com.example.project.global.exception.ResourceNotFoundException;
import com.example.project.global.exception.DuplicateResourceException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
private final UserRepository userRepository;
private final PasswordEncoder passwordEncoder;

    /**
     * 사용자 조회
     */
    public UserResponse getUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserMapper.toResponse(user);
    }

    /**
     * 이메일로 사용자 조회
     */
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserMapper.toResponse(user);
    }

    /**
     * 사용자 목록 조회 (페이징)
     */
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
            .map(UserMapper::toResponse);
    }

    /**
     * 사용자 검색
     */
    public Page<UserResponse> searchUsers(String keyword, Pageable pageable) {
        return userRepository.findByNameContaining(keyword, pageable)
            .map(UserMapper::toResponse);
    }

    /**
     * 사용자 생성
     */
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        // 1. 이메일 중복 검증
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
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

    /**
     * 사용자 수정
     */
    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        // 1. 사용자 조회
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // 2. 수정
        user.setName(request.getName());
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }

        // 3. 저장 (dirty checking으로 자동 update)
        // User updatedUser = userRepository.save(user); // 생략 가능

        // 4. Response 변환
        return UserMapper.toResponse(user);
    }

    /**
     * 사용자 삭제
     */
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    /**
     * 이메일 존재 여부 확인
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

}
\`\`\`

## 예제 2: PostService (복잡한 비즈니스 로직)

\`\`\`java
package com.example.project.domain.post.service;

import com.example.project.domain.post.entity.Post;
import com.example.project.domain.post.repository.PostRepository;
import com.example.project.domain.post.dto.\*;
import com.example.project.domain.user.entity.User;
import com.example.project.domain.user.repository.UserRepository;
import com.example.project.domain.category.entity.Category;
import com.example.project.domain.category.repository.CategoryRepository;
import com.example.project.global.exception.ResourceNotFoundException;
import com.example.project.global.exception.UnauthorizedException;
import com.example.project.global.exception.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {
private final PostRepository postRepository;
private final UserRepository userRepository;
private final CategoryRepository categoryRepository;

    /**
     * 게시글 조회
     */
    public PostResponse getPost(Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        return PostMapper.toResponse(post);
    }

    /**
     * 게시글 목록 조회
     */
    public Page<PostResponse> getPosts(Pageable pageable) {
        return postRepository.findAll(pageable)
            .map(PostMapper::toResponse);
    }

    /**
     * 게시글 검색
     */
    public Page<PostResponse> searchPosts(String keyword, Pageable pageable) {
        return postRepository.findByTitleContaining(keyword, pageable)
            .map(PostMapper::toResponse);
    }

    /**
     * 특정 사용자의 게시글 목록
     */
    public Page<PostResponse> getPostsByAuthor(Long authorId, Pageable pageable) {
        return postRepository.findByAuthorId(authorId, pageable)
            .map(PostMapper::toResponse);
    }

    /**
     * 카테고리별 게시글 목록
     */
    public Page<PostResponse> getPostsByCategory(Long categoryId, Pageable pageable) {
        return postRepository.findByCategoryId(categoryId, pageable)
            .map(PostMapper::toResponse);
    }

    /**
     * 게시글 작성
     */
    @Transactional
    public PostResponse createPost(Long userId, CreatePostRequest request) {
        log.info("Creating post for user: {}", userId);

        // 1. 사용자 확인
        User author = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // 2. 입력 검증
        validatePostRequest(request);

        // 3. 카테고리 조회
        Set<Category> categories = categoryRepository.findAllByIdIn(request.getCategoryIds())
            .stream()
            .collect(Collectors.toSet());

        if (categories.size() != request.getCategoryIds().size()) {
            throw new ValidationException("Some categories not found");
        }

        // 4. Entity 생성
        Post post = Post.builder()
            .title(request.getTitle())
            .content(request.getContent())
            .author(author)
            .categories(categories)
            .build();

        // 5. 저장
        Post savedPost = postRepository.save(post);

        log.info("Post created successfully: {}", savedPost.getId());
        return PostMapper.toResponse(savedPost);
    }

    /**
     * 게시글 수정
     */
    @Transactional
    public PostResponse updatePost(Long postId, Long userId, UpdatePostRequest request) {
        log.info("Updating post: {} by user: {}", postId, userId);

        // 1. 게시글 조회
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        // 2. 권한 확인 (작성자만 수정 가능)
        if (!post.getAuthor().getId().equals(userId)) {
            throw new UnauthorizedException("You don't have permission to update this post");
        }

        // 3. 입력 검증
        validateUpdatePostRequest(request);

        // 4. 수정
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());

        // 카테고리 변경이 있는 경우
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            Set<Category> categories = categoryRepository.findAllByIdIn(request.getCategoryIds())
                .stream()
                .collect(Collectors.toSet());
            post.setCategories(categories);
        }

        log.info("Post updated successfully: {}", postId);
        return PostMapper.toResponse(post);
    }

    /**
     * 게시글 삭제
     */
    @Transactional
    public void deletePost(Long postId, Long userId) {
        log.info("Deleting post: {} by user: {}", postId, userId);

        // 1. 게시글 조회
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        // 2. 권한 확인 (작성자만 삭제 가능)
        if (!post.getAuthor().getId().equals(userId)) {
            throw new UnauthorizedException("You don't have permission to delete this post");
        }

        // 3. 삭제
        postRepository.delete(post);

        log.info("Post deleted successfully: {}", postId);
    }

    /**
     * 게시글 작성 요청 검증
     */
    private void validatePostRequest(CreatePostRequest request) {
        if (request.getTitle().length() < 5) {
            throw new ValidationException("Title must be at least 5 characters");
        }
        if (request.getTitle().length() > 200) {
            throw new ValidationException("Title must not exceed 200 characters");
        }
        if (request.getContent().length() < 10) {
            throw new ValidationException("Content must be at least 10 characters");
        }
        if (request.getCategoryIds() == null || request.getCategoryIds().isEmpty()) {
            throw new ValidationException("At least one category is required");
        }
        if (request.getCategoryIds().size() > 5) {
            throw new ValidationException("Maximum 5 categories allowed");
        }
    }

    /**
     * 게시글 수정 요청 검증
     */
    private void validateUpdatePostRequest(UpdatePostRequest request) {
        if (request.getTitle() != null) {
            if (request.getTitle().length() < 5 || request.getTitle().length() > 200) {
                throw new ValidationException("Title must be between 5 and 200 characters");
            }
        }
        if (request.getContent() != null && request.getContent().length() < 10) {
            throw new ValidationException("Content must be at least 10 characters");
        }
    }

}
\`\`\`

## 예제 3: OrderService (트랜잭션 관리)

\`\`\`java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {
private final OrderRepository orderRepository;
private final ProductRepository productRepository;
private final PaymentService paymentService;

    /**
     * 주문 생성 (복잡한 트랜잭션)
     */
    @Transactional
    public OrderResponse createOrder(Long userId, CreateOrderRequest request) {
        // 1. 제품 재고 확인 및 감소
        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new InsufficientStockException("Insufficient stock for product: " + product.getName());
            }

            product.decreaseStock(itemRequest.getQuantity());
        }

        // 2. 주문 생성
        Order order = createOrderEntity(userId, request);
        Order savedOrder = orderRepository.save(order);

        // 3. 결제 처리
        try {
            paymentService.processPayment(savedOrder.getId(), request.getPaymentMethod());
        } catch (PaymentException e) {
            // 결제 실패 시 롤백 (RuntimeException이므로 자동 롤백)
            throw new OrderProcessingException("Payment failed: " + e.getMessage());
        }

        return OrderMapper.toResponse(savedOrder);
    }

    /**
     * 주문 취소 (트랜잭션)
     */
    @Transactional
    public void cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // 권한 확인
        if (!order.getUserId().equals(userId)) {
            throw new UnauthorizedException("You don't have permission to cancel this order");
        }

        // 상태 확인
        if (!order.canBeCancelled()) {
            throw new IllegalStateException("Order cannot be cancelled in current state");
        }

        // 재고 복구
        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            product.increaseStock(item.getQuantity());
        }

        // 환불 처리
        paymentService.refund(order.getPaymentId());

        // 주문 취소
        order.cancel();
    }

    private Order createOrderEntity(Long userId, CreateOrderRequest request) {
        // Order 생성 로직
        return Order.builder()
            .userId(userId)
            .status(OrderStatus.PENDING)
            .build();
    }

}
\`\`\`

## Service 작성 가이드라인

### 1. 단일 책임 원칙

각 Service는 하나의 Entity에 대한 비즈니스 로직만 처리합니다.

\`\`\`java
// ✅ 좋은 예
@Service
public class UserService {
// User 관련 로직만
}

@Service
public class PostService {
// Post 관련 로직만
}

// ❌ 나쁜 예
@Service
public class ApplicationService {
// 여러 Entity 로직이 섞여 있음
}
\`\`\`

### 2. 트랜잭션 관리

- 클래스 레벨: `@Transactional(readOnly = true)`
- 쓰기 메서드: `@Transactional`

### 3. 예외 처리

명확한 Custom Exception 사용:

\`\`\`java
// ResourceNotFoundException
// DuplicateResourceException
// ValidationException
// UnauthorizedException
\`\`\`

### 4. 로깅

중요한 작업에 로깅 추가:

\`\`\`java
log.info("Creating user with email: {}", email);
log.error("Failed to create user", exception);
\`\`\`

### 5. 검증 로직 분리

복잡한 검증은 별도 메서드로:

\`\`\`java
private void validate[Something]([Params]) {
// 검증 로직
}
\`\`\`
