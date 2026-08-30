import { StoreSettings, HomePageSettings, CategoryItem } from '@/types';

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'EIFFEL',
  tagline: '',
  phone: '',
  whatsappNumber: '',
  facebookUrl: '',
  instagramUrl: '',
  announcementTextAr: '',
  announcementTextEn: '',
  currency: 'EGP',
  freeShippingThreshold: 1500,
  adminPin: '',
  vipRequiredOrders: 3,
  vipRequiredPoints: 500,
  vipDiscountPercentage: 10,
  loyaltyCashbackRate: 0.05,
  vipFreeShipping: true
};

export const DEFAULT_HOME_SETTINGS: HomePageSettings = {
  hero: {
    tagEn: '',
    tagAr: '',
    titleEn: '',
    titleAr: '',
    subtitleEn: '',
    subtitleAr: '',
    buttonTextEn: '',
    buttonTextAr: '',
    buttonLink: '/collections/men',
    secondaryButtonTextEn: '',
    secondaryButtonTextAr: '',
    secondaryButtonLink: '/collections/new-arrivals',
    imageUrl: ''
  },
  promoEditorial: {
    badgeEn: '',
    badgeAr: '',
    titleEn: '',
    titleAr: '',
    descriptionEn: '',
    descriptionAr: '',
    buttonTextEn: '',
    buttonTextAr: '',
    buttonLink: '/collections/offers',
    discountBadgeEn: '',
    discountBadgeAr: '',
    imageUrl: ''
  },
  shopTheLook: {
    titleEn: '',
    titleAr: '',
    subtitleEn: '',
    subtitleAr: '',
    imageUrl: '',
    collectionLink: '/collections/men',
    hotspots: []
  }
};

export const STATIC_CATEGORIES: CategoryItem[] = [
  {
    id: 'men',
    name: 'أزياء الرجال',
    nameEn: 'MEN COLLECTION',
    subtitle: 'بدل فاخرة، قمصان إيطالية، وبليزرات بتفصيل راقٍ',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop',
    itemCount: '24 قطعة',
    subCategories: ['بدل رسمية', 'بليزرات', 'قمصان', 'بنطلونات', 'معاطف']
  },
  {
    id: 'kids',
    name: 'أزياء الأطفال',
    nameEn: 'KIDS COLLECTION',
    subtitle: 'أناقة الصغار للمناسبات الخاصة بجودة فائقة وراحة استثنائية',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop',
    itemCount: '18 قطعة',
    subCategories: ['بدل أطفال', 'قمصان مناسبات', 'بليزرات صغيرة', 'إكسسوارات أطفال']
  },
  {
    id: 'accessories',
    name: 'الإكسسوارات',
    nameEn: 'ACCESSORIES',
    subtitle: 'ربطات عنق حريرية، أزرار أكمام مطلية، وأحزمة جلدية طبيعية',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    itemCount: '16 قطعة',
    subCategories: ['ربطات عنق', 'أزرار أكمام', 'أحزمة جلدية', 'محافظ فاخرة', 'مناديل جيب']
  },
  {
    id: 'shoes',
    name: 'الأحذية الفاخرة',
    nameEn: 'SHOES & FOOTWEAR',
    subtitle: 'أحذية كلاسيكية مصنوعة يدوياً من الجلد الطبيعي الفاخر',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
    itemCount: '12 قطعة',
    subCategories: ['أكسفورد', 'ديربي', 'لوفر كلاسيك', 'بوت شتوي']
  }
];
