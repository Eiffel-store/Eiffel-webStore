export interface LookbookPreset {
  labelAr: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  category?: string;
  collectionLink: string;
}

export interface CollectionOption {
  labelAr: string;
  labelEn: string;
  path: string;
}

export const LOOKBOOK_PRESETS: LookbookPreset[] = [
  {
    labelAr: '👔 طقم كاجوال شيك للعمل والخروج (Smart Casual)',
    titleAr: 'تسوق الطقم كامل',
    titleEn: 'SHOP THE COMPLETE LOOK',
    subtitleAr: 'طقم متناسق وأنيق للعمل والخروجات اليومية بخامات قطنية مريحة وتلبيس مضبوط',
    subtitleEn: 'Curated ready-to-wear ensemble featuring versatile styling & premium comfortable fabrics',
    category: 'men',
    collectionLink: '/collections/men'
  },
  {
    labelAr: '❄️ طقم شتوي كاجوال دافئ (Winter Casual)',
    titleAr: 'طقم الشتاء الأنيق',
    titleEn: 'WINTER CASUAL LOOK',
    subtitleAr: 'جاكت شتوي شيك مع بنطلون جينز وسويت شيرت مريح لمظهر عصري أنيق',
    subtitleEn: 'Modern winter jacket paired with relaxed denim and comfortable essentials',
    category: 'winter',
    collectionLink: '/collections/new-arrivals'
  },
  {
    labelAr: '🕶️ طقم صيفي كاجوال مريح (Summer Casual)',
    titleAr: 'طقم صيفي كاجوال شيك',
    titleEn: 'SUMMER CASUAL SET',
    subtitleAr: 'تيشيرت قطن فاخر مع شورت مريح وسنيكرز لمظهر صيفي عملي وجذاب',
    subtitleEn: 'Premium cotton t-shirt paired with comfortable casual shorts and sneakers',
    category: 'casual',
    collectionLink: '/collections/men'
  }
];

export const COLLECTION_OPTIONS: CollectionOption[] = [
  { labelAr: '👔 تشكيلة الرجال (Men)', labelEn: 'Men Collection', path: '/collections/men' },
  { labelAr: '✨ وصول جديد (New Arrivals)', labelEn: 'New Arrivals', path: '/collections/new-arrivals' },
  { labelAr: '🏷️ التخفيضات (Offers & Sale)', labelEn: 'Offers & Sale', path: '/collections/offers' },
  { labelAr: '👶 تشكيلة الأطفال (Kids)', labelEn: 'Kids Collection', path: '/collections/kids' },
  { labelAr: '💼 الإكسسوارات (Accessories)', labelEn: 'Accessories', path: '/collections/accessories' }
];
