export interface ProductColor {
  name: string;
  hex: string;
  secondaryHex?: string; // Optional Secondary Color for Two-Tone (لون ثانوي)
  image?: string; // Primary / Front view (وش)
  backImage?: string; // Secondary / Back view (ظهر)
  images?: string[]; // Additional angle shots for this color
}

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  subtitle: string;
  subtitleAr?: string;
  subtitleEn?: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory: string;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  description: string;
  descriptionAr?: string;
  descriptionEn?: string;
  details: string[];
  composition: string;
  fit: string;
  care: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isLimited?: boolean;
  tag?: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  stock?: number;
  inStock: boolean;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  nameEn: string;
  subtitle: string;
  image: string;
  itemCount: string;
  subCategories: string[];
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  minOrderAmount?: number;
  isActive: boolean;
  expiryDate?: string;
}

export interface StoreLocation {
  id: string;
  city: string;
  cityEn?: string;
  name: string;
  nameEn?: string;
  address: string;
  addressEn?: string;
  hours: string;
  hoursEn?: string;
  phone: string;
  email: string;
  type: 'Flagship' | 'Atelier' | 'Boutique' | 'Studio';
  coordinates: { x: number; y: number };
  latitude?: number;
  longitude?: number;
  image: string;
  mapLink?: string;
  active?: boolean;
}

export interface Address {
  id: string;
  isDefault: boolean;
  type: 'Home' | 'Work' | 'Other';
  firstName: string;
  lastName: string;
  street: string;
  streetAddress?: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  formattedAddress?: string;
}

export interface PaymentMethod {
  id: string;
  isDefault: boolean;
  type: 'visa' | 'mastercard' | 'amex';
  cardNumber: string;
  expiry: string;
  cardholderName: string;
}

export interface Order {
  id: string;
  date: string;
  createdAt?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  status: 'Pending' | 'Awaiting_Confirmation' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber: string;
  estimatedDelivery: string;
  shippingAddress: Address;
  paymentMethod: string;
  customerNotes?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  pointsEarned?: number;
  pointsRedeemed?: number;
  pointsDiscount?: number;
  couponCode?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  facebookUrl: string;
  instagramUrl: string;
  announcementTextAr: string;
  announcementTextEn: string;
  currency: string;
  freeShippingThreshold: number;
  adminPin: string;
  vipRequiredOrders?: number;
  vipRequiredPoints?: number;
  vipDiscountPercentage?: number;
  loyaltyCashbackRate?: number;
  vipFreeShipping?: boolean;
}

export interface User {
  id?: string | number;
  name: string;
  email: string;
  role?: 'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_CUSTOMER';
  tier: 'EIFFEL PRIVÉ' | 'EIFFEL NOIR' | 'VIP' | 'MEMBER' | string;
  tierPoints: number;
  points?: number;
  completedOrdersCount?: number;
  totalSpend?: number;
  isVip?: boolean;
  phone: string;
  memberSince: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  orders: Order[];
}

export type UserProfile = User;

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  timestamp?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  pin?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
}

export interface AuthResult {
  token: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  id: number | string;
  name: string;
  email: string;
  role: 'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_CUSTOMER';
  tier?: string;
  tierPoints?: number;
  phone?: string;
  isVip?: boolean;
}

export interface HeroBannerSettings {
  tagEn: string;
  tagAr: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  buttonTextEn: string;
  buttonTextAr: string;
  buttonLink: string;
  secondaryButtonTextEn: string;
  secondaryButtonTextAr: string;
  secondaryButtonLink: string;
  imageUrl: string;
}

export interface PromoBannerSettings {
  badgeEn: string;
  badgeAr: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  buttonTextEn: string;
  buttonTextAr: string;
  buttonLink: string;
  discountBadgeEn: string;
  discountBadgeAr: string;
  imageUrl: string;
}

export interface LookbookHotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  titleEn: string;
  titleAr: string;
  price: number;
  productId?: string;
}

export interface Look {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  imageUrl: string;
  collectionLink?: string;
  hotspots: LookbookHotspot[];
  active?: boolean;
  displayOrder?: number;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShopTheLookSettings {
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  imageUrl: string;
  collectionLink: string;
  hotspots: LookbookHotspot[];
}

export interface HomePageSettings {
  hero: HeroBannerSettings;
  promoEditorial: PromoBannerSettings;
  shopTheLook: ShopTheLookSettings;
}

export type BannerPlacement = 
  | 'HERO_SLIDER'
  | 'PROMO_EDITORIAL'
  | 'TOP_ANNOUNCEMENT'
  | 'POPUP_MODAL'
  | 'COLLECTION_HEADER';

export type BannerType = 'IMAGE' | 'VIDEO' | 'COUNTDOWN';

export interface Banner {
  id: string;
  titleEn?: string;
  titleAr?: string;
  subtitleEn?: string;
  subtitleAr?: string;
  tagEn?: string;
  tagAr?: string;
  placement: BannerPlacement;
  type?: BannerType;
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  videoUrl?: string;
  buttonTextEn?: string;
  buttonTextAr?: string;
  buttonLink?: string;
  secondaryButtonTextEn?: string;
  secondaryButtonTextAr?: string;
  secondaryButtonLink?: string;
  discountCode?: string;
  isActive?: boolean;
  displayOrder?: number;
  startDate?: string;
  endDate?: string;
  targetAudience?: string;
  impressions?: number;
  clicks?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  status?: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface ProductReviewsSummary {
  averageRating: number;
  totalReviews: number;
  recommendationRate: number;
  ratingDistribution: Record<number, number>;
  reviews: PageResponse<Review>;
}

export interface CreateReviewInput {
  rating: number;
  customerName: string;
  customerEmail?: string;
  title?: string;
  comment: string;
}

export type ExchangeType = 'EXCHANGE_SIZE' | 'EXCHANGE_COLOR' | 'DEFECT' | 'RETURN_REFUND';
export type ExchangeStatus = 'PENDING' | 'APPROVED' | 'IN_TRANSIT' | 'COMPLETED' | 'REJECTED';

export interface ExchangeRequest {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productId: string;
  productName: string;
  productImage?: string;
  originalSize?: string;
  originalColor?: string;
  requestedSize?: string;
  requestedColor?: string;
  requestType: ExchangeType;
  reason: string;
  customerNotes?: string;
  proofImageUrl?: string;
  pickupAddress?: string;
  pickupCity?: string;
  status: ExchangeStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}


