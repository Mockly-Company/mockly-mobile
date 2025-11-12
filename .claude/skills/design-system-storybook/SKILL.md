---
name: design-system-storybook
description: 디자인 시스템 컴포넌트를 만들 때 자동으로 Storybook stories와 컴포넌트 문서(.md)를 생성하는 스킬. 새로운 디자인 시스템 컴포넌트 추가, Storybook 스토리 작성, 컴포넌트 문서화 작업에 사용.
---

# Design System Storybook Generator

디자인 시스템 컴포넌트를 만들 때 Storybook stories와 마크다운 문서를 자동으로 생성하는 스킬.

## Purpose

이 스킬은 다음 작업을 자동화:

1. 컴포넌트에 대한 Storybook stories 파일 생성 (\*.stories.tsx)
2. 컴포넌트 문서 파일 생성 (\*.md)
3. 다양한 variant 및 props 예제 작성
4. 접근성(a11y) 정보 포함

## When to Use

다음과 같은 경우 이 스킬을 사용:

- 새로운 디자인 시스템 컴포넌트를 만들었을 때
- 기존 컴포넌트에 Storybook 스토리 추가가 필요할 때
- 컴포넌트 문서를 작성해야 할 때
- UI 라이브러리 구축 시

## How to Use

### Step 1: 컴포넌트 분석

먼저 대상 컴포넌트 파일을 읽어서 다음 정보를 파악:

- 컴포넌트 이름
- Props 인터페이스 (TypeScript 타입)
- 기본 props (defaultProps)
- Variants (size, color, variant 등)
- 필수/선택 props

**예시:**

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}
```

### Step 2: Storybook Stories 생성

컴포넌트와 같은 디렉토리에 `{ComponentName}.stories.tsx` 파일 생성.

**사용할 템플릿:** [templates/storybook-story.md](./templates/storybook-story.md)

**생성 규칙:**

1. **Meta 정보 설정**
   - title: 컴포넌트 경로 (예: "Components/Button")
   - component: 컴포넌트 import
   - tags: ['autodocs'] 포함

2. **기본 Story**
   - Default: 가장 일반적인 사용 예제

3. **Variant Stories**
   - 각 variant별 Story 생성
   - 예: Primary, Secondary, Outline

4. **Size Stories (있는 경우)**
   - Small, Medium, Large

5. **State Stories**
   - Default, Hover, Disabled, Loading 등

6. **Interactive Story**
   - 모든 props를 controls로 조작 가능한 story

7. **Accessibility Story**
   - 접근성 테스트를 위한 story

**Args 타입 지정:**

- Storybook 7.x+ 스타일 사용
- `satisfies Meta<typeof Component>` 사용
- StoryObj 타입 활용

### Step 3: 컴포넌트 문서 생성

컴포넌트와 같은 디렉토리에 `{ComponentName}.md` 파일 생성.

**사용할 템플릿:** [templates/component-docs.md](./templates/component-docs.md)

**문서 구조:**

1. **개요**
   - 컴포넌트 설명
   - 주요 사용 사례

2. **설치 및 Import**

   ```tsx
   import { Button } from '@/components/Button';
   ```

3. **기본 사용법**
   - 가장 간단한 예제 코드

4. **Props API**
   - 모든 props 설명 테이블
   - 타입, 기본값, 필수 여부

5. **Variants**
   - 각 variant 설명 및 예제

6. **예제**
   - 다양한 사용 시나리오
   - 코드 예제

7. **접근성**
   - ARIA 속성
   - 키보드 네비게이션
   - 스크린 리더 지원

8. **디자인 가이드라인**
   - 언제 사용하는지
   - 언제 사용하지 말아야 하는지
   - 디자인 원칙

### Step 4: Storybook 설정 확인

프로젝트에 Storybook이 설정되어 있는지 확인:

**필요한 패키지:**

```json
{
  "devDependencies": {
    "@storybook/react": "^7.x.x",
    "@storybook/addon-essentials": "^7.x.x",
    "@storybook/addon-interactions": "^7.x.x",
    "@storybook/addon-a11y": "^7.x.x"
  }
}
```

**설정 파일 확인:**

- `.storybook/main.ts` 또는 `.storybook/main.js`
- `.storybook/preview.ts` 또는 `.storybook/preview.js`

설정이 없으면 기본 Storybook 설정 추가 제안.

### Step 5: 파일 위치 규칙

**표준 구조:**

```
src/components/Button/
├── Button.tsx              # 컴포넌트
├── Button.stories.tsx      # Storybook stories
├── Button.md              # 컴포넌트 문서
├── Button.test.tsx        # 테스트 (있는 경우)
└── index.ts               # export
```

또는

```
src/components/
├── Button.tsx
├── Button.stories.tsx
├── Button.md
└── Button.test.tsx
```

프로젝트의 기존 구조를 따르되, 컴포넌트와 같은 디렉토리에 배치.

## Best Practices

### Story 작성

1. **실제 사용 사례 반영**: 실제로 사용될 법한 예제 작성
2. **모든 variants 커버**: 모든 가능한 조합 포함
3. **Interactive controls**: args를 통해 실시간 조작 가능하게
4. **Accessibility 고려**: a11y addon으로 접근성 검증

### 문서 작성

1. **명확한 설명**: 비개발자도 이해할 수 있게
2. **풍부한 예제**: 다양한 사용 시나리오 제공
3. **Do's and Don'ts**: 좋은 예시와 나쁜 예시
4. **디자인 토큰 참조**: 색상, 간격 등 디자인 토큰 명시

### 코드 품질

1. **타입 안전성**: TypeScript 타입 완전 활용
2. **재사용성**: 공통 args는 별도로 정의
3. **성능**: decorators 활용으로 중복 제거
4. **문서화**: JSDoc 주석 포함

## Examples

### 기본 Button 컴포넌트

**입력 (Button.tsx):**

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

**출력:** Button.stories.tsx와 Button.md 생성 (템플릿 참조)

## Workflow

1. 사용자가 컴포넌트 파일 경로 제공 또는 컴포넌트 코드를 보여줌
2. 컴포넌트 분석 (props, variants 파악)
3. Storybook stories 파일 생성
4. 컴포넌트 문서 파일 생성
5. 생성된 파일 경로와 내용 사용자에게 제시
6. 사용자 피드백에 따라 수정

## Output Format

생성된 파일은 다음 형식으로 제시:

```
✅ Storybook Stories 생성 완료
📁 파일: src/components/Button/Button.stories.tsx

✅ 컴포넌트 문서 생성 완료
📁 파일: src/components/Button/Button.md

📊 생성된 Stories:
  - Default
  - Primary
  - Secondary
  - Small
  - Medium
  - Large
  - Disabled
  - Interactive
  - Accessibility

다음 명령어로 Storybook 실행:
npm run storybook
```

## Additional Resources

- [Storybook Story 템플릿](./templates/storybook-story.md)
- [컴포넌트 문서 템플릿](./templates/component-docs.md)
- [복잡한 컴포넌트 예제](./templates/complex-component-example.md)
