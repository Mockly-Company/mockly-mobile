import type { Meta, StoryObj } from '@storybook/react';

import { Indicator } from './Indicator';
import { tw } from '../../lib/tw';

const meta: Meta<typeof Indicator> = {
  title: '컴포넌트/Indicator',
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
      return <Story />;
    },
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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
};
