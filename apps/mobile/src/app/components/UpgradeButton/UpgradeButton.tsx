import { TouchableOpacity } from 'react-native';
import { tw, Text, Badge, Icon } from '@mockly/design-system';

import { PlanType } from '@mockly/domain';
import { useUserProfile } from '@features/user';

interface PremiumBadgeButtonProps {
  onPress: () => void;
}

export function UpgradeButton({ onPress }: PremiumBadgeButtonProps) {
  const { subscription } = useUserProfile();

  const isPremium = subscription.planType === PlanType.enum.PREMIUM;
  if (isPremium) return;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={tw.style('flex-row items-center px-3 py-1.5 rounded-full')}
    >
      <Badge
        size="md"
        style={tw`bg-transparent dark:bg-purple-400 border-purple-600 dark:border-purple-400`}
      >
        <Icon
          name="dollar-sign"
          style={tw`text-purple-600 dark:text-black mr-1`}
          size={12}
        />
        <Text
          variant="caption2"
          weight="bold"
          style={tw`text-purple-600 dark:text-black`}
        >
          UPGRADE
        </Text>
      </Badge>
    </TouchableOpacity>
  );
}
