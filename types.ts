
export enum AppMode {
  DASHBOARD = 'dashboard',
  SCAN = 'scan',
  PAYMENT_PREVIEW = 'payment_preview',
  BAAS_TERMINAL = 'baas_terminal',
  SUCCESS = 'success'
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  rate: number; // 1 CCY = X INR
}

export interface PaymentData {
  merchantName: string;
  country: string;
  originalCurrency: string;
  originalAmount: number;
  subtotal: number;
  tax: number;
  inrAmount: number;
  isNIPL: boolean;
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  currency: string;
  inrValue: number;
  date: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}
