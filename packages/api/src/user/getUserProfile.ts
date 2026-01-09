import { UserProfile } from '@mockly/domain';
import { apiClient } from '../client';

interface UserResDTO {
  id: string;
  email: string;
  name: string;
}

export async function getUserProfile(): Promise<UserProfile> {
  const res = await apiClient.get<UserResDTO>(`/api/auth/me`);
  const user = {
    ...res.data,
    phoneNumber: '010-0000-0000',
  };
  return {
    user,
    subscription: {
      type: 'Free',
      planSnapshot: {
        name: 'Free',
        price: '0',
      },
    },
    isPhoneVerified: false,
  };
}
