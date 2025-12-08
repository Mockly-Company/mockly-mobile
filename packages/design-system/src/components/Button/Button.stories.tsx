import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: '컴포넌트/Button',
  component: (props: Parameters<typeof Button>[0]) => (
    <Button {...props}>
      <Button.Text>Button</Button.Text>
    </Button>
  ),
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'outline'],
      description: 'Button variant style',
    },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
  decorators: [Story => <Story />],
} as Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Disabled Button',
    disabled: true,
  },
};
