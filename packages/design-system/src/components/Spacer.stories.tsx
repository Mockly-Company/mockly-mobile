import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from './Spacer';
import { View } from 'react-native';
import { Text } from './Text';

const meta = {
  title: 'Design System/Layout/Spacer',
  component: Spacer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: 'Spacer size',
    },
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Spacer direction',
    },
  },
  decorators: [
    Story => (
      <View style={{ padding: 20 }}>
        <Story />
      </View>
    ),
  ],
} as Meta<typeof Spacer>;

export default meta;
type Story = StoryObj<typeof meta>;

const BoxItem = ({ label }: { label: string }) => (
  <View style={{ backgroundColor: '#007AFF', padding: 16, borderRadius: 8 }}>
    <Text color="background">{label}</Text>
  </View>
);

export const VerticalSmall: Story = {
  args: {
    size: 'sm',
    direction: 'vertical',
  },
  render: args => (
    <View>
      <BoxItem label="Item 1" />
      <Spacer {...args} />
      <BoxItem label="Item 2" />
    </View>
  ),
};

export const VerticalMedium: Story = {
  args: {
    size: 'md',
    direction: 'vertical',
  },
  render: args => (
    <View>
      <BoxItem label="Item 1" />
      <Spacer {...args} />
      <BoxItem label="Item 2" />
    </View>
  ),
};

export const VerticalLarge: Story = {
  args: {
    size: 'xl',
    direction: 'vertical',
  },
  render: args => (
    <View>
      <BoxItem label="Item 1" />
      <Spacer {...args} />
      <BoxItem label="Item 2" />
    </View>
  ),
};

export const HorizontalSmall: Story = {
  args: {
    size: 'sm',
    direction: 'horizontal',
  },
  render: args => (
    <View style={{ flexDirection: 'row' }}>
      <BoxItem label="Item 1" />
      <Spacer {...args} />
      <BoxItem label="Item 2" />
    </View>
  ),
};

export const HorizontalMedium: Story = {
  args: {
    size: 'md',
    direction: 'horizontal',
  },
  render: args => (
    <View style={{ flexDirection: 'row' }}>
      <BoxItem label="Item 1" />
      <Spacer {...args} />
      <BoxItem label="Item 2" />
    </View>
  ),
};

export const HorizontalLarge: Story = {
  args: {
    size: 'xl',
    direction: 'horizontal',
  },
  render: args => (
    <View style={{ flexDirection: 'row' }}>
      <BoxItem label="Item 1" />
      <Spacer {...args} />
      <BoxItem label="Item 2" />
    </View>
  ),
};
