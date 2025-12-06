import React, { createContext, useContext, useMemo, PropsWithChildren } from 'react';
import { View, ViewProps } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { tw } from '../../lib/tw';

// ========================================
// Context
// ========================================

type IndicatorContextValue = {
  count: number;
  currentIndex: SharedValue<number> | number;
};

const IndicatorContext = createContext<IndicatorContextValue | null>(null);

// ========================================
// Indicator (Root Component)
// ========================================

export interface IndicatorProps extends ViewProps, PropsWithChildren {
  /** 총 아이템 수 */
  count: number;
  /** 현재 인덱스 (0부터 시작, SharedValue 또는 number) */
  currentIndex: SharedValue<number> | number;
}

const IndicatorRoot: React.FC<IndicatorProps> = ({
  count,
  currentIndex,
  children,
  style,
  ...props
}) => {
  const contextValue = useMemo(() => ({ count, currentIndex }), [count, currentIndex]);

  return (
    <IndicatorContext.Provider value={contextValue}>
      <View style={[tw`flex-row items-center justify-start gap-1.5`, style]} {...props}>
        {children}
      </View>
    </IndicatorContext.Provider>
  );
};

// ========================================
// Indicator.Container (레이아웃 컨테이너)
// ========================================

export interface IndicatorContainerProps extends ViewProps, PropsWithChildren {}

const IndicatorContainer: React.FC<IndicatorContainerProps> = ({ children, style, ...props }) => {
  return (
    <View style={[tw`flex-row items-center justify-start gap-1.5`, style]} {...props}>
      {children}
    </View>
  );
};

// ========================================
// Indicator.Bar (바 형태)
// ========================================

export interface IndicatorBarProps extends ViewProps {
  /** 이 Bar의 인덱스 */
  index?: number;
  /** 수동으로 active 상태 설정 (Context 없이 사용 시) */
  active?: boolean;
}

const IndicatorBar: React.FC<IndicatorBarProps> = ({ index, active, style, ...props }) => {
  const context = useContext(IndicatorContext);

  const animatedStyle = useAnimatedStyle(() => {
    // Context 없이 직접 사용하는 경우
    if (!context || index === undefined) {
      return {
        opacity: active ? 1 : 0.3,
      };
    }

    const currentIdx =
      typeof context.currentIndex === 'number' ? context.currentIndex : context.currentIndex.value;

    const roundedProgress = Math.round(currentIdx);
    const isReachedBar = index <= roundedProgress;

    return {
      opacity: isReachedBar ? 1 : 0.3,
    };
  }, [context, index, active]);

  return (
    <View style={tw`flex-1`}>
      <Animated.View
        style={[tw`h-2 rounded-full bg-primary dark:bg-primary`, animatedStyle, style]}
        {...props}
      />
    </View>
  );
};

// ========================================
// Indicator.Dot (점 형태)
// ========================================

export interface IndicatorDotProps extends ViewProps {
  /** 이 Dot의 인덱스 */
  index?: number;
  /** 수동으로 active 상태 설정 (Context 없이 사용 시) */
  active?: boolean;
}

const IndicatorDot: React.FC<IndicatorDotProps> = ({ index, active, style, ...props }) => {
  const context = useContext(IndicatorContext);

  const animatedStyle = useAnimatedStyle(() => {
    // Context 없이 직접 사용하는 경우
    if (!context || index === undefined) {
      return {
        opacity: active ? 1 : 0.3,
        transform: [{ scale: active ? 1.2 : 1 }],
      };
    }

    const currentIdx =
      typeof context.currentIndex === 'number' ? context.currentIndex : context.currentIndex.value;

    const isActive = Math.round(currentIdx) === index;

    return {
      opacity: isActive ? 1 : 0.3,
      transform: [{ scale: isActive ? 1.2 : 1 }],
    };
  }, [context, index, active]);

  return (
    <Animated.View
      style={[
        tw`h-3 mx-auto aspect-square rounded-full bg-primary dark:bg-primary`,
        animatedStyle,
        style,
      ]}
      {...props}
    />
  );
};

// ========================================
// Export
// ========================================
IndicatorDot.displayName = 'Indicator.Dot';
IndicatorBar.displayName = 'Indicator.Bar';
IndicatorContainer.displayName = 'Indicator.Container';

export const Indicator = Object.assign(IndicatorRoot, {
  Container: IndicatorContainer,
  Bar: IndicatorBar,
  Dot: IndicatorDot,
});
