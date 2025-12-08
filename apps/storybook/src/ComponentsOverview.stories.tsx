import type {Meta, StoryObj} from '@storybook/react';
import {ScrollView, View} from 'react-native';
import {
  Button,
  Input,
  Indicator,
  Text,
  Card,
  Carousel,
  Icon,
  tw,
} from '@mockly/design-system';

import {useSharedValue} from 'react-native-reanimated';
const components = [
  {
    name: 'Card',
    description:
      'elevated, outlined, filled, gradient 등 다양한 스타일과 padding, gradient 지원 카드 컴포넌트.',
    Example: () => (
      <Card variant="elevated" padding="md" style={tw`w-30`}>
        <Text variant="body">Card Content</Text>
      </Card>
    ),
  },
  {
    name: 'Carousel',
    description:
      '수평 스와이프/탭 지원, 커스텀 렌더링 가능한 Carousel(슬라이더) 컴포넌트.',
    Example: () => {
      const slides = [
        {id: 1, color: '#60a5fa'},
        {id: 2, color: '#34d399'},
        {id: 3, color: '#a78bfa'},
      ];
      const currentSlideIndex = useSharedValue(0);
      const hasReachedEnd = useSharedValue(false);

      return (
        <View style={tw`flex-1 w-40`}>
          <Carousel
            items={slides}
            renderItem={item => (
              <View
                style={tw`flex-1 items-center justify-center rounded-lg bg-[${item.color}]`}>
                <Text
                  style={tw`text-white dark:text-text-dark`}>{`Slide ${item.id}`}</Text>
              </View>
            )}
            currentIndex={currentSlideIndex}
            hasReachedEnd={hasReachedEnd}
            loop={true}
            interaction="tap"
          />
        </View>
      );
    },
  },
  {
    name: 'Icon',
    description:
      'Feather 기반의 벡터 아이콘 컴포넌트. name, size, color props 지원.',
    Example: () => (
      <View style={tw`flex-row items-center gap-2`}>
        <Icon name="star" size={28} variant="warning" />
        <Icon name="heart" size={28} variant="error" />
        <Icon name="user" size={28} variant="secondary" />
      </View>
    ),
  },
  {
    name: 'Button',
    description:
      '기본 버튼 컴포넌트. variant, size, disabled 등 다양한 상태 지원.',
    Example: () => (
      <Button variant="primary" size="medium">
        <Text>Primary Button</Text>
      </Button>
    ),
  },
  {
    name: 'Input',
    description:
      '텍스트 입력 필드. label, error, disabled 등 다양한 상태 지원.',
    Example: () => <Input placeholder="입력하세요" />,
  },
  {
    name: 'Indicator',
    description:
      '페이지/단계 표시용 인디케이터. Bar, Dot 등 compound 패턴 지원.',
    Example: () => (
      <Indicator count={3} currentIndex={1}>
        <Indicator.Container>
          <Indicator.Dot index={0} />
          <Indicator.Dot index={1} />
          <Indicator.Dot index={2} />
        </Indicator.Container>
      </Indicator>
    ),
  },
  {
    name: 'Text',
    description:
      '디자인 시스템 Typography 컴포넌트. heading, body, caption 등 variant 지원.',
    Example: () => <Text variant="h1">Heading 1</Text>,
  },
];

const ComponentsOverview = () => (
  <ScrollView style={tw`p-8 bg-white dark:bg-gray-900`}>
    <Text style={tw`text-2xl font-bold mb-4 text-gray-900 dark:text-white`}>
      Components
    </Text>
    <Text style={tw`text-base text-gray-700 dark:text-gray-300 mb-6`}>
      디자인 시스템의 주요 컴포넌트와 사용 예시, 특징을 한눈에 볼 수 있는
      개요입니다.
    </Text>
    <View style={tw`flex-col mb-8 gap-10`}>
      {components.map(comp => (
        <View key={comp.name} style={tw`flex-row gap-20`}>
          <View style={tw`flex-1`}>
            <Text
              style={tw`text-lg font-bold mb-1 text-gray-900 dark:text-white`}>
              {comp.name}
            </Text>
            <Text style={tw`text-xs text-gray-400 dark:text-gray-500 mb-1`}>
              {comp.description}
            </Text>
          </View>
          <View
            style={tw`flex-1 justify-center items-center bg-gray-100 dark:bg-gray-800 rounded-md`}>
            {comp.Example ? <comp.Example /> : null}
          </View>
        </View>
      ))}
    </View>
    <Text style={tw`text-sm text-gray-700 dark:text-gray-300 mt-6`}>
      각 컴포넌트는 일관된 UI/UX와 확장성을 위해 설계되었습니다. 실제 사용
      예시를 참고해 다양한 상황에 맞게 활용하세요.
    </Text>
  </ScrollView>
);

const meta: Meta<typeof ComponentsOverview> = {
  title: '컴포넌트/컴포넌트 소개',
  component: ComponentsOverview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '디자인 시스템의 주요 컴포넌트와 사용 가이드, 특징을 한눈에 볼 수 있는 Components 개요입니다.',
      },
      page: ComponentsOverview,
    },
  },
  tags: ['autodocs', '!dev'],
};

export default meta;
type Story = StoryObj<typeof ComponentsOverview>;
export const 컴포넌트_소개: Story = meta;
