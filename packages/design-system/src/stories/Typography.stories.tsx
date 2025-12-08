import type { Meta, StoryObj } from '@storybook/react';
import { View, ScrollView } from 'react-native';
import { tw } from '../lib/tw';
import { Text } from '../components/Text/Text';
import { typography } from '../theme';

const meta: Meta = {
  title: '파운데이션/Typography',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FontSizes: Story = {
  render: () => (
    <ScrollView style={tw`flex-1 bg-white dark:bg-zinc-950`}>
      <View style={tw`p-6 gap-4`}>
        <Text style={tw`text-2xl font-bold text-zinc-900 dark:text-white mb-4`}>Font Sizes</Text>
        <View style={tw`gap-3`}>
          <View style={tw`gap-1`}>
            <Text style={tw`text-xs text-zinc-500 dark:text-zinc-400`}>
              xs ({typography.fontSize.xs}px)
            </Text>
            <Text style={tw`text-xs text-zinc-900 dark:text-white`}>
              The quick brown fox jumps over the lazy dog
            </Text>
          </View>
          <View style={tw`gap-1`}>
            <Text style={tw`text-xs text-zinc-500 dark:text-zinc-400`}>
              sm ({typography.fontSize.sm}px)
            </Text>
            <Text style={tw`text-sm text-zinc-900 dark:text-white`}>
              The quick brown fox jumps over the lazy dog
            </Text>
          </View>
          <View style={tw`gap-1`}>
            <Text style={tw`text-xs text-zinc-500 dark:text-zinc-400`}>
              md ({typography.fontSize.md}px)
            </Text>
            <Text style={tw`text-base text-zinc-900 dark:text-white`}>
              The quick brown fox jumps over the lazy dog
            </Text>
          </View>
          <View style={tw`gap-1`}>
            <Text style={tw`text-xs text-zinc-500 dark:text-zinc-400`}>
              lg ({typography.fontSize.lg}px)
            </Text>
            <Text style={tw`text-lg text-zinc-900 dark:text-white`}>
              The quick brown fox jumps over the lazy dog
            </Text>
          </View>
          <View style={tw`gap-1`}>
            <Text style={tw`text-xs text-zinc-500 dark:text-zinc-400`}>
              xl ({typography.fontSize.xl}px)
            </Text>
            <Text style={tw`text-xl text-zinc-900 dark:text-white`}>
              The quick brown fox jumps over the lazy dog
            </Text>
          </View>
          <View style={tw`gap-1`}>
            <Text style={tw`text-xs text-zinc-500 dark:text-zinc-400`}>
              2xl ({typography.fontSize['2xl']}px)
            </Text>
            <Text style={tw`text-2xl text-zinc-900 dark:text-white`}>
              The quick brown fox jumps over the lazy dog
            </Text>
          </View>
          <View style={tw`gap-1`}>
            <Text style={tw`text-xs text-zinc-500 dark:text-zinc-400`}>
              3xl ({typography.fontSize['3xl']}px)
            </Text>
            <Text style={tw`text-3xl text-zinc-900 dark:text-white`}>
              The quick brown fox jumps over the lazy dog
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  ),
};

export const FontWeights: Story = {
  render: () => (
    <ScrollView style={tw`flex-1 bg-white dark:bg-zinc-950`}>
      <View style={tw`p-6 gap-4`}>
        <Text style={tw`text-2xl font-bold text-zinc-900 dark:text-white mb-4`}>Font Weights</Text>
        <View style={tw`gap-3`}>
          <View style={tw`gap-1`}>
            <Text style={tw`text-xs text-zinc-500 dark:text-zinc-400`}>
              regular ({typography.fontWeight.regular})
            </Text>
            <Text style={tw`text-lg font-normal text-zinc-900 dark:text-white`}>
              The quick brown fox jumps over the lazy dog
            </Text>
          </View>
          <View style={tw`gap-1`}>
            <Text style={tw`text-xs text-zinc-500 dark:text-zinc-400`}>
              medium ({typography.fontWeight.medium})
            </Text>
            <Text style={tw`text-lg font-medium text-zinc-900 dark:text-white`}>
              The quick brown fox jumps over the lazy dog
            </Text>
          </View>
          <View style={tw`gap-1`}>
            <Text style={tw`text-xs text-zinc-500 dark:text-zinc-400`}>
              semibold ({typography.fontWeight.semibold})
            </Text>
            <Text style={tw`text-lg font-semibold text-zinc-900 dark:text-white`}>
              The quick brown fox jumps over the lazy dog
            </Text>
          </View>
          <View style={tw`gap-1`}>
            <Text style={tw`text-xs text-zinc-500 dark:text-zinc-400`}>
              bold ({typography.fontWeight.bold})
            </Text>
            <Text style={tw`text-lg font-bold text-zinc-900 dark:text-white`}>
              The quick brown fox jumps over the lazy dog
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  ),
};

export const TextHierarchy: Story = {
  render: () => (
    <ScrollView style={tw`flex-1 bg-white dark:bg-zinc-950`}>
      <View style={tw`p-6 gap-4`}>
        <Text variant="h2" color="text" weight="bold" style={tw`mb-4`}>
          Text Hierarchy
        </Text>
        <View style={tw`gap-4`}>
          <View>
            <Text variant="h1" color="text" weight="bold">
              Heading 1
            </Text>
            <Text variant="caption" color="textSecondary">
              2xl / bold - 주요 페이지 제목
            </Text>
          </View>
          <View>
            <Text variant="h2" color="text" weight="bold">
              Heading 2
            </Text>
            <Text variant="caption" color="textSecondary">
              2xl / bold - 섹션 제목
            </Text>
          </View>
          <View>
            <Text variant="h3" color="text" weight="semibold">
              Heading 3
            </Text>
            <Text variant="caption" color="textSecondary">
              xl / semibold - 서브 섹션 제목
            </Text>
          </View>
          <View>
            <Text variant="h4" color="text" weight="medium">
              Subtitle
            </Text>
            <Text variant="caption" color="textSecondary">
              lg / medium - 부제목
            </Text>
          </View>
          <View>
            <Text variant="body" color="text" weight="normal">
              Body Text
            </Text>
            <Text variant="caption" color="textSecondary">
              md / regular - 본문 텍스트
            </Text>
          </View>
          <View>
            <Text variant="caption" color="textSecondary" weight="normal">
              Body Small
            </Text>
            <Text variant="caption" color="textSecondary">
              sm / regular - 작은 본문 텍스트
            </Text>
          </View>
          <View>
            <Text style={tw`text-xs text-zinc-500 dark:text-zinc-400`}>Caption</Text>
            <Text style={tw`text-sm text-zinc-500 dark:text-zinc-400`}>
              xs / regular - 캡션, 보조 텍스트
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  ),
};

export const TextColors: Story = {
  render: () => (
    <ScrollView style={tw`flex-1 bg-white dark:bg-zinc-950`}>
      <View style={tw`p-6 gap-4`}>
        <Text style={tw`text-2xl font-bold text-zinc-900 dark:text-white mb-4`}>Text Colors</Text>
        <View style={tw`gap-3`}>
          <View>
            <Text color="text">Primary Text</Text>
            <Text style={tw`text-sm text-zinc-500 dark:text-zinc-400`}>
              주요 텍스트 (zinc-900 / white)
            </Text>
          </View>
          <View>
            <Text color="textSecondary">Secondary Text</Text>
            <Text style={tw`text-sm text-zinc-500 dark:text-zinc-400`}>
              보조 텍스트 (zinc-600 / zinc-300)
            </Text>
          </View>
          <View>
            <Text color="primary">Primary Color</Text>
            <Text style={tw`text-sm text-zinc-500 dark:text-zinc-400`}>브랜드 컬러 텍스트</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  ),
};
