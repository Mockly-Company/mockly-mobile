import React from 'react';
import { TouchableOpacity, View, ViewProps } from 'react-native';
import { tw, Text } from '@mockly/design-system';

export interface SectionHeaderProps extends ViewProps {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionLabel,
  onPressAction,
  style,
  ...props
}) => {
  return (
    <View
      style={[tw`flex-row items-center justify-between mb-md`, style]}
      {...props}
    >
      <Text variant="h4" style={tw`font-bold text-black dark:text-white`}>
        {title}
      </Text>
      {actionLabel && (
        <TouchableOpacity
          onPress={onPressAction}
          style={tw`px-sm`}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel} 버튼`}
          accessibilityHint={`${title} 섹션의 추가 옵션 보기`}
        >
          <Text
            variant={'h5'}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={tw`text-primary font-bold`}
          >
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
