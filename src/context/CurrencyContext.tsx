import React, { createContext, useContext } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  rate: number;
  position: 'after';
  name: string;
  nameAr: string;
}

export const CURRENCY_EGP: Currency = {
  code: 'EGP',
  symbol: 'ج.م',
  rate: 1, // Direct EGP amounts or 1:1 format
  position: 'after',
  name: 'Egyptian Pound (EGP)',
  nameAr: 'الجنيه المصري (ج.م)'
};

export const CURRENCIES: Record<string, Currency> = {
  EGP: CURRENCY_EGP
};

interface CurrencyContextType {
  currency: Currency;
  setCurrencyCode: (code: string) => void;
  formatPrice: (amount: number) => string;
  convertPrice: (amount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currency = CURRENCY_EGP;

  // No-op for backward compatibility
  const setCurrencyCode = (_code: string) => {};

  const convertPrice = (amount: number): number => {
    // If amounts are entered in standard figures e.g. 180 -> 1,800 EGP or direct amount
    return amount >= 1000 ? amount : amount * 10;
  };

  const formatPrice = (amount: number): string => {
    const converted = convertPrice(amount);
    const formattedNumber = new Intl.NumberFormat('en-US').format(converted);
    const isArabic = typeof document !== 'undefined' && document.documentElement.getAttribute('dir') === 'rtl';
    const symbol = isArabic ? 'ج.م' : 'EGP';
    return `${formattedNumber} ${symbol}`;
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
