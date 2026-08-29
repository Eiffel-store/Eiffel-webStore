import { Product } from '@/types';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';

/**
 * Resolves the primary (front) image for a given product color.
 */
export const resolveColorImage = (
  product?: Product | null,
  colorName?: string | null
): string => {
  if (!product) return FALLBACK_IMG;

  const validImages = (product.images || []).filter(img => img && img.trim() !== '');

  if (!colorName || !product.colors || product.colors.length === 0) {
    return validImages[0] || FALLBACK_IMG;
  }

  const cleanTarget = colorName.trim().toLowerCase();
  const colorObj = product.colors.find(
    c => c.name && c.name.trim().toLowerCase() === cleanTarget
  );

  if (colorObj) {
    // 1. Explicit primary / front image attached to the color
    if (colorObj.image && colorObj.image.trim() !== '') {
      return colorObj.image.trim();
    }
  }

  // Fallback to general product images
  return validImages[0] || FALLBACK_IMG;
};

/**
 * Resolves the full gallery list for a given product and selected color.
 * Prioritizes the color's Front view, Back view, and specific color angles,
 * followed by any remaining general product images.
 */
export const resolveColorImages = (
  product?: Product | null,
  colorName?: string | null
): string[] => {
  if (!product) return [FALLBACK_IMG];

  const validGeneralImages = (product.images || []).filter(img => img && img.trim() !== '');

  if (!colorName || !product.colors || product.colors.length === 0) {
    return validGeneralImages.length > 0 ? validGeneralImages : [FALLBACK_IMG];
  }

  const cleanTarget = colorName.trim().toLowerCase();
  const colorObj = product.colors.find(
    c => c.name && c.name.trim().toLowerCase() === cleanTarget
  );

  if (colorObj) {
    const colorSpecificImages: string[] = [];
    if (colorObj.image && colorObj.image.trim() !== '') {
      colorSpecificImages.push(colorObj.image.trim());
    }
    if (colorObj.backImage && colorObj.backImage.trim() !== '') {
      colorSpecificImages.push(colorObj.backImage.trim());
    }
    if (colorObj.images && colorObj.images.length > 0) {
      colorObj.images.forEach(img => {
        if (img && img.trim() !== '' && !colorSpecificImages.includes(img.trim())) {
          colorSpecificImages.push(img.trim());
        }
      });
    }

    if (colorSpecificImages.length > 0) {
      // Append any general images that aren't already included
      const merged = [
        ...colorSpecificImages,
        ...validGeneralImages.filter(img => !colorSpecificImages.includes(img))
      ];
      return merged;
    }
  }

  return validGeneralImages.length > 0 ? validGeneralImages : [FALLBACK_IMG];
};

