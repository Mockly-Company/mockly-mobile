import { Mock, MockData } from '@mockly/entities';
import { ApiClient } from '../client';

export class MockService {
  constructor(private client: ApiClient) {}

  async getMocks(): Promise<Mock[]> {
    return this.client.get<Mock[]>('/mocks');
  }

  async getMock(mockId: string): Promise<MockData> {
    return this.client.get<MockData>(`/mocks/${mockId}`);
  }

  async createMock(data: Omit<MockData, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockData> {
    return this.client.post<MockData>('/mocks', data);
  }

  async updateMock(mockId: string, data: Partial<MockData>): Promise<MockData> {
    return this.client.put<MockData>(`/mocks/${mockId}`, data);
  }

  async deleteMock(mockId: string): Promise<void> {
    return this.client.delete<void>(`/mocks/${mockId}`);
  }
}
