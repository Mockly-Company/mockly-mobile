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
    if (scrollRef) {
      scrollTo(scrollRef, (currentIndex?.value || 0) * width.value, 0, true);
    }
  });

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
