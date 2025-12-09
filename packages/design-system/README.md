# Mockly 디자인 시스템

모던 React Native UI 컴포넌트/테마 패키지

---

## ✨ 주요 특징

- 재사용 가능한 UI 컴포넌트 (Button, Card, Text, Badge, Avatar 등)
- 다크/라이트 모드 지원, 테마 토큰 기반 스타일링
- tailwind(twrnc) + cva로 variant/size/상태 관리
- Storybook 연동, 실시간 프리뷰/문서화
- 타입 안전성, 접근성(Accessibility) 고려

---

## 📂 폴더 구조

```
src/
├── components/      # 주요 UI 컴포넌트 (Button, Card, Text, ...)
│   ├── Button/
│   ├── Card/
│   ├── Text/
│   └── ...
├── layout/          # 레이아웃/그리드 컴포넌트
├── animations/      # 애니메이션 컴포넌트
├── theme/           # 테마/컬러 토큰
├── stories/         # 디자인 토큰/가이드 스토리
│   ├── Colors.stories.tsx
│   ├── Typography.stories.tsx
│   └── ...
├── lib/             # 내부 유틸리티/헬퍼
└── index.ts         # 패키지 엔트리
```

### components 종류

- Avatar
- Badge
- Button
- Card
- Carousel
- Icon
- Indicator
- Input
- Text

### layout 종류

- Grid
- Spacer
- Stack

### animations 종류

- FadeIn, FadeInText, FadeOut, FadeOutText
- ScaleIn, ScaleOut
- SlideIn, SlideOut

---

## 🛠️ 사용법

```tsx
import { Button, Card, Text } from '@mockly/design-system';

<Button variant="primary" size="large">확인</Button>
<Card variant="surface">...</Card>
<Text variant="heading">타이틀</Text>
```

- tailwind(twrnc) + cva로 스타일/variant 관리
- 테마 토큰/다크모드 자동 적용

---

## 🎨 테마/토큰 (상세)

- **컬러 팔레트**: orange, blue, pink, green, yellow, red, gray, neutral 등 50~900 scale로 세분화
- **라이트/다크 컬러 토큰**: `lightColors`, `darkColors`로 배경/텍스트/버튼/경고 등 역할별 색상 분리
- **spacing**: xs~2xl까지 여백 단위 제공 (`theme.spacing`)
- **typography**: fontSize(xs~3xl), fontWeight(regular~bold) 등 텍스트 스타일 토큰 (`theme.typography`)
- **borderRadius**: sm~full까지 둥근 모서리 토큰 (`theme.borderRadius`)
- 모든 토큰은 `src/theme/index.ts`에서 관리, theme 객체로 통합
- **Storybook에서 모든 테마/토큰을 실시간 프리뷰/문서화로 자세히 확인할 수 있습니다.**

### 실제 사용 예시

```tsx
import { theme } from '@mockly/design-system';

const styles = {
  backgroundColor: theme.colors.background,
  color: theme.colors.text,
  borderRadius: theme.borderRadius.md,
  padding: theme.spacing.lg,
  fontSize: theme.typography.fontSize.lg,
};
```

### 커스텀 테마 확장 방법

- `src/theme/index.ts`에서 palette/토큰을 추가하거나, colors/spacing/typography를 오버라이드
- 컴포넌트에서 theme 객체를 import해 일관된 스타일 적용

---

## 🧪 테스트/스토리북

- 컴포넌트 단위/통합 테스트: `__tests__/` 폴더에서 관리
- Storybook에서 실시간 프리뷰/문서화 지원
- 개별 컴포넌트 스토리는 이 패키지에서 선언, 전체/페이지 단위 스토리는 Storybook 프로젝트에서 관리

---

## 📑 기타 참고

- 디자인 시스템 전체 구조/가이드: [프로젝트 루트 README](../../../README.md)
- 확장/기여: 새로운 컴포넌트는 `src/components/`에 추가, 테마는 `src/theme/`에서 확장
- 접근성/테스트/다크모드 등은 기존 컴포넌트 코드 참고

---

> 공통 규칙, 커밋 메시지, AGENTS 안내 등은 [루트 README](../../../README.md)에서 확인하세요!
