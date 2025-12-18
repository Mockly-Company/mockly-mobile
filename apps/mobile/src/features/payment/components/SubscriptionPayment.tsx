import { PortOneController, IssueBillingKey } from '@portone/react-native-sdk';
import { ComponentProps, createRef } from 'react';
import { SubscriptionProduct, User } from '@mockly/domain';

import { tw } from '@mockly/design-system';

type IssueBillingKeyProps = ComponentProps<typeof IssueBillingKey>;

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

  return (
    <IssueBillingKey
      ref={controller}
      request={{
        customer: {
          ...customer,
          phoneNumber: '010-0000-0000',
        },
        issueId: paymentId,
        issueName: paymentProductProps.orderName,
        storeId: 'STORE_KEY_PLACEHOLDER',
        channelKey: 'CHANNEL_KEY_PLACEHOLDER',
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
