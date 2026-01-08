import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import api from '@mockly/api';

// if you prefer to declare everything in one file
export const queries = createQueryKeyStore({
  user: {
    all: null,
    profile: () => ({
      queryKey: ['profile'],
      queryFn: () => api.user.getUserProfile(),
    }),
  },
  subscription: {
    all: null,
    cancel: () => ({
      queryKey: ['delete'],
    }),
    detail: () => ({
      queryKey: ['detail'],
      queryFn: () => api.subscription.getUserSubscription(),
    }),
    change: () => ({
      queryKey: ['change'],
    }),
    create: () => ({
      queryKey: ['create'],
    }),
    getExpectedChangeAmount: (planType: string) => ({
      queryKey: ['expected-change-amount', planType],
      queryFn: () => api.subscription.getExpectedSubscriptionAmount(planType),
    }),
    dashboard: () => ({
      queryKey: ['dashboard'],
      queryFn: () => api.subscription.getSubscriptionDashboard(),
    }),
  },
  order: {
    all: null,
    issueId: () => ({
      queryKey: ['id'],
    }),
  },
  payment: {
    all: null,
    list: (params: { size: number }) => ({
      queryKey: [params],
      queryFn: ctx =>
        api.payment.getPayments({
          queryParams: {
            page: ctx.pageParam as number,
            size: params.size,
          },
        }),
    }),
    issueId: () => ({
      queryKey: ['id'],
    }),
    create: () => ({
      queryKey: ['create'],
    }),
    invoice: (paymentId: string) => ({
      queryKey: ['invoice', paymentId],
      queryFn: () => api.payment.getPaymentInvoice(paymentId),
    }),
    detail: (paymentId: string) => ({
      queryKey: ['detail', paymentId],
      queryFn: () => api.payment.getPaymentDetail(paymentId),
    }),
  },
  product: {
    all: null,
    list: () => ({
      queryKey: ['list'],
      queryFn: api.product.getProducts,
    }),
  },
});
