# PR 메시지 예시

이 문서는 다양한 시나리오별 PR 메시지 예시를 제공합니다.

## 예시 1: 디자인 시스템 구축 (프론트엔드)

````markdown
## 요약

React Native 프로젝트에 일관된 UI/UX를 제공하고 개발 생산성을 향상시키기 위한 디자인 시스템을 구축했습니다. NativeWind에서 twrnc로 마이그레이션하고, 재사용 가능한 UI 컴포넌트와 레이아웃 컴포넌트를 구현했습니다.

## 주요 변경사항

- 스타일링 라이브러리 전환: NativeWind → twrnc로 마이그레이션하여 RN 0.82 호환성 개선
- 디자인 토큰 정의: Tailwind config에 색상, 타이포그래피, spacing 토큰 적용
- 기본 UI 컴포넌트: Button, Input, Text, Card 컴포넌트 구현
- 레이아웃 컴포넌트: Stack, Grid, Spacer 컴포넌트 추가
- Storybook 설정: RN 네이티브 환경과 Web 환경 모두 지원하는 Storybook 구축
- 유틸리티 패키지: cn() 함수 등 공통 유틸리티 추가

## 변경 내용

### 빌드 및 설정

- twrnc 라이브러리로 마이그레이션 완료
- @gorhom/bottom-sheet RN 0.82 호환성 패치 적용
- Storybook RN + Web 빌드 환경 구성
- TypeScript 타입 정의 및 설정 개선

### 디자인 토큰

```js
colors: {
  primary, secondary, accent, background, surface,
  text, textSecondary, border, error, warning, success
}
spacing: { xs, sm, md, lg, xl, 2xl }
fontSize: { xs, sm, md, lg, xl, 2xl }
```
````

### 구현된 컴포넌트

#### UI 컴포넌트

**Button**

- variant: primary, secondary, outline
- size: small, medium, large
- props 기반 커스터마이징 지원

**Input**

- label: string
- error: string

**Text**

- variant: h1, h2, h3, body, caption
- color: primary, secondary, success, warning, error, surface
- weight: thin, regular, medium, semibold, bold

**Card**

- variant: elevated, outlined, filled
- padding: xs, sm, md, lg, xl, 2xl

#### 레이아웃 컴포넌트

- **Stack** - 수직/수평 정렬, spacing 조절
- **Grid** - 그리드 레이아웃
- **Spacer** - 간격 조정용 컴포넌트

### 문서화

- 각 컴포넌트별 Storybook 스토리 작성 완료
- Props 예시 및 사용법 문서화

## 테스트

### 추가된 테스트

- [x] Storybook에서 모든 컴포넌트 상태 값에 따른 정상 렌더링 확인

### 수동 테스트 가이드

1. Storybook 실행: `npm run storybook`
2. 각 컴포넌트의 다양한 variant/size 확인
3. iOS 시뮬레이터 및 Android 에뮬레이터에서 렌더링 확인

### 테스트 환경

- Storybook Web 환경에서 모든 컴포넌트 확인 완료
- iOS 시뮬레이터 (iOS 16.0) 동작 확인
- Android 에뮬레이터 (API 33) 동작 확인

## 스크린샷

### 버튼

![Button](image)

### 카드

![Card](image)

### 인풋

![Input](image)

### 텍스트

![Text](image)

### 그리드

![Grid](image)

### 스택

![Stack](image)

### 스페이서

![Spacer](image)

## 관련 이슈

- Closes #10 - 디자인 시스템 구축

## 완료

- [x] 디자인 토큰(색상, 폰트, spacing) Tailwind config 적용
- [x] 기본 UI 컴포넌트 4개 구현 (Button, Input, Text, Card)
- [x] 레이아웃 컴포넌트 3개 구현 (Stack, Grid, Spacer)
- [x] TypeScript 타입 정의 포함
- [x] Storybook 문서화 완료
- [x] 문서화 페이지 또는 README 작성

````

---

## 예시 2: 로그인 기능 구현 (풀스택)

```markdown
## 요약
사용자 인증을 위한 로그인 기능을 구현했습니다. JWT 토큰 기반 인증 방식을 사용하며, 프론트엔드에서는 로그인 UI와 상태 관리를, 백엔드에서는 인증 API와 미들웨어를 구현했습니다.

## 주요 변경사항
- 프론트엔드: 로그인 화면 UI 및 폼 검증 구현
- 백엔드: JWT 기반 인증 API 엔드포인트 추가
- 인증 미들웨어: 보호된 라우트에 대한 토큰 검증
- 상태 관리: Zustand를 사용한 전역 인증 상태 관리
- 자동 로그인: Refresh token을 통한 세션 유지

## 변경 내용
### 프론트엔드

#### UI 컴포넌트
- **LoginScreen**: 로그인 화면 구현
  - 이메일/비밀번호 입력 필드
  - 로그인 버튼
  - 에러 메시지 표시
- **LoginForm**: 폼 검증 및 제출 로직
  - 이메일 형식 검증
  - 비밀번호 최소 길이 검증

#### 상태 관리
- **authStore**: Zustand 스토어 생성
  - user: 현재 로그인한 사용자 정보
  - token: JWT 액세스 토큰
  - login(): 로그인 액션
  - logout(): 로그아웃 액션
  - isAuthenticated: 로그인 상태 computed value

#### API 연동
- **authApi**: 인증 관련 API 호출
  - login(email, password): 로그인 API
  - refreshToken(): 토큰 갱신 API
  - logout(): 로그아웃 API

### 백엔드

#### API 엔드포인트
- **POST /api/auth/login**
  - Body: { email, password }
  - Response: { accessToken, refreshToken, user }
  - 성공 시 200, 실패 시 401 반환

- **POST /api/auth/refresh**
  - Body: { refreshToken }
  - Response: { accessToken }

- **POST /api/auth/logout**
  - Header: Authorization Bearer token
  - Response: 204 No Content

#### 비즈니스 로직
- **AuthService**
  - login(): 이메일/비밀번호 검증 및 토큰 생성
  - verifyToken(): JWT 토큰 검증
  - generateTokens(): 액세스/리프레시 토큰 생성
  - hashPassword(): bcrypt를 사용한 비밀번호 해싱

#### 미들웨어
- **authMiddleware**: JWT 토큰 검증 미들웨어
  - Authorization 헤더에서 토큰 추출
  - 토큰 검증 후 req.user에 사용자 정보 주입
  - 검증 실패 시 401 응답

#### 데이터베이스
- **User 모델** 필드 추가
  - refreshToken: string (nullable)
  - lastLoginAt: DateTime

### 공통

#### 타입 정의
```typescript
interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
````

## 테스트

### 추가된 테스트

- [x] 단위 테스트: AuthService.login() 로직 테스트
- [x] 단위 테스트: authMiddleware 토큰 검증 테스트
- [x] 통합 테스트: POST /api/auth/login 엔드포인트 테스트
- [x] E2E 테스트: 로그인 플로우 전체 테스트 (Detox)

### 수동 테스트 가이드

1. 앱 실행 후 로그인 화면 확인
2. 잘못된 이메일 입력 → 에러 메시지 확인
3. 올바른 계정으로 로그인 → 대시보드로 리다이렉트 확인
4. 앱 종료 후 재실행 → 자동 로그인 확인
5. 로그아웃 → 다시 로그인 화면으로 이동 확인

### 테스트 환경

- 로컬 백엔드 서버 (http://localhost:3000)
- iOS 시뮬레이터 테스트 완료
- Android 에뮬레이터 테스트 완료
- Jest 테스트 100% 통과

### 알려진 이슈

- 없음

## 스크린샷

### 로그인 화면

![Login Screen](image)

### 에러 상태

![Error State](image)

## 관련 이슈

- Closes #15 - 사용자 인증 기능 구현
- Relates to #20 - 회원가입 기능 (다음 PR 예정)

## 완료

- [x] 로그인 UI 구현
- [x] 폼 검증 로직 추가
- [x] JWT 기반 인증 API 구현
- [x] 인증 미들웨어 구현
- [x] Zustand 인증 상태 관리
- [x] Refresh token 자동 갱신 로직
- [x] 단위/통합/E2E 테스트 작성
- [x] API 문서 작성

````

---

## 예시 3: 버그 수정 (프론트엔드)

```markdown
## 요약
모바일 환경에서 사이드 메뉴가 닫히지 않는 버그를 수정했습니다. 터치 이벤트 핸들러의 이벤트 버블링 문제를 해결하고, 메뉴 외부 클릭 시 정상적으로 닫히도록 개선했습니다.

## 주요 변경사항
- 사이드 메뉴 외부 클릭 시 메뉴 닫힘 기능 수정
- 이벤트 버블링으로 인한 즉시 재열림 문제 해결
- iOS/Android 모두에서 동작 확인

## 변경 내용
### UI 컴포넌트
- **SideMenu 컴포넌트** (components/SideMenu.tsx)
  - onPress 이벤트에 `event.stopPropagation()` 추가
  - 오버레이 터치 핸들러 개선
  - 메뉴 열림/닫힘 애니메이션 타이밍 조정

### 수정된 코드
```tsx
// Before
<Pressable onPress={onClose}>
  <View>Menu content</View>
</Pressable>

// After
<Pressable onPress={onClose}>
  <View onStartShouldSetResponder={() => true}>
    <Pressable onPress={(e) => e.stopPropagation()}>
      Menu content
    </Pressable>
  </View>
</Pressable>
````

## 테스트

### 추가된 테스트

- [x] SideMenu 컴포넌트 외부 클릭 테스트 추가

### 수동 테스트 가이드

1. 사이드 메뉴 열기 버튼 클릭
2. 메뉴 외부 영역(오버레이) 터치
3. 메뉴가 정상적으로 닫히는지 확인
4. 메뉴 내부 항목 클릭 시 메뉴가 유지되는지 확인

### 테스트 환경

- iOS 시뮬레이터 (iOS 16.0, iOS 17.0) 동작 확인
- Android 에뮬레이터 (API 33) 동작 확인
- 물리 디바이스 (iPhone 13, Galaxy S21) 테스트 완료

## 스크린샷

### Before (버그 상황)

![Bug](image)

### After (수정 후)

![Fixed](image)

## 관련 이슈

- Fixes #42 - 모바일에서 사이드 메뉴가 닫히지 않는 버그

## 완료

- [x] 버그 원인 분석 (이벤트 버블링)
- [x] 터치 이벤트 핸들러 수정
- [x] iOS/Android 모두에서 동작 확인
- [x] 회귀 테스트 작성

````

---

## 예시 4: 리팩터링 (백엔드)

```markdown
## 요약
사용자 서비스 계층의 복잡한 비즈니스 로직을 개선하여 가독성과 유지보수성을 향상시켰습니다. 중복 코드를 제거하고, 단일 책임 원칙에 따라 함수를 분리했습니다.

## 주요 변경사항
- UserService의 복잡한 함수를 작은 단위로 분리
- 중복된 검증 로직을 공통 유틸리티로 추출
- 에러 핸들링 일관성 개선
- TypeScript 타입 안정성 강화

## 변경 내용
### 비즈니스 로직
- **UserService 리팩터링**
  - `createUser()`: 회원가입 로직 단순화
  - `updateUser()`: 수정 로직에서 검증 부분 분리
  - `validateEmail()`: 이메일 검증 로직 추출
  - `validatePassword()`: 비밀번호 검증 로직 추출

### 유틸리티
- **validation.utils.ts** 새로 추가
  - `isValidEmail()`: 이메일 형식 검증
  - `isStrongPassword()`: 비밀번호 강도 검증
  - `sanitizeInput()`: 입력값 정제

### 코드 개선 예시
```typescript
// Before
async createUser(data: CreateUserDto) {
  if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new Error('Invalid email');
  }
  if (data.password.length < 8) {
    throw new Error('Password too short');
  }
  const existing = await this.userRepo.findByEmail(data.email);
  if (existing) {
    throw new Error('Email already exists');
  }
  // ... 긴 로직 계속
}

// After
async createUser(data: CreateUserDto) {
  this.validateEmail(data.email);
  this.validatePassword(data.password);
  await this.checkEmailUniqueness(data.email);

  const hashedPassword = await this.hashPassword(data.password);
  return this.userRepo.create({ ...data, password: hashedPassword });
}

private validateEmail(email: string) {
  if (!isValidEmail(email)) {
    throw new BadRequestException('Invalid email format');
  }
}

private validatePassword(password: string) {
  if (!isStrongPassword(password)) {
    throw new BadRequestException('Password must be at least 8 characters');
  }
}

private async checkEmailUniqueness(email: string) {
  const existing = await this.userRepo.findByEmail(email);
  if (existing) {
    throw new ConflictException('Email already exists');
  }
}
````

## 테스트

### 추가된 테스트

- [x] validation.utils.ts 단위 테스트 추가
- [x] 리팩터링된 UserService 메서드 테스트 업데이트
- [x] 기존 통합 테스트 모두 통과 확인

### 테스트 결과

- 모든 기존 테스트 통과 (회귀 없음)
- 코드 커버리지: 85% → 92%

## 관련 이슈

- Relates to #60 - 코드 품질 개선 프로젝트

## 완료

- [x] UserService 함수 분리 및 단순화
- [x] 중복 검증 로직 유틸리티로 추출
- [x] 에러 타입 명확화 (BadRequestException, ConflictException 등)
- [x] TypeScript strict 모드 적용
- [x] 단위 테스트 추가
- [x] 코드 리뷰 반영

````

---

## 예시 5: 성능 최적화 (프론트엔드)

```markdown
## 요약
대시보드 페이지의 렌더링 성능을 개선했습니다. 불필요한 리렌더링을 제거하고, 이미지 lazy loading과 데이터 캐싱을 적용하여 초기 로딩 속도를 50% 향상시켰습니다.

## 주요 변경사항
- React.memo로 차트 컴포넌트 최적화
- useMemo/useCallback으로 계산 비용 절감
- 이미지 lazy loading 적용
- React Query로 API 응답 캐싱
- 번들 사이즈 20% 감소 (코드 스플리팅)

## 변경 내용
### UI 컴포넌트
- **Dashboard 컴포넌트**
  - React.memo 적용으로 불필요한 리렌더링 방지
  - 차트 데이터 계산 로직 useMemo로 최적화
  - 이벤트 핸들러 useCallback으로 메모이제이션

- **ChartCard 컴포넌트**
  - React.memo 적용
  - props 비교 함수 커스터마이징

### API 연동
- **React Query 도입**
  - 대시보드 데이터 5분간 캐싱
  - staleTime: 5분
  - cacheTime: 10분
  - 백그라운드 자동 갱신

### 성능 개선
- **이미지 최적화**
  - react-native-fast-image 라이브러리 도입
  - 이미지 lazy loading 적용
  - 썸네일 우선 로딩

- **코드 스플리팅**
  - 차트 라이브러리 동적 import
  - 초기 번들 크기: 2.5MB → 2.0MB (20% 감소)

## 테스트
### 추가된 테스트
- [x] 메모이제이션 동작 테스트
- [x] React Query 캐싱 동작 테스트

### 성능 측정 결과
#### Before
- 초기 로딩: 3.2초
- 리렌더링 횟수: 평균 12회
- 번들 크기: 2.5MB

#### After
- 초기 로딩: 1.6초 (50% 개선)
- 리렌더링 횟수: 평균 4회 (67% 감소)
- 번들 크기: 2.0MB (20% 감소)

### 측정 환경
- iPhone 13 Pro (iOS 17.0)
- Galaxy S21 (Android 13)
- React DevTools Profiler 사용

## 관련 이슈
- Closes #75 - 대시보드 성능 개선

## 완료
- [x] React.memo 적용
- [x] useMemo/useCallback 최적화
- [x] React Query 캐싱 구현
- [x] 이미지 lazy loading
- [x] 코드 스플리팅
- [x] 성능 측정 및 비교
- [x] 최적화 가이드 문서 작성
````

---

## 예시 6: 새로운 기능 추가 (백엔드)

```markdown
## 요약

사용자 프로필 이미지 업로드 기능을 구현했습니다. AWS S3를 사용한 파일 저장, 이미지 크기 제한 및 형식 검증, 그리고 기존 이미지 자동 삭제 기능을 포함합니다.

## 주요 변경사항

- AWS S3 파일 업로드 API 구현
- 이미지 업로드 엔드포인트 추가
- Multer를 사용한 multipart/form-data 처리
- 파일 크기 제한 (최대 5MB)
- 지원 형식: jpg, png, webp

## 변경 내용

### API 엔드포인트

- **POST /api/users/:id/profile-image**
  - Content-Type: multipart/form-data
  - Field: image (파일)
  - Response: { imageUrl: string }
  - 인증 필요 (본인만 업로드 가능)

### 비즈니스 로직

- **FileService**
  - `uploadToS3()`: S3 파일 업로드
  - `deleteFromS3()`: S3 파일 삭제
  - `generateUniqueFileName()`: 고유 파일명 생성
  - `validateImageFile()`: 이미지 검증

- **UserService**
  - `updateProfileImage()`: 프로필 이미지 업데이트
    - 기존 이미지가 있으면 S3에서 삭제
    - 새 이미지 업로드 후 URL 저장

### 미들웨어

- **uploadMiddleware**
  - Multer 설정 (메모리 저장소)
  - 파일 크기 제한: 5MB
  - 파일 형식 검증: jpg, png, webp
  - 에러 핸들링 (파일 크기 초과, 잘못된 형식 등)

### 설정 및 환경변수

- **AWS S3 설정**
  - AWS_S3_BUCKET: 버킷 이름
  - AWS_REGION: 리전
  - AWS_ACCESS_KEY_ID: 액세스 키
  - AWS_SECRET_ACCESS_KEY: 시크릿 키

### 데이터베이스

- **User 모델** 필드 추가
  - profileImageUrl: string (nullable)

## 테스트

### 추가된 테스트

- [x] 단위 테스트: FileService.uploadToS3() 테스트
- [x] 단위 테스트: 파일 검증 로직 테스트
- [x] 통합 테스트: 이미지 업로드 API 테스트
- [x] 통합 테스트: 파일 크기 초과 시 에러 테스트
- [x] 통합 테스트: 잘못된 형식 업로드 시 에러 테스트

### 수동 테스트 가이드

1. Postman에서 POST /api/users/me/profile-image 호출
2. form-data에 이미지 파일 첨부
3. 응답에서 imageUrl 확인
4. 해당 URL로 이미지 조회 가능 확인
5. 다시 업로드 시 기존 이미지가 삭제되는지 S3 콘솔에서 확인

### 테스트 환경

- 로컬 환경: AWS S3 테스트 버킷 사용
- Jest + Supertest로 API 테스트
- 모든 테스트 통과

## 관련 이슈

- Closes #88 - 프로필 이미지 업로드 기능

## 완료

- [x] AWS S3 설정 및 연동
- [x] 파일 업로드 API 구현
- [x] Multer 미들웨어 설정
- [x] 파일 검증 로직 (크기, 형식)
- [x] 기존 이미지 자동 삭제 로직
- [x] 에러 핸들링
- [x] 단위/통합 테스트 작성
- [x] 환경 변수 문서화
```

---

## 공통 패턴

모든 좋은 PR 메시지는 다음과 같은 특징을 가집니다:

1. **명확한 요약**: 2-3문장으로 전체 맥락 제공
2. **구조화된 정보**: 카테고리별로 체계적 정리
3. **충분한 상세**: 리뷰어가 이해할 수 있을 만큼의 정보
4. **테스트 증거**: 어떻게 검증했는지 명시
5. **시각적 자료**: UI 변경 시 스크린샷 포함
6. **이슈 연결**: 관련 이슈 명확히 링크
7. **완료 체크리스트**: 무엇을 했는지 한눈에 파악
