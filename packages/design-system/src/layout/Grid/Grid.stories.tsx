import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './Grid';
import { View } from 'react-native';
import { Text } from '../../components/Text';
import { tw } from '../../lib/tw';
// import { fn } from 'storybook/test';
const meta = {
  title: 'Layout/Grid',
  component: Grid,
  parameters: {
    layout: 'centered',
  },
  args: {
    itemDimension: 130,
    spacing: 'md',
    onItemsPerRowChange: () => {},
  },
  tags: ['autodocs'],
  argTypes: {
    itemDimension: {
      control: 'number',
      description: 'Minimum width or height for each item',
    },
    spacing: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Spacing between items',
    },
  },
  decorators: [
    Story => (
      <View style={tw`p-5 w-100 h-150 bg-white dark:bg-gray-900`}>
        <Story />
      </View>
    ),
  ],
} as Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const GridItem = ({ label }: { label: string }) => (
  <View style={tw`bg-blue-600 dark:bg-blue-500 p-4 rounded-lg items-center justify-center h-20`}>
    <Text color="background">{label}</Text>
  </View>
);

const gridData = [
  { id: '1', label: 'Item 1' },
  { id: '2', label: 'Item 2' },
  { id: '3', label: 'Item 3' },
  { id: '4', label: 'Item 4' },
  { id: '5', label: 'Item 5' },
  { id: '6', label: 'Item 6' },
];

export const TwoColumns: Story = {
  args: {
    itemDimension: 130,
    data: gridData.slice(0, 4),
    spacing: 'md',
    renderItem: ({ item }: any) => <GridItem label={item.label} />,
  },
};

export const ThreeColumns: Story = {
  args: {
    itemDimension: 80,
    data: gridData,
    spacing: 'md',
    renderItem: ({ item }: any) => <GridItem label={item.label} />,
  },
};

export const SmallSpacing: Story = {
  args: {
    itemDimension: 130,
    data: gridData.slice(0, 4),
    spacing: 'xs',
    renderItem: ({ item }: any) => <GridItem label={item.label} />,
  },
};

export const LargeSpacing: Story = {
  args: {
    itemDimension: 130,
    data: gridData.slice(0, 4),
    spacing: 'xl',
    renderItem: ({ item }: any) => <GridItem label={item.label} />,
  },
};
