import { describe, it, expect, beforeEach } from 'vitest';
import { useWishlistStore } from '../stores/useWishlistStore';
import { Product } from '../types';

const product1: Product = {
  id: 'item-1',
  name: 'Item One',
  subtitle: 'Subtitle One',
  price: 500,
  category: 'men',
  subCategory: 'T-Shirts',
  images: ['/img1.jpg'],
  colors: [],
  sizes: [],
  description: 'Desc',
  details: [],
  composition: 'Cotton',
  fit: 'Regular',
  care: [],
  rating: 5,
  reviewCount: 5,
  inStock: true,
};

const product2: Product = {
  id: 'item-2',
  name: 'Item Two',
  subtitle: 'Subtitle Two',
  price: 750,
  category: 'kids',
  subCategory: 'Cardigans',
  images: ['/img2.jpg'],
  colors: [],
  sizes: [],
  description: 'Desc',
  details: [],
  composition: 'Wool',
  fit: 'Regular',
  care: [],
  rating: 4.9,
  reviewCount: 8,
  inStock: true,
};

describe('Wishlist Store Operations', () => {
  beforeEach(() => {
    useWishlistStore.getState().clearWishlist();
  });

  it('starts with an empty wishlist', () => {
    const store = useWishlistStore.getState();
    expect(store.items).toEqual([]);
    expect(store.isInWishlist('item-1')).toBe(false);
  });

  it('adds items and prevents duplicates', () => {
    const store = useWishlistStore.getState();
    store.addToWishlist(product1);
    expect(useWishlistStore.getState().items.length).toBe(1);
    expect(useWishlistStore.getState().isInWishlist(product1.id)).toBe(true);

    // Adding same product again should not duplicate
    store.addToWishlist(product1);
    expect(useWishlistStore.getState().items.length).toBe(1);
  });

  it('toggles wishlist state correctly', () => {
    const store = useWishlistStore.getState();
    // Toggle on
    store.toggleWishlist(product1);
    expect(useWishlistStore.getState().isInWishlist(product1.id)).toBe(true);

    // Toggle off
    store.toggleWishlist(product1);
    expect(useWishlistStore.getState().isInWishlist(product1.id)).toBe(false);
  });

  it('removes specific items and clears wishlist', () => {
    const store = useWishlistStore.getState();
    store.addToWishlist(product1);
    store.addToWishlist(product2);
    expect(useWishlistStore.getState().items.length).toBe(2);

    store.removeFromWishlist(product1.id);
    expect(useWishlistStore.getState().items.length).toBe(1);
    expect(useWishlistStore.getState().items[0].id).toBe(product2.id);

    store.clearWishlist();
    expect(useWishlistStore.getState().items.length).toBe(0);
  });
});
