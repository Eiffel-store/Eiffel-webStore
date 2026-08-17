export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory: string;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  description: string;
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
  name: string;
  address: string;
  hours: string;
  phone: string;
  email: string;
  type: 'Flagship' | 'Atelier' | 'Boutique';
  coordinates: { x: number; y: number };
  image: string;
  mapLink?: string;
}

export interface Address {
  id: string;
  isDefault: boolean;
  type: 'Home' | 'Work' | 'Other';
  firstName: string;
  lastName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
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
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber: string;
  estimatedDelivery: string;
  shippingAddress: Address;
  paymentMethod: string;
  customerNotes?: string;
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
}

export interface User {
  id?: string | number;
  name: string;
  email: string;
  role?: 'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_CUSTOMER';
  tier: 'EIFFEL PRIVÉ' | 'EIFFEL NOIR' | 'MEMBER' | string;
  tierPoints: number;
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
  id: number;
  name: string;
  email: string;
  role: 'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_CUSTOMER';
  tier?: string;
  tierPoints?: number;
  phone?: string;
}
