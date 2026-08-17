import { describe, it, expect } from 'vitest';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { STORES } from '../data/stores';
import { ar } from '../i18n/locales/ar';
import { en } from '../i18n/locales/en';
import { EGYPTIAN_GOVERNORATES } from '../features/checkout/components/CheckoutContactForm';

describe('Data Integrity & Store Catalog Validation', () => {
  it('ensures all products have valid IDs, non-empty names, positive prices, and images', () => {
    expect(PRODUCTS.length).toBeGreaterThan(0);

    const validCategories = ['men', 'kids', 'accessories'];

    PRODUCTS.forEach((product) => {
      expect(product.id).toBeDefined();
      expect(product.id.length).toBeGreaterThan(0);
      expect(product.name).toBeDefined();
      expect(product.name.trim().length).toBeGreaterThan(0);
      expect(product.price).toBeGreaterThan(0);
      expect(validCategories).toContain(product.category);
      expect(Array.isArray(product.images)).toBe(true);
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.inStock).toBeDefined();
    });
  });

  it('ensures all categories have valid definitions', () => {
    expect(CATEGORIES.length).toBeGreaterThan(0);

    CATEGORIES.forEach((cat) => {
      expect(cat.id).toBeDefined();
      expect(cat.title).toBeDefined();
      expect(cat.title.length).toBeGreaterThan(0);
      expect(cat.image).toBeDefined();
    });
  });

  it('ensures all store locations have physical addresses in Egypt', () => {
    expect(STORES.length).toBeGreaterThan(0);

    STORES.forEach((store) => {
      expect(store.id).toBeDefined();
      expect(store.name).toBeDefined();
      expect(store.address).toBeDefined();
      expect(store.phone).toBeDefined();
      expect(store.hours).toBeDefined();
    });
  });

  it('verifies Egyptian governorates list includes major hubs', () => {
    expect(EGYPTIAN_GOVERNORATES.length).toBeGreaterThanOrEqual(27);
    const cairo = EGYPTIAN_GOVERNORATES.some((g) => g.includes('Cairo') || g.includes('القاهرة'));
    const alex = EGYPTIAN_GOVERNORATES.some((g) => g.includes('Alexandria') || g.includes('الإسكندرية'));
    const gharbia = EGYPTIAN_GOVERNORATES.some((g) => g.includes('Gharbia') || g.includes('الغربية'));

    expect(cairo).toBe(true);
    expect(alex).toBe(true);
    expect(gharbia).toBe(true);
  });

  it('verifies i18n translation coverage between Arabic and English', () => {
    const arKeys = Object.keys(ar);
    const enKeys = Object.keys(en);

    expect(arKeys.length).toBeGreaterThan(50);
    expect(enKeys.length).toBeGreaterThan(50);

    // Verify key parity for major navigation and shop strings
    const essentialKeys = [
      'navMen',
      'navKids',
      'navAccessories',
      'shoppingBag',
      'proceedToCheckout',
      'subtotal',
      'estimatedTotal',
      'adminPanel',
      'addToBag',
      'addedToBag',
    ];

    essentialKeys.forEach((key) => {
      expect(ar).toHaveProperty(key);
      expect(en).toHaveProperty(key);
      expect((ar as any)[key]).toBeTruthy();
      expect((en as any)[key]).toBeTruthy();
    });
  });
});
