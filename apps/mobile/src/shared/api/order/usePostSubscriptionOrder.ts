import { useMutation } from '@tanstack/react-query';
import { RestUseMutationProps } from '../typeUtils';
import { order } from '@mockly/api';

export const usePostSubscriptionOrder = (
  props?: RestUseMutationProps<typeof order.postSubscriptionOrder>,
) => {
  return useMutation({
    mutationKey: ['subscription', 'delete'],
    mutationFn: order.postSubscriptionOrder,
    ...props,
  });
};
