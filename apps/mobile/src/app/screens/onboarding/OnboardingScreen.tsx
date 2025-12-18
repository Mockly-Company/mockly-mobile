import { useRef, useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  tw,
  Carousel,
  FadeInAnimation,
  Text,
  Indicator,
} from '@mockly/design-system';
import { LoginBottomSheet } from './LoginBottomSheet';
import { OnboardingCTA } from './components/OnboardingCTA';
import { OnboardingSlide } from './components/OnboardingSlide';
import { SafeAreaView } from 'react-native-safe-area-context';

export type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
};

const slides: OnboardingSlide[] = [
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

export const OnboardingScreen = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const currentSlideIndex = useSharedValue(0);
  const hasReachedEnd = useSharedValue(false);

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  return (
    <SafeAreaView style={tw`flex-1 bg-white dark:bg-zinc-950`}>
      <CarouselIndicator
        pageCount={slides.length}
        currentIndex={currentSlideIndex}
      />
      <Carousel
        items={slides}
        renderItem={item => (
          <OnboardingSlide title={item.title} description={item.description} />
        )}
        currentIndex={currentSlideIndex}
        hasReachedEnd={hasReachedEnd}
        interaction="tap"
        loop={true}
      />
      <Header onPressLogin={handleOpenBottomSheet} />
      <Footer
        isButtonVisible={hasReachedEnd}
        onCTAPress={handleOpenBottomSheet}
      />
      <LoginBottomSheet ref={bottomSheetRef} />
    </SafeAreaView>
  );
};

const Header = ({ onPressLogin }: { onPressLogin: () => void }) => {
  return (
    <TouchableOpacity
      style={tw`absolute top-15 right-6`}
      onPress={onPressLogin}
    >
      <Text variant="caption" color="primary" weight="semibold">
        로그인
      </Text>
    </TouchableOpacity>
  );
};

const Footer = ({
  isButtonVisible,
  onCTAPress,
}: {
  isButtonVisible: SharedValue<boolean>;
  onCTAPress: () => void;
}) => {
  const textStyle = useAnimatedStyle(() => ({
    display: isButtonVisible.value ? 'none' : 'flex',
  }));
  return (
    <SafeAreaView>
      <FadeInAnimation
        direction={'up'}
        delay={400}
        useSpring={true}
        style={tw`absolute left-6 right-6 bottom-6`}
      >
        <OnboardingCTA isVisible={isButtonVisible} onPress={onCTAPress} />

        <Animated.Text
          style={[
            tw`text-center text-zinc-500 dark:text-zinc-400 text-sm font-medium`,
            textStyle,
          ]}
        >
          탭해서 계속하기
        </Animated.Text>
      </FadeInAnimation>
    </SafeAreaView>
  );
};

type CarouselIndicatorProps = {
  pageCount: number;
  currentIndex: SharedValue<number>;
};

export const CarouselIndicator: React.FC<CarouselIndicatorProps> = ({
  pageCount,
  currentIndex,
}) => {
  return (
    <View style={tw`absolute top-30 left-6 w-1/3`}>
      <Indicator count={pageCount} currentIndex={currentIndex}>
        {Array.from({ length: pageCount }).map((_, index) => (
          <Indicator.Bar key={index} index={index} />
        ))}
      </Indicator>
    </View>
  );
};
