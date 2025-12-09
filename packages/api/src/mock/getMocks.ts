import { Mock } from '@mockly/domain';
import { apiClient } from '../client';

interface MockResDTO {
  id: string;
  title: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export async function getMocks(): Promise<Mock[]> {
  const res = await apiClient.get<MockResDTO[]>('/mocks');
  return res.data.map(dto => ({
    id: dto.id,
    title: dto.title,
    description: dto.description,
    createdBy: dto.created_by,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  }));
}
