import { MockData } from '@mockly/domain';
import { apiClient } from '../client';

interface MockResDTO {
  id: string;
  title: string;
  description?: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status_code: number;
  response_body: Record<string, unknown>;
  headers?: Record<string, string>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMockReqDTO {
  title: string;
  description?: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status_code: number;
  response_body: Record<string, unknown>;
  headers?: Record<string, string>;
}

export async function createMock(data: CreateMockReqDTO): Promise<MockData> {
  const res = await apiClient.post<MockResDTO>('/mocks', data);
  const dto = res.data;
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    endpoint: dto.endpoint,
    method: dto.method,
    statusCode: dto.status_code,
    responseBody: dto.response_body,
    headers: dto.headers,
    createdBy: dto.created_by,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  };
}
