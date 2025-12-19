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
    detail: (userId: string) => ({
      queryKey: [userId],
      queryFn: () => api.subscription.getUserSubscription(userId),
    }),
    change: () => ({
      queryKey: ['change'],
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
    list: (limit: number = 10) => ({
      queryKey: [limit],
      queryFn: ctx =>
        api.payment.getPaymentHistory(ctx.pageParam as number, limit),
    }),
    issueId: () => ({
      queryKey: ['id'],
    }),
    create: () => ({
      queryKey: ['create'],
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
