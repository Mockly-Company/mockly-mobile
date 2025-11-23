import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './Grid';
import { View } from 'react-native';
import { Text } from './Text';

const meta = {
  title: 'Design System/Layout/Grid',
  component: Grid,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    itemDimension: {
      control: 'number',
      description: 'Minimum width or height for each item',
    },
    spacing: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: 'Spacing between items',
    },
  },
  decorators: [
    Story => (
      <View style={{ padding: 20, width: 400, height: 600 }}>
        <Story />
      </View>
    ),
  ],
} as Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const GridItem = ({ label }: { label: string }) => (
  <View
    style={{
      backgroundColor: '#007AFF',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      height: 80,
    }}
  >
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
