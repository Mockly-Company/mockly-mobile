import { useMutation } from '@tanstack/react-query';

import { subscription } from '@mockly/api';
import { RestUseMutationProps } from '../typeUtils';

export const usePatchUserSubscription = (
  props?: RestUseMutationProps<typeof subscription.patchUserSubscription>,
) => {
  return useMutation({
    mutationKey: ['subscription', 'change'],
    mutationFn: subscription.patchUserSubscription,
    gcTime: 0,
    ...props,
  });
};
