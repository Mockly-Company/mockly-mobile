import type {Meta, StoryObj} from '@storybook/react';
import {View, TextStyle, ScrollView} from 'react-native';
import {tw, Text} from '@mockly/design-system';

// 컬러 팔레트 데이터
const palette = [
  {
    name: 'Primary Orange',
    base: '#FF6B35',
    scale: {
      50: '#FFF5F2',
      100: '#FFE8E0',
      200: '#FFD1C1',
      300: '#FFB394',
      400: '#FF8A5B',
      500: '#FF6B35',
      600: '#E55A28',
      700: '#C54A1E',
      800: '#A03D18',
      900: '#7A2E12',
    },
    description:
      '활력과 열정을 전달하는 브랜드 메인 컬러. 주요 버튼, 링크, 액션에 사용.',
    usage: '주요 버튼, 액티브 상태, 브랜드 아이덴티티',
    accessibility: '명도 대비 4.5:1 이상, 텍스트/아이콘에 적합',
  },
  {
    name: 'Secondary Blue',
    base: '#4A90E2',
    scale: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#5BA3F5',
      500: '#4A90E2',
      600: '#3B82F6',
      700: '#2563EB',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
    description: '신뢰감과 안정감을 주는 보조 컬러.',
    usage: '보조 버튼, 링크, 정보 표시',
    accessibility: '명도 대비 4.5:1 이상, 텍스트/아이콘에 적합',
  },
  {
    name: 'Accent Pink',
    base: '#FD79A8',
    scale: {
      50: '#FEF5FA',
      100: '#FDEAF4',
      200: '#FCD5E9',
      300: '#FAB3D9',
      400: '#FD79A8',
      500: '#F472B6',
      600: '#EC4899',
      700: '#DB2777',
      800: '#BE185D',
      900: '#9F1239',
    },
    description: '포인트와 강조를 위한 액센트 컬러.',
    usage: '강조, 배지, 하이라이트',
    accessibility: '명도 대비 3:1 이상, 배경/포인트에 적합',
  },
  {
    name: 'Success Green',
    base: '#2ECC71',
    scale: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#2ECC71',
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
    base: '#E17055',
    scale: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#E17055',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
    description: '경고, 오류, 위험 등 부정적 메시지.',
    usage: '에러 메시지, 경고, 상태 표시',
    accessibility: '명도 대비 4.5:1 이상, 텍스트/아이콘에 적합',
  },
  {
    name: 'Gray',
    base: '#6B7280',
    scale: {
      50: '#F8F9FC',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#A0A0A0',
      500: '#6B7280',
      600: '#4B5563',
      700: '#404040',
      800: '#2D2D2D',
      900: '#1A1A1A',
    },
    description: '중립, 텍스트, 배경 등 다양한 용도.',
    usage: '배경, 보조 텍스트, 구분선, 아이콘',
    accessibility: '명도 대비 7:1 이상, 텍스트/배경에 적합',
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
  <ScrollView style={tw`p-8 bg-background dark:bg-background-dark`}>
    {/* 컴러 섹션 */}
    <Text variant="h2" weight="bold" color="text" style={tw`mb-4`}>
      브랜드 컴러
    </Text>
    <Text variant="body" color="text" style={tw`mb-6`}>
      브랜드 컴러는 신뢰, 전문성, 활력 등 브랜드 메시지를 시각적으로 전달합니다.
      각 컴러는 명확한 용도와 접근성 기준에 따라 선정되었습니다.
    </Text>
    {palette.map(color => (
      <View key={color.name} style={tw`mb-8`}>
        <Text variant="h3" weight="bold" color="text" style={tw`mb-2`}>
          {color.name}
        </Text>
        <Text variant="caption" color="secondary" style={tw`mb-1`}>
          {color.description}
        </Text>
        <Text variant="caption" color="textSecondary" style={tw`mb-1`}>
          용도: {color.usage}
        </Text>
        <Text variant="caption" color="textSecondary" style={tw`mb-2`}>
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
              <Text variant="caption" color="text" style={tw`text-xs`}>
                {step}
              </Text>
              <Text variant="caption" color="textSecondary" style={tw`text-xs`}>
                {hex}
              </Text>
            </View>
          ))}
        </View>
      </View>
    ))}

    {/* 타이포그래피 섹션 */}
    <Text variant="h2" weight="bold" color="text" style={tw`mb-4 mt-8`}>
      타이포그래피
    </Text>
    <Text variant="body" color="text" style={tw`mb-6`}>
      브랜드의 일관성과 가독성을 위해 다양한 텍스트 스타일(크기, 굵기, 계층)을
      제공합니다. 각 스타일은 명확한 사용 목적과 가이드에 따라 정의됩니다.
    </Text>
    <View style={tw`mb-8`}>
      {typographyScales.map(type => (
        <View key={type.name} style={tw`mb-5`}>
          <Text
            style={tw.style(`mb-1 text-gray-900 dark:text-white`, {
              fontSize: type.size,
              fontWeight: type.weight as TextStyle['fontWeight'],
            })}>
            {type.name} - {type.size}px
          </Text>
          <Text variant="caption" color="textSecondary" style={tw`mb-1`}>
            {type.description}
          </Text>
          {/* 실제 샘플 텍스트 */}
          <Text
            style={tw.style(`text-gray-800 dark:text-gray-200 mb-2`, {
              fontSize: type.size,
              fontWeight: type.weight as TextStyle['fontWeight'],
            })}>
            샘플 텍스트 AaBbCc123
          </Text>
        </View>
      ))}
    </View>
    <Text variant="caption" color="text" style={tw`mt-6`}>
      Typography는 정보의 계층 구조를 명확히 하고, 브랜드의 톤&매너를 시각적으로
      전달합니다. 각 스타일과 굵기를 상황에 맞게 활용해 일관된 UI를 구현하세요.
    </Text>
  </ScrollView>
);

const meta: Meta<typeof FoundationOverview> = {
  title: '파운데이션/파운데이션 소개',
  component: FoundationOverview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: FoundationOverview,
    },
  },
  tags: ['!dev'],
};

export default meta;
type Story = StoryObj<typeof FoundationOverview>;
export const 파운데이션_소개: Story = meta;
