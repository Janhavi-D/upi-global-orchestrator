
import { CurrencyConfig } from './types';

export const FX_RATES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 89.96 },
  EUR: { code: 'EUR', symbol: '€', rate: 105.00 },
  GBP: { code: 'GBP', symbol: '£', rate: 121.00 },
  AED: { code: 'AED', symbol: 'د.إ', rate: 24.50 },
  SGD: { code: 'SGD', symbol: 'S$', rate: 67.90 },
  CAD: { code: 'CAD', symbol: 'C$', rate: 65.61 },
  AUD: { code: 'AUD', symbol: 'A$', rate: 60.20 },
  JPY: { code: 'JPY', symbol: '¥', rate: 0.58 },
  HKD: { code: 'HKD', symbol: 'HK$', rate: 11.54 },
  THB: { code: 'THB', symbol: '฿', rate: 2.85 },
  INR: { code: 'INR', symbol: '₹', rate: 1.00 }
};

export const NIPL_COUNTRIES = [
  'UAE', 'Singapore', 'Mauritius', 'Nepal', 'Bhutan', 'Sri Lanka', 'Qatar', 'Cyprus', 'France'
];

export const INITIAL_BALANCE = 482910;

export const BRIDGE_FEE_PCT = 0.015; // 1.5%
export const GST_ON_FEE_PCT = 0.18; // 18% GST on the fee
