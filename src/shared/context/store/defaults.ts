import { StoreSettings, HomePageSettings } from '@/types';

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
  vipRequiredOrders: 3,
  vipRequiredPoints: 500,
  vipDiscountPercentage: 10,
  loyaltyCashbackRate: 0.05,
  vipFreeShipping: true,

  // Home Page Section Visibility Toggles
  showHero: true,
  showCategories: true,
  showFeaturedProducts: true,
  showPromoBanner: true,
  showShopTheLook: true,
  showAnnouncementBar: true,

  // Home Page CMS Content
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

export const DEFAULT_HOME_SETTINGS: HomePageSettings = DEFAULT_SETTINGS;
