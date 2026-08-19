import React, { createContext, useContext } from 'react';
import { CartItem, Product } from '@/types';
import { useCartStore } from '@/stores/useCartStore';
import { useStoreData } from '@/shared';

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, selectedSize?: string, selectedColor?: string, quantity?: number) => boolean;
  removeFromCart: (productId: string, selectedSize: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedSize: string, selectedColor: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  discountCode: string;
  discountPercentage: number;
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
  const { products = [], decrementStock, incrementStock } = useStoreData();

  const subtotal = store.getSubtotal();
  const totalItems = store.getItemCount();
  const discountAmount = store.getDiscountAmount();
  const discountPercentage = store.appliedCoupon?.discountPercentage || 0;
  const discountCode = store.appliedCoupon?.code || '';

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const addToCart = (product: Product, size?: string, color?: string, quantity: number = 1): boolean => {
    // 1. Get latest real-time stock
    const currentProd = products.find(p => p.id === product.id) || product;
    const availableStock = currentProd.stock !== undefined ? currentProd.stock : (currentProd.inStock ? 20 : 0);

    // 2. Check if product is out of stock
    if (availableStock <= 0) {
      alert('عذراً، هذا المنتج نفد من المخزون حالياً.');
      return false;
    }

    // 3. Cap quantity to available stock
    const validQuantity = Math.min(quantity, availableStock);
    const selectedSize = size || (currentProd.sizes && currentProd.sizes[0]) || 'M';
    const selectedColor = color || (currentProd.colors && currentProd.colors[0]?.name) || 'Standard';

    // 4. Add to cart store
    store.addToCart(currentProd, validQuantity, selectedColor, selectedSize);

    // 5. Decrement inventory stock across app & backend
    decrementStock(currentProd.id, validQuantity);
    return true;
  };

  const removeFromCart = (productId: string, selectedSize: string, selectedColor: string) => {
    const existing = store.items.find(
      (item) =>
        item.product.id === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (existing) {
      // Restore stock
      incrementStock(productId, existing.quantity);
    }

    store.removeFromCart(productId, selectedColor, selectedSize);
  };

  const updateQuantity = (productId: string, selectedSize: string, selectedColor: string, newQuantity: number) => {
    const existing = store.items.find(
      (item) =>
        item.product.id === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (!existing) return;

    if (newQuantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }

    const currentQty = existing.quantity;
    const delta = newQuantity - currentQty;

    if (delta > 0) {
      // Need more items: check available stock
      const currentProd = products.find(p => p.id === productId);
      const availableStock = currentProd?.stock !== undefined ? currentProd.stock : 20;

      if (availableStock < delta) {
        alert(`عذراً، المتبقي في المخزون هو ${availableStock} قطع إضافية فقط.`);
        const allowedQty = currentQty + availableStock;
        if (allowedQty > currentQty) {
          decrementStock(productId, availableStock);
          store.updateQuantity(productId, selectedColor, selectedSize, allowedQty);
        }
        return;
      }

      decrementStock(productId, delta);
      store.updateQuantity(productId, selectedColor, selectedSize, newQuantity);
    } else if (delta < 0) {
      // Returned items to stock
      incrementStock(productId, Math.abs(delta));
      store.updateQuantity(productId, selectedColor, selectedSize, newQuantity);
    }
  };

  const clearCart = () => {
    // Restore all items back to stock
    store.items.forEach(item => {
      incrementStock(item.product.id, item.quantity);
    });
    store.clearCart();
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
        clearCart,
        subtotal,
        totalItems,
        discountCode,
        discountPercentage,
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
