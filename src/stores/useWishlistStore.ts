import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../types';

interface WishlistState {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        if (!get().isInWishlist(product.id)) {
          set((state) => ({ items: [...state.items, product] }));
        }
      },

      removeFromWishlist: (productId) => {
        set((state) => ({ items: state.items.filter((p) => p.id !== productId) }));
      },

      isInWishlist: (productId) => {
        return get().items.some((p) => p.id === productId);
      },

      toggleWishlist: (product) => {
        if (get().isInWishlist(product.id)) {
          get().removeFromWishlist(product.id);
        } else {
          get().addToWishlist(product);
        }
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'eiffel-wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
