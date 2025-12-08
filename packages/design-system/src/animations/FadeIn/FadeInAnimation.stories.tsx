import type { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';
import { FadeInAnimation } from './FadeInAnimation';

const meta: Meta = {
  title: '애니메이션/FadeInAnimation',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'FadeInAnimation 컴포넌트의 방향, delay, springify 옵션을 조절해볼 수 있습니다.',
      },
    },
  },
  tags: ['!autodocs'],
};

export default meta;

type AnimationArgs = {
  direction: 'up' | 'down' | 'left' | 'right' | 'default';
  delay: number;
  useSpring?: boolean;
  children: string;
  style?: object;
};

export const FadeIn: StoryObj<AnimationArgs> = {
  args: {
    direction: 'down',
    delay: 200,
    useSpring: true,
    children: 'Fade In Animation',
    style: {
      width: 200,
      height: 80,
      backgroundColor: '#22C55E',
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  argTypes: {
    direction: {
      control: { type: 'radio' },
      options: ['up', 'down', 'left', 'right', 'default'],
    },
    delay: { control: { type: 'number', min: 0, max: 2000, step: 50 } },
    useSpring: { control: 'boolean' },
    children: { control: 'text' },
    style: { control: false },
  },
  render: ({ direction, delay, useSpring, children, style }) => (
    <FadeInAnimation
      direction={direction}
      delay={delay}
      style={style}
      useSpring={useSpring}
      key={`${direction}-${delay}-${useSpring}`}
    >
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>{children}</Text>
    </FadeInAnimation>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '방향, delay, springify 옵션을 조절해 다양한 FadeIn 애니메이션을 확인할 수 있습니다.',
      },
    },
  },
};
