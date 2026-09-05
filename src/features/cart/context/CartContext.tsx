import React, { createContext, useContext } from 'react';
import toast from 'react-hot-toast';
import { CartItem, Product } from '@/types';
import { useCartStore } from '@/stores/useCartStore';
import { useStoreData } from '@/shared';
import { couponService } from '@/services/couponService';

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, selectedSize?: string, selectedColor?: string, quantity?: number, silent?: boolean) => boolean;
  removeFromCart: (productId: string, selectedSize: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedSize: string, selectedColor: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  discountCode: string;
  discountPercentage: number;
  discountAmount: number;
  applyDiscount: (code: string) => Promise<{ success: boolean; message: string }>;
  removeDiscount: () => void;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  freeShippingProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 1500; // EGP in Egypt

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useCartStore();
  const { products = [], coupons = [], decrementStock, incrementStock, settings } = useStoreData();

  const subtotal = store.getSubtotal();
  const totalItems = store.getItemCount();
  const discountAmount = store.getDiscountAmount();
  const discountPercentage = store.appliedCoupon?.discountPercentage || 0;
  const discountCode = store.appliedCoupon?.code || '';

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const addToCart = (product: Product, size?: string, color?: string, quantity: number = 1, silent: boolean = false): boolean => {
    // 1. Get latest real-time stock
    const currentProd = products.find(p => p.id === product.id) || product;
    const availableStock = currentProd.stock !== undefined ? currentProd.stock : (currentProd.inStock ? 20 : 0);

    // 2. Check if product is out of stock
    if (availableStock <= 0) {
      toast.error('عذراً، هذا المنتج نفد من المخزون حالياً.', { id: `out-of-stock-${product.id}` });
      return false;
    }

    const selectedSize = size || (currentProd.sizes && currentProd.sizes[0]) || 'M';
    const selectedColor = color || (currentProd.colors && currentProd.colors[0]?.name) || 'Standard';

    // Anti-Spam Inventory Protection: Dynamic per-item limits from settings
    const minAllowed = Math.max(1, settings?.minPiecesPerItem ?? 1);
    const maxAllowed = Math.max(minAllowed, settings?.maxPiecesPerItem ?? 3);

    const existing = store.items.find(
      (item) =>
        item.product.id === product.id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );
    const currentQtyInCart = existing ? existing.quantity : 0;

    if (quantity < minAllowed) {
      toast.error(
        `أقل عدد مسموح بطلبه هو ${minAllowed} قطعة من هذا المنتج.`,
        { id: `min-qty-limit-${product.id}` }
      );
      return false;
    }

    if (currentQtyInCart + quantity > maxAllowed) {
      toast.error(
        `الحد الأقصى المسموح به هو ${maxAllowed} قطع من نفس القطعة للطلب الواحد للحفاظ على توفر المخزون.`,
        { id: `max-qty-limit-${product.id}` }
      );
      return false;
    }

    // 3. Cap quantity to available stock
    const validQuantity = Math.min(quantity, availableStock);

    // 4. Add to cart store
    store.addToCart(currentProd, validQuantity, selectedColor, selectedSize);

    // 5. Decrement inventory stock across app & backend
    decrementStock(currentProd.id, validQuantity);

    if (!silent) {
      const prodTitle = currentProd.nameAr || currentProd.nameEn || currentProd.name || 'القطعة';
      toast.success(`تمت إضافة ${prodTitle} إلى حقيبة التسوق`, {
        icon: '🛍️',
        id: `cart-add-${currentProd.id}`
      });
    }

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

    const minAllowed = Math.max(1, settings?.minPiecesPerItem ?? 1);
    const maxAllowed = Math.max(minAllowed, settings?.maxPiecesPerItem ?? 3);

    if (newQuantity < minAllowed) {
      toast.error(`أقل عدد مسموح به هو ${minAllowed} قطعة من نفس الموديل.`);
      return;
    }

    if (newQuantity > maxAllowed) {
      toast.error(`الحد الأقصى المسموح به هو ${maxAllowed} قطع من نفس الموديل للطلب الواحد.`);
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

  const applyDiscount = async (code: string): Promise<{ success: boolean; message: string }> => {
    const clean = code.trim().toUpperCase();
    try {
      const validated = await couponService.validate(clean, subtotal);
      if (validated) {
        store.applyCoupon(validated);
        return { success: true, message: `تم تطبيق كود الخصم (${validated.code}) بنجاح (${validated.discountPercentage}%)` };
      }
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message || err?.message || '';
      if (serverMsg.toLowerCase().includes('maximum usage limit') || serverMsg.toLowerCase().includes('limit')) {
        return {
          success: false,
          message: 'عذراً، هذا الكوبون انتهى بالفعل بعد استنفاد الحد الأقصى لعدد مرات الاستخدام المسموح بها.'
        };
      }
      // Check in cached coupons list
      const matched = (coupons || []).find(c => c.code.toUpperCase() === clean);
      if (matched) {
        if (matched.usageLimit && (matched.timesUsed || 0) >= matched.usageLimit) {
          return {
            success: false,
            message: 'عذراً، هذا الكوبون انتهى بالفعل بعد استنفاد الحد الأقصى لعدد مرات الاستخدام المسموح بها.'
          };
        }
        if (!matched.isActive) {
          return { success: false, message: 'عذراً، هذا الكوبون غير نشط أو منتهي الصلاحية.' };
        }
        if (matched.minOrderAmount && subtotal < matched.minOrderAmount) {
          return { success: false, message: `الحد الأدنى لتطبيق هذا الكوبون هو ${matched.minOrderAmount} ج.م` };
        }
        store.applyCoupon(matched);
        return { success: true, message: `تم تطبيق كود الخصم (${matched.code}) بنجاح (${matched.discountPercentage}%)` };
      }
      return { success: false, message: serverMsg || 'كود الخصم غير صالح أو منتهي الصلاحية' };
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
