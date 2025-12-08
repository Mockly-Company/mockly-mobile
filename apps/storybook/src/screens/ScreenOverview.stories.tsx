import type {Meta, StoryObj} from '@storybook/react';
import {View, TouchableOpacity} from 'react-native';
import {Text, tw} from '@mockly/design-system';
import {linkTo} from '@storybook/addon-links';

const ScreenOverview = () => {
  return (
    <View style={tw`p-6 bg-white dark:bg-zinc-900`}>
      <Text variant="h1" weight="bold" color="text" style={tw`mb-4`}>
        📱 스크린
      </Text>

      <Text variant="body" color="text" style={tw`mb-6`}>
        Mockly 앱의 전체 화면 구성을 미리 볼 수 있습니다.
      </Text>

      <View style={tw`mb-8`}>
        <Text variant="h2" weight="bold" color="text" style={tw`mb-3`}>
          ⚠️ 웹 렌더링 한계
        </Text>
        <Text variant="body" color="secondary" style={tw`mb-2`}>
          이 섹션의 스토리들은 Storybook Web에서 렌더링되므로 실제 React Native
          앱과 일부 동작이 다를 수 있습니다.
        </Text>
        <View style={tw`mt-2 pl-4`}>
          <Text variant="caption" color="textSecondary" style={tw`mb-1`}>
            • 터치 제스처 및 네이티브 인터랙션
          </Text>
          <Text variant="caption" color="textSecondary" style={tw`mb-1`}>
            • 애니메이션 성능 및 타이밍
          </Text>
          <Text variant="caption" color="textSecondary" style={tw`mb-1`}>
            • 네이티브 모듈 (카메라, 위치정보 등)
          </Text>
          <Text variant="caption" color="textSecondary" style={tw`mb-1`}>
            • Bottom Tab Navigation 동작
          </Text>
          <Text variant="caption" color="textSecondary">
            • Bottom Sheet 및 모달 동작
          </Text>
        </View>
      </View>

      <View style={tw`mb-8`}>
        <Text variant="h2" weight="bold" color="text" style={tw`mb-3`}>
          📋 포함된 스크린
        </Text>
        <View style={tw`pl-4`}>
          <TouchableOpacity
            style={tw`mb-3`}
            onPress={linkTo('스크린/비로그인화면')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="OnboardingScreen 스토리로 이동">
            <Text
              variant="body"
              weight="semibold"
              color="primary"
              style={tw`mb-1 underline`}>
              비로그인 화면
            </Text>
            <Text variant="caption" color="secondary">
              온보딩 캐러셀과 로그인 바텀시트를 포함한 첫 진입 화면
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`mb-3`}
            onPress={linkTo('스크린/로그인화면')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="SignedScreen 스토리로 이동">
            <Text
              variant="body"
              weight="semibold"
              color="primary"
              style={tw`mb-1 underline`}>
              로그인 후 화면
            </Text>
            <Text variant="caption" color="secondary">
              로그인 후 메인 화면, Bottom Tab Navigator 포함
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={tw`bg-blue-50 dark:bg-blue-950 p-4 rounded-lg`}>
        <Text variant="body" weight="semibold" color="primary" style={tw`mb-2`}>
          💡 권장사항
        </Text>
        <Text variant="caption" color="secondary">
          스크린의 전체적인 레이아웃과 구성을 확인하는 용도로 사용하고, 실제
          동작과 성능은 React Native 디바이스나 시뮬레이터에서 테스트하세요.
        </Text>
      </View>
    </View>
  );
};

const meta: Meta<typeof ScreenOverview> = {
  title: '스크린',
  component: ScreenOverview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => <ScreenOverview />,
    },
  },
  tags: ['!dev'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const 스크린_소개: Story = meta;
