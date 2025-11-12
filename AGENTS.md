Mockly Mobile - 코드베이스 개요

이 문서는 Mockly Mobile 프로젝트에서 AI 어시스턴트(예: Claude)가 작업할 때 필요한 핵심 정보를 제공합니다.

프로젝트 구조
mockly-mobile/
├── apps/
│ ├── mobile/ # React Native 앱 (메인 애플리케이션)
│ └── storybook/ # 디자인 시스템 문서용 Storybook
├── packages/
│ ├── entities/ # 공유 TypeScript 타입과 인터페이스
│ ├── design-system/ # 재사용 가능한 React Native 컴포넌트
│ ├── api/ # API 클라이언트 및 서비스 레이어
│ └── typescript-config/ # 공유 TypeScript 설정
└── .env.\* # 환경별 구성 파일

Apps

mobile: React Native 0.82.1 앱, NativeWind(Tailwind CSS) 사용

storybook: Storybook React Native Web, 컴포넌트 문서용

Packages (workspace:\*)

@mockly/entities: 도메인 타입 및 인터페이스(User, Mock 등)

@mockly/design-system: UI 컴포넌트 라이브러리 + 테마 시스템

@mockly/api: Axios 기반 API 클라이언트, 인터셉터 포함

@mockly/typescript-config: 공유 TypeScript 설정

기술 스택

Monorepo: Turborepo 2.6.0 + pnpm workspace

런타임: React Native 0.82.1, React 19.1.1

언어: TypeScript 5.9.3

스타일링: NativeWind 4.2.1 (React Native용 Tailwind CSS)

빌드: Metro bundler

테스트: Jest 30.2.0

문서화: Storybook 10.0.5

주요 외부 의존성

axios: 1.13.2 (HTTP 클라이언트)

react-native-dotenv: 환경 변수 관리

react-native-safe-area-context: 안전 영역 처리

개발 도구

ESLint 9.39.1 (TypeScript, React, React Native 플러그인 포함)

Prettier 3.6.2 (코드 포맷팅)

Husky 9.1.7 (Git 훅 관리)

Commitlint 20.1.0 (커밋 메시지 검증)

lint-staged 16.2.6 (사전 커밋 린트 실행)

코드 규칙
커밋 메시지

형식: [type] subject

사용 가능한 타입:

feat: 새로운 기능

fix: 버그 수정

docs: 문서 변경

style: 코드 포맷팅 (기능 변경 없음)

refactor: 코드 리팩터링

test: 테스트 코드

chore: 빌드 작업, 패키지 매니저 설정

perf: 성능 개선

ci: CI 설정 변경

build: 빌드 시스템 변경

revert: 커밋 되돌리기

예시:

[feat] 로그인 기능 추가
[fix] 버튼 클릭 이벤트 수정
[docs] README 업데이트

TypeScript

Strict 모드 활성화

명시적 any 금지 (경고만 표시)

사용하지 않는 변수는 \_로 시작해야 함

공통 설정은 @mockly/typescript-config 사용

코드 스타일 (Prettier)
{
"semi": true,
"trailingComma": "es5",
"singleQuote": true,
"printWidth": 100,
"tabWidth": 2,
"useTabs": false,
"arrowParens": "avoid",
"endOfLine": "lf"
}

ESLint 규칙

TypeScript 추천 규칙

React / React Native 권장 규칙

Prettier 통합

화살표 함수 매개변수 괄호: avoid (한 개일 경우)

\_ 접두사 사용 시 사용하지 않는 변수 무시

공통 패턴
디자인 시스템 컴포넌트 구조
// Button.tsx 예시
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';

export interface ButtonProps extends TouchableOpacityProps {
variant?: 'primary' | 'secondary' | 'outline';
size?: 'small' | 'medium' | 'large';
children: string;
}

export const Button: React.FC<ButtonProps> = ({
variant = 'primary',
size = 'medium',
children,
style,
disabled,
...props
}) => {
return (
<TouchableOpacity
style={[styles.base, styles[variant], styles[size], disabled && styles.disabled, style]}
disabled={disabled}
{...props} >
<Text style={[styles.text, styles[`${variant}Text`]]}>{children}</Text>
</TouchableOpacity>
);
};

const styles = StyleSheet.create({
// 테마 토큰 사용
});

API 서비스 패턴
// 인터셉터가 포함된 API 클라이언트
export class ApiClient {
private client: AxiosInstance;

constructor(config: ApiClientConfig) {
this.client = axios.create({
baseURL: config.baseURL,
timeout: config.timeout || 30000,
headers: { 'Content-Type': 'application/json' },
});
this.setupInterceptors();
}

private setupInterceptors() {
// 요청: 인증 토큰 추가
// 응답: 401 에러 처리
}

public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
const response = await this.client.get<T>(url, config);
return response.data;
}
// ... 다른 HTTP 메서드
}

워크스페이스 패키지 사용 예
{
"dependencies": {
"@mockly/entities": "workspace:_",
"@mockly/design-system": "workspace:_",
"@mockly/api": "workspace:\*"
}
}

NativeWind (Tailwind CSS) 사용 예
import { View, Text } from 'react-native';

<View className="bg-primary p-md rounded-lg">
  <Text className="text-xl font-semibold text-white">Hello World</Text>
</View>

사용 가능한 테마 토큰:

색상: bg-primary, text-secondary, border-error

간격: p-xs, m-md, gap-lg (xs, sm, md, lg, xl, 2xl)

타이포그래피: text-sm, font-semibold

테두리 반경: rounded-sm, rounded-lg

토큰 정의: [packages/design-system/src/theme/index.ts](packages/design-system/src/theme/index.ts)

환경 변수

파일: .env.dev, .env.stage, .env.prod

개발 모드 (pnpm dev): .env.dev 자동 로드

빌드 모드 (pnpm build): .env.prod 자동 로드

babel.config.js에서 react-native-dotenv로 관리

# .env.dev

NODE_ENV=development
API_URL=your_api_url_here

빌드 및 개발
주요 명령어

# 개발

pnpm dev # 모바일 Metro bundler 시작 (개발 환경)
pnpm dev:storybook # Storybook 시작

# 빌드

pnpm build # 모든 패키지 빌드

# 코드 품질

pnpm lint # ESLint 실행
pnpm lint:fix # ESLint 자동 수정
pnpm format # Prettier 포맷
pnpm type-check # TypeScript 타입 체크

# 테스트

pnpm test # 모든 테스트 실행

# 클린업

pnpm clean # node_modules 및 빌드 산출물 삭제

Turborepo 작업 파이프라인

build: dist/, .next/, build/, android/app/build/, ios/build/ 출력

dev: 캐시 없음, 지속적 작업

lint, type-check, test: ^build 의존 (먼저 빌드 후 실행)

Git 훅 (Husky)

Pre-commit:

lint-staged: ESLint 자동 수정 + Prettier 포맷

type-check: TypeScript 전체 검증

Commit-msg:

commitlint: 커밋 메시지 형식 검증

요구 사항

Node.js >= 20

pnpm >= 9.0.0

React Native 개발 환경 (Android Studio / Xcode)

AI 어시스턴트용 주의 사항

내부 패키지는 항상 워크스페이스 참조(workspace:\*) 사용

커밋 메시지 형식 준수 (commitlint 적용)

디자인 시스템에서 값 하드코딩 금지, 테마 토큰 사용

컴포넌트 props는 React Native 기본 컴포넌트에서 확장

스타일은 StyleSheet.create 사용 (inline 객체 금지)

패키지 index 파일에서 타입과 구현 모두 export

커밋 전 타입 체크 필수 (Git 훅 자동 실행)

가능한 NativeWind 클래스 사용, inline 스타일 최소화

모바일 앱에 통합하기 전에 Storybook에서 컴포넌트 테스트

환경 변수는 NODE_ENV 기준 자동 로드
