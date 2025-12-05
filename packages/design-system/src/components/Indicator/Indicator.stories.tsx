import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Indicator } from './Indicator';
import { tw } from '../../lib/tw';

const meta: Meta<typeof Indicator> = {
  title: 'Components/Indicator',
  component: Indicator,
  args: {
    count: 4,
    currentIndex: 0,
  },
  argTypes: {
    count: {
      control: 'number',
    },
    currentIndex: {
      control: 'number',
    },
  },
  decorators: [
    Story => {
      return (
        <View>
          <Story />
        </View>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Bars: Story = {
  render: ({ currentIndex, count }) => (
    <Indicator count={count} currentIndex={currentIndex}>
      <Indicator.Container style={tw`gap-3 mx-auto min-w-40 `}>
        {Array.from({ length: count }).map((_, idx) => (
          <Indicator.Bar key={idx} active={idx === currentIndex} />
        ))}
      </Indicator.Container>
    </Indicator>
  ),
  parameters: {
    docs: {
      description: {
        story: '',
      },
    },
  },
};
export const Dots: Story = {
  render: ({ currentIndex, count }) => (
    <Indicator count={count} currentIndex={currentIndex}>
      <Indicator.Container style={tw`gap-3 mx-auto min-w-40 `}>
        {Array.from({ length: count }).map((_, idx) => (
          <Indicator.Dot key={idx} active={idx === currentIndex} />
        ))}
      </Indicator.Container>
    </Indicator>
  ),
  parameters: {
    docs: {
      description: {
        story: '',
      },
    },
  },
};
