import { useMutation } from '@tanstack/react-query';

import { subscription } from '@mockly/api';
import { RestUseMutationProps } from '../typeUtils';

export const useDeleteUserSubscription = (
  props?: RestUseMutationProps<typeof subscription.deleteUserSubscription>,
) => {
  return useMutation({
    mutationKey: ['subscription', 'delete'],
    mutationFn: () => {
      return subscription.deleteUserSubscription();
    },
    gcTime: 0,
    ...props,
  });
};
