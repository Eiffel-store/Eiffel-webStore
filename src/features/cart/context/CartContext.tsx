import React, { createContext, useContext } from 'react';
import { CartItem, Product } from '@/types';
import { useCartStore } from '@/stores/useCartStore';

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, selectedSize?: string, selectedColor?: string, quantity?: number) => void;
  removeFromCart: (productId: string, selectedSize: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedSize: string, selectedColor: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  discountCode: string;
  discountAmount: number;
  applyDiscount: (code: string) => { success: boolean; message: string };
  removeDiscount: () => void;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  freeShippingProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 1500; // EGP in Egypt

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useCartStore();

  const subtotal = store.getSubtotal();
  const totalItems = store.getItemCount();
  const discountAmount = store.getDiscountAmount();
  const discountCode = store.appliedCoupon?.code || '';

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const addToCart = (product: Product, size?: string, color?: string, quantity: number = 1) => {
    const selectedSize = size || (product.sizes && product.sizes[0]) || 'M';
    const selectedColor = color || (product.colors && product.colors[0]?.name) || 'Standard';
    store.addToCart(product, quantity, selectedColor, selectedSize);
  };

  const removeFromCart = (productId: string, selectedSize: string, selectedColor: string) => {
    store.removeFromCart(productId, selectedColor, selectedSize);
  };

  const updateQuantity = (productId: string, selectedSize: string, selectedColor: string, quantity: number) => {
    store.updateQuantity(productId, selectedColor, selectedSize, quantity);
  };

  const applyDiscount = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'EIFFEL10') {
      store.applyCoupon({ id: 'c-1', code: 'EIFFEL10', discountPercentage: 10, isActive: true });
      return { success: true, message: 'تم تطبيق خصم 10% بنجاح' };
    } else if (clean === 'CAIRO20' || clean === 'SUMMER20') {
      store.applyCoupon({ id: 'c-2', code: 'CAIRO20', discountPercentage: 20, isActive: true });
      return { success: true, message: 'تم تطبيق خصم 20% بنجاح' };
    } else if (clean === 'VIP30') {
      store.applyCoupon({ id: 'c-3', code: 'VIP30', discountPercentage: 30, isActive: true });
      return { success: true, message: 'تم تطبيق خصم 30% VIP بنجاح' };
    }
    return { success: false, message: 'كود الخصم غير صالح أو منتهي الصلاحية' };
  };

  const removeDiscount = () => {
    store.removeCoupon();
  };

  return (
    <CartContext.Provider
      value={{
        cart: store.items,
        isOpen: store.isOpen,
        openCart: store.openCart,
        closeCart: store.closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart: store.clearCart,
        subtotal,
        totalItems,
        discountCode,
        discountAmount,
        applyDiscount,
        removeDiscount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemaining,
        freeShippingProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
