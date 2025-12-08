import type { Meta, StoryObj } from '@storybook/react';
import { View, Text, ScrollView } from 'react-native';
import { tw } from '../lib/tw';
import { palette, lightColors, darkColors } from '../theme';

const meta: Meta = {
  title: '파운데이션/Colors',
};

export default meta;
type Story = StoryObj<typeof meta>;

const ColorBox = ({ color, name, hex }: { color: string; name: string; hex?: string }) => (
  <View style={tw`items-center gap-2 mb-4`}>
    <View
      style={[
        tw`w-24 h-24 rounded-lg border border-gray-200 dark:border-gray-700`,
        { backgroundColor: color },
      ]}
    />
    <Text style={tw`text-sm font-medium text-zinc-900 dark:text-white`}>{name}</Text>
    {hex && <Text style={tw`text-xs text-zinc-500 dark:text-zinc-400`}>{hex}</Text>}
  </View>
);

export const BrandColors: Story = {
  render: () => (
    <ScrollView style={tw`flex-1 bg-white dark:bg-zinc-950`}>
      <View style={tw`p-6`}>
        <Text style={tw`text-2xl font-bold text-zinc-900 dark:text-white mb-6`}>Brand Colors</Text>
        <View style={tw`flex-row flex-wrap gap-4`}>
          <ColorBox color={lightColors.primary} name="Primary" hex={lightColors.primary} />
          <ColorBox color={lightColors.secondary} name="Secondary" hex={lightColors.secondary} />
          <ColorBox color={lightColors.accent} name="Accent" hex={lightColors.accent} />
        </View>
      </View>
    </ScrollView>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <ScrollView style={tw`flex-1 bg-white dark:bg-zinc-950`}>
      <View style={tw`p-6`}>
        <Text style={tw`text-2xl font-bold text-zinc-900 dark:text-white mb-6`}>
          Semantic Colors
        </Text>
        <View style={tw`flex-row flex-wrap gap-4`}>
          <ColorBox color={lightColors.success} name="Success" hex={lightColors.success} />
          <ColorBox color={lightColors.warning} name="Warning" hex={lightColors.warning} />
          <ColorBox color={lightColors.error} name="Error" hex={lightColors.error} />
        </View>
      </View>
    </ScrollView>
  ),
};

export const OrangePalette: Story = {
  render: () => (
    <ScrollView style={tw`flex-1 bg-white dark:bg-zinc-950`}>
      <View style={tw`p-6`}>
        <Text style={tw`text-2xl font-bold text-zinc-900 dark:text-white mb-6`}>
          Orange Palette
        </Text>
        <View style={tw`flex-row flex-wrap gap-4`}>
          {Object.entries(palette.orange).map(([shade, color]) => (
            <ColorBox key={shade} color={color} name={shade} hex={color} />
          ))}
        </View>
      </View>
    </ScrollView>
  ),
};

export const BluePalette: Story = {
  render: () => (
    <ScrollView style={tw`flex-1 bg-white dark:bg-zinc-950`}>
      <View style={tw`p-6`}>
        <Text style={tw`text-2xl font-bold text-zinc-900 dark:text-white mb-6`}>Blue Palette</Text>
        <View style={tw`flex-row flex-wrap gap-4`}>
          {Object.entries(palette.blue).map(([shade, color]) => (
            <ColorBox key={shade} color={color} name={shade} hex={color} />
          ))}
        </View>
      </View>
    </ScrollView>
  ),
};

export const GrayPalette: Story = {
  render: () => (
    <ScrollView style={tw`flex-1 bg-white dark:bg-zinc-950`}>
      <View style={tw`p-6`}>
        <Text style={tw`text-2xl font-bold text-zinc-900 dark:text-white mb-6`}>Gray Palette</Text>
        <View style={tw`flex-row flex-wrap gap-4`}>
          {Object.entries(palette.gray).map(([shade, color]) => (
            <ColorBox key={shade} color={color} name={shade} hex={color} />
          ))}
        </View>
      </View>
    </ScrollView>
  ),
};

export const LightTheme: Story = {
  render: () => (
    <ScrollView style={tw`flex-1 bg-white dark:bg-zinc-950`}>
      <View style={tw`p-6`}>
        <Text style={tw`text-2xl font-bold text-zinc-900 dark:text-white mb-6`}>Light Theme</Text>
        <View style={tw`flex-row flex-wrap gap-4`}>
          {Object.entries(lightColors).map(([name, color]) => (
            <ColorBox key={name} color={color} name={name} hex={color} />
          ))}
        </View>
      </View>
    </ScrollView>
  ),
};

export const DarkTheme: Story = {
  render: () => (
    <ScrollView style={tw`flex-1 bg-zinc-950`}>
      <View style={tw`p-6`}>
        <Text style={tw`text-2xl font-bold text-white mb-6`}>Dark Theme</Text>
        <View style={tw`flex-row flex-wrap gap-4`}>
          {Object.entries(darkColors).map(([name, color]) => (
            <ColorBox key={name} color={color} name={name} hex={color} />
          ))}
        </View>
      </View>
    </ScrollView>
  ),
};
