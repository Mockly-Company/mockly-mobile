import React, { useCallback } from 'react';
import { LayoutChangeEvent, Pressable } from 'react-native';
import Animated, {
  useAnimatedRef,
  scrollTo,
  SharedValue,
  useDerivedValue,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { tw } from '../../lib/tw';

export type CarouselInteraction = 'tap' | 'swipe' | 'both';

export type CarouselProps<T = unknown> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  currentIndex?: SharedValue<number>;
  hasReachedEnd?: SharedValue<boolean>;
  interaction?: CarouselInteraction;
  loop?: boolean;
};

// NOTE: item 순서 변경의 소지가 있는 경우 key값 개선이 필요. 아래 예시 방법들 참고.
// 1. Key extractor prop 추가 -> 사용자가 key를 직접 지적하는 props 추가
// 2. items 타입에 고유 id 속성 추가하게 사용도록 만들기 -> 도메인에 데이터 처리를 귀찮게할 수 있음.
// 3. Headless 컴포넌트로 Carousel.Item 분리 -> 사용자가 List 출력 로직과 key 지정을 직접 하도록 유도
export function Carousel<T>({
  items,
  renderItem,
  currentIndex,
  hasReachedEnd,
  interaction = 'both',
  loop = false,
}: CarouselProps<T>) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const total = items.length;
  const maxIndex = total - 1;

  const canSwipe = interaction === 'swipe' || interaction === 'both';
  const canTap = interaction === 'tap' || interaction === 'both';

  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      width.set(e.nativeEvent.layout.width);
      height.set(e.nativeEvent.layout.height);
    },
    [width, height]
  );

  const slideContainerStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
    };
  });
  useDerivedValue(() => {
    scrollTo(scrollRef, (currentIndex?.value || 0) * width.value, 0, true);
  }, [currentIndex, width]);

  const handlePress = () => {
    if (currentIndex) {
      const next = loop
        ? (currentIndex.value + 1) % total
        : Math.min(currentIndex.value + 1, maxIndex);

      currentIndex.set(next);
      if (hasReachedEnd && hasReachedEnd.value === false && next === maxIndex) {
        hasReachedEnd.set(true);
      }
    }
  };

  return (
    <Pressable
      style={tw`flex-1 overflow-hidden`}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityHint="다음 슬라이드로 이동"
      disabled={!canTap}
      onLayout={onLayout}
    >
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={canSwipe}
        bounces={false}
      >
        {items.map((item, i) => (
          <Animated.View key={`item-${i}`} style={slideContainerStyle}>
            {renderItem(item)}
          </Animated.View>
        ))}
      </Animated.ScrollView>
    </Pressable>
  );
}
