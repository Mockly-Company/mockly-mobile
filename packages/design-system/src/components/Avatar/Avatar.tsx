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
        <DefaultAvatarImage fallbackText={fallbackText} size={size} />
      )}
    </View>
  );
};

const defaultAvatarVariants = cva({
  base: 'rounded-full items-center justify-center',
  variants: {
    size: {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const DefaultAvatarImage = ({
  fallbackText,
  size,
}: {
  fallbackText?: string;
  size: 'sm' | 'md' | 'lg';
}) => {
  const containerStyle = useMemo(() => tw.style(defaultAvatarVariants({ size })), [size]);

  return (
    <View style={[containerStyle, tw`bg-primary/10 dark:bg-primary/30`]}>
      <Text color="primary">{fallbackText ?? '🙂'}</Text>
    </View>
  );
};
