import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from './Spacer';
import { View } from 'react-native';
import { Text } from '../../components/Text';
import { tw } from '../../lib/tw';

const meta = {
  title: 'Layout/Spacer',
  component: Spacer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
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
      <View style={tw`p-5 bg-white dark:bg-gray-900`}>
        <Story />
      </View>
    ),
  ],
} as Meta<typeof Spacer>;

export default meta;
type Story = StoryObj<typeof meta>;

const BoxItem = ({ label }: { label: string }) => (
  <View style={tw`bg-blue-600 dark:bg-blue-500 p-4 rounded-lg`}>
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
    <View style={tw`flex-row`}>
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
    <View style={tw`flex-row`}>
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
    <View style={tw`flex-row`}>
      <BoxItem label="Item 1" />
      <Spacer {...args} />
      <BoxItem label="Item 2" />
    </View>
  ),
};
