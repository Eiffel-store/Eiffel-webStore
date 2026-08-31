import { CategoryItem } from '@/types';

/**
 * Creates a safe fallback CategoryItem object when a requested category
 * is not yet loaded or not present in the database.
 */
export const createDefaultCategoryFallback = (categoryId: string): CategoryItem => {
  const catLower = categoryId.toLowerCase().trim();

  let nameAr = categoryId.toUpperCase();
  let nameEn = categoryId.toUpperCase();

  if (catLower === 'men') {
    nameAr = 'تشكيلة الرجال';
    nameEn = "MEN'S COLLECTION";
  } else if (catLower === 'kids') {
    nameAr = 'أزياء الأطفال';
    nameEn = 'KIDS COLLECTION';
  } else if (catLower === 'accessories') {
    nameAr = 'القطع الجلدية والإكسسوارات';
    nameEn = 'ACCESSORIES';
  }

  return {
    id: categoryId,
    name: nameAr,
    nameEn: nameEn,
    subtitle: 'أحدث تشكيلات الملابس الجاهزة بخامات ممتازة وتلبيس مضبوط',
    image: `${import.meta.env.BASE_URL}images/products/eiffel-cardigan-trio.jpg`,
    itemCount: '',
    subCategories: []
  };
};
