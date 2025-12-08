import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Text } from '../Text';
import { View } from 'react-native';

const meta = {
  title: '컴포넌트/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled', 'gradient', 'transparent'],
      description: 'Card variant style',
    },
    padding: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Card padding size',
    },
    gradientColors: {
      control: 'object',
      description: 'Gradient colors (for gradient variant)',
    },
    gradientStart: {
      control: 'object',
      description: 'Gradient start point',
    },
    gradientEnd: {
      control: 'object',
      description: 'Gradient end point',
    },
  },
  decorators: [Story => <Story />],
} as Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    padding: 'md',
    children: (
      <View>
        <Text variant="h3" color="text">
          Card Title
        </Text>
        <Text variant="body" color="secondary">
          This is an elevated card with shadow effect.
        </Text>
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
        <Text variant="h3" color="text">
          Card Title
        </Text>
        <Text variant="body" color="secondary">
          This is an outlined card with border.
        </Text>
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
        <Text variant="h3" color="text">
          Card Title
        </Text>
        <Text variant="body" color="secondary">
          This is a filled card with background color.
        </Text>
      </View>
    ),
  },
};

export const Gradient: Story = {
  args: {
    variant: 'gradient',
    padding: 'md',
    gradientColors: ['#6EE7B7', '#3B82F6'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 0 },
    children: (
      <View>
        <Text variant="h3" color="text">
          Gradient Card
        </Text>
        <Text variant="body" color="secondary">
          This card uses a linear gradient background.
        </Text>
      </View>
    ),
  },
};

export const Transparent: Story = {
  args: {
    variant: 'transparent',
    padding: 'md',
    children: (
      <View>
        <Text variant="h3" color="text">
          Transparent Card
        </Text>
        <Text variant="body" color="secondary">
          This card has a transparent background and border.
        </Text>
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
        <Text variant="h3" color="text">
          Small Padding
        </Text>
        <Text variant="body" color="secondary">
          Card with small padding.
        </Text>
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
        <Text variant="h3" color="text">
          Large Padding
        </Text>
        <Text variant="body" color="secondary">
          Card with large padding.
        </Text>
      </View>
    ),
  },
};
