import { useCallback, useState, RefObject, PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import GoHomeBottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { Text, tw } from '@mockly/design-system';
import { PaidPlanType } from '@mockly/domain';
import api from '@mockly/api';

import { BottomSheet } from '@app/components/BottomSheet/BottomSheet';
import { useUserProfile } from '@features/user';
import { queries } from '@shared/api/QueryKeys';
import { toast } from '@shared/utils/toast';

import { ProductBanner } from './components/ProductBanner';
import { ProductList } from './components/ProductList';
import { ProductDetail } from './components/ProductDetail';
import { ProductSummary } from './components/ProductSummary';
import { PurchaseCTA } from './components/PurchaseCTA';

export interface PlanSelectionBottomSheetProps {
  bottomSheetRef: RefObject<GoHomeBottomSheet | null>;
}

type ActionType = 'subscribe' | 'change' | 'notSelected' | 'loading';

const PURCHASE_CTA_TEXT: Record<ActionType, string> = {
  subscribe: '구독하기',
  change: '변경하기',
  notSelected: '플랜을 선택해주세요',
  loading: '처리 중...',
};

export const ProductsScreen = ({
  bottomSheetRef,
}: PlanSelectionBottomSheetProps) => {
  const navigation = useNavigation();
  const { subscription: userSubscription } = useUserProfile();

  const [selectedPlanType, setSelectedPlanType] = useState<PaidPlanType | null>(
    null,
  );
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useMutation({
    mutationKey: queries.order.issueId().queryKey,
    mutationFn: api.order.postSubscriptionOrder,
    onError: () => toast.warning('주문 생성 실패'),
  });

  const getActionType = (): ActionType => {
    if (!selectedPlanType) return 'notSelected';
    if (isCreatingOrder) return 'loading';
    return userSubscription.planType === 'FREE' ? 'subscribe' : 'change';
  };

  const actionType = getActionType();
  const isActionDisabled =
    actionType === 'notSelected' || actionType === 'loading';

  // ========== 결제 써드파티 라이브러리의 진행상황 확인 코드 ==========
  const isNotOnPaymentProcess = useCallback(() => {
    const currentRoute = navigation.getState()?.routes.at(-1);
    const isOnPayment = currentRoute?.name.startsWith('Payment') || false;
    const isOnSubscription =
      currentRoute?.name.startsWith('Subscription') || false;
    return !isOnPayment && !isOnSubscription;
  }, [navigation]);

  const handleSubscribe = useCallback(
    async (planType: PaidPlanType) => {
      const { orderId } = await createOrder({
        planId: 'mock-plan',
        planType,
      });

      navigation.navigate('Subscription', {
        screen: 'Subscribe',
        params: { orderId, planType },
      });
    },
    [createOrder, navigation],
  );
  const handleChangeSubscription = useCallback(
    (planType: PaidPlanType) => {
      navigation.navigate('Subscription', {
        screen: 'SubscriptionChange',
        params: { planType },
      });
    },
    [navigation],
  );

  const handlePurchase = useCallback(async () => {
    if (!selectedPlanType) return;

    switch (actionType) {
      case 'subscribe':
        await handleSubscribe(selectedPlanType);
        break;
      case 'change':
        handleChangeSubscription(selectedPlanType);
        break;
    }
  }, [selectedPlanType, actionType, handleSubscribe, handleChangeSubscription]);

  return (
    <BottomSheet
      isClosable={isNotOnPaymentProcess}
      ref={bottomSheetRef}
      FooterComponent={
        <PurchaseCTA
          onPress={handlePurchase}
          disabled={isActionDisabled}
          content={PURCHASE_CTA_TEXT[actionType]}
        />
      }
    >
      <BottomSheetScrollView
        contentContainerStyle={tw`pb-32`}
        showsVerticalScrollIndicator={false}
      >
        <ProductBanner />
        <ContentContainer>
          <Header
            title="나에게 맞는 플랜 선택하기"
            subTitle="AI 면접 연습의 모든 기능을 경험해보세요"
          />
          <ProductList
            selectedType={selectedPlanType}
            onSelect={setSelectedPlanType}
            usingPlanType={userSubscription.planType}
          />
          <ProductDetail planType={selectedPlanType} />
          <ProductSummary planType={selectedPlanType} />
        </ContentContainer>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

ProductsScreen.displayName = 'ProductsScreen';

const Header = ({ title, subTitle }: { title: string; subTitle: string }) => {
  return (
    <>
      <Text variant="h2" color="text" style={tw`mb-2 text-center`}>
        {title}
      </Text>
      <Text variant="body" color="textSecondary" style={tw`mb-6 text-center`}>
        {subTitle}
      </Text>
    </>
  );
};

const ContentContainer = ({ children }: PropsWithChildren) => (
  <View style={tw`px-4`}>{children}</View>
);
