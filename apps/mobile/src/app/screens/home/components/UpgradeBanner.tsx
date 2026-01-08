import { View, TouchableOpacity } from 'react-native';
import { tw, Text } from '@mockly/design-system';
import { PlanType, PLAN_ICONS, ProductService } from '@mockly/domain';
import LinearGradient from 'react-native-linear-gradient';
import { useProductBottomSheet } from '@app/screens/product/ProductBottomSheetProvider';

interface UpgradeBannerProps {
  currentPlan: PlanType;
}

export function UpgradeBanner({ currentPlan }: UpgradeBannerProps) {
  const nextPlan = ProductService.getNextPlan(currentPlan);
  const { expand } = useProductBottomSheet();
  if (!nextPlan || currentPlan === PlanType.enum.Premium) {
    return null;
  }

  const nextPlanType = nextPlan.planType;
  const nextPlanIcon = PLAN_ICONS[nextPlanType];

  const handleUpgrade = () => {
    expand();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleUpgrade}
      accessibilityRole="button"
      accessibilityLabel={`${nextPlanType} 플랜으로 업그레이드`}
      accessibilityHint="프리미엄 플랜의 더 많은 기능을 사용할 수 있습니다"
    >
      <LinearGradient
        colors={['#a855f7', '#ec4899']}
        style={tw`p-4 rounded-lg mb-4`}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-1`}>
            <View style={tw`flex-row items-center mb-1`}>
              <Text style={tw`text-2xl mr-2`}>{nextPlanIcon}</Text>
              <Text variant="h4" style={tw`text-white font-bold`}>
                {nextPlanType} 플랜으로 업그레이드
              </Text>
            </View>
            <Text variant="body" style={tw`text-white opacity-90`}>
              더 많은 기능과 혜택을 누려보세요
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
