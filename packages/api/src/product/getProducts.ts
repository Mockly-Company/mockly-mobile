import { apiClient } from '../client';

interface GetProductsResponseDto {
  Products: string;
  expiredAt: string;
}

export async function getProducts(): Promise<GetProductsResponseDto> {
  const response = await apiClient.get<GetProductsResponseDto>('/api/plans');

  return response.data;
}
