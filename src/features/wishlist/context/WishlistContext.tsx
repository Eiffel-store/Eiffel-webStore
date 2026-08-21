import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Product } from '@/types';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  totalWishlist: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('eiffel_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('eiffel_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product: Product) => {
    const prodName = product.nameAr || product.nameEn || product.name || 'القطعة';
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        toast(`تمت إزالة ${prodName} من قائمة الرغبات`, { icon: '🤍', id: `wishlist-${product.id}` });
        return prev.filter(item => item.id !== product.id);
      } else {
        toast.success(`تم حفظ ${prodName} في قائمة الرغبات`, { icon: '❤️', id: `wishlist-${product.id}` });
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        totalWishlist: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
