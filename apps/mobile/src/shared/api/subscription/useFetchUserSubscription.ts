import { useQuery } from '@tanstack/react-query';

import { useLoggedInAuth } from '@features/auth/hooks';
import { subscription } from '@mockly/api';

export const useFetchUserSubscription = () => {
  const { user } = useLoggedInAuth();
  return useQuery({
    queryKey: ['subscription', user.id],
    queryFn: async () => {
      return await subscription.getUserSubscription(user.id);
    },
    gcTime: 0,
  });
};
