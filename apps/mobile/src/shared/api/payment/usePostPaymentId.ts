import { useMutation } from '@tanstack/react-query';
import { RestUseMutationProps } from '../typeUtils';
import { payment } from '@mockly/api';

export const usePostPaymentId = (
  props?: RestUseMutationProps<typeof payment.postPaymentUId>,
) => {
  return useMutation({
    mutationFn: payment.postPaymentUId,
    ...props,
  });
};
