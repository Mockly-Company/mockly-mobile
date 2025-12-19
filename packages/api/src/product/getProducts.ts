import { PlanFeatures } from '@mockly/domain';
import { apiClient } from '../client';

interface GetProductsResponseDto {
  Products: PlanFeatures[];
  expiredAt: string;
}

export async function getProducts(): Promise<GetProductsResponseDto> {
  const response = await apiClient.get<GetProductsResponseDto>('/api/plans');

  return response.data;
}
