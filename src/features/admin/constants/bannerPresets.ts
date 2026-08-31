export interface CampaignPreset {
  id: string;
  labelAr: string;
  labelEn: string;
  tagAr: string;
  tagEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  buttonTextAr: string;
  buttonTextEn: string;
  buttonLink: string;
  discountCode: string;
}

export interface StoreDestinationOption {
  labelAr: string;
  labelEn: string;
  path: string;
}

export interface ButtonPresetOption {
  ar: string;
  en: string;
}

// Pre-defined ready-to-use marketing presets
export const CAMPAIGN_PRESETS: CampaignPreset[] = [
  {
    id: 'preset-winter',
    labelAr: '❄️ تشكيلة الموسم الجديد (New Season Campaign)',
    labelEn: '❄️ New Season Campaign',
    tagAr: 'تشكيلة الموسم الجديد الحصرية',
    tagEn: 'NEW SEASON COLLECTION',
    titleAr: 'أحدث صيحات الملابس الجاهزة',
    titleEn: 'CONTEMPORARY READY-TO-WEAR',
    subtitleAr: 'تشكيلة ملابس جاهزة منتقاة بعناية، خامات قطنية مريحة وعالية الجودة وتلبيس مضبوط يناسب جميع الأوقات.',
    subtitleEn: 'Handpicked ready-to-wear clothing with premium cotton fabrics and versatile styling for everyday life.',
    buttonTextAr: 'استكشف التشكيلة',
    buttonTextEn: 'EXPLORE COLLECTION',
    buttonLink: '/collections/men',
    discountCode: ''
  },
  {
    id: 'preset-sale',
    labelAr: '🔥 عروض وتخفيضات خاصة (Seasonal Sale)',
    labelEn: '🔥 Seasonal Private Sale',
    tagAr: 'خصومات حصرية لفترة محدودة',
    tagEn: 'EXCLUSIVE PRIVATE SALE',
    titleAr: 'تخفيضات الموسم الاستثنائية',
    titleEn: 'MID-SEASON SPECIAL SALE',
    subtitleAr: 'استمتع بخصم يصل إلى 30% على مختارات من الملابس الرجالية والشبابية وملابس الأطفال.',
    subtitleEn: 'Enjoy up to 30% off on curated menswear and junior fashion collections.',
    buttonTextAr: 'تسوق العروض الآن',
    buttonTextEn: 'SHOP OFFERS NOW',
    buttonLink: '/collections/offers',
    discountCode: 'EIFFEL10'
  },
  {
    id: 'preset-cashmere',
    labelAr: '👑 تشكيلة الجواكت والقمصان (Jackets & Shirts)',
    labelEn: '👑 Premium Jackets Edition',
    tagAr: 'الأناقة والشياكة اليومية',
    tagEn: 'SMART CASUAL ELEGANCE',
    titleAr: 'تشكيلة الجواكت والمعاطف الأنيقة',
    titleEn: 'PREMIUM JACKETS & COATS',
    subtitleAr: 'جواكت وقمصان شيك وعصرية بخامات ممتازة وتقفيل عالي الجودة وتلبيس مثالي.',
    subtitleEn: 'Stylish jackets and casual overshirts crafted with durable high-quality fabrics.',
    buttonTextAr: 'تسوق التشكيلة',
    buttonTextEn: 'SHOP NOW',
    buttonLink: '/collections/men',
    discountCode: ''
  },
  {
    id: 'preset-shipping',
    labelAr: '🚚 شحن سريع مجاني (Free Express Shipping)',
    labelEn: '🚚 Free Express Delivery',
    tagAr: 'شحن سريع مجاني',
    tagEn: 'FREE EXPRESS SHIPPING',
    titleAr: 'شحن مجاني لجميع محافظات مصر للطلبات فوق 1,500 ج.م',
    titleEn: 'FREE EXPRESS DELIVERY ACROSS EGYPT ON ORDERS OVER 1,500 EGP',
    subtitleAr: 'محافظة الغربية • زفتى • نهطاي • وكافة المحافظات',
    subtitleEn: 'GHARBIA • ZEFTA • NAHTAY • NATIONWIDE',
    buttonTextAr: 'تسوق الآن',
    buttonTextEn: 'SHOP NOW',
    buttonLink: '/collections/men',
    discountCode: 'EIFFEL10'
  },
  {
    id: 'preset-vip',
    labelAr: '💎 نافذة ترحيبية بالعملاء الجدد (VIP Welcome Popup)',
    labelEn: '💎 VIP Welcome Popup',
    tagAr: 'عرض حصري لعملاء المتجر',
    tagEn: 'EXCLUSIVE VIP PRIVILEGE',
    titleAr: 'مرحباً بك في متجر إيفل',
    titleEn: 'WELCOME TO EIFFEL STORE',
    subtitleAr: 'احصل على خصم 10% إضافي على طلبك الأول عند استخدام كود الخصم EIFFEL10.',
    subtitleEn: 'Enjoy 10% off your entire first purchase with exclusive code EIFFEL10.',
    buttonTextAr: 'تفعيل الخصم والتسوق',
    buttonTextEn: 'CLAIM VOUCHER & SHOP',
    buttonLink: '/collections/men',
    discountCode: 'EIFFEL10'
  }
];

// Pre-defined quick link destinations
export const STORE_DESTINATIONS: StoreDestinationOption[] = [
  { labelAr: '👔 تشكيلة الرجال (Men Collection)', labelEn: "👔 Men's Collection", path: '/collections/men' },
  { labelAr: '✨ أحدث الوصول (New Arrivals)', labelEn: '✨ New Arrivals', path: '/collections/new-arrivals' },
  { labelAr: '🏷️ العروض والتخفيضات (Offers & Sale)', labelEn: '🏷️ Offers & Sale', path: '/collections/offers' },
  { labelAr: '👶 تشكيلة الأطفال (Kids Collection)', labelEn: "👶 Kids' Collection", path: '/collections/kids' },
  { labelAr: '💼 الإكسسوارات (Accessories)', labelEn: '💼 Accessories', path: '/collections/accessories' },
  { labelAr: '🏛️ فروعنا وصالات العرض (Stores & Ateliers)', labelEn: '🏛️ Stores & Ateliers', path: '/stores' }
];

// Pre-defined CTA button text options
export const BUTTON_PRESETS: ButtonPresetOption[] = [
  { ar: 'استكشف التشكيلة', en: 'EXPLORE COLLECTION' },
  { ar: 'تسوق الآن', en: 'SHOP NOW' },
  { ar: 'اطلب القطعة الآن', en: 'ACQUIRE PIECE' },
  { ar: 'عرض الكتالوج', en: 'VIEW LOOKBOOK' },
  { ar: 'تفعيل الخصم والتسوق', en: 'CLAIM & SHOP' },
  { ar: 'استكشف البدلات', en: 'DISCOVER SUITS' }
];
