import { PaidPlanType } from '@mockly/domain';
import type { NavigatorScreenParams } from '@react-navigation/native';

export type LoggedOutStackParamList = {
  Landing: undefined;
};

export type LoggedInStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  Payments: NavigatorScreenParams<PaymentParamList>;
  Subscription: NavigatorScreenParams<SubscriptionParamList>;
  PhoneVerification: undefined;
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
    amount: number;
    orderName: string;
    billingPeriod: number /** n months */;
    currency: 'KRW' | 'USD';
    planType: PaidPlanType;
    planId: number;
  };
  SinglePayment: { planType: PaidPlanType };
  PaymentSuccess: undefined;
  PaymentHistory: undefined;
  PaymentFail: undefined;
  SubscriptionPaymentChange: { planType: PaidPlanType };
  PaymentInvoice: { paymentId: string };
};

export type SubscriptionParamList = {
  SubscriptionChange: { planType: PaidPlanType };
  SubscriptionCancel: undefined;
  Subscribe: { planType: PaidPlanType };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends LoggedInStackParamList {}
  }
}
