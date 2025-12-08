import type {Meta, StoryObj} from '@storybook/react';
import {OnboardingScreen} from '@mobile/app/screens/onboarding/OnboardingScreen';
import {MockProviders} from './mocks/MockProviders';

const OnboardingScreenWithProvider = () => {
  return (
    <MockProviders>
      <OnboardingScreen />
    </MockProviders>
  );
};

const meta = {
  title: '스크린/비로그인화면',
  component: OnboardingScreenWithProvider,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'iphone6',
    },
    docs: {
      story: {
        inline: false,
        iframeHeight: 667,
        iframeWidth: 375,
      },
      description: {
        component:
          'Mockly 앱의 온보딩 화면입니다. 캐러셀 슬라이드와 로그인 바텀시트를 포함합니다.\n\n**⚠️ 웹 렌더링 한계:** 이 스토리는 Storybook Web에서 렌더링되므로 실제 React Native 앱과 일부 동작이 다를 수 있습니다. 터치 제스처, 애니메이션, 네이티브 모듈 등은 실제 디바이스에서 테스트하는 것을 권장합니다.',
      },
    },
  },
  tags: ['!autodocs'],
  globals: {
    viewport: {value: 'iphone6', isRotated: false},
  },
} satisfies Meta<typeof OnboardingScreenWithProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 비로그인화면: Story = meta;
