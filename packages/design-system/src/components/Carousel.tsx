import React from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedRef,
  scrollTo,
  SharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import { tw } from '../lib/tw';

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
  const { width } = useWindowDimensions();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const total = items.length;
  const maxIndex = total - 1;

  const canSwipe = interaction === 'swipe' || interaction === 'both';
  const canTap = interaction === 'tap' || interaction === 'both';

  useDerivedValue(() => {
    scrollTo(scrollRef, (currentIndex?.value || 0) * width, 0, true);
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
    <View style={styles.container}>
      <Pressable
        style={styles.pressableContainer}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityHint="다음 슬라이드로 이동"
        disabled={!canTap}
      >
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={canSwipe}
          bounces={false}
          style={styles.pager}
        >
          {items.map((item, i) => (
            <View key={i} style={[styles.itemContainer, { width, height: '100%' }]}>
              {renderItem(item)}
            </View>
          ))}
        </Animated.ScrollView>
      </Pressable>
    </View>
  );
}

const styles = {
  container: tw`flex-1`,
  pressableContainer: tw`flex-1`,
  animatedContainer: tw`flex-1`,
  pager: tw`flex-1`,
  itemContainer: tw`flex-1 items-center justify-center px-6`,
  indicator: tw`items-center mt-sm`,
};
