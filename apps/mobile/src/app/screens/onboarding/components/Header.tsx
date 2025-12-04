import React from 'react';
import { View } from 'react-native';
import { Text, tw } from '@mockly/design-system';

type HeaderProps = {
  title: string;
  subtitle?: string;
  onSkip?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={tw`px-md pt-lg`}>
      <Text style={tw`text-xl font-bold text-zinc-900 dark:text-white`}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={tw`text-md text-text-secondary dark:text-text-secondary-dark mt-xs`}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};
