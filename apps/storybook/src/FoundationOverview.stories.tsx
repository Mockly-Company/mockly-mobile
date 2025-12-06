import type {Meta, StoryObj} from '@storybook/react';
import {View, Text, TextStyle, ScrollView} from 'react-native';
import {tw} from '@mockly/design-system';

// 컬러 팔레트 데이터
const palette = [
  {
    name: 'Primary Blue',
    base: '#4F8EF7',
    scale: {
      50: '#EAF3FF',
      100: '#CFE2FF',
      200: '#A3C8FF',
      300: '#6EA8FF',
      400: '#388BFF',
      500: '#4F8EF7',
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
    description:
      '신뢰감과 전문성을 주는 브랜드 메인 컬러. 버튼, 링크, 주요 액션에 사용.',
    usage: '주요 버튼, 액티브 상태, 브랜드 아이덴티티',
    accessibility: '명도 대비 4.5:1 이상, 텍스트/아이콘에 적합',
  },
  {
    name: 'Gray',
    base: '#6B7280',
    scale: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    description: '중립, 보조, 텍스트, 아이콘 등 다양한 용도.',
    usage: '배경, 보조 텍스트, 구분선, 아이콘',
    accessibility: '명도 대비 7:1 이상, 텍스트/배경에 적합',
  },
  {
    name: 'Accent Yellow',
    base: '#FFD600',
    scale: {
      50: '#FFFDE7',
      100: '#FFF9C4',
      200: '#FFF59D',
      300: '#FFF176',
      400: '#FFEE58',
      500: '#FFD600',
      600: '#FFC400',
      700: '#FFAB00',
      800: '#FF9100',
      900: '#FF6F00',
    },
    description: '활력과 주목성을 주는 포인트 컬러.',
    usage: '강조, 배지, 경고, 포인트',
    accessibility: '명도 대비 3:1 이상, 배경/포인트에 적합',
  },
  {
    name: 'Success Green',
    base: '#22C55E',
    scale: {
      50: '#ECFDF5',
      100: '#D1FADF',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    description: '긍정, 성공, 승인 등 긍정적 메시지.',
    usage: '성공 메시지, 승인, 상태 표시',
    accessibility: '명도 대비 4.5:1 이상, 텍스트/아이콘에 적합',
  },
  {
    name: 'Error Red',
    base: '#EF4444',
    scale: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
    description: '경고, 오류, 위험 등 부정적 메시지.',
    usage: '에러 메시지, 경고, 상태 표시',
    accessibility: '명도 대비 4.5:1 이상, 텍스트/아이콘에 적합',
  },
];

// Typography 데이터
const typographyScales = [
  {
    name: 'Display',
    size: 40,
    weight: 'bold',
    description: 'Hero, 브랜드 로고, 강한 임팩트',
  },
  {
    name: 'Headline',
    size: 32,
    weight: 'bold',
    description: '섹션 타이틀, 페이지 헤더',
  },
  {
    name: 'Title',
    size: 24,
    weight: 'bold',
    description: '카드, 모달, 리스트 타이틀',
  },
  {
    name: 'Body Large',
    size: 18,
    weight: 'normal',
    description: '주요 본문, 안내문',
  },
  {
    name: 'Body',
    size: 16,
    weight: 'normal',
    description: '일반 본문, 상세 설명',
  },
  {name: 'Caption', size: 13, weight: 'normal', description: '라벨, 보조 설명'},
];

const FoundationOverview = () => (
  <ScrollView style={tw`p-8 bg-white dark:bg-gray-900`}>
    {/* 컬러 섹션 */}
    <Text style={tw`text-2xl font-bold mb-4 text-gray-900 dark:text-white`}>
      브랜드 컬러
    </Text>
    <Text style={tw`text-base text-gray-700 dark:text-gray-300 mb-6`}>
      브랜드 컬러는 신뢰, 전문성, 활력 등 브랜드 메시지를 시각적으로 전달합니다.
      각 컬러는 명확한 용도와 접근성 기준에 따라 선정되었습니다.
    </Text>
    {palette.map(color => (
      <View key={color.name} style={tw`mb-8`}>
        <Text style={tw`text-xl font-bold mb-2 text-gray-900 dark:text-white`}>
          {color.name}
        </Text>
        <Text style={tw`text-sm text-gray-500 dark:text-gray-400 mb-1`}>
          {color.description}
        </Text>
        <Text style={tw`text-xs text-gray-400 dark:text-gray-500 mb-1`}>
          용도: {color.usage}
        </Text>
        <Text style={tw`text-xs text-gray-400 dark:text-gray-500 mb-2`}>
          접근성: {color.accessibility}
        </Text>
        <View style={tw`flex-row flex-wrap gap-3`}>
          {Object.entries(color.scale).map(([step, hex]) => (
            <View key={step} style={tw`items-center mr-3 mb-3`}>
              <View
                style={tw.style(
                  `w-12 h-12 rounded-lg border border-gray-100 mb-1`,
                  {
                    backgroundColor: hex,
                  },
                )}
              />
              <Text style={tw`text-xs text-gray-700 dark:text-gray-300`}>
                {step}
              </Text>
              <Text style={tw`text-xs text-gray-500 dark:text-gray-400`}>
                {hex}
              </Text>
            </View>
          ))}
        </View>
      </View>
    ))}

    {/* 타이포그래피 섹션 */}
    <Text
      style={tw`text-2xl font-bold mb-4 mt-8 text-gray-900 dark:text-white`}>
      타이포그래피
    </Text>
    <Text style={tw`text-base text-gray-700 dark:text-gray-300 mb-6`}>
      브랜드의 일관성과 가독성을 위해 다양한 텍스트 스타일(크기, 굵기, 계층)을
      제공합니다. 각 스타일은 명확한 사용 목적과 가이드에 따라 정의됩니다.
    </Text>
    <View style={tw`mb-8`}>
      {typographyScales.map(type => (
        <View key={type.name} style={tw`mb-5`}>
          <Text
            style={tw.style(`mb-1`, {
              fontSize: type.size,
              fontWeight: type.weight as TextStyle['fontWeight'],
            })}>
            {type.name} - {type.size}px
          </Text>
          <Text style={tw`text-sm text-gray-500 mb-1`}>{type.description}</Text>
          {/* 실제 샘플 텍스트 */}
          <Text
            style={tw.style(`text-gray-800 mb-2`, {
              fontSize: type.size,
              fontWeight: type.weight as TextStyle['fontWeight'],
            })}>
            샘플 텍스트 AaBbCc123
          </Text>
        </View>
      ))}
    </View>
    <Text style={tw`text-sm text-gray-700 dark:text-gray-300 mt-6`}>
      Typography는 정보의 계층 구조를 명확히 하고, 브랜드의 톤&매너를 시각적으로
      전달합니다. 각 스타일과 굵기를 상황에 맞게 활용해 일관된 UI를 구현하세요.
    </Text>
  </ScrollView>
);

const meta: Meta<typeof FoundationOverview> = {
  title: 'Foundation/파운데이션 소개',
  component: FoundationOverview,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '브랜드 컬러 팔레트, 선정 이유, 접근성, 타이포그래피 스케일, 샘플, 사용 가이드 등 디자인 시스템의 핵심 정보를 한눈에 볼 수 있는 Foundation 개요입니다.',
      },
    },
  },
  tags: ['!autodocs'],
};

export default meta;
type Story = StoryObj<typeof FoundationOverview>;
export const 파운데이션_소개: Story = meta;
