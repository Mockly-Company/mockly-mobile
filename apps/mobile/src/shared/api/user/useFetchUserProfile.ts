import { useQuery } from '@tanstack/react-query';
import { RestUseQueryProps } from '../typeUtils';
import { user } from '@mockly/api';

export const useFetchUserProfile = (
  props?: RestUseQueryProps<typeof user.getUserProfile>,
) => {
  return useQuery({
    queryKey: ['subscription', 'delete'],
    queryFn: user.getUserProfile,
    gcTime: 0,
    ...props,
  });
};
