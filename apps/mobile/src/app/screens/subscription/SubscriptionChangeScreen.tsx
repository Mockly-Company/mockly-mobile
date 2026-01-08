import { tw, Text, Button, Card } from '@mockly/design-system';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import { SubscriptionParamList } from '@app/navigation/types';
import { MockProducts } from '@mockly/domain';
import { useNavigation } from '@react-navigation/native';

import { toast } from '@libs/toast';
import { useUserProfile } from '@features/user';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '@configs/queryClient/QueryKeys';
import api from '@mockly/api';
import dayjs from 'dayjs';
import { useLayoutEffect } from 'react';

type Props = StackScreenProps<SubscriptionParamList, 'SubscriptionChange'>;

export const SubscriptionChangeScreen = ({ route }: Props) => {
  const { planType } = route.params;
  const navigation = useNavigation();

  const { subscription } = useUserProfile();
  const { data: expectedReceipt } = useSuspenseQuery({
    ...queries.subscription.getExpectedChangeAmount(planType),
    gcTime: 0,
  });
  const { mutate: changeSubscription, isPending } = useMutation({
    mutationKey: queries.subscription.change().queryKey,
    mutationFn: api.subscription.patchUserSubscription,
    onSuccess: () => {
      toast.success('요금제 변경 성공');
      navigation.navigate('MainTabs', { screen: 'Home' });
    },
    onError: () => {
      toast.warning('요금제 변경 실패');
    },
  });

  useLayoutEffect(() => {
    if (subscription.type === 'Free') {
      navigation.navigate('MainTabs', { screen: 'Home' });
    }
  }, []);
  if (subscription.type === 'Free') {
    return null;
  }
  const newSubscription = MockProducts[planType];
  const userSubscription = MockProducts[subscription.planSnapshot.name];
  const handleConfirmChange = () => {
    changeSubscription({
      confirmedAmount: newSubscription.price,
      targetPlanId: newSubscription.id,
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (!userSubscription) {
    handleCancel();
    return null;
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-background dark:bg-background-dark`}>
      <ScrollView contentContainerStyle={tw`p-6`}>
        <Text variant="h1" style={tw`mb-2`}>
          플랜 변경
        </Text>
        <Text variant="body" color="textSecondary" style={tw`mb-8`}>
          등록된 결제 수단의 플랜이 변경됩니다
        </Text>

        <View style={tw`mb-6`}>
          <Text variant="caption" color="textSecondary" style={tw`mb-2`}>
            현재 플랜
          </Text>
          <Card variant="elevated" padding="lg" style={tw`rounded-lg`}>
            <Text variant="h3" style={tw`mb-1`}>
              {userSubscription.name}
            </Text>
            <Text variant="body" color="textSecondary">
              {userSubscription.price.toLocaleString()}원 / 월
            </Text>
          </Card>
        </View>

        <View style={tw`items-center mb-6`}>
          <Text variant="h2" color="textSecondary">
            ↓
          </Text>
        </View>

        <View style={tw`mb-6`}>
          <Text variant="caption" color="textSecondary" style={tw`mb-2`}>
            변경할 플랜
          </Text>
          <Card
            variant="elevated"
            padding="lg"
            style={tw`rounded-lg border-2 border-primary`}
          >
            <Text variant="h3" style={tw`mb-1`}>
              {newSubscription.name}
            </Text>
            <Text variant="body" color="textSecondary">
              {newSubscription.price.toLocaleString()}원 / 월
            </Text>
          </Card>
        </View>

        <View
          style={tw`p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-6`}
        >
          <Text variant="caption" weight="semibold" style={tw`mb-2`}>
            플랜 변경 안내
          </Text>
          <Text variant="caption" color="textSecondary">
            • 남은 기간에 대해 일할 계산되어 즉시 결제됩니다.{'\n'}• 기존 플랜은
            즉시 변경됩니다.{'\n'}• 다음 결제일부터는 새 플랜 금액으로 정기
            결제됩니다.
          </Text>
        </View>

        {/* 즉시 결제 금액 */}
        <Card variant="elevated" padding="lg" style={tw`rounded-lg mb-4`}>
          <Text variant="caption" color="textSecondary" style={tw`mb-2`}>
            즉시 결제 금액
          </Text>
          <Text variant="h2" color="primary" style={tw`mb-1`}>
            {expectedReceipt.immediateAmount.toLocaleString()}원
          </Text>
          <Text variant="caption" color="textSecondary">
            기존 플랜 남은 기간 차액
          </Text>
        </Card>

        {/* 결제 상세 정보 */}
        <View
          style={tw`p-4 border border-surface dark:border-surface-dark rounded-lg mb-8`}
        >
          <View
            style={tw`flex-row justify-between mb-3 pb-3 border-b border-gray-200`}
          >
            <Text variant="body" weight="semibold">
              결제 상세
            </Text>
          </View>
          <View style={tw`flex-row justify-between mb-2`}>
            <Text variant="body" color="textSecondary">
              현재 플랜 ({expectedReceipt.currentPlan.name})
            </Text>
            <Text variant="body">
              {expectedReceipt.currentPlan.price.toLocaleString()}원
            </Text>
          </View>
          <View style={tw`flex-row justify-between mb-2`}>
            <Text variant="body" color="textSecondary">
              변경 플랜 ({expectedReceipt.targetPlan.name})
            </Text>
            <Text variant="body">
              {expectedReceipt.targetPlan.price.toLocaleString()}원
            </Text>
          </View>
          <View
            style={tw`flex-row justify-between mb-3 pt-3 border-t border-gray-200`}
          >
            <Text variant="body" weight="semibold">
              즉시 결제 금액
            </Text>
            <Text variant="h4" color="primary">
              {expectedReceipt.immediateAmount.toLocaleString()}원
            </Text>
          </View>
          <View style={tw`flex-row justify-between mb-2`}>
            <Text variant="body" color="textSecondary">
              다음 정기 결제 금액
            </Text>
            <Text variant="body" weight="semibold">
              {expectedReceipt.nextBillingAmount.toLocaleString()}원
            </Text>
          </View>
          <View style={tw`flex-row justify-between mb-2`}>
            <Text variant="body" color="textSecondary">
              다음 결제일
            </Text>
            <Text variant="body">
              {dayjs(expectedReceipt.nextBillingDate).format('YYYY년 M월 D일')}
            </Text>
          </View>
          <View style={tw`flex-row justify-between`}>
            <Text variant="body" color="textSecondary">
              결제 수단
            </Text>
            <Text variant="body">등록된 카드</Text>
          </View>
        </View>

        <View style={tw`gap-3`}>
          <Button
            onPress={handleConfirmChange}
            disabled={isPending}
            accessibilityLabel="구독 변경 요청"
            accessibilityHint="구독 변경을 요청합니다"
          >
            <Button.Text>
              {isPending ? '변경 중...' : '플랜 변경하기'}
            </Button.Text>
          </Button>
          <Button
            variant="outline"
            onPress={handleCancel}
            disabled={isPending}
            accessibilityLabel="변경 취소"
            accessibilityHint="구독 변경을 취소합니다."
          >
            <Button.Text>취소</Button.Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
