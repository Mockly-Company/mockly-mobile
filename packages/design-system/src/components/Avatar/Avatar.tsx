import React, { useMemo } from 'react';
import { View, Image, ViewProps } from 'react-native';
import { cva, type VariantProps } from 'cva';
import { tw } from '../../lib/tw';
import { Text } from '../Text/Text';

const avatarVariants = cva({
  base: 'items-center justify-center overflow-hidden',
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
        <Image source={{ uri }} style={tw`w-full h-full`} />
      ) : (
        <DefaultAvatarImage fallbackText={fallbackText} />
      )}
    </View>
  );
};

const DefaultAvatarImage = ({ fallbackText }: { fallbackText?: string }) => {
  return (
    <View style={tw`w-10 h-10 rounded-full items-center justify-center bg-primary/10`}>
      <Text style={tw`text-primary`}>{fallbackText ?? '🙂'}</Text>
    </View>
  );
};
