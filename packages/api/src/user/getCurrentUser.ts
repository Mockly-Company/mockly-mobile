import { User } from '@mockly/domain';
import { apiClient } from '../client';

interface UserResDTO {
  id: string;
  email: string;
  name: string;
}

export async function getCurrentUser(): Promise<User> {
  const res = await apiClient.get<UserResDTO>('/users/me');
  const dto = res.data;
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
  };
}
