# Design System Storybook Generator

디자인 시스템 컴포넌트를 만들 때 Storybook stories와 마크다운 문서를 자동으로 생성하는 스킬입니다.

## 개요

새로운 디자인 시스템 컴포넌트를 만들면 자동으로:

1. **Storybook stories 파일** (\*.stories.tsx) 생성
2. **컴포넌트 문서** (\*.md) 생성
3. 다양한 **variants와 examples** 포함
4. **접근성(a11y) 정보** 추가

## 사용 시나리오

다음과 같은 경우 이 스킬을 사용하세요:

- ✅ 새로운 디자인 시스템 컴포넌트를 만들었을 때
- ✅ 기존 컴포넌트에 Storybook 추가가 필요할 때
- ✅ 컴포넌트 문서를 작성해야 할 때
- ✅ UI 라이브러리를 구축할 때

## 빠른 시작

### 1. 스킬 호출

```
"Button 컴포넌트에 Storybook 추가해줘"
"이 컴포넌트 문서화해줘"
"디자인 시스템 컴포넌트 Storybook 생성"
```

### 2. 컴포넌트 제공

컴포넌트 파일 경로를 제공하거나 코드를 직접 보여주세요:

```tsx
// src/components/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // 컴포넌트 구현
};
```

### 3. 자동 생성

스킬이 자동으로:

- `Button.stories.tsx` 생성
- `Button.md` 생성
- 모든 variants와 사용 예제 포함

## 생성되는 파일

### Storybook Stories (\*.stories.tsx)

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: { ... },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 다양한 stories 자동 생성:
export const Default: Story = { ... };
export const Primary: Story = { ... };
export const Secondary: Story = { ... };
export const Small: Story = { ... };
export const Disabled: Story = { ... };
export const Interactive: Story = { ... };
export const AllVariants: Story = { ... };
```

**포함되는 Stories:**

- Default - 기본 사용 예제
- 각 Variant별 Story
- 각 Size별 Story
- State Stories (Disabled, Loading 등)
- Interactive Story (모든 controls 활성화)
- AllVariants Story (한눈에 보기)
- Accessibility Story

### 컴포넌트 문서 (\*.md)

```markdown
# Button

버튼 컴포넌트 설명...

## 설치 및 Import

## 기본 사용법

## Props (완전한 테이블)

## Variants (각 variant 설명 + 예제)

## 예제 (다양한 사용 시나리오)

## 접근성 (ARIA, 키보드, 스크린 리더)

## 디자인 가이드라인 (Do's and Don'ts)

## 관련 컴포넌트
```

**포함되는 섹션:**

- 개요 및 설명
- 설치 및 Import
- 기본 사용법
- Props API 테이블
- 모든 Variants 설명
- 실용적인 예제 5개 이상
- 접근성 가이드
- 디자인 가이드라인
- 관련 컴포넌트 링크

## 파일 구조

생성된 파일은 컴포넌트와 같은 디렉토리에 배치됩니다:

```
src/components/Button/
├── Button.tsx              # 컴포넌트
├── Button.stories.tsx      # ← 자동 생성
├── Button.md              # ← 자동 생성
├── Button.test.tsx        # 테스트
└── index.ts               # export
```

또는

```
src/components/
├── Button.tsx
├── Button.stories.tsx     # ← 자동 생성
├── Button.md             # ← 자동 생성
└── Button.test.tsx
```

## 지원하는 컴포넌트 타입

### 기본 컴포넌트

- Button, Input, Checkbox, Radio, Switch
- Card, Badge, Tag, Chip
- Avatar, Icon, Image

### 복잡한 컴포넌트

- Modal, Dropdown, Tooltip, Popover
- Tabs, Accordion, Collapse
- DataTable, Pagination, Select

### 레이아웃 컴포넌트

- Container, Grid, Stack, Flex
- Divider, Spacer

모든 타입의 컴포넌트에 대해 적절한 stories와 문서를 생성합니다!

## 예제

### 예제 1: Button 컴포넌트

**입력:**

```tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}
```

**출력:**

```
✅ Storybook Stories 생성 완료
📁 파일: src/components/Button/Button.stories.tsx

✅ 컴포넌트 문서 생성 완료
📁 파일: src/components/Button/Button.md

📊 생성된 Stories:
  - Default
  - Primary
  - Secondary
  - Small, Medium, Large
  - Disabled
  - Interactive
  - AllVariants
  - Accessibility
```

### 예제 2: Modal 컴포넌트

**입력:**

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}
```

**출력:**

- 상태 관리가 포함된 Interactive stories
- 다양한 size variants
- closeOnOverlayClick 등 옵션별 stories
- 폼 포함 예제
- 문서에 사용 가이드라인 포함

## 필수 의존성

Storybook이 설치되어 있어야 합니다:

```bash
npm install --save-dev @storybook/react @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-a11y
```

또는

```bash
npx storybook@latest init
```

## Storybook 실행

생성된 stories를 보려면:

```bash
npm run storybook
```

## 템플릿

이 스킬은 다음 템플릿을 사용합니다:

### 1. [Storybook Story 템플릿](./templates/storybook-story.md)

- 기본 story 구조
- ArgTypes 패턴
- 다양한 story 타입 예제
- Decorators 사용법
- Play function (interaction testing)

### 2. [컴포넌트 문서 템플릿](./templates/component-docs.md)

- 문서 구조
- Props 테이블 형식
- 예제 작성 방법
- 접근성 섹션
- 디자인 가이드라인

### 3. [복잡한 컴포넌트 예제](./templates/complex-component-example.md)

- Modal, Dropdown, DataTable 예제
- 상태 관리가 필요한 컴포넌트
- Wrapper 컴포넌트 패턴
- 고급 story 작성법

## Best Practices

### Story 작성

1. ✅ 실제 사용 사례를 반영한 예제
2. ✅ 모든 variants와 states 커버
3. ✅ Interactive controls로 실시간 조작 가능
4. ✅ a11y addon으로 접근성 검증

### 문서 작성

1. ✅ 비개발자도 이해할 수 있는 명확한 설명
2. ✅ 풍부한 코드 예제
3. ✅ Do's and Don'ts 포함
4. ✅ 디자인 토큰 참조

### 코드 품질

1. ✅ TypeScript 타입 완전 활용
2. ✅ 공통 args는 별도로 정의하여 재사용
3. ✅ Decorators로 중복 제거
4. ✅ JSDoc 주석 포함

## 워크플로우

1. 디자인 시스템 컴포넌트 작성
2. 이 스킬 호출하여 Storybook + 문서 자동 생성
3. 생성된 파일 확인 및 커스터마이징
4. `npm run storybook`으로 확인
5. Git 커밋 및 팀과 공유

## 커스터마이징

생성된 파일은 시작점이므로 자유롭게 수정할 수 있습니다:

- Story 추가/수정
- ArgTypes 세부 조정
- 문서 내용 보강
- 예제 추가

## 트러블슈팅

### Storybook이 설치되지 않았어요

```bash
npx storybook@latest init
```

### Stories가 표시되지 않아요

`.storybook/main.ts`의 `stories` 패턴을 확인하세요:

```typescript
stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'];
```

### 타입 에러가 발생해요

`@storybook/react` 버전이 7.x 이상인지 확인하세요.

## 추가 리소스

- [SKILL.md](./SKILL.md) - 전체 스킬 가이드
- [Storybook 공식 문서](https://storybook.js.org/)
- [Storybook Best Practices](https://storybook.js.org/docs/react/writing-stories/introduction)

## 변경 이력

### v1.0.0

- 초기 릴리즈
- Button, Input, Modal 등 기본 컴포넌트 지원
- Storybook 7.x 호환
- 접근성 가이드 포함
