import type { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';
import { SlideOutAnimation } from './SlideOutAnimation';
import { tw } from '../../lib/tw';

const meta: Meta<typeof SlideOutAnimation> = {
  title: '애니메이션/SlideOutAnimation',
  component: SlideOutAnimation,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'SlideOutAnimation 컴포넌트의 방향, delay, springify 옵션을 조절해볼 수 있습니다.',
      },
    },
  },
  tags: ['!autodocs'],
};

export default meta;

type AnimationArgs = {
  direction: 'up' | 'down' | 'left' | 'right';
  delay: number;
  useSpring?: boolean;
  children: string;
  style?: object;
};

export const SlideOut: StoryObj<AnimationArgs> = {
  args: {
    direction: 'down',
    delay: 200,
    useSpring: true,
    children: 'Slide Out',
    style: {
      width: 120,
      height: 48,
      backgroundColor: '#F59E42',
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  argTypes: {
    direction: {
      control: { type: 'select', options: ['up', 'down', 'left', 'right'] },
    },
    delay: { control: { type: 'number', min: 0, max: 2000, step: 50 } },
    useSpring: { control: 'boolean' },
    children: { control: 'text' },
    style: { control: false },
  },
  render: ({ direction, delay, useSpring, children, style }) => (
    <SlideOutAnimation
      direction={direction}
      delay={delay}
      useSpring={useSpring}
      style={style}
      key={`${direction}-${delay}-${useSpring}`}
    >
      <Text style={tw`text-white dark:text-gray-100 text-xl font-bold`}>{children}</Text>
    </SlideOutAnimation>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'SlideOut(방향 선택) 애니메이션 예시. direction, delay, springify 옵션을 조절할 수 있습니다.',
      },
    },
  },
};
