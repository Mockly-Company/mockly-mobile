import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Badge } from './Badge';
import { tw } from '../../lib/tw';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  decorators: [
    Story => (
      <View style={tw`flex-1 items-center justify-center p-4 bg-white dark:bg-zinc-950`}>
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Soft: Story = {
  render: () => (
    <View style={tw`flex-row gap-2 flex-wrap`}>
      <Badge variant="soft" color="primary">
        Primary
      </Badge>
      <Badge variant="soft" color="success">
        Success
      </Badge>
      <Badge variant="soft" color="warning">
        Warning
      </Badge>
      <Badge variant="soft" color="neutral">
        Neutral
      </Badge>
    </View>
  ),
};

export const Solid: Story = {
  render: () => (
    <View style={tw`flex-row gap-2 flex-wrap`}>
      <Badge variant="solid" color="primary">
        Primary
      </Badge>
      <Badge variant="solid" color="success">
        Success
      </Badge>
      <Badge variant="solid" color="warning">
        Warning
      </Badge>
      <Badge variant="solid" color="neutral">
        Neutral
      </Badge>
    </View>
  ),
};

export const Outline: Story = {
  render: () => (
    <View style={tw`flex-row gap-2 flex-wrap`}>
      <Badge variant="outline" color="primary">
        Primary
      </Badge>
      <Badge variant="outline" color="success">
        Success
      </Badge>
      <Badge variant="outline" color="warning">
        Warning
      </Badge>
      <Badge variant="outline" color="neutral">
        Neutral
      </Badge>
    </View>
  ),
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Badge',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Badge',
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={tw`gap-4`}>
      <View style={tw`gap-2`}>
        <Badge variant="soft" color="primary" size="sm">
          Soft Primary SM
        </Badge>
        <Badge variant="soft" color="primary" size="md">
          Soft Primary MD
        </Badge>
      </View>
      <View style={tw`gap-2`}>
        <Badge variant="solid" color="success" size="sm">
          Solid Success SM
        </Badge>
        <Badge variant="solid" color="success" size="md">
          Solid Success MD
        </Badge>
      </View>
      <View style={tw`gap-2`}>
        <Badge variant="outline" color="warning" size="sm">
          Outline Warning SM
        </Badge>
        <Badge variant="outline" color="warning" size="md">
          Outline Warning MD
        </Badge>
      </View>
    </View>
  ),
};
