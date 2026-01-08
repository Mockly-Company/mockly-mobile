import { PortOneController, Payment } from '@portone/react-native-sdk';
import { ComponentProps, createRef, useMemo } from 'react';
import { SubscriptionProduct, User } from '@mockly/domain';

import { tw } from '@mockly/design-system';
import { PAYMENT_PG_STORE_ID, PAYMENT_PG_CHANNEL_KEY } from '@env';
import { v7 } from 'uuid';
type PaymentProps = ComponentProps<typeof Payment>;

type SinglePaymentProps = {
  user: User;
  product: SubscriptionProduct;
  onError: PaymentProps['onError'];
  onComplete: PaymentProps['onComplete'];
};
const STORE_KEY = PAYMENT_PG_STORE_ID;
const CHANNEL_KEY = PAYMENT_PG_CHANNEL_KEY;

export const SinglePayment = ({
  user,
  product,
  onError,
  onComplete,
}: SinglePaymentProps) => {
  const customer = {
    fullName: user.name,
    email: user.email,
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
  const paymentId = useMemo(() => v7(), []);

  return (
    <Payment
      ref={controller}
      request={{
        customer,
        storeId: STORE_KEY,
        paymentId: paymentId,
        channelKey: CHANNEL_KEY,
        ...paymentProductProps,
        totalAmount: 1000,
        payMethod: 'CARD',
        redirectUrl: 'mockly://payment-complete',
        productType: 'PRODUCT_TYPE_DIGITAL',
        offerPeriod: offerPeriod,
      }}
      onError={onError}
      onComplete={onComplete}
      style={tw`bg-background dark:bg-background-dark`}
    />
  );
};
