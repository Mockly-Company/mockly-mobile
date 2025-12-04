import React from 'react';
import { View } from 'react-native';
import { Button, Text, tw } from '@mockly/design-system';

type FooterProps = {
  index: number;
  total: number;
  onNext: () => void;
  onComplete: () => void;
};

export const Footer: React.FC<FooterProps> = ({
  index,
  total,
  onNext,
  onComplete,
}) => {
  const isLast = index >= total - 1;
  return (
    <View style={tw`px-md pb-lg`}>
      <Text
        style={tw`text-text-secondary dark:text-text-secondary-dark mb-sm`}
      >{`${index + 1} / ${total}`}</Text>
      <Button
        variant="primary"
        size="medium"
        onPress={isLast ? onComplete : onNext}
      >
        {isLast ? '시작하기' : '다음'}
      </Button>
    </View>
  );
};
