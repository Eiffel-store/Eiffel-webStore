import React, { createContext, useContext } from 'react';
import { CartItem, Product, Coupon } from '@/types';
import { useCartStore } from '@/stores/useCartStore';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedColor: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedColor: string, selectedSize: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
  itemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  discountAmount: number;
  shippingFee: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cartStore = useCartStore();

  return (
    <CartContext.Provider
      value={{
        cart: cartStore.items,
        addToCart: cartStore.addToCart,
        removeFromCart: cartStore.removeFromCart,
        updateQuantity: cartStore.updateQuantity,
        clearCart: cartStore.clearCart,
        subtotal: cartStore.getSubtotal(),
        total: cartStore.getTotal(),
        itemCount: cartStore.getItemCount(),
        isCartOpen: cartStore.isOpen,
        openCart: cartStore.openCart,
        closeCart: cartStore.closeCart,
        toggleCart: cartStore.toggleCart,
        appliedCoupon: cartStore.appliedCoupon,
        applyCoupon: cartStore.applyCoupon,
        removeCoupon: cartStore.removeCoupon,
        discountAmount: cartStore.getDiscountAmount(),
        shippingFee: cartStore.getShippingFee(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
