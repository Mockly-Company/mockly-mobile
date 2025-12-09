# Mockly Mobile 앱 개발자용 README

> 전체 모노레포 구조, 공통 규칙, 디자인 시스템 안내는 [프로젝트 루트 README](../../README.md) 참고!

---

## 📱 모바일 앱 빠른 시작

1. **환경 준비**
   - Node.js, Android Studio, Xcode 설치
   - React Native 공식 가이드 참고: https://reactnative.dev/docs/environment-setup

2. **환경 변수 파일 생성**
   - `apps/mobile/.env.dev` 파일을 반드시 생성
   - 예시:
     ```env
     GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
     GOOGLE_IOS_CLIENT_ID=your_google_ios_client_id
     GOOGLE_ANDROID_CLIENT_ID=your_google_android_client_id
     API_BASE_URL=http://localhost:8080
     ```

3. **의존성 설치**

   ```bash
   pnpm install
   ```

4. **앱 실행**

   ```bash
   pnpm dev
   pnpm android   # 또는 pnpm ios
   ```

5. **테스트 실행**
   ```bash
   pnpm test:mobile
   pnpm test:watch
   pnpm test:coverage
   ```

---

## 📂 주요 폴더 구조 (모바일)

```
src/
├── app/
│   ├── screens/        # 화면 컴포넌트
│   ├── navigation/     # 내비게이션 설정
│   └── components/     # 앱 전용 컴포넌트
├── features/           # 도메인별 기능
├── shared/             # 공통 상수/유틸
├── lib/                # 외부 라이브러리 래퍼
__tests__/              # 모바일 테스트 코드
```

---

## 🛠️ 모바일 개발/디버깅 팁

- **에뮬레이터/실기기 테스트**: Android Studio/Xcode에서 직접 실행 가능
- **Fast Refresh/Hot Reload**: 코드 변경 즉시 반영
- **환경 변수 변경 시**: 앱 재시작 필요
- **로그/디버깅**: React Native Debugger, Flipper 등 활용
- **트러블슈팅**: Metro 캐시 문제 시 `pnpm start --reset-cache` 사용

---

## 🧪 모바일 테스트 전략

- **테스트 폴더**: `__tests__/features`, `__tests__/ui`, ...
- **테스트 도구**: Jest, @testing-library/react-native
- **실제 사용 케이스 중심 통합 테스트 권장**

---

## ✨ 디자인 시스템 컴포넌트 사용법

- 모든 UI 컴포넌트는 `@mockly/design-system` 패키지에서 import
- 예시:
  ```tsx
  import { Button, Card, Text } from '@mockly/design-system';
  ```
- 다크모드/variant는 tailwind(twrnc) + cva로 관리

---

## 📑 기타 참고

- 앱 아이콘/스플래시/푸시 등 모바일 특화 설정은 별도 문서 참고
- 배포(테스트플라이트, 구글 플레이)는 루트 README 또는 별도 배포 문서 참고

---

> 공통 규칙, 커밋 메시지, AGENTS 안내 등은 [루트 README](../../README.md)에서 확인하세요!
