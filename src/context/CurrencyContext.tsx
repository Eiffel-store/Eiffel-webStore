import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  rate: number; // Rate relative to USD (base: 1 USD = 50 EGP)
  position: 'before' | 'after';
  name: string;
  nameAr: string;
}

export const CURRENCIES: Record<string, Currency> = {
  EGP: { code: 'EGP', symbol: 'ج.م', rate: 50, position: 'after', name: 'Egyptian Pound (EGP)', nameAr: 'الجنيه المصري (ج.م)' },
  USD: { code: 'USD', symbol: '$', rate: 1, position: 'before', name: 'US Dollar ($)', nameAr: 'الدولار الأمريكي ($)' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, position: 'before', name: 'Euro (€)', nameAr: 'اليورو (€)' },
  AED: { code: 'AED', symbol: 'د.إ', rate: 3.67, position: 'after', name: 'UAE Dirham (AED)', nameAr: 'الدرهم الإماراتي (د.إ)' },
  SAR: { code: 'SAR', symbol: 'ر.س', rate: 3.75, position: 'after', name: 'Saudi Riyal (SAR)', nameAr: 'الريال السعودي (ر.س)' }
};

interface CurrencyContextType {
  currency: Currency;
  setCurrencyCode: (code: string) => void;
  formatPrice: (amountInUSD: number) => string;
  convertPrice: (amountInUSD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencyCode, setCurrencyCodeState] = useState<string>(() => {
    return localStorage.getItem('eiffel_currency') || 'EGP';
  });

  const currency = CURRENCIES[currencyCode] || CURRENCIES.EGP;

  useEffect(() => {
    localStorage.setItem('eiffel_currency', currency.code);
  }, [currency]);

  const setCurrencyCode = (code: string) => {
    if (CURRENCIES[code]) {
      setCurrencyCodeState(code);
    }
  };

  const convertPrice = (amountInUSD: number): number => {
    return Math.round(amountInUSD * currency.rate);
  };

  const formatPrice = (amountInUSD: number): string => {
    const converted = convertPrice(amountInUSD);
    const formattedNumber = new Intl.NumberFormat('en-US').format(converted);

    if (currency.position === 'before') {
      return `${currency.symbol}${formattedNumber}`;
    }
    return `${formattedNumber} ${currency.symbol}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrencyCode,
        formatPrice,
        convertPrice
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
  return context;
};
