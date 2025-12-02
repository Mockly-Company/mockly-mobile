import React from 'react';
import { View } from 'react-native';
import { Text, tw } from '@mockly/design-system';

type HeaderProps = {
  title: string;
  subtitle?: string;
  onSkip?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const styles = {
    container: tw`px-md pt-lg`,
    title: tw`text-xl font-bold text-zinc-900 dark:text-white`,
    subtitle: tw`text-md text-text-secondary dark:text-text-secondary-dark mt-xs`,
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};
