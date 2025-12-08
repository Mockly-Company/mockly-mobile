import type { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';
import { ScaleOutAnimation } from './ScaleOutAnimation';
import { tw } from '../../lib/tw';

const meta: Meta<typeof ScaleOutAnimation> = {
  title: '애니메이션/ScaleOutAnimation',
  component: ScaleOutAnimation,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ScaleOutAnimation(ZoomOut) 컴포넌트의 delay, springify 옵션을 조절해볼 수 있습니다.',
      },
    },
  },
  tags: ['!autodocs'],
};

export default meta;

type AnimationArgs = {
  delay: number;
  useSpring?: boolean;
  children: string;
  style?: object;
};

export const ScaleOut: StoryObj<AnimationArgs> = {
  args: {
    delay: 200,
    useSpring: true,
    children: 'Scale Out',
    style: {
      width: 120,
      height: 48,
      backgroundColor: '#A21CAF',
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  argTypes: {
    delay: { control: { type: 'number', min: 0, max: 2000, step: 50 } },
    useSpring: { control: 'boolean' },
    children: { control: 'text' },
    style: { control: false },
  },
  render: ({ delay, useSpring, children, style }) => (
    <ScaleOutAnimation
      delay={delay}
      useSpring={useSpring}
      style={style}
      key={`${delay}-${useSpring}`}
    >
      <Text style={tw`text-white dark:text-gray-100 text-xl font-bold`}>{children}</Text>
    </ScaleOutAnimation>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ScaleOut(ZoomOut) 애니메이션 예시. delay, springify 옵션을 조절할 수 있습니다.',
      },
    },
  },
};
