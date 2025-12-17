import { useMutation } from '@tanstack/react-query';

import { subscription } from '@mockly/api';
import { RestUseMutationProps } from '../typeUtils';

export const usePatchUserSubscription = (
  props?: RestUseMutationProps<typeof subscription.patchUserSubscription>,
) => {
  return useMutation({
    mutationKey: ['subscription', 'patch'],
    mutationFn: subscription.patchUserSubscription,
    ...props,
  });
};
