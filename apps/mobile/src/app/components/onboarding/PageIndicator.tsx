import { tw } from '@mockly/design-system';
import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';

interface PageIndicatorProps {
  /** 총 페이지 수 */
  pageCount: number;
  /** 현재 페이지 인덱스 (0부터 시작) */
  currentIndex: SharedValue<number>;
}

/**
 * 온보딩 페이지 인디케이터 컴포넌트
 * 가로 바 형태로 현재 페이지를 시각적으로 표시
 */
export const PageIndicator: React.FC<PageIndicatorProps> = ({
  pageCount,
  currentIndex,
}) => {
  return (
    <View style={tw`flex-row items-center justify-start gap-1.5`}>
      {Array.from({ length: pageCount }).map((_, index) => (
        <Bar
          key={index}
          index={index}
          currentIndex={currentIndex}
          pageCount={pageCount}
        />
      ))}
    </View>
  );
};

interface BarProps {
  index: number;
  currentIndex: SharedValue<number>;
  pageCount: number;
}

const Bar: React.FC<BarProps> = ({ index, currentIndex }) => {
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const progress = currentIndex.value;
    const roundedProgress = Math.round(progress);

    const isReachedBar = index <= roundedProgress;
    if (isReachedBar) {
      return {
        opacity: 1,
      };
    }

    return {
      opacity: 0.3,
    };
  });

  return (
    <View style={tw`flex-1`}>
      <Animated.View
        style={[tw`h-2 rounded-full bg-primary dark:bg-primary`, animatedStyle]}
      />
    </View>
  );
};
