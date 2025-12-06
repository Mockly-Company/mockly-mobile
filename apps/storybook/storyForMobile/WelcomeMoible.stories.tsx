import type {Meta, StoryObj} from '@storybook/react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {tw} from '@mockly/design-system';
import {linkTo} from '@storybook/addon-links';
import {Icon} from '@mockly/design-system';

const WelcomeComponentMobile = () => {
  return (
    <ScrollView
      style={tw`bg-slate-50 dark:bg-gray-900`}
      contentContainerStyle={tw`pb-10`}>
      {/* 대형 헤더 */}
      <View
        style={tw`w-full items-center pt-12 pb-6 px-4 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 mb-8`}>
        <Text
          style={tw`text-4xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight`}>
          Mockly Design System
        </Text>
        <Text style={tw`text-lg text-primary dark:text-blue-400 mb-2`}>
          for React Native
        </Text>
        <Text
          style={tw`text-base text-slate-600 dark:text-gray-300 px-4 text-center`}>
          이 디자인 시스템의 모든 문서는 React Native JSX 태그를 통해
          만들어졌습니다. 빠르고 일관된 모바일 UI/UX를 위한 컴포넌트, 토큰,
          애니메이션, 접근성 가이드까지 모두 담았습니다. 시간날 때 마다 틈틈이
          업데이트할 예정입니다.
        </Text>
        <Text style={tw`text-base text-slate-600 dark:text-gray-300`}>
          담당: Yoon Carrot, 작성일: 2025.12
        </Text>
      </View>

      {/* 본문 컨텐츠 래퍼 */}
      <View
        style={tw`w-full px-4 bg-slate-50 dark:bg-gray-800 rounded-2xl mb-10`}>
        {/* 주요 특징 */}
        <View
          style={tw`w-full bg-white dark:bg-gray-700 rounded-xl p-5 mb-6 shadow-sm`}>
          <Text
            style={tw`text-lg font-bold mb-2 text-gray-900 dark:text-white`}>
            주요 특징
          </Text>
          <Text style={tw`text-sm text-gray-700 dark:text-gray-300 mb-1`}>
            • 테마 토큰 기반 스타일링 (tailwind, cva)
          </Text>
          <Text style={tw`text-sm text-gray-700 dark:text-gray-300 mb-1`}>
            • 재사용 가능한 컴포넌트와 레이아웃
          </Text>
          <Text style={tw`text-sm text-gray-700 dark:text-gray-300 mb-1`}>
            • 접근성 및 반응형 지원
          </Text>
          <Text style={tw`text-sm text-gray-700 dark:text-gray-300 mb-1`}>
            • Storybook 기반 문서화 및 테스트
          </Text>
          <Text style={tw`text-sm text-gray-700 dark:text-gray-300 mb-1`}>
            • 주요 애니메이션 프리셋 제공 (Fade, Slide, Scale 등)
          </Text>
          <Text style={tw`text-sm text-gray-700 dark:text-gray-300 mb-1`}>
            • 실제 코드 예제와 Playground, 접근성 가이드 포함
          </Text>
        </View>

        {/* 빠른 이동 버튼 */}
        <View style={tw`flex-row flex-wrap justify-center gap-2 mb-8`}>
          <TouchableOpacity
            style={tw`items-center bg-blue-50 dark:bg-blue-900 rounded-lg p-2 w-[48%]`}
            onPress={linkTo('Foundation')}>
            <Icon name="layers" size={40} color="#4F8EF7" style={tw`mb-2`} />
            <Text style={tw`text-base font-bold text-gray-900 dark:text-white`}>
              Foundation
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`items-center bg-blue-50 dark:bg-blue-900 rounded-lg p-2 w-[48%]`}
            onPress={linkTo('Components')}>
            <Icon name="grid" size={40} color="#4F8EF7" style={tw`mb-2`} />
            <Text style={tw`text-base font-bold text-gray-900 dark:text-white`}>
              Components
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`items-center bg-blue-50 dark:bg-blue-900 rounded-lg p-2 w-[48%]`}
            onPress={linkTo('Layout')}>
            <Icon name="layout" size={40} color="#4F8EF7" style={tw`mb-2`} />
            <Text style={tw`text-base font-bold text-gray-900 dark:text-white`}>
              Layout
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`items-center bg-blue-50 dark:bg-blue-900 rounded-lg p-2 w-[48%]`}
            onPress={linkTo('Animations')}>
            <Icon name="activity" size={40} color="#4F8EF7" style={tw`mb-2`} />
            <Text style={tw`text-base font-bold text-gray-900 dark:text-white`}>
              Animation
            </Text>
          </TouchableOpacity>
        </View>

        {/* 섹션별 설명 */}
        <View style={tw`w-full mb-6`}>
          <Text
            style={tw`text-base font-bold mb-2 text-gray-900 dark:text-white`}>
            섹션 안내
          </Text>
          <Text style={tw`text-sm text-gray-700 dark:text-gray-300 mb-1`}>
            <Text style={tw`font-bold`}>Foundation</Text>: 컬러, 타이포그래피,
            아이콘 등 디자인 토큰과 기본 요소
          </Text>
          <Text style={tw`text-sm text-gray-700 dark:text-gray-300 mb-1`}>
            <Text style={tw`font-bold`}>Components</Text>: 버튼, 입력, 카드 등
            재사용 가능한 UI 컴포넌트
          </Text>
          <Text style={tw`text-sm text-gray-700 dark:text-gray-300 mb-1`}>
            <Text style={tw`font-bold`}>Layout</Text>: 그리드, 스택, 컨테이너 등
            레이아웃 컴포넌트
          </Text>
          <Text style={tw`text-sm text-gray-700 dark:text-gray-300 mb-1`}>
            <Text style={{fontWeight: 'bold'}}>Animation</Text>: Fade, Slide,
            Scale 등 주요 애니메이션 프리셋과 실제 사용 예시, 커스텀 가이드
          </Text>
        </View>

        {/* Storybook 보는 방법 */}
        <View
          style={tw`w-full bg-white dark:bg-gray-700 rounded-xl p-5 mb-6 shadow-sm`}>
          <Text
            style={tw`text-lg font-bold mb-3 text-gray-900 dark:text-white`}>
            Storybook 보는 방법
          </Text>

          {/* 설치 */}
          <View style={tw`mb-4`}>
            <Text
              style={tw`text-base font-bold mb-2 text-gray-900 dark:text-white`}>
              📦 설치
            </Text>
            <View style={tw`bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-2`}>
              <Text
                style={tw`font-mono text-sm text-gray-900 dark:text-white mb-1`}>
                git clone &quot;레포 주소&quot;
              </Text>
              <Text
                style={tw`font-mono text-sm text-gray-900 dark:text-white mb-1`}>
                pnpm install
              </Text>
              <Text style={tw`font-mono text-sm text-gray-900 dark:text-white`}>
                cd apps/storybook/ios && pod install
              </Text>
              <Text style={tw`font-mono text-sm text-gray-900 dark:text-white`}>
                cd &quot;root 디렉토리&quot;
              </Text>
            </View>
            <Text style={tw`text-sm text-gray-600 dark:text-gray-400`}>
              필요한 패키지와 iOS 의존성을 설치합니다.
            </Text>
          </View>

          {/* Web으로 보기 */}
          <View style={tw`mb-4`}>
            <Text
              style={tw`text-base font-bold mb-2 text-gray-900 dark:text-white`}>
              🌐 Web으로 보기
            </Text>
            <View style={tw`bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-2`}>
              <Text style={tw`font-mono text-sm text-gray-900 dark:text-white`}>
                pnpm storybook:web
              </Text>
            </View>
            <Text style={tw`text-sm text-gray-600 dark:text-gray-400`}>
              브라우저에서 http://localhost:6006 으로 접속하여 확인할 수
              있습니다.
            </Text>
            <Text style={tw`text-sm text-gray-600 dark:text-gray-400`}>
              RN 컴포넌트를 Web으로 렌더링하여 보기때문에 일부 동작이 다를 수
              있습니다.
            </Text>
          </View>

          {/* Android로 보기 */}
          <View style={tw`mb-4`}>
            <Text
              style={tw`text-base font-bold mb-2 text-gray-900 dark:text-white`}>
              📱 Android로 보기
            </Text>
            <View style={tw`bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-2`}>
              <Text
                style={tw`font-mono text-sm text-gray-900 dark:text-white mb-1`}>
                pnpm storybook:android
              </Text>
            </View>
            <Text style={tw`text-sm text-gray-600 dark:text-gray-400`}>
              Android 에뮬레이터 또는 실제 기기에서 실행됩니다.
            </Text>
          </View>

          {/* iOS로 보기 */}
          <View>
            <Text
              style={tw`text-base font-bold mb-2 text-gray-900 dark:text-white`}>
              🍎 iOS로 보기
            </Text>
            <View style={tw`bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-2`}>
              <Text
                style={tw`font-mono text-sm text-gray-900 dark:text-white mb-1`}>
                pnpm storybook:ios
              </Text>
            </View>
            <Text style={tw`text-sm text-gray-600 dark:text-gray-400`}>
              iOS 시뮬레이터 또는 실제 기기에서 실행됩니다.
            </Text>
          </View>
        </View>

        {/* 추가 안내 및 외부 링크 */}
        <View
          style={{
            width: '100%',
            marginBottom: 24,
            backgroundColor: '#F1F5F9',
            borderRadius: 8,
            padding: 16,
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 6}}>
            더 알아보기
          </Text>
          <Text style={{fontSize: 15, color: '#444', marginBottom: 4}}>
            • <Text style={{fontWeight: 'bold'}}>스토리북 문서</Text>에서 각
            컴포넌트별 props, 예제, 접근성 가이드를 확인할 수 있습니다.
          </Text>
          <Text style={{fontSize: 15, color: '#444', marginBottom: 4}}>
            • <Text style={{fontWeight: 'bold'}}>Animation</Text> 섹션에서 실제
            애니메이션 동작을 직접 체험해보세요.
          </Text>
          <Text style={{fontSize: 15, color: '#444', marginBottom: 4}}>
            • <Text style={{fontWeight: 'bold'}}>디자인 시스템 가이드</Text>와{' '}
            <Text style={{color: '#4F8EF7'}} onPress={() => {}}>
              Mockly Notion
            </Text>
            에서 더 많은 정보를 확인할 수 있습니다.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const meta: Meta<typeof WelcomeComponentMobile> = {
  title: 'Welcome/디자인 시스템',
  component: WelcomeComponentMobile,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Mockly Design System에 오신 것을 환영합니다! 주요 가이드, 빠른 이동 버튼, 섹션별 안내, 외부 문서 링크, 배너 등 다양한 정보를 제공합니다.',
      },
    },
  },
  tags: ['!autodocs'],
};

export default meta;
type Story = StoryObj<typeof WelcomeComponentMobile>;
export const 디자인_시스템: Story = {
  render: () => <WelcomeComponentMobile />,
};
