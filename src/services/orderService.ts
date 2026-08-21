import { apiClient } from './apiClient';
import { Order, ApiResponse, CartItem, Address, Product } from '../types';

export interface ServerOrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  productImage?: string;
}

export interface ServerOrder {
  id: string;
  date?: string;
  subtotal: number;
  shipping?: number;
  discount?: number;
  tax?: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  estimatedDelivery?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingStreet?: string;
  shippingApartment?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  paymentMethod?: string;
  customerNotes?: string;
  items?: ServerOrderItem[];
}

export interface ServerOrderRequest {
  items: ServerOrderItem[];
  subtotal: number;
  shipping?: number;
  discount?: number;
  tax?: number;
  total: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingStreet?: string;
  shippingApartment?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  paymentMethod?: string;
  customerNotes?: string;
  couponCode?: string;
}

// Convert ServerOrder to Frontend Order
export const mapServerOrderToClient = (s: ServerOrder): Order => {
  const nameParts = (s.customerName || 'عميل إيفل').trim().split(' ');
  const firstName = nameParts[0] || 'عميل';
  const lastName = nameParts.slice(1).join(' ') || 'إيفل';

  const shippingAddress: Address = {
    id: `addr-${s.id}`,
    isDefault: true,
    type: 'Home',
    firstName,
    lastName,
    street: s.shippingStreet || 'عنوان الشحن',
    apartment: s.shippingApartment,
    city: s.shippingCity || 'القاهرة',
    state: s.shippingState || s.shippingCity || 'مصر',
    postalCode: s.shippingPostalCode || '11211',
    country: s.shippingCountry || 'Egypt',
    phone: s.customerPhone || ''
  };

  const clientItems: CartItem[] = (s.items || []).map(item => ({
    product: {
      id: item.productId,
      name: item.productName || 'قطعة أزياء إيفل',
      subtitle: '',
      description: 'قطعة حصرية فاخرة من دار أزياء إيفل',
      details: [],
      composition: '100% قطن مصري فاخر',
      care: [],
      price: item.price || 0,
      category: 'men',
      subCategory: 'T-Shirts',
      images: item.productImage ? [item.productImage] : ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop'],
      colors: item.selectedColor ? [{ name: item.selectedColor, hex: '#000000', image: item.productImage }] : [],
      sizes: item.selectedSize ? [item.selectedSize] : ['M'],
      inStock: true,
      isNew: false,
      isBestSeller: false,
      rating: 5,
      reviewsCount: 1
    } as unknown as Product,
    quantity: item.quantity || 1,
    selectedColor: item.selectedColor || 'Standard',
    selectedSize: item.selectedSize || 'M'
  }));

  return {
    id: s.id,
    date: s.date ? new Date(s.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    items: clientItems,
    subtotal: s.subtotal || 0,
    shipping: s.shipping || 0,
    discount: s.discount || 0,
    tax: s.tax || 0,
    total: s.total || 0,
    status: s.status || 'Pending',
    trackingNumber: s.trackingNumber || `TRK-${s.id}`,
    estimatedDelivery: s.estimatedDelivery || 'خلال 48 ساعة',
    shippingAddress,
    paymentMethod: s.paymentMethod || 'الدفع عند الاستلام (كاش)',
    customerNotes: s.customerNotes
  };
};

// Convert Frontend Order to ServerOrderRequest
export const mapClientOrderToServerRequest = (order: Partial<Order>): ServerOrderRequest => {
  const address = order.shippingAddress;
  const fullName = order.customerName || (address ? `${address.firstName || ''} ${address.lastName || ''}`.trim() : 'عميل إيفل');
  const email = order.customerEmail || (order as any).email || (address as any)?.email;
  const phone = order.customerPhone || address?.phone || '';

  const items: ServerOrderItem[] = (order.items || []).map(it => ({
    productId: it.product?.id || `prod-${Date.now()}`,
    productName: it.product?.name || 'قطعة إيفل',
    price: it.product?.price || 0,
    quantity: it.quantity || 1,
    selectedColor: it.selectedColor,
    selectedSize: it.selectedSize,
    productImage: it.product?.images?.[0] || undefined
  }));

  return {
    items,
    subtotal: order.subtotal || 0,
    shipping: order.shipping || 0,
    discount: order.discount || 0,
    tax: order.tax || 0,
    total: order.total || (order.subtotal || 0),
    customerName: fullName,
    customerEmail: email || undefined,
    customerPhone: phone || undefined,
    shippingStreet: address?.street || '',
    shippingApartment: address?.apartment || '',
    shippingCity: address?.city || 'القاهرة',
    shippingState: address?.state || '',
    shippingPostalCode: address?.postalCode || '',
    shippingCountry: address?.country || 'Egypt',
    paymentMethod: order.paymentMethod || 'Cash on Delivery (الدفع عند الاستلام)',
    customerNotes: order.customerNotes,
    couponCode: order.couponCode
  };
};

export const orderService = {
  create: async (orderData: Partial<Order>): Promise<Order> => {
    const payload = mapClientOrderToServerRequest(orderData);
    const response = await apiClient.post<ApiResponse<ServerOrder>>('/orders', payload);
    const saved = response.data.data;
    return mapServerOrderToClient(saved);
  },

  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<ServerOrder[]>>('/orders');
    const rawOrders = response.data.data || [];
    return rawOrders.map(mapServerOrderToClient);
  },

  getMyOrders: async (email?: string): Promise<Order[]> => {
    const params = email ? { email } : undefined;
    const response = await apiClient.get<ApiResponse<ServerOrder[]>>('/orders/my-orders', { params });
    const rawOrders = response.data.data || [];
    return rawOrders.map(mapServerOrderToClient);
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<ServerOrder>>(`/orders/${id}`);
    return mapServerOrderToClient(response.data.data);
  },

  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<ServerOrder>>(`/orders/${id}/status`, { status }, {
      params: { status }
    });
    return mapServerOrderToClient(response.data.data);
  },
};
