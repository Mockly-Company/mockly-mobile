import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Text } from './Text';
import { View } from 'react-native';

const meta = {
  title: 'Design System/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled'],
      description: 'Card variant style',
    },
    padding: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: 'Card padding size',
    },
  },
  decorators: [
    Story => (
      <View style={{ padding: 20, width: 300 }}>
        <Story />
      </View>
    ),
  ],
} as Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    padding: 'md',
    children: (
      <View>
        <Text variant="h3">Card Title</Text>
        <Text variant="body">This is an elevated card with shadow effect.</Text>
      </View>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    padding: 'md',
    children: (
      <View>
        <Text variant="h3">Card Title</Text>
        <Text variant="body">This is an outlined card with border.</Text>
      </View>
    ),
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    padding: 'md',
    children: (
      <View>
        <Text variant="h3">Card Title</Text>
        <Text variant="body">This is a filled card with background color.</Text>
      </View>
    ),
  },
};

export const SmallPadding: Story = {
  args: {
    variant: 'elevated',
    padding: 'sm',
    children: (
      <View>
        <Text variant="h3">Small Padding</Text>
        <Text variant="body">Card with small padding.</Text>
      </View>
    ),
  },
};

export const LargePadding: Story = {
  args: {
    variant: 'elevated',
    padding: 'xl',
    children: (
      <View>
        <Text variant="h3">Large Padding</Text>
        <Text variant="body">Card with large padding.</Text>
      </View>
    ),
  },
};
