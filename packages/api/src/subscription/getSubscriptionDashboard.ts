// import { apiClient } from '../client';

// interface GetUserSubscriptionResponseDto {
//   limit: number;
//   usage: number;
// }

export async function getSubscriptionDashboard() {
  //   const response = await apiClient.get<GetUserSubscriptionResponseDto>(
  //     '/api/subscriptions/dashboard'
  //   );
  return Promise.resolve({
    limit: 100000,
    usage: 30000,
  });
}
