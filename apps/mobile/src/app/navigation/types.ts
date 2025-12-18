import { PaidPlanType } from '@mockly/domain';
import type { NavigatorScreenParams } from '@react-navigation/native';

export type LoggedOutStackParamList = {
  Landing: undefined;
};

export type LoggedInStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  Payments: NavigatorScreenParams<PaymentParamList>;
  Subscription: NavigatorScreenParams<SubscriptionParamList>;
};

export type TabParamList = {
  Home: undefined;
  LocalInterview: undefined;
  Interview: undefined;
  Chat: undefined;
  MyPage: undefined;
};

export type PaymentParamList = {
  SubscriptionPayment: {
    paymentUid: string;
    amount: number;
    orderName: string;
    billingPeriod: number /** n months */;
    currency: 'KRW' | 'USD';
    planType: PaidPlanType;
  };
  SinglePayment: { planType: PaidPlanType; paymentId: string };
  PaymentSuccess: undefined;
  PaymentHistory: undefined;
  PaymentFail: undefined;
  SubscriptionPaymentChange: { planType: PaidPlanType };
};

export type SubscriptionParamList = {
  SubscriptionChange: { planType: PaidPlanType };
  SubscriptionCancel: undefined;
  Subscribe: { planType: PaidPlanType; orderId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends LoggedInStackParamList {}
  }
}
