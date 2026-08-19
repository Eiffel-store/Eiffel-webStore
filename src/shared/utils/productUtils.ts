import { Product } from '@/types';

/**
 * Resolves the corresponding image for a given product color.
 * 1. Checks if the color object has an explicit `image` URL.
 * 2. If not, falls back to the image at the same index in `product.images`.
 * 3. If not found, falls back to the primary product image `product.images[0]`.
 */
export const resolveColorImage = (
  product?: Product | null,
  colorName?: string | null
): string => {
  const fallback = 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';
  if (!product) return fallback;

  const validImages = (product.images || []).filter(img => img && img.trim() !== '');

  if (!colorName || !product.colors || product.colors.length === 0) {
    return validImages[0] || fallback;
  }

  const cleanTarget = colorName.trim().toLowerCase();
  const colorIndex = product.colors.findIndex(
    c => c.name && c.name.trim().toLowerCase() === cleanTarget
  );

  if (colorIndex >= 0) {
    const colorObj = product.colors[colorIndex];
    // 1. Explicit image attached to the color
    if (colorObj.image && colorObj.image.trim() !== '') {
      return colorObj.image.trim();
    }
    // 2. Automatic positional fallback (Color #N maps to Image #N)
    if (validImages[colorIndex]) {
      return validImages[colorIndex];
    }
  }

  return validImages[0] || fallback;
};
