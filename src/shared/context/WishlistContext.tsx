import React, { createContext, useContext } from 'react';
import { Product } from '@/types';
import { useWishlistStore } from '@/stores/useWishlistStore';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wishlistStore = useWishlistStore();

  return (
    <WishlistContext.Provider
      value={{
        wishlist: wishlistStore.items,
        addToWishlist: wishlistStore.addToWishlist,
        removeFromWishlist: wishlistStore.removeFromWishlist,
        isInWishlist: wishlistStore.isInWishlist,
        toggleWishlist: wishlistStore.toggleWishlist,
        clearWishlist: wishlistStore.clearWishlist,
        itemCount: wishlistStore.items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
