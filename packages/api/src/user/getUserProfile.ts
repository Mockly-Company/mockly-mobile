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

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const res = await apiClient.get<UserResDTO>(`/users/${userId}`);
  const dto = res.data;
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    avatar: dto.avatar,
    bio: dto.bio,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  };
}
