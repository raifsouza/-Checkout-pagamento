export type PaymentMethod = 'credit' | 'debit' | 'pix';

export type CheckoutStepStatus = 'idle' | 'processing' | 'success' | 'error';

export interface ProductInfo {
  id: string;
  name: string;
  summary: string;
  price: number;
  currency: string;
}

export interface CardPaymentPayload {
  number: string;
  holderName: string;
  expiration: string;
  cvv: string;
}

export interface PaymentReceipt {
  method: PaymentMethod;
  methodLabel: string;
  maskedDetail: string;
  paidAt: string;
  amount: number;
  currency: string;
  product: ProductInfo;
}

export interface PaymentErrorInfo {
  code: string;
  title: string;
  message: string;
  method?: PaymentMethod;
  canRetry: boolean;
}

export interface CheckoutState {
  product: ProductInfo;
  selectedMethod: PaymentMethod;
  status: CheckoutStepStatus;
  receipt: PaymentReceipt | null;
  error: PaymentErrorInfo | null;
  simulateFailureMode: 'random' | 'always_error' | 'always_success';
}