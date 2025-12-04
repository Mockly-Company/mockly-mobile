import React from 'react';
import { View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { PageIndicator } from '@app/components/onboarding/PageIndicator';
import { tw } from '@mockly/design-system';

type OnboardingIndicatorProps = {
  pageCount: number;
  currentIndex: SharedValue<number>;
};

export const OnboardingIndicator: React.FC<OnboardingIndicatorProps> = ({
  pageCount,
  currentIndex,
}) => {
  return (
    <View style={tw`absolute top-30 left-6 w-1/3`}>
      <PageIndicator pageCount={pageCount} currentIndex={currentIndex} />
    </View>
  );
};
