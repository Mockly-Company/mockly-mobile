import { PortOneController, IssueBillingKey } from '@portone/react-native-sdk';
import { ComponentProps, createRef, useMemo } from 'react';
import { SubscriptionProduct, User } from '@mockly/domain';

import { tw } from '@mockly/design-system';
import { PAYMENT_PG_STORE_ID, PAYMENT_PG_CHANNEL_KEY } from '@env';
import { v7 } from 'uuid';

type IssueBillingKeyProps = ComponentProps<typeof IssueBillingKey>;

const STORE_KEY = PAYMENT_PG_STORE_ID;
const CHANNEL_KEY = PAYMENT_PG_CHANNEL_KEY;

type PaymentProps = {
  user: User;
  product: Omit<SubscriptionProduct, 'id'>;
  onError: IssueBillingKeyProps['onError'];
  onComplete: IssueBillingKeyProps['onComplete'];
};

export const SubscriptionPayment = ({
  user,
  product,
  onError,
  onComplete,
}: PaymentProps) => {
  // TODO: phoneNumber 수집 논의
  const customer = {
    fullName: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber || '010-0000-0000',
  };
  const paymentProductProps = {
    orderName: product.name,
    totalAmount: product.price,
    currency: product.currency,
    displayAmount: product.price,
  };
  const offerPeriod = {
    interval: `${product.billingPeriod}m`,
  };
  const controller = createRef<PortOneController>();
  const issueId = useMemo(() => v7(), []);
  return (
    <IssueBillingKey
      ref={controller}
      request={{
        customer: {
          ...customer,
          customerId: issueId,
        },
        issueId: issueId,
        issueName: paymentProductProps.orderName,
        storeId: STORE_KEY,
        channelKey: CHANNEL_KEY,
        ...paymentProductProps,
        billingKeyMethod: 'CARD',
        // easyPay: {
        //   easyPayProvider: 'NAVERPAY',
        //   availablePayMethods: ['CARD', 'CHARGE'],
        // },
        productType: 'PRODUCT_TYPE_DIGITAL',
        offerPeriod: offerPeriod,
        // redirectUrl: 'com.mockly.mobile://',
      }}
      onError={onError}
      onComplete={onComplete}
      style={tw`bg-background`}
    />
  );
};
