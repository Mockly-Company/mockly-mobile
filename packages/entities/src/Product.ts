export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  category?: string;
  stock?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductOption {
  id: string;
  productId: string;
  name: string;
  price: number;
  stock?: number;
}

export interface ProductDetail extends Product {
  options?: ProductOption[];
  images?: string[];
  specifications?: Record<string, string>;
}
