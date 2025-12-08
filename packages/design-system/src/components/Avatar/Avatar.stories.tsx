import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Avatar } from './Avatar';
import { tw } from '../../lib/tw';

const meta: Meta<typeof Avatar> = {
  title: '컴포넌트/Avatar',
  component: Avatar,
  decorators: [Story => <Story />],
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    fallbackText: {
      control: { type: 'text' },
    },
    uri: {
      control: { type: 'text' },
    },
    variant: {
      control: { type: 'radio' },
      options: ['circle'],
    },
  },
  args: {
    size: 'md',
    fallbackText: '🙂',
    uri: '',
    variant: 'circle',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fallbackText: '🙂',
  },
};

export const WithImage: Story = {
  args: {
    uri: 'https://i.pravatar.cc/150?img=1',
  },
};

export const WithFallbackText: Story = {
  args: {
    fallbackText: 'AB',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    fallbackText: '🙂',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    fallbackText: '🙂',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    fallbackText: '🙂',
  },
};

export const Sizes: Story = {
  render: () => (
    <View style={tw`flex-row gap-4 items-center`}>
      <Avatar size="sm" fallbackText="S" />
      <Avatar size="md" fallbackText="M" />
      <Avatar size="lg" fallbackText="L" />
    </View>
  ),
};

export const WithImages: Story = {
  render: () => (
    <View style={tw`flex-row gap-4 items-center`}>
      <Avatar size="sm" uri="https://i.pravatar.cc/150?img=1" />
      <Avatar size="md" uri="https://i.pravatar.cc/150?img=2" />
      <Avatar size="lg" uri="https://i.pravatar.cc/150?img=3" />
    </View>
  ),
};
