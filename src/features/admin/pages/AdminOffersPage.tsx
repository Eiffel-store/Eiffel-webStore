import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStoreData, useLanguage } from '@/shared';
import { AdminOffersTable } from '../components/offers/AdminOffersTable';
import { AdminCouponsManager } from '../components/offers/AdminCouponsManager';
import { AdminAddOfferModal } from '../components/offers/AdminAddOfferModal';

export const AdminOffersPage: React.FC = () => {
  const { products, updateProduct } = useStoreData();
  const { isRTL } = useLanguage();
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);

  const offerProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price);
  const nonOfferProducts = products.filter(p => !p.originalPrice || p.originalPrice <= p.price);

  const handleApplyOffer = (productId: string, salePrice: number, baseOriginalPrice?: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const originalPrice = baseOriginalPrice || (product.originalPrice && product.originalPrice > product.price ? product.originalPrice : product.price);

    updateProduct(product.id, {
      originalPrice,
      price: salePrice
    });
  };

  const handleRemoveOffer = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.originalPrice) return;

    updateProduct(productId, {
      price: product.originalPrice,
      originalPrice: undefined
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
            {isRTL ? 'العروض والتخفيضات والكوبونات' : 'Offers & Promotions Engine'}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isRTL
              ? 'التحكم في صفحة العروض الخاصة وإنشاء وتعديل أكواد الخصم للمتجر.'
              : 'Control /collections/offers section and create promo coupon codes.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddOfferModal(true)}
          className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 transition-colors font-label-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isRTL ? 'إضافة منتج لقسم العروض' : 'Add Product to Offers'}</span>
        </button>
      </div>

      {/* 1. Discounted Products Table */}
      <AdminOffersTable
        products={offerProducts}
        onRemoveOffer={handleRemoveOffer}
        onOpenAddModal={() => setShowAddOfferModal(true)}
      />

      {/* 2. Promo Coupons Engine */}
      <AdminCouponsManager />

      {/* Add to Offer Modal */}
      <AdminAddOfferModal
        isOpen={showAddOfferModal}
        onClose={() => setShowAddOfferModal(false)}
        products={products}
        onApplyOffer={handleApplyOffer}
      />
    </div>
  );
};
