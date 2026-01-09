import { UserProfile } from '@mockly/domain';
import { apiClient } from '../client';

interface UserResDTO {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserReqDTO {
  name?: string;
  avatar?: string;
  bio?: string;
}

export async function updateUserProfile(
  userId: string,
  data: UpdateUserReqDTO
): Promise<UserProfile> {
  const res = await apiClient.put<UserResDTO>(`/users/${userId}`, data);
  const dto = res.data;
  return {
    user: {
      id: dto.id,
      email: dto.email,
      name: dto.name,
    },
    subscription: {
      type: 'Paid',
      subscriptionId: 'sub_mock_123',
      status: 'Active',
      planSnapshot: {
        name: 'Basic',
        price: '4900',
        billingCycle: 'Monthly',
        features: [],
      },
      startedAt: new Date(),
      endedAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      nextBillingAmount: 4900,
      cancelAtPeriodEnd: false,
      canceledAt: null,
    },
    isPhoneVerified: false,
  };
}
