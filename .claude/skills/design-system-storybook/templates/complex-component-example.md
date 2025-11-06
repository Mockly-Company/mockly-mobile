# 복잡한 컴포넌트 예제

Modal, Dropdown, DataTable 같은 복잡한 컴포넌트의 Storybook stories와 문서 예제입니다.

## Modal 컴포넌트

### Modal.stories.tsx

\`\`\`typescript
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../Button';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    onClose: { action: 'closed' },
    onConfirm: { action: 'confirmed' },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper 컴포넌트 - 상태 관리
const ModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Modal Title',
    children: <p>Modal content goes here.</p>,
  },
};

export const WithFooter: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Confirm Action',
    children: <p>Are you sure you want to proceed?</p>,
    footer: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </>
    ),
  },
};

export const Small: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Small Modal',
    size: 'sm',
    children: <p>This is a small modal.</p>,
  },
};

export const Large: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Large Modal',
    size: 'lg',
    children: (
      <div>
        <p>This is a large modal with more content.</p>
        <p>It can contain multiple paragraphs and elements.</p>
      </div>
    ),
  },
};

export const FullScreen: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Full Screen Modal',
    size: 'full',
    children: (
      <div style={{ height: '80vh' }}>
        <p>Full screen modal content.</p>
      </div>
    ),
  },
};

export const WithForm: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Create Account',
    children: (
      <form>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
      </form>
    ),
    footer: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button variant="primary" type="submit">Create</Button>
      </>
    ),
  },
};

export const NonDismissible: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Important Notice',
    children: <p>You must read this before continuing.</p>,
    closeOnOverlayClick: false,
    showCloseButton: false,
    footer: <Button variant="primary">I Understand</Button>,
  },
};
\`\`\`

## Dropdown 컴포넌트

### Dropdown.stories.tsx

\`\`\`typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const menuItems = [
  { label: 'Profile', value: 'profile', icon: '👤' },
  { label: 'Settings', value: 'settings', icon: '⚙️' },
  { label: 'Help', value: 'help', icon: '❓' },
  { type: 'divider' },
  { label: 'Logout', value: 'logout', icon: '🚪', variant: 'danger' },
];

export const Default: Story = {
  args: {
    trigger: <button>Menu</button>,
    items: menuItems,
  },
};

export const WithSections: Story = {
  args: {
    trigger: <button>Actions</button>,
    items: [
      { label: 'Edit', value: 'edit', section: 'Modify' },
      { label: 'Duplicate', value: 'duplicate', section: 'Modify' },
      { type: 'divider' },
      { label: 'Archive', value: 'archive', section: 'Manage' },
      { label: 'Delete', value: 'delete', section: 'Manage', variant: 'danger' },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    trigger: <button>📁 File</button>,
    items: [
      { label: 'New File', value: 'new', icon: '📄', shortcut: 'Ctrl+N' },
      { label: 'Open', value: 'open', icon: '📂', shortcut: 'Ctrl+O' },
      { label: 'Save', value: 'save', icon: '💾', shortcut: 'Ctrl+S' },
      { type: 'divider' },
      { label: 'Export', value: 'export', icon: '📤' },
      { label: 'Print', value: 'print', icon: '🖨️', shortcut: 'Ctrl+P' },
    ],
  },
};

export const Disabled: Story = {
  args: {
    trigger: <button>Disabled Menu</button>,
    items: [
      { label: 'Available', value: 'available' },
      { label: 'Disabled', value: 'disabled', disabled: true },
      { label: 'Also Disabled', value: 'disabled2', disabled: true },
    ],
  },
};

export const Placement: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', padding: '4rem' }}>
      <Dropdown trigger={<button>Top</button>} items={menuItems} placement="top" />
      <Dropdown trigger={<button>Top Start</button>} items={menuItems} placement="top-start" />
      <Dropdown trigger={<button>Top End</button>} items={menuItems} placement="top-end" />
      <Dropdown trigger={<button>Bottom</button>} items={menuItems} placement="bottom" />
      <Dropdown trigger={<button>Bottom Start</button>} items={menuItems} placement="bottom-start" />
      <Dropdown trigger={<button>Bottom End</button>} items={menuItems} placement="bottom-end" />
      <Dropdown trigger={<button>Left</button>} items={menuItems} placement="left" />
      <Dropdown trigger={<button>Right</button>} items={menuItems} placement="right" />
    </div>
  ),
};
\`\`\`

## DataTable 컴포넌트

### DataTable.stories.tsx

\`\`\`typescript
import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';

const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const columns = [
  { key: 'id', header: 'ID', width: '60px' },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: (value: string) => (
      <span style={{
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        backgroundColor: value === 'active' ? '#d4edda' : '#f8d7da',
        color: value === 'active' ? '#155724' : '#721c24',
      }}>
        {value}
      </span>
    ),
  },
];

const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Editor', status: 'active' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'active' },
];

export const Default: Story = {
  args: {
    columns,
    data,
  },
};

export const WithSelection: Story = {
  args: {
    columns,
    data,
    selectable: true,
    onSelectionChange: (selectedRows) => console.log('Selected:', selectedRows),
  },
};

export const WithPagination: Story = {
  args: {
    columns,
    data: Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: \`User \${i + 1}\`,
      email: \`user\${i + 1}@example.com\`,
      role: ['Admin', 'User', 'Editor'][i % 3],
      status: i % 3 === 0 ? 'inactive' : 'active',
    })),
    pagination: true,
    pageSize: 10,
  },
};

export const WithActions: Story = {
  args: {
    columns: [
      ...columns,
      {
        key: 'actions',
        header: 'Actions',
        render: (_, row: User) => (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => console.log('Edit', row)}>Edit</button>
            <button onClick={() => console.log('Delete', row)}>Delete</button>
          </div>
        ),
      },
    ],
    data,
  },
};

export const Loading: Story = {
  args: {
    columns,
    data: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    columns,
    data: [],
    emptyMessage: 'No users found',
  },
};

export const Striped: Story = {
  args: {
    columns,
    data,
    striped: true,
  },
};

export const Compact: Story = {
  args: {
    columns,
    data,
    density: 'compact',
  },
};

export const Comfortable: Story = {
  args: {
    columns,
    data,
    density: 'comfortable',
  },
};
\`\`\`

## Tabs 컴포넌트

### Tabs.stories.tsx

\`\`\`typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const tabs = [
  {
    id: 'tab1',
    label: 'Profile',
    content: <div>Profile content</div>,
  },
  {
    id: 'tab2',
    label: 'Settings',
    content: <div>Settings content</div>,
  },
  {
    id: 'tab3',
    label: 'Notifications',
    content: <div>Notifications content</div>,
    badge: 5,
  },
];

export const Default: Story = {
  args: {
    tabs,
  },
};

export const WithIcons: Story = {
  args: {
    tabs: [
      { id: 'profile', label: '👤 Profile', content: <div>Profile</div> },
      { id: 'settings', label: '⚙️ Settings', content: <div>Settings</div> },
      { id: 'help', label: '❓ Help', content: <div>Help</div> },
    ],
  },
};

export const Vertical: Story = {
  args: {
    tabs,
    orientation: 'vertical',
  },
};

export const FullWidth: Story = {
  args: {
    tabs,
    variant: 'fullwidth',
  },
};

export const Pills: Story = {
  args: {
    tabs,
    variant: 'pills',
  },
};
\`\`\`

## 복잡한 컴포넌트 문서화 팁

1. **상태 관리 예제 포함**: useState를 사용한 실제 사용 예제
2. **다양한 시나리오**: 최소 5-7개의 다른 사용 사례
3. **Wrapper 컴포넌트**: 상태가 필요한 컴포넌트는 wrapper로 감싸기
4. **Render 함수 활용**: 복잡한 레이아웃은 render 함수 사용
5. **실제 데이터**: 의미 있는 실제 데이터 사용
6. **Actions 로깅**: 모든 이벤트 핸들러에 action 추가
7. **접근성 테스트**: a11y addon으로 검증
