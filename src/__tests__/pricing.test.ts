import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../stores/useCartStore';
import { Product } from '../types';

const mockProductA: Product = {
  id: 'prod-1',
  name: 'Eiffel Silk Shirt',
  subtitle: 'Luxury Shirt',
  price: 600,
  category: 'men',
  subCategory: 'Shirts',
  images: ['/img1.jpg'],
  colors: [{ name: 'Black', hex: '#000' }],
  sizes: ['M', 'L'],
  description: 'Test description',
  details: ['Detail 1'],
  composition: '100% Silk',
  fit: 'Regular',
  care: ['Dry clean'],
  rating: 5,
  reviewCount: 20,
  inStock: true,
};

const mockProductB: Product = {
  id: 'prod-2',
  name: 'Eiffel Tailored Chino',
  subtitle: 'Luxury Pants',
  price: 1000,
  category: 'men',
  subCategory: 'Pants',
  images: ['/img2.jpg'],
  colors: [{ name: 'Beige', hex: '#ccc' }],
  sizes: ['32', '34'],
  description: 'Test description',
  details: ['Detail 2'],
  composition: '100% Cotton',
  fit: 'Slim',
  care: ['Machine wash'],
  rating: 4.8,
  reviewCount: 15,
  inStock: true,
};

describe('Eiffel Store Pricing & Cart Calculations', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('calculates initial subtotal as 0 when cart is empty', () => {
    const store = useCartStore.getState();
    expect(store.getSubtotal()).toBe(0);
    expect(store.getItemCount()).toBe(0);
    expect(store.getTotal()).toBe(0);
  });

  it('calculates subtotal correctly after adding products', () => {
    const store = useCartStore.getState();
    store.addToCart(mockProductA, 2, 'Black', 'M'); // 600 * 2 = 1200
    expect(useCartStore.getState().getSubtotal()).toBe(1200);
    expect(useCartStore.getState().getItemCount()).toBe(2);

    store.addToCart(mockProductB, 1, 'Beige', '32'); // 1200 + 1000 = 2200
    expect(useCartStore.getState().getSubtotal()).toBe(2200);
    expect(useCartStore.getState().getItemCount()).toBe(3);
  });

  it('charges shipping fee when subtotal is below free shipping threshold (1500 EGP)', () => {
    const store = useCartStore.getState();
    store.addToCart(mockProductA, 1, 'Black', 'M'); // 600 EGP
    expect(store.getSubtotal()).toBe(600);
    expect(store.getShippingFee(1500)).toBe(65);
    expect(store.getTotal(1500)).toBe(665);
  });

  it('grants free shipping when subtotal reaches or exceeds 1500 EGP', () => {
    const store = useCartStore.getState();
    store.addToCart(mockProductB, 2, 'Beige', '32'); // 2000 EGP
    expect(store.getSubtotal()).toBe(2000);
    expect(store.getShippingFee(1500)).toBe(0);
    expect(store.getTotal(1500)).toBe(2000);
  });

  it('applies percentage coupon discounts correctly without multiplying subtotal', () => {
    const store = useCartStore.getState();
    store.addToCart(mockProductA, 2, 'Black', 'M'); // Subtotal: 1200 EGP

    // Apply 10% coupon
    store.applyCoupon({
      id: 'c-1',
      code: 'EIFFEL10',
      discountPercentage: 10,
      isActive: true,
    });

    const discountAmount = store.getDiscountAmount();
    expect(discountAmount).toBe(120); // 10% of 1200 = 120

    const shipping = store.getShippingFee(1500); // 65 EGP (since 1200 < 1500)
    expect(shipping).toBe(65);

    // Total should be 1200 - 120 + 65 = 1145
    expect(store.getTotal(1500)).toBe(1145);
  });

  it('applies 20% and 30% VIP coupon discounts correctly on high totals', () => {
    const store = useCartStore.getState();
    store.addToCart(mockProductB, 3, 'Beige', '32'); // Subtotal: 3000 EGP

    // Apply 20% coupon
    store.applyCoupon({
      id: 'c-2',
      code: 'CAIRO20',
      discountPercentage: 20,
      isActive: true,
    });

    expect(store.getDiscountAmount()).toBe(600); // 20% of 3000 = 600
    expect(store.getShippingFee(1500)).toBe(0); // Free shipping
    expect(store.getTotal(1500)).toBe(2400); // 3000 - 600 = 2400

    // Apply 30% coupon
    store.applyCoupon({
      id: 'c-3',
      code: 'VIP30',
      discountPercentage: 30,
      isActive: true,
    });

    expect(store.getDiscountAmount()).toBe(900); // 30% of 3000 = 900
    expect(store.getTotal(1500)).toBe(2100); // 3000 - 900 = 2100
  });

  it('clears coupon when removed', () => {
    const store = useCartStore.getState();
    store.addToCart(mockProductA, 1, 'Black', 'M');
    store.applyCoupon({
      id: 'c-1',
      code: 'EIFFEL10',
      discountPercentage: 10,
      isActive: true,
    });
    expect(store.getDiscountAmount()).toBe(60);

    store.removeCoupon();
    expect(store.appliedCoupon).toBeNull();
    expect(store.getDiscountAmount()).toBe(0);
  });
});
