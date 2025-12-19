import { tw, Text, Button, Card } from '@mockly/design-system';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import { SubscriptionParamList } from '@app/navigation/types';
import { MockProducts } from '@mockly/domain';
import { useNavigation } from '@react-navigation/native';

import { toast } from '@shared/utils/toast';
import { useUserProfile } from '@features/user';
import { useMutation } from '@tanstack/react-query';
import { queries } from '@shared/api/QueryKeys';
import api from '@mockly/api';

type Props = StackScreenProps<SubscriptionParamList, 'SubscriptionChange'>;

export const SubscriptionChangeScreen = ({ route }: Props) => {
  const { planType } = route.params;
  const navigation = useNavigation();

  const { subscription: useSubscription } = useUserProfile();

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

  const handleConfirmChange = () => {
    changeSubscription({ plan: planType });
  };
  if (useSubscription.planType === 'FREE') {
    navigation.navigate('MainTabs', { screen: 'Home' });
    return;
  }
  const newSubscription = MockProducts[planType];
  const userSubscription = MockProducts[useSubscription.planType];

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
            • 남은 기간에 대해 일할 계산되어 &quot;이번달 결제 금액&quot;만큼
            결제일에 결제됩니다.{'\n'}• 기존 플랜은 즉시 변경됩니다{'\n'}
          </Text>
        </View>

        <View
          style={tw`p-4 border border-surface dark:border-surface-dark rounded-lg mb-8`}
        >
          <View style={tw`flex-row justify-between mb-2`}>
            <Text variant="body" color="textSecondary">
              이번달 결제 금액
            </Text>
            <Text variant="body" weight="semibold">
              {newSubscription.price.toLocaleString()}원
            </Text>
          </View>
          <View style={tw`flex-row justify-between mb-2`}>
            <Text variant="body" color="textSecondary">
              정기 결제 금액
            </Text>
            <Text variant="body" weight="semibold">
              {newSubscription.price.toLocaleString()}원
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
