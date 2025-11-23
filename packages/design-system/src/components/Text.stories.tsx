import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';
import { View } from 'react-native';

const meta = {
  title: 'Design System/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'body', 'caption'],
      description: 'Text variant/style',
    },
    color: {
      control: 'select',
      options: ['text', 'textSecondary', 'primary', 'secondary', 'error'],
      description: 'Text color',
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
      description: 'Font weight',
    },
    children: {
      control: 'text',
      description: 'Text content',
    },
  },
  decorators: [
    Story => (
      <View style={{ padding: 20 }}>
        <Story />
      </View>
    ),
  ],
} as Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading1: Story = {
  args: {
    variant: 'h1',
    children: 'Heading 1',
  },
};

export const Heading2: Story = {
  args: {
    variant: 'h2',
    children: 'Heading 2',
  },
};

export const Heading3: Story = {
  args: {
    variant: 'h3',
    children: 'Heading 3',
  },
};

export const Body: Story = {
  args: {
    variant: 'body',
    children: 'This is body text. It is used for most content in the application.',
  },
};

export const Caption: Story = {
  args: {
    variant: 'caption',
    children: 'This is caption text. It is used for small notes and labels.',
  },
};

export const ColorVariants: Story = {
  render: () => (
    <View style={{ gap: 10 }}>
      <Text color="text">Default text color</Text>
      <Text color="textSecondary">Secondary text color</Text>
      <Text color="primary">Primary color</Text>
      <Text color="secondary">Secondary color</Text>
      <Text color="error">Error color</Text>
    </View>
  ),
};

export const WeightVariants: Story = {
  render: () => (
    <View style={{ gap: 10 }}>
      <Text weight="normal">normal weight</Text>
      <Text weight="medium">Medium weight</Text>
      <Text weight="semibold">Semibold weight</Text>
      <Text weight="bold">Bold weight</Text>
    </View>
  ),
};
