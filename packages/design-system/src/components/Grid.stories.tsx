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
    columns: {
      control: 'number',
      description: 'Number of columns',
    },
    spacing: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: 'Spacing between items',
    },
  },
  decorators: [
    Story => (
      <View style={{ padding: 20, width: 400 }}>
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
    }}
  >
    <Text color="background">{label}</Text>
  </View>
);

export const TwoColumns: Story = {
  args: {
    columns: 2,
    spacing: 'md',
    children: (
      <>
        <GridItem label="Item 1" />
        <GridItem label="Item 2" />
        <GridItem label="Item 3" />
        <GridItem label="Item 4" />
      </>
    ),
  },
};

export const ThreeColumns: Story = {
  args: {
    columns: 3,
    spacing: 'md',
    children: (
      <>
        <GridItem label="Item 1" />
        <GridItem label="Item 2" />
        <GridItem label="Item 3" />
        <GridItem label="Item 4" />
        <GridItem label="Item 5" />
        <GridItem label="Item 6" />
      </>
    ),
  },
};

export const FourColumns: Story = {
  args: {
    columns: 4,
    spacing: 'md',
    children: (
      <>
        <GridItem label="1" />
        <GridItem label="2" />
        <GridItem label="3" />
        <GridItem label="4" />
        <GridItem label="5" />
        <GridItem label="6" />
        <GridItem label="7" />
        <GridItem label="8" />
      </>
    ),
  },
};

export const SmallSpacing: Story = {
  args: {
    columns: 2,
    spacing: 'xs',
    children: (
      <>
        <GridItem label="Item 1" />
        <GridItem label="Item 2" />
        <GridItem label="Item 3" />
        <GridItem label="Item 4" />
      </>
    ),
  },
};

export const LargeSpacing: Story = {
  args: {
    columns: 2,
    spacing: 'xl',
    children: (
      <>
        <GridItem label="Item 1" />
        <GridItem label="Item 2" />
        <GridItem label="Item 3" />
        <GridItem label="Item 4" />
      </>
    ),
  },
};
