# Use Case 템플릿

Use Case 작성 시 사용하는 템플릿입니다.

## 기본 구조

\`\`\`typescript
// src/domain/usecases/[feature]/[ActionName]UseCase.ts

export class [ActionName]UseCase {
constructor(
private [repository]Repository: [Repository]Repository
) {}

async execute([params]): Promise<[ReturnType]> {
// 1. 입력 검증
// 2. 비즈니스 로직
// 3. Repository 호출
// 4. 결과 반환
}
}
\`\`\`

## 예제 1: LoginUseCase

\`\`\`typescript
// src/domain/usecases/auth/LoginUseCase.ts

import { User } from '@/domain/entities/User';
import { AuthToken } from '@/domain/entities/AuthToken';
import { AuthRepository } from '@/domain/repositories/AuthRepository';

export interface LoginResult {
user: User;
token: AuthToken;
}

export class LoginUseCase {
constructor(private authRepository: AuthRepository) {}

async execute(email: string, password: string): Promise<LoginResult> {
// 1. 입력 검증
if (!this.isValidEmail(email)) {
throw new Error('Invalid email format');
}

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // 2. Repository를 통한 인증
    const token = await this.authRepository.login(email, password);

    // 3. 사용자 정보 가져오기
    const user = await this.authRepository.getCurrentUser(token);

    // 4. 토큰 저장
    await this.authRepository.storeToken(token);

    return { user, token };

}

private isValidEmail(email: string): boolean {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
}
}
\`\`\`

## 예제 2: GetPostsUseCase

\`\`\`typescript
// src/domain/usecases/posts/GetPostsUseCase.ts

import { Post } from '@/domain/entities/Post';
import { PostRepository } from '@/domain/repositories/PostRepository';

export interface GetPostsParams {
page: number;
limit: number;
filter?: PostFilter;
}

export interface PostFilter {
authorId?: string;
tags?: string[];
searchQuery?: string;
}

export class GetPostsUseCase {
constructor(private postRepository: PostRepository) {}

async execute(params: GetPostsParams): Promise<Post[]> {
// 1. 입력 검증
this.validateParams(params);

    // 2. Repository 호출
    const posts = await this.postRepository.getPosts(
      params.page,
      params.limit,
      params.filter
    );

    // 3. 비즈니스 로직 (필요한 경우)
    return this.sortByRelevance(posts, params.filter?.searchQuery);

}

private validateParams(params: GetPostsParams): void {
if (params.page < 1) {
throw new Error('Page must be greater than 0');
}

    if (params.limit < 1 || params.limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

}

private sortByRelevance(posts: Post[], searchQuery?: string): Post[] {
if (!searchQuery) {
return posts;
}

    // 검색어 관련성에 따라 정렬
    return posts.sort((a, b) => {
      const aScore = this.calculateRelevance(a, searchQuery);
      const bScore = this.calculateRelevance(b, searchQuery);
      return bScore - aScore;
    });

}

private calculateRelevance(post: Post, query: string): number {
let score = 0;
const lowerQuery = query.toLowerCase();

    if (post.title.toLowerCase().includes(lowerQuery)) score += 10;
    if (post.content.toLowerCase().includes(lowerQuery)) score += 5;

    return score;

}
}
\`\`\`

## 예제 3: UpdateProfileUseCase

\`\`\`typescript
// src/domain/usecases/profile/UpdateProfileUseCase.ts

import { User } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/UserRepository';

export interface UpdateProfileData {
name?: string;
bio?: string;
website?: string;
location?: string;
}

export class UpdateProfileUseCase {
constructor(
private userRepository: UserRepository
) {}

async execute(userId: string, data: UpdateProfileData): Promise<User> {
// 1. 사용자 존재 확인
const existingUser = await this.userRepository.getUserById(userId);
if (!existingUser) {
throw new Error('User not found');
}

    // 2. 데이터 검증
    this.validateUpdateData(data);

    // 3. 업데이트 수행
    const updatedUser = await this.userRepository.updateUser(userId, data);

    return updatedUser;

}

private validateUpdateData(data: UpdateProfileData): void {
if (data.name !== undefined && data.name.trim().length === 0) {
throw new Error('Name cannot be empty');
}

    if (data.website !== undefined && !this.isValidUrl(data.website)) {
      throw new Error('Invalid website URL');
    }

    if (data.bio !== undefined && data.bio.length > 500) {
      throw new Error('Bio must be 500 characters or less');
    }

}

private isValidUrl(url: string): boolean {
try {
new URL(url);
return true;
} catch {
return false;
}
}
}
\`\`\`

## 복잡한 Use Case 예제: CreateOrderUseCase

\`\`\`typescript
// src/domain/usecases/orders/CreateOrderUseCase.ts

import { Order } from '@/domain/entities/Order';
import { OrderItem } from '@/domain/entities/OrderItem';
import { OrderRepository } from '@/domain/repositories/OrderRepository';
import { ProductRepository } from '@/domain/repositories/ProductRepository';
import { PaymentRepository } from '@/domain/repositories/PaymentRepository';

export interface CreateOrderData {
userId: string;
items: Array<{
productId: string;
quantity: number;
}>;
shippingAddress: Address;
paymentMethod: PaymentMethod;
}

export class CreateOrderUseCase {
constructor(
private orderRepository: OrderRepository,
private productRepository: ProductRepository,
private paymentRepository: PaymentRepository
) {}

async execute(data: CreateOrderData): Promise<Order> {
// 1. 입력 검증
this.validateOrderData(data);

    // 2. 제품 정보 및 재고 확인
    const orderItems = await this.validateAndPrepareItems(data.items);

    // 3. 총액 계산
    const totalAmount = this.calculateTotal(orderItems);

    // 4. 결제 처리
    const payment = await this.paymentRepository.processPayment({
      amount: totalAmount,
      method: data.paymentMethod,
      userId: data.userId,
    });

    if (!payment.success) {
      throw new Error('Payment failed: ' + payment.errorMessage);
    }

    // 5. 주문 생성
    const order = await this.orderRepository.createOrder({
      userId: data.userId,
      items: orderItems,
      totalAmount,
      shippingAddress: data.shippingAddress,
      paymentId: payment.id,
      status: 'pending',
    });

    // 6. 재고 차감
    await this.productRepository.decreaseStock(
      orderItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    );

    return order;

}

private validateOrderData(data: CreateOrderData): void {
if (!data.userId) {
throw new Error('User ID is required');
}

    if (!data.items || data.items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    if (!data.shippingAddress) {
      throw new Error('Shipping address is required');
    }

}

private async validateAndPrepareItems(
items: Array<{ productId: string; quantity: number }>
): Promise<OrderItem[]> {
const orderItems: OrderItem[] = [];

    for (const item of items) {
      // 제품 존재 확인
      const product = await this.productRepository.getProductById(item.productId);
      if (!product) {
        throw new Error(\`Product \${item.productId} not found\`);
      }

      // 재고 확인
      if (product.stock < item.quantity) {
        throw new Error(\`Insufficient stock for \${product.name}\`);
      }

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: product.price * item.quantity,
      });
    }

    return orderItems;

}

private calculateTotal(items: OrderItem[]): number {
return items.reduce((sum, item) => sum + item.subtotal, 0);
}
}
\`\`\`

## Use Case 작성 가이드라인

### 1. 단일 책임 원칙

각 Use Case는 하나의 비즈니스 작업만 수행합니다.

\`\`\`typescript
// ✅ 좋은 예
class LoginUseCase { }
class LogoutUseCase { }
class RefreshTokenUseCase { }

// ❌ 나쁜 예
class AuthUseCase {
login() { }
logout() { }
refresh() { }
}
\`\`\`

### 2. 입력 검증

모든 입력은 Use Case 내에서 검증합니다.

\`\`\`typescript
async execute(data: CreateUserData): Promise<User> {
// 입력 검증
if (!data.email || !this.isValidEmail(data.email)) {
throw new Error('Invalid email');
}

if (!data.password || data.password.length < 8) {
throw new Error('Password must be at least 8 characters');
}

// 비즈니스 로직
// ...
}
\`\`\`

### 3. 명확한 에러 메시지

사용자가 이해할 수 있는 에러 메시지를 반환합니다.

\`\`\`typescript
// ✅ 좋은 예
throw new Error('Email is already registered');
throw new Error('Password must contain at least one uppercase letter');

// ❌ 나쁜 예
throw new Error('Error');
throw new Error('Invalid input');
\`\`\`

### 4. Repository 추상화

Use Case는 Repository 인터페이스에만 의존합니다.

\`\`\`typescript
// ✅ 좋은 예
class LoginUseCase {
constructor(private authRepository: AuthRepository) {}
// AuthRepository는 인터페이스
}

// ❌ 나쁜 예
class LoginUseCase {
constructor(private apiClient: ApiClient) {}
// 구체적인 구현에 의존
}
\`\`\`

### 5. 타입 안전성

모든 입력과 출력에 타입을 명시합니다.

\`\`\`typescript
interface CreatePostData {
title: string;
content: string;
tags: string[];
}

class CreatePostUseCase {
async execute(data: CreatePostData): Promise<Post> {
// 타입 안전한 구현
}
}
\`\`\`

## 테스트 작성

\`\`\`typescript
describe('LoginUseCase', () => {
let useCase: LoginUseCase;
let mockAuthRepository: jest.Mocked<AuthRepository>;

beforeEach(() => {
mockAuthRepository = {
login: jest.fn(),
getCurrentUser: jest.fn(),
storeToken: jest.fn(),
} as any;

    useCase = new LoginUseCase(mockAuthRepository);

});

it('should login successfully with valid credentials', async () => {
const mockToken = { accessToken: 'token', refreshToken: 'refresh' };
const mockUser = { id: '1', email: 'test@example.com', name: 'Test' };

    mockAuthRepository.login.mockResolvedValue(mockToken);
    mockAuthRepository.getCurrentUser.mockResolvedValue(mockUser);

    const result = await useCase.execute('test@example.com', 'password123');

    expect(result.user).toEqual(mockUser);
    expect(result.token).toEqual(mockToken);
    expect(mockAuthRepository.storeToken).toHaveBeenCalledWith(mockToken);

});

it('should throw error for invalid email', async () => {
await expect(
useCase.execute('invalid-email', 'password123')
).rejects.toThrow('Invalid email format');
});

it('should throw error for short password', async () => {
await expect(
useCase.execute('test@example.com', '123')
).rejects.toThrow('Password must be at least 8 characters');
});
});
\`\`\`
