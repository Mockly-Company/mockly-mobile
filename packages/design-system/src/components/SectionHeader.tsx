import React from 'react';
import { TouchableOpacity, View, ViewProps } from 'react-native';
import { tw } from '../lib/tw';
import { Text } from './Text';

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
    <View style={[styles.container, style]} {...props}>
      <Text variant="h4" style={styles.title}>
        {title}
      </Text>
      {actionLabel && (
        <TouchableOpacity
          onPress={onPressAction}
          style={styles.actionButton}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel} 버튼`}
          accessibilityHint={`${title} 섹션의 추가 옵션 보기`}
        >
          <Text variant={'h5'} numberOfLines={1} ellipsizeMode="tail" style={styles.actionLabel}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = {
  container: tw`flex-row items-center justify-between mb-md`,
  title: tw`font-bold text-black dark:text-white`,
  actionButton: tw`px-sm`,
  actionLabel: tw`text-primary font-bold`,
};
