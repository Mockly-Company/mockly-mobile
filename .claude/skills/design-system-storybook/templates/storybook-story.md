# Storybook Story Template

이 템플릿은 디자인 시스템 컴포넌트의 Storybook stories 파일을 생성할 때 사용합니다.

## 기본 구조

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { {ComponentName} } from './{ComponentName}';

const meta = {
  title: '{Category}/{ComponentName}',
  component: {ComponentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Props에 따라 자동 생성
  },
} satisfies Meta<typeof {ComponentName}>;

export default meta;
type Story = StoryObj<typeof meta>;

// Stories 정의
export const Default: Story = {
  args: {
    // 기본 props
  },
};
```

## 전체 예제: Button 컴포넌트

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: '버튼의 시각적 스타일',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '버튼 크기',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 Story
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

// Variant Stories
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
};

// Size Stories
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

// State Stories
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading...',
    disabled: true,
    // loading prop이 있다면 추가
  },
};

// Icon과 함께 사용
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span>🚀</span> Button with Icon
      </>
    ),
  },
};

// Interactive Story - 모든 controls 활성화
export const Interactive: Story = {
  args: {
    children: 'Interactive Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
};

// 여러 버튼을 함께 보여주는 Story
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// Accessibility Story
export const Accessibility: Story = {
  args: {
    children: 'Accessible Button',
    'aria-label': 'Accessible button example',
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};
```

## Form 컴포넌트 예제

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
    },
    error: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email',
    placeholder: 'email@example.com',
    type: 'email',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'email@example.com',
    error: 'Invalid email address',
    value: 'invalid-email',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot edit',
    disabled: true,
  },
};
```

## Card 컴포넌트 예제

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <h3>Card Title</h3>
        <p>Card content goes here.</p>
      </>
    ),
  },
};

export const WithHeader: Story = {
  args: {
    header: <h2>Card Header</h2>,
    children: <p>Card body content</p>,
    footer: <button>Action</button>,
  },
};

export const Elevated: Story = {
  args: {
    elevation: 'high',
    children: (
      <>
        <h3>Elevated Card</h3>
        <p>This card has higher elevation.</p>
      </>
    ),
  },
};
```

## ArgTypes 패턴

```typescript
// Enum/Union 타입
variant: {
  control: 'select',
  options: ['primary', 'secondary', 'tertiary'],
  description: '컴포넌트 variant',
  table: {
    type: { summary: 'primary | secondary | tertiary' },
    defaultValue: { summary: 'primary' },
  },
},

// Boolean
disabled: {
  control: 'boolean',
  description: '비활성화 여부',
},

// Number with range
spacing: {
  control: { type: 'range', min: 0, max: 10, step: 1 },
  description: '간격',
},

// Color
backgroundColor: {
  control: 'color',
  description: '배경색',
},

// Object
style: {
  control: 'object',
  description: '커스텀 스타일',
},

// Function (action)
onClick: {
  action: 'clicked',
  description: '클릭 핸들러',
},

// Children (disable control)
children: {
  control: false,
  description: '자식 요소',
},
```

## Decorators 사용

```typescript
// 전역 decorator
const meta = {
  title: 'Components/Button',
  component: Button,
  decorators: [
    (Story) => (
      <div style={{ padding: '3rem', backgroundColor: '#f5f5f5' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

// Story별 decorator
export const WithCustomBackground: Story = {
  args: {
    children: 'Custom Background',
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: 'navy', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};
```

## Play Function (Interaction Testing)

```typescript
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export const InteractiveTest: Story = {
  args: {
    children: 'Click Me',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
  },
};
```

## 생성 시 체크리스트

- [ ] Meta 정보 완전히 설정 (title, component, tags)
- [ ] ArgTypes로 모든 props 문서화
- [ ] Default story 포함
- [ ] 모든 variants에 대한 story 포함
- [ ] 모든 sizes에 대한 story 포함
- [ ] Disabled, Loading 등 state stories 포함
- [ ] Interactive story (모든 controls 활성화)
- [ ] AllVariants story (한눈에 보기)
- [ ] Accessibility story (a11y 테스트)
- [ ] Actions 설정 (onClick 등)
- [ ] 적절한 parameters (layout 등)
