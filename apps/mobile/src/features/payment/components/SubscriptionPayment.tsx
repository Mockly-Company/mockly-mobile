import { PortOneController, IssueBillingKey } from '@portone/react-native-sdk';
import { ComponentProps, createRef } from 'react';
import { SubscriptionProduct, User } from '@mockly/domain';

import { tw } from '@mockly/design-system';
import { PAYMENT_PG_STORE_ID, PAYMENT_PG_CHANNEL_KEY } from '@env';

type IssueBillingKeyProps = ComponentProps<typeof IssueBillingKey>;

const STORE_KEY = PAYMENT_PG_STORE_ID;
const CHANNEL_KEY = PAYMENT_PG_CHANNEL_KEY;

type PaymentProps = {
  user: User;
  product: Omit<SubscriptionProduct, 'id'>;
  paymentId: string;
  onError: IssueBillingKeyProps['onError'];
  onComplete: IssueBillingKeyProps['onComplete'];
};

export const SubscriptionPayment = ({
  user,
  product,
  paymentId,
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

  return (
    <IssueBillingKey
      ref={controller}
      request={{
        customer: {
          ...customer,
        },
        issueId: paymentId,
        issueName: paymentProductProps.orderName,
        storeId: STORE_KEY,
        channelKey: CHANNEL_KEY,
        ...paymentProductProps,
        billingKeyMethod: 'CARD',
        productType: 'PRODUCT_TYPE_DIGITAL',
        offerPeriod: offerPeriod,
      }}
      onError={onError}
      onComplete={onComplete}
      style={tw`bg-background dark:bg-background-dark`}
    />
  );
};
