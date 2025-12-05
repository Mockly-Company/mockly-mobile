import type {Meta, StoryObj} from '@storybook/react';
import {tw} from '@mockly/design-system';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useState, ComponentType} from 'react';

/* global setTimeout */

import {
  FadeInAnimation,
  FadeOutAnimation,
  ScaleInAnimation,
  ScaleOutAnimation,
  SlideInAnimation,
  SlideOutAnimation,
} from '@mockly/design-system';

type ExampleProps = Record<string, any> & {style?: object};
const makeExample = (
  AnimationComp: ComponentType<any>,
  viewProps: Omit<ExampleProps, 'style'>,
  text: string,
) => {
  const Example = () => {
    const [show, setShow] = useState(true);
    const [key, setKey] = useState(0);
    const handleToggle = () => {
      if (show) {
        setShow(false);
        setTimeout(() => {
          setKey(k => k + 1);
          setShow(true);
        }, 400);
      } else {
        setKey(k => k + 1);
        setShow(true);
      }
    };
    return (
      <View style={tw`items-center`}>
        <TouchableOpacity
          onPress={handleToggle}
          style={tw`mb-2 px-3 py-1 bg-secondary dark:bg-primary rounded-lg`}>
          <Text style={tw`text-gray-900 dark:text-white`}>보기</Text>
        </TouchableOpacity>
        {show && (
          <AnimationComp key={key} {...viewProps}>
            <View style={tw`w-20 h-8 rounded-lg items-center justify-center`}>
              <Text style={tw`text-text dark:text-text-dark font-bold`}>
                {text}
              </Text>
            </View>
          </AnimationComp>
        )}
      </View>
    );
  };
  Example.displayName = `${text}Example`;
  return Example;
};

const animationTokens = [
  {
    name: 'Fade In',
    value: 'fadeIn',
    description: '컴포넌트가 점진적으로 나타날 때 사용. 자연스러운 등장 효과.',
    Example: makeExample(
      FadeInAnimation,
      {direction: 'default', delay: 300},
      'Fade In',
    ),
  },
  {
    name: 'Fade Out',
    value: 'fadeOut',
    description: '컴포넌트가 점진적으로 사라질 때 사용. 부드러운 퇴장 효과.',
    Example: makeExample(
      FadeOutAnimation,
      {direction: 'default', delay: 0},
      'Fade Out',
    ),
  },
  {
    name: 'Slide In',
    value: 'slideIn',
    description: '슬라이드로 등장(방향 지정 가능). 모달, 알림, 드롭다운 등.',
    Example: makeExample(
      SlideInAnimation,
      {direction: 'up', delay: 300},
      'Slide In',
    ),
  },
  {
    name: 'Slide Out',
    value: 'slideOut',
    description: '슬라이드로 퇴장(방향 지정 가능). 팝오버, 알림 등.',
    Example: makeExample(
      SlideOutAnimation,
      {direction: 'down', delay: 0},
      'Slide Out',
    ),
  },
  {
    name: 'Scale In',
    value: 'scaleIn',
    description: '작게 시작해 점점 커지며 등장. 버튼, 카드 등.',
    Example: makeExample(ScaleInAnimation, {delay: 300}, 'Scale In'),
  },
  {
    name: 'Scale Out',
    value: 'scaleOut',
    description: '크게 시작해 점점 작아지며 사라짐. 강조 해제 등.',
    Example: makeExample(ScaleOutAnimation, {delay: 0}, 'Scale Out'),
  },
];

const AnimationOverview = () => (
  <ScrollView style={tw`p-8 bg-white dark:bg-gray-900`}>
    <Text style={tw`text-2xl font-bold mb-4 text-gray-900 dark:text-white`}>
      Animation
    </Text>
    <Text style={tw`text-base text-gray-700 dark:text-gray-300 mb-6`}>
      디자인 시스템의 애니메이션 토큰은 사용자 경험을 부드럽고 직관적으로
      만듭니다. 주요 등장/퇴장, 슬라이드, 스케일 효과를 토큰화하여 일관된
      인터랙션을 제공합니다.
    </Text>
    <View style={tw`mb-8`}>
      {animationTokens.map(token => (
        <View key={token.value} style={tw`mb-7 flex-row items-center`}>
          <View style={tw`flex-1`}>
            <Text
              style={tw`text-lg font-bold mb-1 text-gray-900 dark:text-white`}>
              {token.name}
            </Text>
            <Text style={tw`text-sm text-gray-500 dark:text-gray-400 mb-1`}>
              {token.value}
            </Text>
            <Text style={tw`text-xs text-gray-400 dark:text-gray-500 mb-1`}>
              {token.description}
            </Text>
          </View>
          <View style={tw`w-30 items-center`}>
            {token.Example ? <token.Example /> : null}
          </View>
        </View>
      ))}
    </View>
    <Text style={tw`text-sm text-gray-700 dark:text-gray-300 mt-6`}>
      애니메이션은 사용자의 시선을 유도하고, 상태 변화를 자연스럽게 전달합니다.
      각 토큰을 상황에 맞게 활용해 일관된 UX를 구현하세요.
    </Text>
  </ScrollView>
);

const meta: Meta<typeof AnimationOverview> = {
  title: 'Animations/애니메이션 소개',
  component: AnimationOverview,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '디자인 시스템의 주요 애니메이션 토큰과 사용 가이드, 효과 설명을 한눈에 볼 수 있는 Animation 개요입니다.',
      },
    },
  },
  tags: ['!autodocs'],
};

export default meta;
type Story = StoryObj<typeof AnimationOverview>;
export const 애니메이션_소개: Story = {
  render: () => <AnimationOverview />,
};
