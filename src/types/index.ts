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
  category: 'men' | 'kids' | 'accessories' | 'new-arrivals';
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
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface JournalArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  readTime: string;
  coverImage: string;
  author: string;
  excerpt: string;
  content: {
    type: 'paragraph' | 'heading' | 'quote' | 'image' | 'product';
    value?: string;
    src?: string;
    caption?: string;
    productId?: string;
  }[];
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
  coordinates: { x: number; y: number }; // Percentage on map canvas
  image: string;
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
  status: 'Processing' | 'Shipped' | 'Delivered';
  trackingNumber: string;
  estimatedDelivery: string;
  shippingAddress: Address;
  paymentMethod: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}
