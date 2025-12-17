import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { payment } from '@mockly/api';

export const useFetchPaymentHistory = (page = 1, _limit = 10) => {
  return useSuspenseInfiniteQuery({
    queryKey: ['payment', 'history'],
    queryFn: ({ pageParam }) => {
      return payment.getPaymentHistory(pageParam, 10);
    },
    initialPageParam: page,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.total < nextPage * 10 ? null : nextPage;
    },
    gcTime: 0,
  });
};
