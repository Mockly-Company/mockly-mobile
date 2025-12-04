import { useRef, useCallback } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, FadeInDown } from 'react-native-reanimated';
import BottomSheet from '@gorhom/bottom-sheet';
import { tw, Carousel } from '@mockly/design-system';
import { LoginBottomSheet } from './components/LoginBottomSheet';
import { OnboardingIndicator } from './components/OnboardingIndicator';
import { OnboardingCTA } from './components/OnboardingCTA';
import { OnboardingLoginButton } from './components/OnboardingLoginButton';

type Slide = {
  id: string;
  title: string;
  description: string;
};

const slides: Slide[] = [
  {
    id: '1',
    title: 'AI 면접 코치',
    description: '무료로 AI 면접 코치와 함께 \n 면접을 경험해보세요',
  },
  {
    id: '2',
    title: '면접 파트너',
    description:
      '동네면접으로 스터디 파트너와 \n 함께 연습하며 실력을 키워보세요',
  },
  {
    id: '3',
    title: 'Start!',
    description: '지금 바로 무료로 시작하세요\n꿈의 직장이 기다리고 있습니다',
  },
];

const SlideContent = ({ item }: { item: Slide }) => {
  return (
    <View
      style={tw`flex-1 items-center justify-center px-6`}
      accessible={true}
      accessibilityLabel={`onboarding-slide-${item.id}`}
    >
      <Animated.Text
        entering={FadeInDown.delay(200).springify()}
        style={tw`text-4xl font-extrabold text-zinc-900 dark:text-white text-center`}
      >
        {item.title}
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(300).springify()}
        style={tw`mt-3 text-lg text-zinc-600 dark:text-zinc-300 text-center`}
      >
        {item.description}
      </Animated.Text>
    </View>
  );
};

export const OnboardingScreen = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const currentSlideIndex = useSharedValue(0);
  const hasReachedEnd = useSharedValue(false);

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <View style={tw`flex-1 bg-white dark:bg-zinc-950`}>
      <OnboardingIndicator
        pageCount={slides.length}
        currentIndex={currentSlideIndex}
      />
      <Carousel
        items={slides}
        renderItem={item => <SlideContent item={item} />}
        currentIndex={currentSlideIndex}
        hasReachedEnd={hasReachedEnd}
        interaction="tap"
        loop={true}
      />
      <OnboardingCTA
        isVisible={hasReachedEnd}
        onPress={handleOpenBottomSheet}
      />
      <OnboardingLoginButton onPress={handleOpenBottomSheet} />
      <LoginBottomSheet ref={bottomSheetRef} />
    </View>
  );
};
