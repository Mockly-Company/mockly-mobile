# Component Documentation Template

디자인 시스템 컴포넌트의 마크다운 문서 템플릿입니다.

## 기본 구조

```markdown
# {ComponentName}

{컴포넌트에 대한 간단한 설명 (1-2문장)}

## 설치 및 Import

\`\`\`tsx
import { {ComponentName} } from '@/components/{ComponentName}';
\`\`\`

## 기본 사용법

\`\`\`tsx
<{ComponentName}>
  {기본 예제}
</{ComponentName}>
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| ... | ... | ... | ... |

## Variants

### {Variant 1}

설명...

\`\`\`tsx
예제 코드
\`\`\`

## 예제

### {예제 1 제목}

\`\`\`tsx
예제 코드
\`\`\`

## 접근성

- ARIA 속성 설명
- 키보드 네비게이션
- 스크린 리더 지원

## 디자인 가이드라인

### 언제 사용하나요?

- 사용 사례 1
- 사용 사례 2

### 언제 사용하지 말아야 하나요?

- 피해야 할 사례 1
- 피해야 할 사례 2

## 관련 컴포넌트

- 관련 컴포넌트 링크
```

## 전체 예제: Button 컴포넌트

```markdown
# Button

버튼은 사용자가 액션을 수행할 수 있게 하는 클릭 가능한 요소입니다.

## 설치 및 Import

\`\`\`tsx
import { Button } from '@/components/Button';
\`\`\`

## 기본 사용법

\`\`\`tsx
<Button>Click me</Button>
\`\`\`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | ReactNode | - | ✅ | 버튼 내부 콘텐츠 |
| variant | 'primary' \| 'secondary' \| 'outline' \| 'ghost' | 'primary' | ❌ | 버튼 스타일 variant |
| size | 'sm' \| 'md' \| 'lg' | 'md' | ❌ | 버튼 크기 |
| disabled | boolean | false | ❌ | 비활성화 상태 |
| loading | boolean | false | ❌ | 로딩 상태 |
| fullWidth | boolean | false | ❌ | 전체 너비 사용 여부 |
| onClick | () => void | - | ❌ | 클릭 이벤트 핸들러 |

## Variants

### Primary

기본 버튼 스타일로, 가장 중요한 액션에 사용합니다.

\`\`\`tsx
<Button variant="primary">Primary Button</Button>
\`\`\`

**사용 사례:**
- 폼 제출
- 주요 Call-to-Action
- 확인/저장 버튼

### Secondary

보조 액션에 사용하는 덜 강조된 버튼입니다.

\`\`\`tsx
<Button variant="secondary">Secondary Button</Button>
\`\`\`

**사용 사례:**
- 보조 액션
- 취소 버튼
- 다중 옵션 중 하나

### Outline

테두리만 있는 버튼으로, 더 가벼운 액션에 사용합니다.

\`\`\`tsx
<Button variant="outline">Outline Button</Button>
\`\`\`

**사용 사례:**
- 선택적 액션
- 필터나 토글
- 덜 중요한 작업

### Ghost

배경이 없는 투명한 버튼입니다.

\`\`\`tsx
<Button variant="ghost">Ghost Button</Button>
\`\`\`

**사용 사례:**
- 테이블 내 액션
- 내비게이션
- 아이콘 버튼

## Sizes

### Small

공간이 제한된 곳에 사용하는 작은 버튼입니다.

\`\`\`tsx
<Button size="sm">Small Button</Button>
\`\`\`

### Medium (기본)

대부분의 경우 사용하는 표준 크기입니다.

\`\`\`tsx
<Button size="md">Medium Button</Button>
\`\`\`

### Large

강조가 필요하거나 터치 타겟을 크게 해야 할 때 사용합니다.

\`\`\`tsx
<Button size="lg">Large Button</Button>
\`\`\`

## 예제

### 아이콘과 함께 사용

\`\`\`tsx
import { PlusIcon } from '@/icons';

<Button>
  <PlusIcon />
  Add Item
</Button>
\`\`\`

### 로딩 상태

\`\`\`tsx
<Button loading disabled>
  Processing...
</Button>
\`\`\`

### 전체 너비

\`\`\`tsx
<Button fullWidth>
  Full Width Button
</Button>
\`\`\`

### 폼 제출

\`\`\`tsx
<form onSubmit={handleSubmit}>
  <input type="text" />
  <Button type="submit">
    Submit
  </Button>
</form>
\`\`\`

### 비활성화 상태

\`\`\`tsx
<Button disabled>
  Disabled Button
</Button>
\`\`\`

### 버튼 그룹

\`\`\`tsx
<div style={{ display: 'flex', gap: '0.5rem' }}>
  <Button variant="outline">Cancel</Button>
  <Button variant="primary">Save</Button>
</div>
\`\`\`

## 접근성

### ARIA 속성

버튼 컴포넌트는 다음 ARIA 속성을 지원합니다:

\`\`\`tsx
<Button
  aria-label="Add new item"
  aria-pressed={isPressed}
  aria-disabled={isDisabled}
>
  Add
</Button>
\`\`\`

### 키보드 네비게이션

- **Enter** 또는 **Space**: 버튼 활성화
- **Tab**: 다음 포커스 가능한 요소로 이동
- **Shift + Tab**: 이전 포커스 가능한 요소로 이동

### 스크린 리더

- 버튼의 목적이 명확하지 않으면 `aria-label` 사용
- 로딩 상태일 때 `aria-busy="true"` 추가
- 비활성화 상태는 자동으로 `aria-disabled="true"` 설정

### 포커스 관리

\`\`\`tsx
import { useRef } from 'react';

const buttonRef = useRef<HTMLButtonElement>(null);

// 프로그래밍 방식으로 포커스
buttonRef.current?.focus();

<Button ref={buttonRef}>Focus Me</Button>
\`\`\`

## 디자인 가이드라인

### 언제 사용하나요?

✅ **사용하는 경우:**
- 사용자 액션을 트리거할 때
- 폼 제출이 필요할 때
- 다이얼로그나 모달 확인/취소
- 네비게이션 (단, 링크가 더 적합할 수 있음)

### 언제 사용하지 말아야 하나요?

❌ **사용하지 않는 경우:**
- 다른 페이지로 이동할 때 → `<Link>` 사용
- 토글 기능일 때 → `<Switch>` 또는 `<Checkbox>` 사용
- 여러 옵션 중 선택일 때 → `<Radio>` 또는 `<Select>` 사용

### 버튼 레이블 작성 가이드

**좋은 예:**
- "Save Changes" (구체적)
- "Add to Cart" (액션 명확)
- "Download Report" (결과 명확)

**나쁜 예:**
- "Click Here" (모호함)
- "OK" (맥락 없음)
- "Submit" (무엇을 제출하는지 불명확)

### 버튼 배치

**Primary 버튼 위치:**
- 일반적으로 오른쪽에 배치
- 사용자의 자연스러운 읽기 흐름 고려
- 모바일에서는 스택(세로) 배치 고려

\`\`\`tsx
// 데스크톱
<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
  <Button variant="outline">Cancel</Button>
  <Button variant="primary">Save</Button>
</div>

// 모바일
<div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '0.5rem' }}>
  <Button variant="outline" fullWidth>Cancel</Button>
  <Button variant="primary" fullWidth>Save</Button>
</div>
\`\`\`

### 색상 및 대비

- 모든 버튼은 WCAG AA 기준 (4.5:1) 대비율 충족
- Primary 버튼: 브랜드 색상 사용
- Disabled 버튼: 충분한 시각적 구분

## 스타일링

### 커스텀 스타일

\`\`\`tsx
<Button
  style={{ borderRadius: '24px' }}
  className="custom-button"
>
  Custom Styled
</Button>
\`\`\`

### CSS Variables

버튼 컴포넌트는 다음 CSS 변수를 사용합니다:

\`\`\`css
--button-primary-bg: #0066cc;
--button-primary-hover: #0052a3;
--button-padding-sm: 0.5rem 1rem;
--button-padding-md: 0.75rem 1.5rem;
--button-padding-lg: 1rem 2rem;
\`\`\`

## 관련 컴포넌트

- **IconButton** - 아이콘만 있는 버튼
- **ButtonGroup** - 버튼들을 그룹화
- **Link** - 네비게이션용 링크
- **FloatingActionButton** - 플로팅 액션 버튼

## 변경 이력

### v1.2.0
- `loading` prop 추가
- `fullWidth` prop 추가

### v1.1.0
- `ghost` variant 추가
- 접근성 개선

### v1.0.0
- 초기 릴리즈
```

## Input 컴포넌트 문서 예제

```markdown
# Input

텍스트 입력을 받는 폼 컴포넌트입니다.

## 설치 및 Import

\`\`\`tsx
import { Input } from '@/components/Input';
\`\`\`

## 기본 사용법

\`\`\`tsx
<Input placeholder="Enter text..." />
\`\`\`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | 'text' \| 'email' \| 'password' \| 'number' | 'text' | ❌ | Input 타입 |
| label | string | - | ❌ | 라벨 텍스트 |
| placeholder | string | - | ❌ | placeholder 텍스트 |
| error | string | - | ❌ | 에러 메시지 |
| helperText | string | - | ❌ | 도움말 텍스트 |
| disabled | boolean | false | ❌ | 비활성화 상태 |
| required | boolean | false | ❌ | 필수 입력 여부 |
| value | string | - | ❌ | Input 값 (제어 컴포넌트) |
| onChange | (e) => void | - | ❌ | 값 변경 핸들러 |

## 예제

### 라벨과 함께

\`\`\`tsx
<Input
  label="Email"
  type="email"
  placeholder="email@example.com"
/>
\`\`\`

### 에러 상태

\`\`\`tsx
<Input
  label="Email"
  type="email"
  value="invalid"
  error="Invalid email address"
/>
\`\`\`

### 도움말 텍스트

\`\`\`tsx
<Input
  label="Password"
  type="password"
  helperText="Must be at least 8 characters"
/>
\`\`\`

### 필수 입력

\`\`\`tsx
<Input
  label="Username"
  required
  placeholder="Enter username"
/>
\`\`\`

## 접근성

- 항상 `label`을 제공하거나 `aria-label` 사용
- 에러 메시지는 `aria-describedby`로 연결
- 필수 필드는 `required` 속성 및 시각적 표시

\`\`\`tsx
<Input
  label="Email"
  required
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
\`\`\`
```

## 문서 작성 체크리스트

- [ ] 컴포넌트 설명 (1-2문장)
- [ ] Import 예제
- [ ] 기본 사용법
- [ ] Props 테이블 (완전한)
- [ ] 모든 variants 문서화
- [ ] 실용적인 예제 5개 이상
- [ ] 접근성 섹션
- [ ] ARIA 속성 설명
- [ ] 키보드 네비게이션
- [ ] 디자인 가이드라인
- [ ] Do's and Don'ts
- [ ] 관련 컴포넌트 링크
