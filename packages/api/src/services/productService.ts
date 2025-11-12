import { Product, ProductDetail } from '@mockly/entities';
import { ApiClient } from '../client';

export interface ProductListParams {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export class ProductService {
  constructor(private client: ApiClient) {}

  async getProducts(params?: ProductListParams): Promise<ProductListResponse> {
    return this.client.get<ProductListResponse>('/products', {
      params,
    });
  }

  async getProduct(productId: string): Promise<ProductDetail> {
    return this.client.get<ProductDetail>(`/products/${productId}`);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.client.get<Product[]>('/products/search', {
      params: { q: query },
    });
  }
}
