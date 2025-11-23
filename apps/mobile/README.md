# Mockly Mobile

React Native 모바일 애플리케이션 - Feature-based 아키텍처

## 프로젝트 구조

```
src/
├── app/                          # 프레젠테이션 레이어
│   ├── navigation/               # 네비게이션 설정
│   │   └── BottomTabNavigator.tsx
│   ├── screens/                  # 화면 컴포넌트 (기능별 그룹화)
│   │   ├── home/
│   │   │   └── HomeScreen.tsx
│   │   ├── chat/
│   │   │   └── ChatScreen.tsx
│   │   ├── interview/
│   │   │   ├── InterviewScreen.tsx
│   │   │   └── LocalInterviewScreen.tsx
│   │   └── profile/
│   │       └── MyPageScreen.tsx
│   └── components/
│       ├── common/               # 공통 컴포넌트
│       └── ui/                   # UI 컴포넌트
│           └── GoogleLoginButton.tsx
├── features/                     # 도메인 로직 (기능별 모듈)
│   └── auth/                     # 인증 기능
│       ├── AuthContext.tsx       # 인증 Context Provider
│       ├── hooks.ts              # useAuth 훅
│       └── types.ts              # 인증 관련 타입
├── shared/                       # 공유 유틸리티
│   ├── api/                      # API 클라이언트
│   ├── hooks/                    # 공통 훅
│   ├── constants/                # 상수
│   ├── utils/                    # 유틸 함수
│   │   └── stringUtils.ts
│   └── types/                    # 공통 타입
├── lib/                          # 서드파티 라이브러리 통합
│   ├── app-auth/                 # OAuth 인증
│   │   └── pkceAuth.ts           # PKCE 기반 Google OAuth
│   └── storage/                  # 저장소 관련
└── styles/                       # 글로벌 스타일
```

## 기술 스택

- **React Native** 0.82.1
- **TypeScript** 5.9.3
- **NativeWind** 4.2.1 (Tailwind CSS for React Native)
- **React Navigation** - 네비게이션
- **AsyncStorage** - 로컬 저장소
- **react-native-app-auth** - PKCE OAuth 인증

## 주요 기능

### 인증 (Authentication)

- PKCE 기반 Google OAuth 로그인
- 자동 토큰 갱신
- AsyncStorage를 통한 로그인 상태 유지

### 네비게이션

- Bottom Tab Navigator (5개 탭)
  - 홈
  - 동네면접
  - 면접
  - 채팅
  - 마이페이지

## 아키텍처 원칙

### Feature-Based Structure

- **app/**: 프레젠테이션 레이어 - UI 컴포넌트, 화면, 네비게이션
- **features/**: 도메인 로직 - 비즈니스 로직을 기능별로 모듈화
- **shared/**: 공유 리소스 - 재사용 가능한 유틸리티, 훅, 타입
- **lib/**: 외부 라이브러리 통합 - 서드파티 라이브러리 래퍼

### 스타일링 규칙

- NativeWind (tw) 사용 권장
- StyleSheet는 레거시 코드에만 존재
- 일관된 스타일 패턴 유지

## Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: 환경 변수 설정

프로젝트 루트에 `.env.dev` 파일을 생성하고 다음 환경 변수를 설정합니다:

```sh
NODE_ENV=development
API_BASE_URL=your_api_url_here
GOOGLE_WEB_CLIENT_ID=your_google_client_id_here
```

## Step 2: 의존성 설치

```sh
# pnpm 사용 (권장)
pnpm install

# iOS의 경우 CocoaPods 설치
cd ios && bundle install && bundle exec pod install && cd ..
```

## Step 3: Metro 서버 시작

먼저 Metro 서버를 실행합니다:

```sh
# pnpm 사용
pnpm dev

# 또는 npm/yarn
npm start
yarn start
```

## Step 4: 앱 빌드 및 실행

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

## Step 4: 앱 빌드 및 실행

Metro가 실행 중인 상태에서 새 터미널을 열고 다음 명령어로 앱을 실행합니다:

### Android

```sh
# pnpm 사용
pnpm android

# 또는 npm/yarn
npm run android
yarn android
```

### iOS

```sh
# pnpm 사용
pnpm ios

# 또는 npm/yarn
npm run ios
yarn ios
```

## 개발 도구

### 테스트 실행

```sh
# 모든 테스트 실행
pnpm test

# 특정 테스트 파일 실행
pnpm test --testPathPattern=MyPageScreen
```

### 타입 체크

```sh
pnpm type-check
```

### 린트

```sh
# ESLint 실행
pnpm lint

# 자동 수정
pnpm lint:fix

# Prettier 포맷팅
pnpm format
```

## 코드 작성 가이드

### 새로운 기능 추가하기

1. **도메인 로직**: `src/features/` 에 새 기능 폴더 생성
2. **화면 컴포넌트**: `src/app/screens/` 에 기능별 폴더 생성
3. **공통 컴포넌트**: `src/app/components/` 에 추가
4. **유틸리티**: `src/shared/utils/` 에 추가

### Import 경로 규칙

```typescript
// 도메인 로직 import
import { useAuth } from '@/features/auth/hooks';

// 화면 컴포넌트 import
import { HomeScreen } from '@/app/screens/home/HomeScreen';

// 공유 유틸리티 import
import { capitalize } from '@/shared/utils/stringUtils';

// 서드파티 통합 import
import { authorizeWithPKCE } from '@/lib/app-auth/pkceAuth';
```

### 스타일링 가이드

```typescript
import { View, Text } from 'react-native';
import { tw } from '@mockly/design-system';

const containerStyle = tw`flex-1 justify-center items-center bg-white`;
const titleStyle = tw`text-2xl font-bold text-gray-900`;

export const MyScreen = () => {
  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>Hello World</Text>
    </View>
  );
};
```

## Google OAuth 설정

### Android Client ID 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. OAuth 2.0 클라이언트 ID 생성 (Android 타입)
3. 패키지 이름: `com.mobile` (또는 `app.json`의 package 이름)
4. SHA-1 인증서 지문 등록
5. 생성된 Client ID를 `.env.dev`의 `GOOGLE_WEB_CLIENT_ID`에 설정

### Redirect URI

백엔드 엔드포인트를 사용합니다:

```
${API_BASE_URL}/login/oauth2/code/google
```

자세한 내용은 `GOOGLE_LOGIN_SETUP.md` 참조

## 프로젝트 구조 설명

### app/ - 프레젠테이션 레이어

사용자에게 보여지는 모든 UI 관련 코드

- 화면 컴포넌트
- 네비게이션
- UI 컴포넌트

### features/ - 도메인 로직

비즈니스 로직을 기능별로 모듈화

- Context Providers
- Custom Hooks
- 도메인 타입
- 각 기능은 독립적으로 동작 가능

### shared/ - 공유 리소스

여러 기능에서 공통으로 사용하는 코드

- 유틸리티 함수
- 공통 훅
- 공통 타입
- 상수

### lib/ - 서드파티 통합

외부 라이브러리를 래핑하여 사용

- OAuth 인증
- 저장소
- 분석 도구 등

## 문제 해결

### Metro Bundler 캐시 삭제

```sh
pnpm start --reset-cache
```

### iOS Pod 재설치

```sh
cd ios && rm -rf Pods Podfile.lock && bundle exec pod install && cd ..
```

### Android 빌드 캐시 삭제

```sh
cd android && ./gradlew clean && cd ..
```

## 관련 문서

- [Google Login Setup](./GOOGLE_LOGIN_SETUP.md) - Google OAuth 설정 가이드
- [PKCE Auth Documentation](./docs/PKCE_AUTH.md) - PKCE 인증 플로우 설명

## 앱 수정하기

`src/app/screens/` 또는 원하는 파일을 수정하면 Fast Refresh가 자동으로 변경사항을 반영합니다.

강제 새로고침:

- **Android**: <kbd>R</kbd> 키를 두 번 누르거나 <kbd>Ctrl</kbd> + <kbd>M</kbd>에서 Reload 선택
- **iOS**: <kbd>Cmd ⌘</kbd> + <kbd>R</kbd>

## 배포

### Android APK 빌드

```sh
cd android && ./gradlew assembleRelease
```

### iOS Archive

Xcode에서 Product > Archive 선택

## 기여하기

1. 브랜치 생성: `git checkout -b feat/new-feature`
2. 변경사항 커밋: 커밋 컨벤션 준수 (`[feat]`, `[fix]` 등)
3. Push: `git push origin feat/new-feature`
4. Pull Request 생성

## 라이선스

이 프로젝트는 Mockly Company의 소유입니다.
