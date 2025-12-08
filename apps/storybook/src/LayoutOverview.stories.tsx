import type {Meta, StoryObj} from '@storybook/react';
import {View, Text, ScrollView} from 'react-native';
import {Stack, Spacer, Grid, tw} from '@mockly/design-system';

const layoutTokens = [
  {
    name: 'Stack',
    description: '수직/수평 정렬 및 간격을 쉽게 조절하는 레이아웃 컴포넌트.',
    Example: () => (
      <View style={tw`flex items-center w-75 justify-center`}>
        <Stack direction="horizontal" spacing="md">
          <View style={tw`w-8 h-8 bg-green-500 rounded-lg`} />
          <View style={tw`w-8 h-8 bg-blue-600 rounded-lg`} />
          <View style={tw`w-8 h-8 bg-orange-500 rounded-lg`} />
        </Stack>
      </View>
    ),
  },
  {
    name: 'Spacer',
    description: '공간을 띄우거나 정렬을 맞추는 데 사용하는 컴포넌트.',
    Example: () => (
      <View style={tw`flex flex-row items-center w-75 justify-center`}>
        <View style={tw`w-8 h-8 bg-green-500 rounded-lg`} />
        <Spacer direction="horizontal" size="md" />
        <View style={tw`w-8 h-8 bg-blue-600 rounded-lg`} />
      </View>
    ),
  },
  {
    name: 'Grid',
    description: '반응형 컬럼 레이아웃을 지원하는 그리드 컴포넌트.',
    Example: () => (
      <Grid
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        style={tw`flex w-[300px]`}
        itemDimension={70}
        renderItem={({item}) => (
          <View
            style={tw`h-[70px] w-[70px] bg-fuchsia-700 rounded-lg items-center justify-center`}>
            <Text style={tw`text-white font-bold`}>{item}</Text>
          </View>
        )}
        spacing={'md'}
        scrollEnabled={false}
      />
    ),
  },
];

const LayoutOverview = () => (
  <View style={tw`flex-1 items-center bg-white dark:bg-gray-900`}>
    <ScrollView
      style={tw`p-8 w-full max-w-4xl`}
      horizontal={false}
      nestedScrollEnabled={true}>
      <Text style={tw`text-2xl font-bold mb-4 text-gray-900 dark:text-white`}>
        Layout
      </Text>
      <Text style={tw`text-base text-gray-700 dark:text-gray-300 mb-6`}>
        주요 레이아웃 컴포넌트(Stack, Spacer, Grid)의 특징과 사용 예시를 한눈에
        볼 수 있는 개요입니다.
      </Text>
      <View style={tw`mb-8 flex-col gap-20 flex-wrap`}>
        {layoutTokens.map(token => (
          <View key={token.name} style={tw`flex-row flex-wrap gap-10`}>
            <View style={tw`flex-1`}>
              <Text
                style={tw`w-fit text-lg font-bold mb-1 text-gray-900 dark:text-white`}>
                {token.name}
              </Text>
              <Text
                style={tw`w-fit text-xs text-gray-400 dark:text-gray-500 mb-1`}>
                {token.description}
              </Text>
            </View>

            <View style={tw`items-center ml-2`}>
              {token.Example ? <token.Example /> : null}
            </View>
          </View>
        ))}
      </View>
      <Text style={tw`text-sm text-gray-700 dark:text-gray-300 mt-6`}>
        각 레이아웃 컴포넌트는 반응형 UI와 일관된 구조를 위해 설계되었습니다.
        실제 사용 예시를 참고해 다양한 화면에 적용해보세요.
      </Text>
    </ScrollView>
  </View>
);

const meta: Meta<typeof LayoutOverview> = {
  title: '레이아웃/레이아웃 소개',
  component: LayoutOverview,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '디자인 시스템의 주요 레이아웃 컴포넌트와 사용 가이드, 특징을 한눈에 볼 수 있는 Layout 개요입니다.',
      },
      page: LayoutOverview,
    },
  },
  tags: ['autodocs', '!dev'],
};

export default meta;
type Story = StoryObj<typeof LayoutOverview>;
export const 레이아웃_소개: Story = meta;
