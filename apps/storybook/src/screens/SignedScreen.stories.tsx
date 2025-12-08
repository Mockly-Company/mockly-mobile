import type {Meta, StoryObj} from '@storybook/react';
import {BottomTabNavigator} from '@mobile/app/navigation/BottomTabNavigator';
import {MockProviders} from './mocks/MockProviders';

const SignedScreenWithProvider = () => {
  return (
    <MockProviders initialAuthState="authenticated">
      <BottomTabNavigator />
    </MockProviders>
  );
};

const meta: Meta = {
  title: '스크린/로그인화면',
  component: SignedScreenWithProvider,
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
          'Mockly 로그인 화면입니다.\n\n**⚠️ 웹 렌더링 한계:** 이 스토리는 Storybook Web에서 렌더링되므로 실제 React Native 앱과 일부 동작이 다를 수 있습니다. Bottom Tab Navigation, 터치 제스처, 네이티브 컴포넌트 등은 실제 디바이스에서 확인하는 것을 권장합니다.',
      },
    },
  },
  tags: ['!autodocs'],
  globals: {
    viewport: {value: 'iphone6', isRotated: false},
  },
} satisfies Meta<typeof BottomTabNavigator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 로그인화면: Story = meta;
