import { User, UserProfile } from '@mockly/entities';
import { ApiClient } from '../client';

export class UserService {
  constructor(private client: ApiClient) {}

  async getCurrentUser(): Promise<User> {
    return this.client.get<User>('/users/me');
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    return this.client.get<UserProfile>(`/users/${userId}`);
  }

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    return this.client.put<UserProfile>(`/users/${userId}`, data);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.client.delete<void>(`/users/${userId}`);
  }
}
