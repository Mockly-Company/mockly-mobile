import { View, ScrollView, TouchableOpacityProps } from 'react-native';
import { tw, Text, Button, Spacer } from '@mockly/design-system';

import { SubscriptionCard, TokenUsageCard } from '@features/subscription';
import { LogoutButton } from '@features/auth/components/LogoutButton';
import { useNavigation } from '@react-navigation/native';

import { useProductBottomSheet } from '../product/ProductBottomSheetProvider';
import { useUserProfile } from '@features/user';
import { useQueryClient } from '@tanstack/react-query';
import { queries } from '@configs/queryClient/QueryKeys';
import { useRefreshControl } from '@hooks/useRefreshControl';

export const MyPageScreen = () => {
  const { subscription } = useUserProfile();
  const isPaidPlan = subscription.type !== 'Free';

  const { expand } = useProductBottomSheet();
  const handleUpgrade = () => {
    expand();
  };

  const navigation = useNavigation();
  const handleViewHistory = () => {
    navigation.navigate('Payments', { screen: 'PaymentHistory' });
  };
  const handleCancelSubscription = () => {
    navigation.navigate('Subscription', { screen: 'SubscriptionCancel' });
  };

  const queryClient = useQueryClient();
  const RefreshControl = useRefreshControl(async () => {
    await queryClient.invalidateQueries({
      queryKey: queries.subscription.detail._def,
    });
  });

  return (
    <ScrollView
      style={tw`flex-1`}
      contentContainerStyle={tw`pb-8 px-4 gap-4`}
      showsVerticalScrollIndicator={false}
      refreshControl={RefreshControl}
    >
      <Spacer size="2xl" />
      <UserBaseProfile />

      <SubscriptionCard />

      <TokenUsageCard />

      {isPaidPlan && <SubscriptionChange handlePromotion={handleUpgrade} />}

      {isPaidPlan && (
        <CancelSubscription handleCancel={handleCancelSubscription} />
      )}

      <PaymentHistoryButton onPress={handleViewHistory} />
      <LogoutButton />
    </ScrollView>
  );
};

const UserBaseProfile = () => {
  const { user } = useUserProfile();
  return (
    <View style={tw`items-center`}>
      <Text variant="h2" color="text" style={tw`mb-2`}>
        {user.name || '이름 없음'}
      </Text>
      <Text variant="body" color="textSecondary" style={tw`mb-1`}>
        {user.email}
      </Text>
    </View>
  );
};

type SubscriptionChangeProps = {
  handlePromotion: TouchableOpacityProps['onPress'];
};
const SubscriptionChange = ({ handlePromotion }: SubscriptionChangeProps) => {
  return (
    <Button
      onPress={handlePromotion}
      accessibilityLabel="플랜 교체"
      accessibilityHint="플랜 선택 화면으로 이동합니다."
    >
      <Button.Text>플랜 변경</Button.Text>
    </Button>
  );
};

interface PaymentHistoryButtonProps {
  onPress: TouchableOpacityProps['onPress'];
}
const PaymentHistoryButton = ({ onPress }: PaymentHistoryButtonProps) => {
  return (
    <Button
      onPress={onPress}
      variant="outline"
      style={tw`w-full`}
      accessibilityLabel="결제 내역"
      accessibilityHint="결제 내역 화면으로 이동합니다"
    >
      <Button.Text>결제 내역 보기</Button.Text>
    </Button>
  );
};

type CancelSubscription = {
  handleCancel: TouchableOpacityProps['onPress'];
};
const CancelSubscription = ({ handleCancel }: CancelSubscription) => {
  return (
    <Button
      variant="error"
      onPress={handleCancel}
      accessibilityLabel="구독 취소"
      accessibilityHint="구독 취소 화면으로 이동합니다"
    >
      <Button.Text>구독 취소</Button.Text>
    </Button>
  );
};
