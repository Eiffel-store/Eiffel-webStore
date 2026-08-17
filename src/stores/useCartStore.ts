import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product, Coupon } from '../types';

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  isOpen: boolean;

  // Actions
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedColor: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedColor: string, selectedSize: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed values
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: (freeShippingThreshold?: number) => number;
  getTotal: (freeShippingThreshold?: number) => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      isOpen: false,

      addToCart: (product, quantity = 1, selectedColor = '', selectedSize = '') => {
        const color = selectedColor || (product.colors && product.colors[0]?.name) || 'Standard';
        const size = selectedSize || (product.sizes && product.sizes[0]) || 'M';

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedColor === color &&
              item.selectedSize === size
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            };
            return { items: newItems, isOpen: true };
          } else {
            return {
              items: [...state.items, { product, quantity, selectedColor: color, selectedSize: size }],
              isOpen: true,
            };
          }
        });
      },

      removeFromCart: (productId, selectedColor, selectedSize) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.selectedColor === selectedColor &&
                item.selectedSize === selectedSize
              )
          ),
        }));
      },

      updateQuantity: (productId, selectedColor, selectedSize, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, selectedColor, selectedSize);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (
              item.product.id === productId &&
              item.selectedColor === selectedColor &&
              item.selectedSize === selectedSize
            ) {
              return { ...item, quantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),

      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),
      removeCoupon: () => set({ appliedCoupon: null }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const { appliedCoupon } = get();
        const subtotal = get().getSubtotal();
        if (!appliedCoupon) return 0;
        return (subtotal * appliedCoupon.discountPercentage) / 100;
      },

      getShippingFee: (freeShippingThreshold = 1500) => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= freeShippingThreshold) return 0;
        return 65; // EGP Standard nationwide express shipping
      },

      getTotal: (freeShippingThreshold = 1500) => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee(freeShippingThreshold);
        return Math.max(0, subtotal - discount + shipping);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'eiffel-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
