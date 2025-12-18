import { tw, Text, Button } from '@mockly/design-system';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import { SubscriptionParamList } from '@app/navigation/types';

import { MockProducts } from '@mockly/domain';

import { toast } from '@shared/utils/toast';
import { useNavigation } from '@react-navigation/native';
import { useUserProfile } from '@features/user';
import { useMutation } from '@tanstack/react-query';
import { queries } from '@shared/api/QueryKeys';
import api from '@mockly/api';

type Props = StackScreenProps<SubscriptionParamList, 'SubscriptionCancel'>;

export const SubscriptionCancelScreen = ({ navigation }: Props) => {
  const { subscription: userSubscription } = useUserProfile();

  const naviagtion = useNavigation();
  const { mutate: deleteUserSubscription, isPending } = useMutation({
    mutationKey: queries.subscription.cancel().queryKey,
    mutationFn: api.subscription.deleteUserSubscription,
    onSuccess: () => {
      toast.success('구독 취소 완료');
      naviagtion.navigate('MainTabs', { screen: 'Home' });
    },
    onError: () => {
      toast.warning('구독 취소 실패', '고객센터에 문의해주세요.');
    },
  });

  if (userSubscription.planType === 'FREE') {
    naviagtion.navigate('MainTabs', { screen: 'Home' });
    return;
  }

  const currentProduct = MockProducts[userSubscription.planType];

  const handleCancelSubscription = () => {
    deleteUserSubscription();
  };

  const handleConfirmDelete = () => {
    Alert.alert(
      '구독 취소',
      '정말 구독을 취소하시겠습니까?\n남은 기간까지는 사용 가능하며, 기간 종료 후 FREE 플랜으로 전환됩니다.',
      [
        {
          text: '아니요',
          style: 'cancel',
        },
        {
          text: '네, 취소합니다',
          style: 'destructive',
          onPress: handleCancelSubscription,
        },
      ],
    );
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-background dark:bg-background-dark`}>
      <ScrollView contentContainerStyle={tw`p-6`}>
        <View style={tw`items-center mb-8`}>
          <View
            style={tw`w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full items-center justify-center mb-4`}
          >
            <Text variant="h1">⚠️</Text>
          </View>
          <Text variant="h1" align="center" style={tw`mb-2`}>
            구독을 취소하시겠습니까?
          </Text>
          <Text variant="body" color="textSecondary" align="center">
            언제든지 다시 구독할 수 있습니다
          </Text>
        </View>

        <View style={tw`mb-6`}>
          <Text variant="caption" color="textSecondary" style={tw`mb-2`}>
            현재 플랜
          </Text>
          <View
            style={tw`p-4 border border-surface dark:border-surface-dark rounded-lg`}
          >
            <Text variant="h3" style={tw`mb-1`}>
              {currentProduct.name}
            </Text>
            <Text variant="body" color="textSecondary">
              {currentProduct.price.toLocaleString()}원 /{' '}
              {currentProduct.billingPeriod}월
            </Text>
          </View>
        </View>

        <View
          style={tw`p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-6`}
        >
          <Text variant="caption" weight="semibold" style={tw`mb-2`}>
            구독 취소 안내
          </Text>
          <Text variant="caption" color="textSecondary">
            • 남은 기간까지는 현재 플랜을 계속 사용할 수 있습니다{'\n'}• 기간
            종료 후 자동으로 FREE 플랜으로 전환됩니다{'\n'}• 추가 요금은
            청구되지 않습니다{'\n'}• 언제든지 다시 구독할 수 있습니다
          </Text>
        </View>

        <View style={tw`p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mb-8`}>
          <Text
            variant="caption"
            weight="semibold"
            style={tw`mb-2 text-red-600 dark:text-red-400`}
          >
            주의사항
          </Text>
          <Text variant="caption" style={tw`text-red-600 dark:text-red-400`}>
            • FREE 플랜으로 전환되면 일부 기능이 제한됩니다{'\n'}• 저장된
            데이터는 유지되지만 프리미엄 기능은 사용할 수 없습니다
          </Text>
        </View>

        <View style={tw`gap-3`}>
          <Button variant="outline" onPress={handleCancel} disabled={isPending}>
            <Button.Text>계속 사용하기</Button.Text>
          </Button>
          <Button
            onPress={handleConfirmDelete}
            disabled={isPending}
            style={tw`bg-red-500`}
          >
            <Button.Text>
              {isPending ? '취소 중...' : '구독 취소하기'}
            </Button.Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
