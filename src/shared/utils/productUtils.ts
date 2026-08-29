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
 * Returns a stable, fixed list of all images for a product without dynamic reshuffling.
 * Preserves the exact sequence so thumbnail order remains constant when switching colors.
 */
export const getAllProductImages = (
  product?: Product | null
): string[] => {
  if (!product) return [FALLBACK_IMG];

  const gathered: string[] = [];

  // 1. Gather all color images in their fixed order (Front, Back, and Angles)
  if (product.colors && product.colors.length > 0) {
    product.colors.forEach(c => {
      if (c.image && c.image.trim() !== '' && !gathered.includes(c.image.trim())) {
        gathered.push(c.image.trim());
      }
      if (c.backImage && c.backImage.trim() !== '' && !gathered.includes(c.backImage.trim())) {
        gathered.push(c.backImage.trim());
      }
      if (c.images && c.images.length > 0) {
        c.images.forEach(img => {
          if (img && img.trim() !== '' && !gathered.includes(img.trim())) {
            gathered.push(img.trim());
          }
        });
      }
    });
  }

  // 2. Gather general product images
  if (product.images && product.images.length > 0) {
    product.images.forEach(img => {
      if (img && img.trim() !== '' && !gathered.includes(img.trim())) {
        gathered.push(img.trim());
      }
    });
  }

  return gathered.length > 0 ? gathered : [FALLBACK_IMG];
};

/**
 * Finds the index of a specific color's front image in the stable product image list.
 */
export const getColorImageIndex = (
  product?: Product | null,
  colorName?: string | null,
  allImages?: string[]
): number => {
  if (!product || !colorName || !product.colors) return 0;
  const cleanTarget = colorName.trim().toLowerCase();
  const colorObj = product.colors.find(
    c => c.name && c.name.trim().toLowerCase() === cleanTarget
  );
  if (!colorObj) return 0;

  const targetUrl = colorObj.image || colorObj.backImage;
  if (!targetUrl) return 0;

  const imagesList = allImages && allImages.length > 0 ? allImages : getAllProductImages(product);
  const foundIndex = imagesList.indexOf(targetUrl.trim());
  return foundIndex !== -1 ? foundIndex : 0;
};

/**
 * Resolves the full gallery list for a given product and selected color.
 */
export const resolveColorImages = (
  product?: Product | null,
  _colorName?: string | null
): string[] => {
  return getAllProductImages(product);
};

/**
 * Resolves CSS style for color swatches, supporting single solid hex and two-tone 50/50 split gradients.
 */
export const getColorBackgroundStyle = (
  color?: { hex?: string; secondaryHex?: string } | null
): React.CSSProperties => {
  if (!color || !color.hex) return { backgroundColor: '#000000' };

  if (color.secondaryHex && color.secondaryHex.trim() !== '') {
    return {
      background: `linear-gradient(135deg, ${color.hex.trim()} 50%, ${color.secondaryHex.trim()} 50%)`
    };
  }

  return {
    backgroundColor: color.hex
  };
};

/**
 * Detects and returns the matching ProductColor name when given an image URL.
 */
export const resolveColorByImage = (
  product?: Product | null,
  imageUrl?: string | null
): string | null => {
  if (!product || !imageUrl || !product.colors || product.colors.length === 0) return null;
  const cleanUrl = imageUrl.trim();

  for (const c of product.colors) {
    if (c.image && c.image.trim() === cleanUrl) return c.name;
    if (c.backImage && c.backImage.trim() === cleanUrl) return c.name;
    if (c.images && c.images.some(img => img && img.trim() === cleanUrl)) return c.name;
  }
  return null;
};
