import {
  tw,
  Text,
  Button,
  Card,
  Spacer,
  Checkbox,
} from '@mockly/design-system';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import { SubscriptionParamList } from '@app/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { useUserProfile } from '@features/user';
import { MockProducts, PaidPlanType } from '@mockly/domain';
import { PLAN_FEATURES } from '@mockly/domain';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@mockly/api';
import { queries } from '@configs/queryClient/QueryKeys';
import dayjs from 'dayjs';

type Props = StackScreenProps<SubscriptionParamList, 'Subscribe'>;

export const SubscribeScreen = ({ route }: Props) => {
  const { planType, orderId } = route.params;
  const { mutateAsync: createPaymentId, isPending } = useMutation({
    mutationKey: queries.payment.issueId().queryKey,
    mutationFn: api.payment.postPaymentUId,
  });

  const { subscription: userSubscription } = useUserProfile();

  const navigation = useNavigation();
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);

  const selectedProduct = MockProducts[planType];

  const handlePayment = async () => {
    const isAlreadySubscribedPlan = userSubscription.planType === planType;
    if (isAlreadySubscribedPlan) {
      navigation.navigate('MainTabs', { screen: 'Home' });
      return;
    }

    const { paymentUid } = await createPaymentId({
      amount: selectedProduct.price,
      orderId: orderId,
      planId: planType,
    });

    navigation.navigate('Payments', {
      screen: 'SubscriptionPayment',
      params: {
        amount: selectedProduct.price,
        paymentUid,
        orderName: selectedProduct.name,
        billingPeriod: selectedProduct.billingPeriod,
        currency: selectedProduct.currency,
        planType: selectedProduct.planType,
      },
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const toggleTermsAgreed = (checked: boolean) => {
    setIsTermsAgreed(checked);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-background dark:bg-background-dark`}>
      <ScrollView contentContainerStyle={tw`p-6`}>
        <Header title="구독 확인" subTitle="구독 내용을 확인해주세요" />

        <OrderDetail planType={planType} />

        <PaymentDetail price={selectedProduct.price} />

        <Cautions />

        <AgreeToTerm
          handleToggleCheck={toggleTermsAgreed}
          checked={isTermsAgreed}
        />

        <PaymentButton
          onPress={handlePayment}
          disabled={!isTermsAgreed || isPending}
          isLoading={isPending}
        />

        <Spacer size="lg" />

        <CancelButton onPress={handleCancel} disabled={isPending} />
      </ScrollView>
    </SafeAreaView>
  );
};

const Header = ({ title, subTitle }: { title: string; subTitle: string }) => {
  return (
    <>
      <Text variant="h1" style={tw`mb-2`}>
        {title}
      </Text>
      <Text variant="body" color="textSecondary" style={tw`mb-8`}>
        {subTitle}
      </Text>
    </>
  );
};

const OrderDetail = ({ planType }: { planType: PaidPlanType }) => {
  const product = MockProducts[planType];
  const planFeatures = PLAN_FEATURES[planType];
  return (
    <View style={tw`mb-6`}>
      <Text variant="caption" color="textSecondary" style={tw`mb-2`}>
        선택한 플랜
      </Text>
      <Card
        variant="elevated"
        padding="lg"
        style={tw`rounded-lg border-2 border-primary`}
      >
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <Text variant="h3">{product.name}</Text>
          <Text variant="h3" color="primary">
            {product.price.toLocaleString()}원
          </Text>
        </View>
        <Text variant="caption" color="textSecondary" style={tw`mb-3`}>
          매월 자동 결제
        </Text>
        <View style={tw`border-t border-surface dark:border-surface-dark pt-3`}>
          <Text variant="caption" weight="semibold" style={tw`mb-2`}>
            포함된 기능
          </Text>
          {planFeatures.displayFeatures.map((feature, index) => (
            <Text
              key={index}
              variant="caption"
              color="textSecondary"
              style={tw`mb-1`}
            >
              • {feature}
            </Text>
          ))}
        </View>
      </Card>
    </View>
  );
};

const Cautions = () => {
  return (
    <View style={tw`p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-6`}>
      <Text variant="caption" weight="semibold" style={tw`mb-2`}>
        유의사항
      </Text>
      <Text variant="caption" color="textSecondary">
        • 구독은 매월 자동으로 갱신되며, 결제일에 자동으로 결제됩니다.
        {'\n'}• 구독 취소는 마이페이지에서 언제든지 가능합니다.
        {'\n'}• 구독 취소 시 다음 결제일까지 서비스를 이용할 수 있습니다.
        {'\n'}• 환불은 결제 후 7일 이내, 서비스 이용 전에만 가능합니다.
      </Text>
    </View>
  );
};

const PaymentDetail = ({ price }: { price: number }) => {
  return (
    <View
      style={tw`p-4 border border-surface dark:border-surface-dark rounded-lg mb-6`}
    >
      <Text variant="body" weight="semibold" style={tw`mb-3`}>
        결제 정보
      </Text>
      <View style={tw`flex-row justify-between mb-2`}>
        <Text variant="body" color="textSecondary">
          첫 결제 금액
        </Text>
        <Text variant="body" weight="semibold">
          {price.toLocaleString()}원
        </Text>
      </View>
      <View style={tw`flex-row justify-between mb-2`}>
        <Text variant="body" color="textSecondary">
          다음 결제일
        </Text>
        <Text variant="body">
          {dayjs().add(1, 'month').format('YYYY년 M월 D일')}
        </Text>
      </View>
      <View style={tw`flex-row justify-between`}>
        <Text variant="body" color="textSecondary">
          결제 주기
        </Text>
        <Text variant="body">매월 자동 결제</Text>
      </View>
    </View>
  );
};

type AgreeToTermProps = {
  handleToggleCheck: (checked: boolean) => void;
  checked: boolean;
};
const AgreeToTerm = ({ handleToggleCheck, checked }: AgreeToTermProps) => {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={handleToggleCheck}
      label="구독 서비스 이용약관 및 개인정보 처리방침에 동의합니다"
      style={tw`mb-8`}
    />
  );
};
type PaymentButtonProps = {
  onPress: () => void;
  disabled: boolean;
  isLoading: boolean;
};
const PaymentButton = ({
  onPress,
  disabled,
  isLoading,
}: PaymentButtonProps) => {
  return (
    <Button
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel="결제 진행"
      accessibilityHint="선택한 플랜으로 결제를 진행합니다"
    >
      <Button.Text>{isLoading ? '처리 중...' : '결제하기'}</Button.Text>
    </Button>
  );
};
type CancelButtonProps = {
  onPress: () => void;
  disabled: boolean;
};
const CancelButton = ({ onPress, disabled }: CancelButtonProps) => {
  return (
    <Button
      variant="outline"
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel="결제 취소"
      accessibilityHint="결제를 취소합니다"
    >
      <Button.Text>취소</Button.Text>
    </Button>
  );
};
