import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';
import { View } from 'react-native';
import { Text } from '../../components/Text';
import { tw } from '../../lib/tw';

const meta = {
  title: '레이아웃/Stack',
  component: Stack,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Stack direction',
    },
    spacing: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Spacing between items',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Alignment of items',
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      description: 'Justification of items',
    },
  },
  decorators: [
    Story => (
      <View style={tw`p-5 bg-white dark:bg-gray-900`}>
        <Story />
      </View>
    ),
  ],
} as Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const BoxItem = ({ label }: { label: string }) => (
  <View style={tw`bg-blue-600 dark:bg-blue-500 p-4 rounded-lg`}>
    <Text color="background">{label}</Text>
  </View>
);

export const Vertical: Story = {
  args: {
    direction: 'vertical',
    spacing: 'md',
    children: (
      <>
        <BoxItem label="Item 1" />
        <BoxItem label="Item 2" />
        <BoxItem label="Item 3" />
      </>
    ),
  },
};

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    spacing: 'md',
    children: (
      <>
        <BoxItem label="Item 1" />
        <BoxItem label="Item 2" />
        <BoxItem label="Item 3" />
      </>
    ),
  },
};

export const CenterAligned: Story = {
  args: {
    direction: 'vertical',
    spacing: 'md',
    align: 'center',
    children: (
      <>
        <BoxItem label="Item 1" />
        <BoxItem label="Item 2" />
        <BoxItem label="Item 3" />
      </>
    ),
  },
};

export const SpaceBetween: Story = {
  args: {
    direction: 'horizontal',
    spacing: 'md',
    justify: 'between',
    children: (
      <>
        <BoxItem label="Item 1" />
        <BoxItem label="Item 2" />
        <BoxItem label="Item 3" />
      </>
    ),
  },
};

export const SmallSpacing: Story = {
  args: {
    direction: 'vertical',
    spacing: 'xs',
    children: (
      <>
        <BoxItem label="Item 1" />
        <BoxItem label="Item 2" />
        <BoxItem label="Item 3" />
      </>
    ),
  },
};

export const LargeSpacing: Story = {
  args: {
    direction: 'vertical',
    spacing: 'xl',
    children: (
      <>
        <BoxItem label="Item 1" />
        <BoxItem label="Item 2" />
        <BoxItem label="Item 3" />
      </>
    ),
  },
};
