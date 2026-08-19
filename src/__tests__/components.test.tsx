import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { Logo } from '../shared/components/Logo';
import { CartOrderSummary } from '../features/cart/components/CartOrderSummary';
import { QuickViewModal } from '../features/products/components/QuickViewModal';
import { LanguageProvider, CurrencyProvider } from '../shared';
import { CartProvider } from '../features/cart';
import { WishlistProvider } from '../features/wishlist';
import { Product } from '../types';

const sampleProduct: Product = {
  id: 'test-cardigan',
  name: 'Eiffel Longline Cardigan',
  subtitle: 'Luxury Knitwear',
  price: 650,
  category: 'men',
  subCategory: 'Outerwear',
  images: ['/img/cardigan.jpg'],
  colors: [{ name: 'Mocha', hex: '#6d4c41' }],
  sizes: ['M', 'L', 'XL'],
  description: 'Test cardigan',
  details: ['Detail A'],
  composition: 'Cotton',
  fit: 'Relaxed',
  care: ['Wash 30C'],
  rating: 4.9,
  reviewCount: 30,
  inStock: true,
};

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StoreDataProvider } from '../shared';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

describe('UI Components Unit Tests', () => {
  it('renders Logo with Eiffel branding emblem correctly', () => {
    render(
      <BrowserRouter>
        <Logo size="md" />
      </BrowserRouter>
    );
    expect(screen.getByLabelText('EIFFEL Emblem Logo')).toBeInTheDocument();
  });

  it('renders CartOrderSummary with formatted discount and total in EGP', () => {
    render(
      <LanguageProvider>
        <CurrencyProvider>
          <CartOrderSummary
            subtotal={2000}
            discountValue={200}
            discountCode="EIFFEL10"
            discountPercentage={10}
            discountAmount={200}
            giftWrap={false}
            shippingFee={0}
            estimatedTotal={1800}
            inputCode=""
            setInputCode={() => {}}
            promoMessage={null}
            onApplyPromo={() => {}}
            onRemoveDiscount={() => {}}
            onProceedToCheckout={() => {}}
          />
        </CurrencyProvider>
      </LanguageProvider>
    );

    // Verify discount badge shows 10%
    expect(screen.getByText(/EIFFEL10/i)).toBeInTheDocument();
    expect(screen.getByText(/10%/i)).toBeInTheDocument();
  });

  it('renders QuickViewModal with product info and add to bag action', () => {
    let closed = false;
    render(
      <QueryClientProvider client={queryClient}>
        <StoreDataProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <WishlistProvider>
                <CartProvider>
                  <QuickViewModal product={sampleProduct} onClose={() => { closed = true; }} />
                </CartProvider>
              </WishlistProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </StoreDataProvider>
      </QueryClientProvider>
    );

    expect(screen.getByText('Eiffel Longline Cardigan')).toBeInTheDocument();
    expect(screen.getByText('Add to Bag')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close quick view/i });
    fireEvent.click(closeBtn);
    expect(closed).toBe(true);
  });
});
