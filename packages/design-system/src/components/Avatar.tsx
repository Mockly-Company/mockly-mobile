import React, { useMemo } from 'react';
import { View, Image, ViewProps } from 'react-native';
import { cva, type VariantProps } from 'cva';
import { tw } from '../lib/tw';
import { Text } from './Text';

const avatarVariants = cva('items-center justify-center overflow-hidden', {
  variants: {
    size: {
      sm: 'w-8 h-8 rounded-full',
      md: 'w-10 h-10 rounded-full',
      lg: 'w-12 h-12 rounded-full',
    },
    variant: {
      circle: '',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'circle',
  },
});

export interface AvatarProps extends ViewProps, VariantProps<typeof avatarVariants> {
  uri?: string;
  fallbackText?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ size = 'md', style, uri, fallbackText }) => {
  const containerStyle = useMemo(() => tw.style(avatarVariants({ size })), [size]);
  return (
    <View style={[containerStyle, style]}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <DefaultAvatarImage fallbackText={fallbackText} />
      )}
    </View>
  );
};

const styles = {
  image: tw`w-full h-full`,
};

const DefaultAvatarImage = ({ fallbackText }: { fallbackText?: string }) => {
  return (
    <View style={defaultAvatarStyles.container}>
      <Text style={defaultAvatarStyles.text}>{fallbackText ?? '🙂'}</Text>
    </View>
  );
};

const defaultAvatarStyles = {
  container: tw`w-10 h-10 rounded-full items-center justify-center bg-primary/10`,
  text: tw`text-primary`,
};
