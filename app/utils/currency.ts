// Currency utility functions for Indian market prioritization

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCY_SYMBOLS: Record<string, CurrencyInfo> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
};

// Prioritized currency list for Indian users
export const PRIORITY_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SGD'];

export function formatSalary(
  min?: number | string,
  max?: number | string,
  currency: string = 'INR'
): string {
  const currencyInfo = CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS.INR;
  
  if (!min && !max) {
    return 'Salary not specified';
  }

  const minValue = typeof min === 'string' ? parseInt(min) : min;
  const maxValue = typeof max === 'string' ? parseInt(max) : max;

  if (minValue && maxValue) {
    return `${currencyInfo.symbol}${minValue.toLocaleString()} - ${currencyInfo.symbol}${maxValue.toLocaleString()}`;
  } else if (minValue) {
    return `${currencyInfo.symbol}${minValue.toLocaleString()}+`;
  } else if (maxValue) {
    return `Up to ${currencyInfo.symbol}${maxValue.toLocaleString()}`;
  }

  return 'Salary not specified';
}

export function formatSalaryWithCurrency(
  min?: number | string,
  max?: number | string,
  currency: string = 'INR'
): string {
  const formattedSalary = formatSalary(min, max, currency);
  const currencyInfo = CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS.INR;
  
  if (formattedSalary === 'Salary not specified') {
    return formattedSalary;
  }
  
  return `${formattedSalary} ${currencyInfo.code}`;
}

export function getCurrencySymbol(currencyCode: string): string {
  return CURRENCY_SYMBOLS[currencyCode]?.symbol || '₹';
}

export function getCurrencyName(currencyCode: string): string {
  return CURRENCY_SYMBOLS[currencyCode]?.name || 'Indian Rupee';
}
