import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../stores/useCartStore';
import { Product } from '../types';

const testProduct: Product = {
  id: 'eiffel-hoodie-test',
  name: 'Eiffel Architectural Hoodie',
  subtitle: 'Heavyweight Cotton Hoodie',
  price: 850,
  category: 'men',
  subCategory: 'Hoodies',
  images: ['/img/hoodie.jpg'],
  colors: [{ name: 'Pitch Noir', hex: '#000' }, { name: 'Chalk White', hex: '#fff' }],
  sizes: ['M', 'L', 'XL'],
  description: 'Test hoodie',
  details: ['Heavyweight fleece'],
  composition: '100% Cotton',
  fit: 'Oversized',
  care: ['Wash cold'],
  rating: 5,
  reviewCount: 10,
  inStock: true,
};

describe('Cart Store Operations & Immutability', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useCartStore.getState().closeCart();
  });

  it('adds items with default color and size when not specified', () => {
    const store = useCartStore.getState();
    store.addToCart(testProduct, 1);

    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].selectedColor).toBe('Pitch Noir');
    expect(items[0].selectedSize).toBe('M');
    expect(items[0].quantity).toBe(1);
  });

  it('increments quantity immutably when the same product, size, and color are added', () => {
    const store = useCartStore.getState();
    store.addToCart(testProduct, 1, 'Pitch Noir', 'L');

    const firstStateItems = useCartStore.getState().items;
    const firstItemRef = firstStateItems[0];

    store.addToCart(testProduct, 2, 'Pitch Noir', 'L');

    const secondStateItems = useCartStore.getState().items;
    expect(secondStateItems.length).toBe(1);
    expect(secondStateItems[0].quantity).toBe(3);
    // Ensure immutability (new reference created)
    expect(secondStateItems[0]).not.toBe(firstItemRef);
  });

  it('creates separate line items when colors or sizes differ', () => {
    const store = useCartStore.getState();
    store.addToCart(testProduct, 1, 'Pitch Noir', 'M');
    store.addToCart(testProduct, 1, 'Pitch Noir', 'L');
    store.addToCart(testProduct, 1, 'Chalk White', 'M');

    const items = useCartStore.getState().items;
    expect(items.length).toBe(3);
    expect(useCartStore.getState().getItemCount()).toBe(3);
  });

  it('updates quantity directly and removes item if quantity becomes <= 0', () => {
    const store = useCartStore.getState();
    store.addToCart(testProduct, 2, 'Pitch Noir', 'M');

    store.updateQuantity(testProduct.id, 'Pitch Noir', 'M', 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);

    // Setting quantity to 0 removes the item
    store.updateQuantity(testProduct.id, 'Pitch Noir', 'M', 0);
    expect(useCartStore.getState().items.length).toBe(0);
  });

  it('removes item by product ID, color, and size', () => {
    const store = useCartStore.getState();
    store.addToCart(testProduct, 1, 'Pitch Noir', 'M');
    store.addToCart(testProduct, 1, 'Chalk White', 'L');

    store.removeFromCart(testProduct.id, 'Pitch Noir', 'M');
    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].selectedColor).toBe('Chalk White');
  });

  it('toggles and manages cart drawer open/close state', () => {
    const store = useCartStore.getState();
    expect(store.isOpen).toBe(false);

    store.openCart();
    expect(useCartStore.getState().isOpen).toBe(true);

    store.closeCart();
    expect(useCartStore.getState().isOpen).toBe(false);

    store.toggleCart();
    expect(useCartStore.getState().isOpen).toBe(true);
  });
});
