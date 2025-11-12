export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT',
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentDetail extends Payment {
  items: PaymentItem[];
  billingAddress?: Address;
  receiptUrl?: string;
}

export interface PaymentItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface PaymentHistory {
  payments: Payment[];
  total: number;
  page: number;
  pageSize: number;
}
