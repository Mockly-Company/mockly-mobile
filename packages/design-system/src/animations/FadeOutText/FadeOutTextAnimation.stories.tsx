import type { Meta, StoryObj } from '@storybook/react';
import { FadeOutTextAnimation } from './FadeOutTextAnimation';
import { tw } from '../../lib/tw';

const meta: Meta = {
  title: '애니메이션/FadeOutTextAnimation',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'FadeOutTextAnimation 컴포넌트의 방향, delay, springify 옵션을 조절해볼 수 있습니다.',
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

export const FadeOutText: StoryObj<AnimationArgs> = {
  args: {
    direction: 'left',
    delay: 200,
    useSpring: true,
    children: 'Fade Out Text',
    style: tw`text-red-600 dark:text-red-400 text-3xl font-bold text-center m-4`,
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
    <FadeOutTextAnimation
      direction={direction}
      delay={delay}
      style={style}
      useSpring={useSpring}
      key={`${direction}-${delay}-${useSpring}`}
    >
      {children}
    </FadeOutTextAnimation>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '텍스트에 다양한 방향, delay, springify 옵션으로 FadeOut 애니메이션을 적용할 수 있습니다.',
      },
    },
  },
};
