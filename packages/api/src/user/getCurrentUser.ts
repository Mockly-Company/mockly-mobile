import { User } from '@mockly/entities';
import { apiClient } from '../client';

interface UserResDTO {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export async function getCurrentUser(): Promise<User> {
  const res = await apiClient.get<UserResDTO>('/users/me');
  const dto = res.data;
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  };
}
